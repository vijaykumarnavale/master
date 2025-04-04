import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faMapMarkerAlt, faMapPin, faSearchLocation, faBuilding, faRulerCombined, faRuler, faParking, faHome } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PropertiesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    apn: '',
    pincode: '',
    zoning: '',
    plot_area_sqft: '',
    height_limit_ft: '',
    depth_ft: '',
    width_ft: '',
    building_sqft: '',
    parking_spaces: '',
    garages: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/properties`, formData)
        .then(response => {
          console.log(response.data);
          localStorage.setItem('property_id', response.data.property_id);
          toast.success("Property details saved successfully!", {
            position: "top-right",
            autoClose: 3000, // Closes after 3 seconds
          });
          setTimeout(() => {
            navigate('/setbacks');
          }, 2000); // Navigate after 2 seconds to show toast message
        })
        .catch(error => {
          console.error('Error submitting property data:', error);
          toast.error("Failed to save property details. Please try again.");
        });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
      <ToastContainer />
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Property Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            ['address', 'Address', faMapMarkerAlt],
            ['apn', 'APN', faMapPin],
            ['pincode', 'Pincode', faSearchLocation],
            ['zoning', 'Zoning', faBuilding],
            ['plot_area_sqft', 'Plot Area (sqft)', faRulerCombined],
            ['height_limit_ft', 'Height Limit (ft)', faRuler],
            ['depth_ft', 'Depth (ft)', faRuler],
            ['width_ft', 'Width (ft)', faRuler],
            ['building_sqft', 'Building Area (sqft)', faBuilding],
            ['parking_spaces', 'Parking Spaces', faParking],
            ['garages', 'Garages', faHome]
          ].map(([name, label, icon]) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="font-semibold text-gray-800 mb-1 text-sm">{label} <span className="text-red-500">*</span></label>
              <div className="relative">
                <FontAwesomeIcon icon={icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
                <input
                  type={name.includes('_sqft') || name.includes('_ft') || name.includes('spaces') || name.includes('garages') ? 'number' : 'text'}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={label}
                  className="pl-10 py-1 px-3 w-full border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-8"
                />
              </div>
              {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name]}</span>}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white py-1 px-3 rounded-md font-semibold text-sm hover:bg-blue-700 transition duration-300">
            <FontAwesomeIcon icon={faArrowRight} className="mr-1" /> Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertiesForm;
