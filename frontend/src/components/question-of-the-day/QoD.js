import React, { useState } from 'react';
import QoDList from '../question-of-the-day/QoDList';

function QoD() {
    const questions = [
        { id: 1, question: "What steps do you take to make difficult decisions?", answer: "I weigh the pros and cons, consult stakeholders, and prioritize the company’s goals. This approach has consistently helped me make sound decisions." },
        { id: 2, question: "Describe your typical workday.", answer: "At my last role we had a weekly Make Money Monday Meeting that I spearheaded, it started off as a crazy idea at first but led to us breaking our team sales and onboarding goal that year!" },
        { id: 3, question: "What was it about your last job that bothered you the most?", answer: "My old company made use old laptops/personal laptops, and my work was often impacted. I dropped calls frequently which ended up really affecting the working relationship with my teammates, especially those that are remote." },
        { id: 4, question: "Describe a time when you had to work under pressure to meet a tight deadline", answer: "Meeting tight deadlines is challenging but also rewarding. I’ve found that a structured approach keeps me focused, and I’m always proud of how these situations bring out the best in my time-management skills. 🤓" },
        { id: 5, question: "Tell me about a time when you received constructive feedback from a supervisor. How did you respond?", answer: "I see feedback as a growth tool, so when my manager suggested ways to improve my presentations, I implemented them, and my next few presentations were noticeably more impactful. 🤓" },
    ];

    const [qod, setQod] = useState(questions[0]); // Today's Question of the Day
    const previousQuestions = questions.slice(1);
    return (
        <div className='qod-container'>
            <h1>Question of the Day</h1>
            <QoDList qod={qod} previousQuestions={previousQuestions} />
        </div>
    );
}

export default QoD;