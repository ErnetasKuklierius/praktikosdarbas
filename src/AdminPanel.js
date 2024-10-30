import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchEvents();
    fetchCategories();
    fetchBlockedUsers(); 
  }, []);

  const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:3001/api/users'); 
        console.log('Fetched users:', response.data);
        setUsers(response.data);
        console.log('Full response:', response);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


  const fetchEvents = async () => {
    const response = await axios.get('http://localhost:3001/api/events'); 
    setEvents(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('http://localhost:3001/api/categories'); 
    setCategories(response.data);
  };

  const fetchBlockedUsers = async () => {
    const response = await axios.get('http://localhost:3001/api/blocked-users'); 
    console.log('Fetched blocked users:', response.data);
    setBlockedUsers(response.data);
  };

  const blockUser  = async (userId) => {
    console.log('Attempting to block user with ID:', userId);

    try {
        await axios.post('http://localhost:3001/api/users/block', { userId, action: 'block' });

        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => 
                user.id === userId ? { ...user, isBlocked: true } : user
            );

            const blockedUser  = updatedUsers.find(user => user.id === userId);
            if (blockedUser ) {
                setBlockedUsers(prevBlockedUsers => [
                    ...prevBlockedUsers, 
                    { ...blockedUser  }
                ]);
            } else {
                console.error('User  not found in the updated state:', userId);
            }

            return updatedUsers;
        });

    } catch (error) {
        console.error('Error blocking user:', error);
    }
};

const unblockUser = async (userId) => {
    console.log('Attempting to unblock user with ID:', userId);
    await axios.post('http://localhost:3001/api/users/block', { userId, action: 'unblock' });
    setUsers(users => users.map(user => user.id === userId ? { ...user, isBlocked: false } : user));
    setBlockedUsers(blockedUsers => blockedUsers.filter(user => user.id !== userId));
};

  
  const removeContent = async (contentId) => {
    await axios.post('http://localhost:3001/api/remove-content', { contentId });
    setEvents(events.filter(item => item.id !== contentId));
  };

  const approveEvent = async (eventId) => {
    await axios.post('http://localhost:3001/api/events', { eventId });
    setEvents(events.map(item => item.id === eventId ? { ...item, isApproved: true } : item));
  };

  const rejectEvent = async (eventId) => {
    await axios.post('http://localhost:3001/api/reject-event', { eventId });
    setEvents(events.map(item => item.id === eventId ? { ...item, isApproved: false } : item));
  };

  const handleLogout = () => {
    navigate("/login"); 
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3001/api/categories', { name: newCategory });
    setCategories([...categories, response.data]); 
    setNewCategory('');
  };

  console.log('Users state:', users);
  console.log('Blocked Users state:', blockedUsers);
  

  return (
    <div className="container mx-auto py-10">
      <button 
        onClick={handleLogout} 
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-5">Admin Panel</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Manage Users</h2>
        <div className="bg-gray-100 p-5 rounded-md">
          {users.map(user => (
            <div key={user.id} className="flex justify-between items-center mb-2">
              <span>{user.username} {user.isBlocked && '(Blocked)'}</span>
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
    <h2 className="text-2xl font-semibold mb-3">Blocked Users</h2>
    <div className="bg-gray-100 p-5 rounded-md">
        {blockedUsers.map(user => (
            <div key={user.id} className="flex justify-between items-center mb-2">
                <span>{user.username} (Blocked)</span>
                <button
                    onClick={() => unblockUser(user.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                >
                    Unblock User
                </button>
            </div>
        ))}
    </div>
</section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Manage Events</h2>
        <div className="bg-gray-100 p-5 rounded-md">
          {events.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>{item.title} {item.isApproved ? '(Approved)' : '(Not Approved)'}</span>
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

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Manage Categories</h2>
        <form onSubmit={handleAddCategory} className="mb-5">
          <input 
            type="text" 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)} 
            placeholder="New Category" 
            className="border p-2 rounded mr-2"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </form>
        <div className="bg-gray-100 p-5 rounded-md">
          {categories.map(category => (
            <div key={category.id} className="mb-2">
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
