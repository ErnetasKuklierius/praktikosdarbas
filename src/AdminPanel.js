import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);


  const blockUser = async (userId) => {
    await axios.post('/block-user', { userId });
    setUsers(users.map(user => user.id === userId ? { ...user, isBlocked: true } : user));
  };

  const removeContent = async (contentId) => {
    await axios.post('/remove-content', { contentId });
    setEvents(events.filter(item => item.id !== contentId));
  };

  const approveEvent = async (eventId) => {
    await axios.post('/approve-event', { eventId });
    setEvents(events.map(item => item.id === eventId ? { ...item, isApproved: true } : item));
  };

  const rejectEvent = async (eventId) => {
    await axios.post('/reject-event', { eventId });
    setEvents(events.map(item => item.id === eventId ? { ...item, isApproved: false } : item));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Admin Panel</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Manage Users</h2>
        <div className="bg-gray-100 p-5 rounded-md">
          {users.map(user => (
            <div key={user.id} className="flex justify-between items-center mb-2">
              <span>{user.name} {user.isBlocked && '(Blocked)'}</span>
              {!user.isBlocked && (
                <button
                  onClick={() => blockUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Block User
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Manage Events</h2>
        <div className="bg-gray-100 p-5 rounded-md">
          {events.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.title} {item.isBlocked && '(Blocked)'} {item.isApproved ? '(Approved)' : '(Not Approved)'}</span>
              <div className="space-x-2">
                {!item.isApproved && (
                  <button
                    onClick={() => approveEvent(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                  >
                    Approve Event
                  </button>
                )}
                {item.isApproved && (
                  <button
                    onClick={() => rejectEvent(item.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                  >
                    Reject Event
                  </button>
                )}
                <button
                  onClick={() => removeContent(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Remove Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
