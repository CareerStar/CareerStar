import React from 'react';
import QuestionCard from './QuestionCard';

function QoDList({ qod, previousQuestions }) {
    return (
        <div className='qodlist-container'>
            <h2>Today's Question</h2>
            <QuestionCard question={qod.question} answer={qod.answer} id={1} />
            <h2>Previous Questions</h2>
            <div className='previous-questions'>
                {previousQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q.question} answer={q.answer} id={2}/>
                ))}
            </div>
        </div>
    );
};

export default QoDList;