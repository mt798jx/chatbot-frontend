import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Typography from '@mui/material/Typography';
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
            const Ids = generateIds(3);
            const responses = await Promise.all(Ids.map(id => fetchQuestion(id)));
            const data = responses.map((response, index) => ({
                id: Ids[index],
                question: response.data,
                userAnswer: ""
            }));
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const generateIds = (count) => {
        const ids = [];
        while (ids.length < count) {
            const randomId = Math.floor(Math.random() * 3) + 1;
            if (!ids.includes(randomId)) ids.push(randomId);
        }
        return ids;
    };

    const handleUserAnswer = (index, value) => {
        const updatedQuestions = [...Questions];
        updatedQuestions[index].userAnswer = value;
        setQuestions(updatedQuestions);
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
            <Typography variant="h4" gutterBottom>
                Operačné systémy
            </Typography>

            <Form onSubmit={handleSubmit}>
                {Questions.map((questionData, index) => (
                    <div key={index} className="question-container">
                        <Form.Group controlId={`question${index + 1}`}>
                            <Form.Label>
                                <Typography variant="h6">{questionData.question}</Typography>
                            </Form.Label>
                        </Form.Group>
                        <Form.Group controlId={`answer${index + 1}`}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={questionData.userAnswer}
                                onChange={(e) => handleUserAnswer(index, e.target.value)}
                                placeholder="Zadaj odpoveď"
                                className="full-width-input"
                            />
                        </Form.Group>
                        {results.length > 0 && (
                            <div className="result-container">
                                <Typography variant="body2" className="result-label">
                                    Result:
                                </Typography>
                                <Typography variant="body2" className="result-value">
                                    {results[index].data} / 1
                                </Typography>
                            </div>
                        )}
                    </div>
                ))}
                <div className="submit-container">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!allAnswered}
                    >
                        Submit
                    </button>
                </div>
            </Form>
        </div>
    );
}

export default Test;