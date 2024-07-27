import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import './Test.css';
import { fetchQuestion, fetchResult } from "../services-react/_api/test-service";

function Test() {
    const [Questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [allAnswered, setAllAnswered] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const allAnswered = Questions.every(question => question.userAnswer.trim() !== "");
        setAllAnswered(allAnswered);
    }, [Questions]);

    const fetchQuestions = async () => {
        try {
            const Ids = Id(3);
            const responses = await Promise.all(Ids.map(id => fetchQuestion(id)));
            const data = responses.map((response, index) => ({
                id: Ids[index],
                question: response.data,
                userAnswer: ""
            }));
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching QandA:', error);
        }
    };

    const Id = (count) => {
        const ids = [];
        while (ids.length < count) {
            const randomId = Math.floor(Math.random() * 3) + 1;
            if (!ids.includes(randomId)) ids.push(randomId);
        }
        return ids;
    };

    const handleUsersAnswer = (index, value) => {
        const updatedQandA = [...Questions];
        updatedQandA[index].userAnswer = value;
        setQuestions(updatedQandA);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultsArray = await Promise.all(Questions.map(question =>
                fetchResult(question.id, question.userAnswer.trim() === '' ? 'dont know' : question.userAnswer, question.correctAnswer)
            ));
            setResults(resultsArray);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    return (
        <div className="test-container">
            <h2>Operačné systémy</h2>

            <Form onSubmit={handleSubmit}>
                {Questions.map((questionData, index) => (
                    <div key={index} className="question-container">
                        <div className="question">
                            <Form.Group controlId={`question${index + 1}`}>
                                <Form.Label>{questionData.question}</Form.Label>
                            </Form.Group>
                        </div>
                        <Form.Group controlId={`answer${index + 1}`}>
                            <Form.Control as="textarea" rows={3} value={questionData.userAnswer} onChange={(e) => handleUsersAnswer(index, e.target.value)} placeholder="Zadaj odpoveď"/>
                        </Form.Group>
                        {results.length > 0 && (
                            <div className="result-container">
                                <p className="result-label">Result:</p>
                                <p className="result-value">{results[index].data} / 1</p>
                            </div>
                        )}
                    </div>
                ))}
                <div className="submit-container">
                    <button type="submit" className="submit-button" disabled={!allAnswered}>Submit</button>
                </div>
            </Form>
        </div>
    );
}

export default Test;