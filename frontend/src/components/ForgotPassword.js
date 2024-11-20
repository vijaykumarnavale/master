import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/forgot-password', { email });
      navigate('/email-sent'); // Redirect to confirmation page
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;