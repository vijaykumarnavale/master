import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AuthForms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUnlockAlt, faSignInAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Load API base URL from environment variables
  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = { email, password };

    try {
      const response = await axios.post(`${apiBaseUrl}/login`, userData); // Use environment variable for API URL
      toast.success(response.data.message);
      setLoading(false);

      const { role } = response.data;

      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (role === 'User') {
        navigate('/user-dashboard');
      } else {
        toast.error('Role not found or invalid.');
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.response ? err.response.data.message : 'Login failed, please try again');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/forgot-password`, { email: forgotPasswordEmail }); // Use environment variable for API URL
      toast.success(response.data.message);
      setForgotPasswordEmail('');
      setIsForgotPassword(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response ? err.response.data.message : 'An error occurred while trying to reset your password');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isForgotPassword ? 'Forgot Password' : 'Login'}</h2>

      {!isForgotPassword ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <p className="forgot-password-link" onClick={() => setIsForgotPassword(true)}>
            <FontAwesomeIcon icon={faUnlockAlt} style={{ marginRight: '8px' }} />
            Forgot your password?
          </p>

          <button type="submit" className="submit-btn" disabled={loading}>
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '8px' }} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit}>
          <div className="input-group">
            <label htmlFor="forgotPasswordEmail">Enter your email</label>
            <div className="input-with-icon">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="forgotPasswordEmail"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email to reset password"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>

          <p className="forgot-password-link" onClick={() => setIsForgotPassword(false)}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
            Back to Login
          </p>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;
