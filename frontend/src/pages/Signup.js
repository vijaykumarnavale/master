import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './AuthForms.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('User'); // Default role
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous error/message
    setError(null);
    setMessage(null);
    setLoading(true);

    const userData = {
      full_name: fullName,
      email: email,
      contact_number: contactNumber,
      password: password,
      role: role,
    };

    try {
      // Replace with your API endpoint
      const response = await axios.post('http://localhost:5000/register', userData);

      // Handle success response
      setMessage(response.data.message);
      setFullName('');
      setEmail('');
      setContactNumber('');
      setPassword('');
      setRole('User');
    } catch (err) {
      // Handle error response
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
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
          <label htmlFor="contact_number">Contact Number</label>
          <input
            type="text"
            id="contact_number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Enter your contact number"
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
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Display error or success messages */}
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing Up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
