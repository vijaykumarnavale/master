import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRuler } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error("Property ID is missing. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);

    axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/setbacks`, formData)
      .then(response => {
        console.log(response.data);
        toast.success("Setbacks saved successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate('/permitted-uses');
        }, 2000); // Navigate after 2 seconds to show toast message
      })
      .catch(error => {
        console.error('Error submitting setbacks data:', error);
        toast.error("Failed to save setbacks. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
      <ToastContainer />
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Setbacks Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
        {[['front_ft', 'Front Setback (ft)'], ['back_ft', 'Back Setback (ft)'], ['side_ft', 'Side Setback (ft)']].map(([name, label]) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="font-semibold text-gray-800 mb-1 text-xs">{label}</label>
            <div className="relative">
              <FontAwesomeIcon icon={faRuler} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="number"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={label}
                className="pl-8 py-1 px-2 w-full border border-gray-400 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 h-8"
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-1 px-3 rounded-md font-semibold text-xs hover:bg-blue-700 transition duration-300"
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                Next
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetbacksForm;
