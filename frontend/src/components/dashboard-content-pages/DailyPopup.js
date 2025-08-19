// src/components/popups/DailyPopup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import dailyPopupIcon from '../../assets/images/dailyPopupIcon.png';

const DailyPopup = ({ userId }) => {
    const [showIcon, setShowIcon] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [followUpAnswer, setFollowUpAnswer] = useState(null);
    const [additionalFeedback, setAdditionalFeedback] = useState("");
    const [showDailyPopup, setShowDailyPopup] = useState(false);
    const [showDailyIcon, setShowDailyIcon] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showPopup, setShowPopup] = useState(() => {
    const lastPopupDate = localStorage.getItem("lastPopupDate");
    const today = new Date().toISOString().split("T")[0];
    return lastPopupDate !== today;
    });

const completeDailyPopup = () => {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("lastPopupDate", today);
  localStorage.setItem("hasSubmittedToday", "true");

  setShowDailyPopup(false);
  setShowDailyIcon(true);
};
const handleSubmit = async () => {
    console.log('handleSubmit was called');
    console.log('selectedRating:', selectedRating);
    console.log('followUpAnswer:', followUpAnswer);
    console.log('additionalFeedback:', additionalFeedback);

    completeDailyPopup();

    const submission = {
        rating: selectedRating,
        followUp: followUpAnswer,
        feedback: additionalFeedback,
        flagged: selectedRating === 1 && followUpAnswer === "Yes" 
    };

    try {
        console.log('submitting feedback...');
        await axios.post("/api/daily-feedback", submission);
        console.log('feedback submitted:', submission);
    } catch (err) {
        console.error('Error submitting feedback:', err);
    }
};

    useEffect(() => {
        const lastPopupDate = localStorage.getItem("lastPopupDate");
        const today = new Date().toISOString().split("T")[0];
        const hasSubmittedToday = localStorage.getItem("hasSubmittedToday");

        if (lastPopupDate !== today) {
            setShowOnboarding(false);
            setShowDailyPopup(true);
        } else if (hasSubmittedToday === "true") {
            setShowDailyPopup(false);
            setShowDailyIcon(true);
        } else {
            setShowDailyIcon(true);
        }
    }, []);

  return (
    <>
      {showPopup && (
        <div className="daily-popup">
          <div className="popup-container">
            <h2>Welcome!</h2>
            <h3>How are you feeling today about your internship career readiness?</h3>

            <div className="daily-rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`rating-button ${selectedRating >= rating ? "active" : ""}`}
                  onClick={() => setSelectedRating(rating)}
                >
                  ★
                </button>
              ))}
            </div>

            {selectedRating === 1 && (
              <div className="followup">
                <p>Uh oh! Want someone to contact you for a chat?</p>
                <div className="yes-no-buttons">
                  <button
                    className={followUpAnswer === "Yes" ? "selected" : ""}
                    onClick={() => setFollowUpAnswer("Yes")}
                  >
                    Yes
                  </button>
                  <button
                    className={followUpAnswer === "No" ? "selected" : ""}
                    onClick={() => setFollowUpAnswer("No")}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {selectedRating === 2 && (
              <div className="followup">
                <p>Got it. What kind of career or internship help do you need right now?</p>
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={additionalFeedback}
                  onChange={(e) => setAdditionalFeedback(e.target.value)}
                  className="popup-input"
                />
              </div>
            )}

            {selectedRating >= 3 && selectedRating <= 5 && (
              <div className="followup">
                <p>
                  {selectedRating === 3
                    ? "Okay, we hope to make that a 5 soon!"
                    : selectedRating === 4
                    ? "That’s pretty good! Thank you for sharing!"
                    : "Excellent! Let’s keep that energy going!"}
                </p>
              </div>
            )}

            {selectedRating && (
              <button className="daily-submit-button" onClick={handleSubmit} type="button">
                Submit
              </button>
            )}

            <button
              className="close-button"
              onClick={() => {
                setShowPopup(false);
                setShowIcon(true);
              }}
            >
              x
            </button>
          </div>
        </div>
      )}

      {showIcon && (
        <img
          src={dailyPopupIcon}
          alt="Daily Popup Icon"
          className="floating-icon"
          onClick={() => setShowPopup(true)}
        />
      )}
    </>
  );
};

export default DailyPopup;
