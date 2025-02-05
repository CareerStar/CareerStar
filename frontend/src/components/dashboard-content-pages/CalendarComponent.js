import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = () => {
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [firstname, setFirstname] = useState(localStorage.getItem('firstname'));
    const [emailID, setEmailID] = useState('');
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [interviewDetails, setInterviewDetails] = useState({
        company: "",
        time: "",
        note: ""
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [showForm, setShowForm] = useState(true);

    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://api.careerstar.co/interviewschedule/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data = await response.json();

                    const updatedEvents = data.interviewSchedule.map(event => ({
                        ...event,
                        date: new Date(event.date),
                    }));

                    setEvents(updatedEvents);
                } else {
                    console.error('Error fetching interview details');
                }
            } catch (error) {
                console.error("Error fetching interview details:", error);
            }

            try {
                const response = await fetch(`https://api.careerstar.co/user/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setEmailID(data.emailID);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, [userId]);

    const onDateChange = (selectedDate) => {
        setSelectedDate(selectedDate);
        const event = events.find(
            (event) => event.date.toDateString() === selectedDate.toDateString()
        );
        if (event) {
            setInterviewDetails({ company: event.company, time: event.time, note: event.note });
            setShowForm(false);
        } else {
            setInterviewDetails({ company: "", time: "", note: "" });
            setShowForm(true);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInterviewDetails({
            ...interviewDetails,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (!interviewDetails.company || !interviewDetails.time) {
            alert("Please fill in all fields");
            return;
        }

        const newEvent = { date: selectedDate, ...interviewDetails };

        try {
            const response = await fetch(`https://api.careerstar.co/interviewschedule/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewSchedule: [...events, newEvent],
                    newInterviewSchedule: newEvent,
                    firstname: firstname,
                    emailID: emailID,
                }),
            });

            if (response.ok) {
                alert("Interview details saved successfully!");
                setEvents((prev) => [...prev, newEvent]);
                setShowForm(false);
            } else {
                console.error('Error updating interview details');
                alert("Failed to save interview details.");
            }
        } catch (error) {
            console.error("Error adding interview date:", error);
            alert("Failed to add interview date.");
        }
    };

    return (
        <div>
            <h1>Your schedule</h1>
            <Calendar
                onChange={onDateChange}
                value={date}
                tileClassName={({ date }) =>
                    events.find(
                        (event) => event.date.toDateString() === date.toDateString()
                    )
                        ? "calender-highlight"
                        : null
                }
            />

            {selectedDate && showForm && (
                <div className="interview-form">
                    <h2>Add Interview Details for {selectedDate.toDateString()}</h2>
                    <form>
                        <div>
                            <label>Company Name:</label>
                            <input
                                type="text"
                                name="company"
                                value={interviewDetails.company}
                                onChange={handleInputChange}
                                placeholder="Enter company name"
                            />
                        </div>
                        <div>
                            <label>Interview Time:</label>
                            <input
                                type="time"
                                name="time"
                                value={interviewDetails.time}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Notes:</label>
                            <textarea
                                name="note"
                                value={interviewDetails.note}
                                onChange={handleInputChange}
                                placeholder="Enter notes"
                            />
                        </div>
                        <button type="button" onClick={handleSubmit}>
                            Save Interview
                        </button>
                    </form>
                </div>
            )}

            {selectedDate && !showForm && (
                <div className="interview-details">
                    <h2>Interview Scheduled for {selectedDate.toDateString()}</h2>
                    <p><strong>Company:</strong> {interviewDetails.company}</p>
                    <p><strong>Time:</strong> {convertTo12HourFormat(interviewDetails.time)}</p>
                    <p><strong>Notes:</strong> {interviewDetails.note}</p>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;