import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function ResumeCoach() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please upload a PDF file');
            setFile(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        try {
            setLoading(true);
            setError('');
            setFeedback('');

            const formData = new FormData();
            formData.append('resume', file);

            const response = await axios.post('https://api.careerstar.co/resumefeedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFeedback(response.data.feedback);
        } catch (err) {
            if (err.response && err.response.status === 504) {
                setError(
                    'The analysis took too long. Please try with a smaller PDF or try again later.'
                );
            } else {
                setError(
                    err.response?.data?.error ||
                    'Error analyzing resume. Please try again.'
                );
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-coach-container">
            <h1 className="resume-coach-heading">
                Generate AI Resume Feedback
            </h1>

            <form onSubmit={handleSubmit} className="resume-coach-form">
                <div className="resume-coach-input-group">
                    <label className="resume-coach-label">
                        Upload your resume (PDF)
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="resume-coach-input-file"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!file || loading}
                    className="resume-coach-button"
                >
                    {loading ? 'Analyzing...' : 'Get Feedback'}
                </button>
            </form>

            {feedback && (
                <div className="resume-coach-feedback">
                    <h2 className="resume-coach-feedback-heading">
                        Resume Coach
                    </h2>
                    <div className="resume-coach-feedback-content">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>

    );
}

export default ResumeCoach;