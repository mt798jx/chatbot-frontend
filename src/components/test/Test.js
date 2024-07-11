import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import './Test.css';
import { fetchQuestionAndAnswer, fetchResult } from "../services-react/_api/test-service";

function Test() {
    const [QandA, setQandA] = useState([]);
    const [results, setResults] = useState([]);
    const [allAnswered, setAllAnswered] = useState(false);

    useEffect(() => {
        fetchQandA();
    }, []);

    useEffect(() => {
        const allAnswered = QandA.every(question => question.userAnswer.trim() !== "");
        setAllAnswered(allAnswered);
    }, [QandA]);

    const fetchQandA = async () => {
        try {
            const Ids = Id(3);
            const responses = await Promise.all(Ids.map(id => fetchQuestionAndAnswer(id)));
            const data = responses.map((response, index) => ({
                id: Ids[index],
                question: response.data[0],
                correctAnswer: response.data[1],
                userAnswer: ""
            }));
            setQandA(data);
        } catch (error) {
            console.error('Error fetching QandA:', error);
        }
    };

    const Id = (count) => {
        const ids = [];
        while (ids.length < count) {
            const randomId = Math.floor(Math.random() * 4) + 1;
            if (!ids.includes(randomId)) ids.push(randomId);
        }
        return ids;
    };

    const handleUsersAnswer = (index, value) => {
        const updatedQandA = [...QandA];
        updatedQandA[index].userAnswer = value;
        setQandA(updatedQandA);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultsArray = await Promise.all(QandA.map(question =>
                fetchResult(question.id, question.userAnswer.trim() === '' ? 'dont know' : question.userAnswer, question.correctAnswer)
            ));
            setResults(resultsArray);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    return (
        <div className="test-container">
            <h2>Exam Test Form</h2>

            <Form onSubmit={handleSubmit}>
                {QandA.map((questionData, index) => (
                    <div key={index} className="question-container">
                        <Form.Group controlId={`question${index + 1}`}>
                            <Form.Label>{questionData.question}</Form.Label>
                        </Form.Group>
                        <Form.Group controlId={`answer${index + 1}`}>
                            <Form.Control as="textarea" rows={3} value={questionData.userAnswer} onChange={(e) => handleUsersAnswer(index, e.target.value)} placeholder="Enter your answer"/>
                        </Form.Group>
                        {results.length > 0 && (
                            <div className="result-container">
                                <p className="result-label">Result:</p>
                                <p className="result-value">{results[index].data}</p>
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
