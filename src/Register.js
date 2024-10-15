import React from 'react';
import bgImage from './Images/bgImg2.jpg';
import avatarImage from './Images/smonkey.png';
import { Link } from 'react-router-dom';
import avatarImage2 from './Images/avatar2.jpg';

function Register() {
  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
      >
    <div className="top-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-80">
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarImage2}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold">Register</h2>
        </div>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Register;
