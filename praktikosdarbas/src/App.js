import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Main from './Main';
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Login/>} />
      </Routes>
    </Router>
  );
}
export default App;
