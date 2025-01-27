import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SetbacksForm.css';
import './Error.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRuler } from '@fortawesome/free-solid-svg-icons';

const SetbacksForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id') || '',
    front_ft: '',
    back_ft: '',
    side_ft: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.property_id) {
      alert("Property ID is missing. Please refresh the page and try again.");
      return;
    }

    const sanitizedData = {
      ...formData,
      front_ft: formData.front_ft === '' ? null : formData.front_ft,
      back_ft: formData.back_ft === '' ? null : formData.back_ft,
      side_ft: formData.side_ft === '' ? null : formData.side_ft,
    };

    setIsSubmitting(true);

    const apiUrl = process.env.REACT_APP_NODE_API_URL;
    if (!apiUrl) {
      console.error("API URL is not defined in the environment variables.");
      setIsSubmitting(false);
      return;
    }

    axios.post(`${apiUrl}/api/setbacks`, sanitizedData)
      .then(response => {
        console.log(response.data);
        navigate('/permitted-uses');
      })
      .catch(error => {
        console.error('Error submitting setbacks data:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="setbacks-form-container">
      <h2 className="setbacks-form-title">Setbacks Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="setbacks-property-form">
        <div className="setbacks-form-group">
          <label htmlFor="front_ft" className="setbacks-input-label">
            Front Setback (ft)
          </label>
          <div className="input-icon-container">
            <FontAwesomeIcon icon={faRuler} className="input-icon" />
            <input
              type="number"
              name="front_ft"
              id="front_ft"
              value={formData.front_ft}
              onChange={handleChange}
              className="setbacks-input-field"
            />
          </div>
        </div>

        <div className="setbacks-form-group">
          <label htmlFor="back_ft" className="setbacks-input-label">
            Back Setback (ft)
          </label>
          <div className="input-icon-container">
            <FontAwesomeIcon icon={faRuler} className="input-icon" />
            <input
              type="number"
              name="back_ft"
              id="back_ft"
              value={formData.back_ft}
              onChange={handleChange}
              className="setbacks-input-field"
            />
          </div>
        </div>

        <div className="setbacks-form-group">
          <label htmlFor="side_ft" className="setbacks-input-label">
            Side Setback (ft)
          </label>
          <div className="input-icon-container">
            <FontAwesomeIcon icon={faRuler} className="input-icon" />
            <input
              type="number"
              name="side_ft"
              id="side_ft"
              value={formData.side_ft}
              onChange={handleChange}
              className="setbacks-input-field"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="setbacks-submit-button"
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              Next
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SetbacksForm;
