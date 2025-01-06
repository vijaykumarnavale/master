import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faKey, faLock } from '@fortawesome/free-solid-svg-icons'; // Import the key and lock icons

const ResetPasswordPage = () => {
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Get location object from React Router
  const navigate = useNavigate();

  // Load API base URL from environment variables
  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  // Extract token from the URL query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // Get token from query string

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired token.');
    }
  }, [token]);

  // Handle password reset form submission
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Send the POST request with the token and new password
      const response = await axios.post(
        `${apiBaseUrl}/reset-password`, // Use the environment variable for the API URL
        { newPassword, token }, // Use `password` from the state variable
        { headers: { 'Content-Type': 'application/json' } } // Add content-type header
      );

      // If the response contains a success message
      setMessage(response.data.message);

      // Redirect to login page after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setLoading(false);

      // Handle specific error responses (if any) from the API
      if (err.response) {
        setError(err.response.data.message || 'Error resetting password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset Your Password</h2>

      <form onSubmit={handlePasswordResetSubmit}>
        <div className="input-group">
          <label htmlFor="password">
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <button type="submit" className="submit-btn" disabled={loading || !token}>
          <FontAwesomeIcon icon={faKey} style={{ marginRight: '8px' }} />
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
