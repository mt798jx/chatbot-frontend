import React from 'react';
import Form from 'react-bootstrap/Form';
import './Test.css'; // Import your custom CSS file for styling

function Test() {
    return (
        <div className="test-container">
            <h2>Exam Test Form</h2>

            <Form>
                <div className="question-container">
                    <Form.Group controlId="question1">
                        <Form.Label>Question 1:</Form.Label>
                    </Form.Group>
                    <Form.Group controlId="answer1">
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                </div>

                <div className="question-container">
                    <Form.Group controlId="question2">
                        <Form.Label>Question 2:</Form.Label>
                    </Form.Group>
                    <Form.Group controlId="answer2">
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                </div>

                {/* Add more question-container divs for additional questions */}

                <div className="submit-container">
                    <button className="submit-button">Submit</button>
                </div>
            </Form>
        </div>
    );
}

export default Test;
