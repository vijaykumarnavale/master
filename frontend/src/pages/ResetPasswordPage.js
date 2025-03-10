import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faLock } from '@fortawesome/free-solid-svg-icons';

const theme = "dark";

const themes = {
  dark: {
    background: "bg-gray-900",
    card: "bg-gray-800 shadow-2xl",
    text: "text-gray-100",
    input: "border-gray-700 bg-gray-700 text-gray-300",
    button: "bg-blue-500 hover:bg-blue-600",
    accent: "text-blue-400",
  },
};

const ResetPasswordPage = () => {
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;
  const colors = themes[theme];

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired token.');
    }
  }, [token]);

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/reset-password`,
        { newPassword, token },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message || 'Error resetting password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${colors.background} pt-0`}>
      <div className={`w-full max-w-md ${colors.card} rounded-3xl p-8 shadow-2xl`}>
        <h2 className={`text-center text-3xl font-bold ${colors.text} mb-6`}>Reset Your Password</h2>

        <form onSubmit={handlePasswordResetSubmit}>
          <div className="mb-6">
            <label className={`block font-medium ${colors.text} mb-2`}>New Password</label>
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faLock} className="absolute left-4 text-gray-500" />
              <input
                type="password"
                className={`w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-300 hover:shadow-md ${colors.input}`}
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={`block font-medium ${colors.text} mb-2`}>Confirm Password</label>
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faLock} className="absolute left-4 text-gray-500" />
              <input
                type="password"
                className={`w-full pl-12 p-3 border rounded-xl focus:ring-2 focus:ring-opacity-50 focus:outline-none transition duration-300 hover:shadow-md ${colors.input}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          {message && <div className="text-green-500 text-sm mb-3">{message}</div>}

          <button
            type="submit"
            className={`w-full ${colors.button} text-white py-3 rounded-xl font-bold transition duration-300 disabled:bg-gray-400 flex items-center justify-center`}
            disabled={loading || !token}
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
