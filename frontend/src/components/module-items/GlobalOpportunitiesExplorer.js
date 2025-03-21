import React, { useState, useEffect } from 'react';

const GlobalOpportunitiesExplorer = () => {

  const [gameState, setGameState] = useState('intro'); // intro, playing, results
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per scenario

  const scenarios = [
    {
      question: "You're approaching graduation and want to work in the U.S. Which work authorization should you apply for first?",
      options: [
        "H-1B Visa", 
        "Optional Practical Training (OPT)", 
        "Green Card", 
        "TN Visa"
      ],
      correctAnswer: 1,
      explanation: "OPT allows F-1 students to work for up to 12 months after graduation, with a possible 24-month extension for STEM students.",
      hint: "Think about the immediate option available to F-1 students after graduation."
    },
    {
      question: "A recruiter asks about your visa status during an interview. What's the best approach?",
      options: [
        "Avoid mentioning you need visa sponsorship", 
        "Briefly explain your OPT status and when you'd need sponsorship", 
        "Ask if they sponsor visas immediately", 
        "Tell them you'll figure out visa issues on your own"
      ],
      correctAnswer: 1,
      explanation: "Being honest while focusing on your current OPT eligibility (which doesn't require sponsorship) gives you the best chance.",
      hint: "Transparency with a focus on immediate work authorization is key."
    },
    {
      question: "Which job search strategy is most effective for international students?",
      options: [
        "Only applying to large companies that are known to sponsor visas", 
        "Using only general job boards like Indeed", 
        "Using specialized platforms and attending networking events with international focus", 
        "Taking any job offer regardless of career fit"
      ],
      correctAnswer: 2,
      explanation: "Specialized job boards for international students and targeted networking provide better opportunities for visa-friendly positions.",
      hint: "Consider where international-friendly employers would be looking for candidates."
    },
    {
      question: "In an American workplace, your supervisor gives you feedback on a project. What's the appropriate response?",
      options: [
        "Silently accept it without question", 
        "Debate each point to show your knowledge", 
        "Thank them for feedback, ask clarifying questions, and discuss follow-up steps", 
        "Promise to fix everything without discussion"
      ],
      correctAnswer: 2,
      explanation: "American workplace culture values thoughtful engagement with feedback, showing appreciation while seeking clarity.",
      hint: "Consider what demonstrates both respect and initiative in American workplace culture."
    },
    {
      question: "Which networking approach would be most effective for an international student?",
      options: [
        "Sending generic connection requests to hundreds of professionals", 
        "Only networking with people from your home country", 
        "Attending targeted industry events and preparing personalized outreach", 
        "Waiting for employers to find your online profile"
      ],
      correctAnswer: 2,
      explanation: "Quality connections with personalized outreach at relevant industry events yield better results than generic mass networking.",
      hint: "Think about quality versus quantity in professional relationship building."
    }
  ];

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswer(-1); 
    }
    
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setScore(0);
    setTimeLeft(60);
  };

  const handleAnswer = (selectedIndex) => {
    const current = scenarios[currentScenario];
    let newFeedback = '';
    
    if (selectedIndex === current.correctAnswer) {
      setScore(score + 1);
      newFeedback = "Correct! " + current.explanation;
    } else if (selectedIndex === -1) {
      newFeedback = "Time's up! " + current.explanation;
    } else {
      newFeedback = "Not quite. " + current.explanation;
    }
    
    setFeedback(newFeedback);
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setFeedback('');
        setShowHint(false);
        setTimeLeft(60);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const restartGame = () => {
    setGameState('intro');
    setCurrentScenario(0);
    setScore(0);
    setFeedback('');
    setShowHint(false);
  };

  const renderIntro = () => (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Global Opportunities Explorer</h2>
      <p className="mb-6 text-gray-700">Navigate the challenges of the U.S. job market as an international student! Answer scenarios correctly to earn points and learn essential strategies for your career journey.</p>
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h3 className="font-semibold text-blue-700 mb-2">How to Play:</h3>
        <ul className="text-left text-gray-600 list-disc pl-6">
          <li>You'll face 5 different career scenarios</li>
          <li>Choose the best response within 60 seconds</li>
          <li>Get feedback on your choices</li>
          <li>Use hints if you're stuck</li>
        </ul>
      </div>
      <button 
        onClick={startGame}
        className="bg-blue-600 hover:bg-blue-700 text-white pointer cursor-pointer font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Start Your Journey
      </button>
    </div>
  );

  const renderPlaying = () => {
    const current = scenarios[currentScenario];
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-blue-800">Scenario {currentScenario + 1}/{scenarios.length}</span>
          <span className={`font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-gray-700'}`}>Time: {timeLeft}s</span>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{current.question}</h3>
          
          <div className="space-y-3">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-3 border border-gray-300 rounded-md hover:bg-blue-50 cursor-pointer transition duration-150 ease-in-out"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {feedback && (
          <div className={`p-3 rounded-md mb-4 ${feedback.startsWith('Correct') ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            {feedback}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-blue-600 border-none p-2 rounded-lg  hover:text-blue-400 pointer cursor-pointer transition duration-150 ease-in-out "
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <span className="font-bold">Score: {score}</span>
        </div>
        
        {showHint && (
          <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md">
            Hint: {current.hint}
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Journey Complete!</h2>
      
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <p className="text-xl mb-2">Your Score: <span className="font-bold text-blue-600">{score}/{scenarios.length}</span></p>
        
        {score === scenarios.length ? (
          <p className="text-green-600">Perfect! You're well-prepared for the U.S. job market!</p>
        ) : score >= 3 ? (
          <p className="text-blue-600">Great job! You have a solid understanding of U.S. job search strategies.</p>
        ) : (
          <p className="text-orange-600">Good effort! Review the material to strengthen your knowledge.</p>
        )}
      </div>
      
      <div className="mb-6 text-left">
        <h3 className="font-bold text-gray-700 mb-2">Key Takeaways:</h3>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Understand your visa options and timeline</li>
          <li>Address visa status professionally in interviews</li>
          <li>Use specialized job search platforms for international students</li>
          <li>Adapt to American workplace communication norms</li>
          <li>Build a targeted, quality-focused network</li>
        </ul>
      </div>
      
      <button 
        onClick={restartGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full pointer cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 mr-4"
      >
        Play Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col justify-center">
      {gameState === 'intro' && renderIntro()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'results' && renderResults()}
    </div>
  );
};

export default GlobalOpportunitiesExplorer;