import React, { useState } from 'react';
import QoDList from '../question-of-the-day/QoDList';
import starMethodImage from '../../assets/images/star-method.png';

function QoD() {
    // const questions = [
    //     { id: 1, question: "What steps do you take to make difficult decisions?", answer: "I weigh the pros and cons, consult stakeholders, and prioritize the company’s goals. This approach has consistently helped me make sound decisions." },
    //     { id: 2, question: "Describe your typical workday.", answer: "At my last role we had a weekly Make Money Monday Meeting that I spearheaded, it started off as a crazy idea at first but led to us breaking our team sales and onboarding goal that year!" },
    //     { id: 3, question: "What was it about your last job that bothered you the most?", answer: "My old company made use old laptops/personal laptops, and my work was often impacted. I dropped calls frequently which ended up really affecting the working relationship with my teammates, especially those that are remote." },
    //     { id: 4, question: "Describe a time when you had to work under pressure to meet a tight deadline", answer: "Meeting tight deadlines is challenging but also rewarding. I’ve found that a structured approach keeps me focused, and I’m always proud of how these situations bring out the best in my time-management skills. 🤓" },
    //     { id: 5, question: "Tell me about a time when you received constructive feedback from a supervisor. How did you respond?", answer: "I see feedback as a growth tool, so when my manager suggested ways to improve my presentations, I implemented them, and my next few presentations were noticeably more impactful. 🤓" },
    // ];

    const questions = [
        { 
            id: 1, 
            question: "Describe a time when you had to work under pressure to meet a tight deadline.", 
            answer: "Choose an example where you managed stress effectively. Highlight prioritization and planning skills. Emphasize resilience under pressure." },
    ]

    const modelAnswer = [
        {
            id: 1,
            question: "Situation",
            answer: "My team was given the responsibility of delivering an MVP within two months to meet a critical investor pitch deadline."
        },
        {
            id: 2,
            question: "Task",
            answer: "The team had to design, develop, and deploy a fully functional web application, ensuring it was scalable and user-friendly while managing limited resources."
        },
        {
            id: 3,
            question: "Action",
            answer: "We broke down the project into key milestones, prioritized essential features, and automated deployment using CI/CD pipelines. We worked efficiently, collaborating with stakeholders to quickly resolve roadblocks and iterating based on feedback."
        },
        {
            id: 4,
            question: "Result",
            answer: "The MVP was successfully launched on time, enabling the company to showcase a working product to investors, which led to securing early funding and user traction."
        },
        {
            id: 5,
            question: "Summary",
            answer: "In summary, this experience underscored the importance of agile planning, clear communication, and collaborative problem solving, which have since become integral to my approach on subsequent projects."
        }
    ];
    
    const starsMethod = [
        { 
            id: 1, 
            question: "Situation", 
            answer: "Describe the situation you were in or the task you needed to accomplish." 
        },
        { 
            id: 2, 
            question: "Task", 
            answer: "Explain the task you were responsible for in that situation." 
        },
        { 
            id: 3, 
            question: "Action", 
            answer: "Describe the specific actions you took to address the situation or complete the task." 
        },
        { 
            id: 4, 
            question: "Result", 
            answer: "Share the results or outcomes of your actions, highlighting any achievements or lessons learned." 
        },
        { 
            id: 5, 
            question: "Summary", 
            answer: "Provide a concise reflection on the experience, emphasizing key takeaways and how it has influenced your skills or approach." 
        }
    ];
    
    

    const [qod, setQod] = useState([questions[0]]);
    return (
        <div className='qod-container'>
            <h1>STARS Method</h1>
            <div className='star-method-container'>
                <div className='star-method-description'>
                    {starsMethod.map((q) => (
                        <div key={q.id} className='star-method-card'>
                            <h3>{q.question}</h3>
                            <p>{q.answer}</p>
                        </div>
                    ))}
                </div>
                <div className='star-method-image'>
                    <img src={starMethodImage} alt="Star Method Example" />
                </div>
            </div>
            <br />
            <h1>Question of the Day</h1>
            <QoDList questions={questions} />
            <br />
            <h1>Model Answer</h1>
            <QoDList questions={modelAnswer} />
        </div>
    );
}

export default QoD;