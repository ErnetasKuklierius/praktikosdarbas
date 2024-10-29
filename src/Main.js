import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"


function Main() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", events_data: "" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/api/events")
      .then((res) => {
        setEvents(res.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/events", newEvent);
      setNewEvent({ title: "", description: "", events_data: "" });
      const response = await axios.get("http://localhost:3001/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Event Manager</h1>

        <button 
          onClick={handleLogout} 
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
          <form onSubmit={handleSubmitEvent}>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Event Title"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                placeholder="Event Description"
                className="w-full p-2 border border-gray-300 rounded"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <input
                type="datetime-local"
                name="events_data"
                value={newEvent.events_data}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Event
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="mb-4 p-4 border border-gray-200 rounded">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-gray-400">Date: {new Date(event.events_data).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No events found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
