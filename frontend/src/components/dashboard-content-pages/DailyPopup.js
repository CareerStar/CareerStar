// src/components/popups/DailyPopup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from '../../utils/api';
import dailyPopupIcon from '../../assets/images/dailyPopupIcon.png';

const DailyPopup = ({ userId, studentName }) => {
  const [showIcon, setShowIcon] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [followUpAnswer, setFollowUpAnswer] = useState(null);
  const [additionalFeedback, setAdditionalFeedback] = useState("");
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

    setShowPopup(false);
    setShowIcon(false);
  };

  const handleSubmit = async () => {
    completeDailyPopup();

    const submission = {
      userId,
      studentName,
      rating: selectedRating,
      followUp: followUpAnswer,
      feedback: additionalFeedback,
      flagged: selectedRating === 1 && followUpAnswer === "Yes",
    };

    try {
      await axios.post(apiUrl('/api/daily-feedback'), submission);
      console.log("feedback submitted:", submission);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  useEffect(() => {
    const lastPopupDate = localStorage.getItem("lastPopupDate");
    const today = new Date().toISOString().split("T")[0];
    const hasSubmittedToday = localStorage.getItem("hasSubmittedToday");

    if (lastPopupDate !== today) {
      setShowOnboarding(false);
      setShowPopup(true);
      setShowIcon(false);
    } else if (hasSubmittedToday === "true") {
      setShowPopup(false);
      setShowIcon(false);
    } else {
      setShowPopup(false);
      setShowIcon(true);
    }
  }, []);

  return (
    <>
      {showPopup && (
        <div className="daily-popup">
          <div className="popup-wrapper">
            {/* mascot OUTSIDE on the left */}
            <img src={dailyPopupIcon} alt="Mascot" className="popup-mascot" />

            <div className="popup-container">
              <div className="daily-popup-content">
                <div className="popup-body">
                  <h2>Welcome!</h2>
                  <h3>How are you feeling today about your internship career readiness?</h3>

                  <div className="daily-rating">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        className={`rating-button ${selectedRating >= rating ? "active" : ""}`}
                        onClick={() => setSelectedRating(rating)}
                        type="button"
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
                          type="button"
                        >
                          Yes
                        </button>
                        <button
                          className={followUpAnswer === "No" ? "selected" : ""}
                          onClick={() => setFollowUpAnswer("No")}
                          type="button"
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
                    <button
                      className="daily-submit-button"
                      onClick={handleSubmit}
                      type="button"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>

              <button
                className="close-button"
                onClick={() => {
                  setShowPopup(false);
                  setShowIcon(true);
                }}
                type="button"
              >
                x
              </button>
            </div>
          </div>
        </div>
      )}

      {showIcon && (
        <img
          src={dailyPopupIcon}
          alt="Daily Popup Icon"
          className="floating-icon"
          onClick={() => {
            setShowPopup(true);
            setShowIcon(false);
          }}
        />
      )}
    </>
  );
};

export default DailyPopup;
