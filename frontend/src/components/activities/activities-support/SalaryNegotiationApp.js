import React, { useState } from 'react';
// Import the CSS file in your actual implementation
// import './SalaryNegotiationApp.css';

const SalaryNegotiationApp = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const scenarios = [
    {
      id: 1,
      interviewer: 'Susan',
      question: "So, what kind of salary are you looking for?",
      example: "Hello Susan, I'm so happy you asked. I've always wanted to tell my father I made $100,000 a year. I understand there is a tiered bonus structure so I would like to also understand where I fit into the yearly review cycle and how often salaries are evaluated.",
      analysis: "This approach uses a personal anecdote to state the desired salary, followed by questions about the broader compensation structure. It's direct and opens the door for further discussion."
    },
    {
      id: 2,
      interviewer: 'Seth',
      question: "Let's talk about compensation. What are your expectations?",
      example: "Well Seth, I am so happy you asked. I've thought a lot about this and $120k is a number I can take back to my family with confidence that I will be able to provide for them. I know we have a variable pay package, so I would like to understand how often you evaluate individual performance and if there is an opportunity to be evaluated based on new business I am able to bring in.",
      analysis: "This response clearly states the desired salary and ties it to personal goals. It also shows interest in performance-based increases and brings attention to potential value the candidate can add."
    },
    {
      id: 3,
      interviewer: 'Alex',
      question: "What are your salary expectations for this position?",
      example: "Thank you for bringing up compensation, Alex. Based on my research and experience, I'm looking for a salary in the range of $85,000 to $95,000. I'm particularly interested in understanding how your company's profit-sharing program works and what opportunities exist for professional development and advancement. Could you share more about these aspects of the total compensation package?",
      analysis: "This response provides a salary range rather than a specific number, demonstrating flexibility. It also shows that the candidate has done their research and is interested in the company's additional benefits and growth opportunities."
    }
  ];

  const handleSelectScenario = (id) => {
    setActiveScenario(id);
    setUserResponse('');
    setShowFeedback(false);
  };

  const handleSubmitResponse = () => {
    if (!userResponse.trim()) {
      setFeedback("Please enter your response before submitting.");
      setShowFeedback(true);
      return;
    }
    
    // Simple feedback based on keywords
    const response = userResponse.toLowerCase();
    const scenario = scenarios.find(s => s.id === activeScenario);
    
    let feedbackText = "";
    
    if (response.includes(scenario.interviewer.toLowerCase())) {
      feedbackText += "✓ Great job using the interviewer's name! Personal touch is effective.\n";
    } else {
      feedbackText += "Consider using the interviewer's name for a more personalized response.\n";
    }
    
    if (response.includes("$") || /\d{2,3}(,\d{3})?/.test(response)) {
      feedbackText += "✓ You mentioned a specific number or range. Clear communication of expectations!\n";
    } else {
      feedbackText += "Consider including a specific salary figure or range in your response.\n";
    }
    
    if (response.includes("understand") || response.includes("question") || response.includes("?")) {
      feedbackText += "✓ Good job asking follow-up questions about the compensation structure.\n";
    } else {
      feedbackText += "Try adding a question about benefits or evaluation structure to open further discussion.\n";
    }
    
    setFeedback(feedbackText);
    setShowFeedback(true);
  };

  const resetPractice = () => {
    setActiveScenario(null);
    setUserResponse('');
    setShowFeedback(false);
  };

  return (
    <div className="negotiation-container">
      <h1 className="negotiation-heading">Salary Negotiation Practice</h1>
      
      {!activeScenario ? (
        <div>
          <p className="scenario-intro">Select a scenario to practice your salary negotiation response:</p>
          <div>
            {scenarios.map((scenario) => (
              <div 
                key={scenario.id}
                className="scenario-card"
                onClick={() => handleSelectScenario(scenario.id)}
              >
                <h3 className="scenario-title">Scenario {scenario.id}: Interview with {scenario.interviewer}</h3>
                <p className="scenario-question">"{scenario.question}"</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="scenario-header">
            <h2 className="scenario-name">
              Scenario {activeScenario}: Interview with {scenarios.find(s => s.id === activeScenario).interviewer}
            </h2>
            <button 
              onClick={resetPractice}
              className="back-button"
            >
              Back to Scenarios
            </button>
          </div>
          
          <div className="interviewer-box">
            <p className="interviewer-name">{scenarios.find(s => s.id === activeScenario).interviewer} (Interviewer):</p>
            <p className="interviewer-question">"{scenarios.find(s => s.id === activeScenario).question}"</p>
          </div>
          
          <div className="response-section">
            <label htmlFor="response" className="response-label">Your Response:</label>
            <textarea
              id="response"
              className="response-textarea"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your salary negotiation response here..."
            />
            <button
              onClick={handleSubmitResponse}
              className="submit-button"
            >
              Submit Response
            </button>
          </div>
          
          {showFeedback && (
            <div className="feedback-container">
              <h3 className="feedback-title">Feedback on Your Response:</h3>
              <pre className="feedback-text">{feedback}</pre>
              
              <div className="example-section">
                <p className="example-title">Example approach:</p>
                <p className="example-text">{scenarios.find(s => s.id === activeScenario).example}</p>
                <p className="example-analysis">{scenarios.find(s => s.id === activeScenario).analysis}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalaryNegotiationApp;