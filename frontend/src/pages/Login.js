import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios'; // Import axios
import './AuthForms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle between login and forgot password
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  // Handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const userData = { email, password };

    try {
      // Replace with your login API endpoint
      const response = await axios.post('http://localhost:5000/login', userData);
      
      setMessage(response.data.message);  // Assuming successful login message
      setLoading(false);

      // Assuming the response contains user data with role
      const { role } = response.data; // Ensure the backend returns role in response
      
      // Redirect based on user role
      if (role === 'Admin') {
        navigate('/admin-dashboard'); // Redirect to Admin Dashboard
      } else if (role === 'User') {
        navigate('/user-dashboard'); // Redirect to User Dashboard
      } else {
        setError('Role not found or invalid.');
      }
      
    } catch (err) {
      setLoading(false);
      setError(err.response ? err.response.data.message : 'Login failed, please try again');
    }
  };

  // Handle forgot password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email: forgotPasswordEmail });

      setMessage(response.data.message); // Success message on forgot password
      setForgotPasswordEmail(''); // Reset input field
      setIsForgotPassword(false);  // Go back to login screen
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response ? err.response.data.message : 'An error occurred while trying to reset your password');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isForgotPassword ? 'Forgot Password' : 'Login'}</h2>

      {/* Login Form */}
      {!isForgotPassword ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Forgot Password Link */}
          <p className="forgot-password-link" onClick={() => setIsForgotPassword(true)}>Forgot your password?</p>
        </form>
      ) : (
        // Forgot Password Form
        <form onSubmit={handleForgotPasswordSubmit}>
          <div className="input-group">
            <label htmlFor="forgotPasswordEmail">Enter your email</label>
            <input
              type="email"
              id="forgotPasswordEmail"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              placeholder="Enter your email to reset password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>

          {/* Back to Login Link */}
          <p className="forgot-password-link" onClick={() => setIsForgotPassword(false)}>Back to Login</p>
        </form>
      )}
    </div>
  );
};

export default Login;
