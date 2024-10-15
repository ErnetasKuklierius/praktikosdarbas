import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();

    const handleAdmin = (e) => {

        e.preventDefault();

        navigate('/admin');
  };
    return (
      <div>
        <p>wow main</p>
        <form onSubmit={handleAdmin}>
        <button className='bg-red-500'>Admin page</button>
        </form>
      </div>
    );
  }
  
  export default Main;
  