import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

function ResumeFeedback() {
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
        <div className="resume-feedback-container">
            <h1 className="resume-feedback-heading">
                Generate AI Resume Feedback
            </h1>

            <form onSubmit={handleSubmit} className="resume-feedback-form">
                <div className="resume-feedback-input-group">
                    <label className="resume-feedback-label">
                        Upload your resume (PDF)
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="resume-feedback-input-file"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!file || loading}
                    className="resume-feedback-button"
                >
                    {loading ? 'Analyzing...' : 'Get Feedback'}
                </button>
            </form>

            {feedback && (
                <div className="resume-feedback-feedback">
                    <h2 className="resume-feedback-feedback-heading">
                        Resume Feedback
                    </h2>
                    <div className="resume-feedback-feedback-content">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>

    );
}

export default ResumeFeedback;