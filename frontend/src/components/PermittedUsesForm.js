import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const useTypeOptions = [
  'Townhouse', 'Condominiums', 'One-Family Dwellings', 'Senior Citizen Units', 'Garages',
  'Unenclosed Parking', 'Accessory Buildings', 'Group Homes', 'Greenhouses/Gardens',
  'Transitional Uses', 'Public Parks', 'Single-Family Homes', 'Multi-Family Housing',
  'Religious Facilities', 'Daycare or Nursery Schools', 'Retail Stores', 'Financial Institutions',
  'Offices', 'Restaurants', 'Entertainment', 'Hotels', 'Educational Uses', 'Manufacturing'
];

const PermittedUsesForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    uses: [
      {
        use_type: '',
        lot_area_sqft: '',
        lot_width_ft: '',
        lot_depth_ft: '',
        setback_front_ft: '',
        setback_back_ft: '',
        setback_side_ft: '',
        max_height_ft: '',
        parking_spaces_required: '',
      },
    ],
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedUses = [...formData.uses];
    updatedUses[index][name] = value;
    setFormData({ ...formData, uses: updatedUses });
  };

  const handleAddUse = () => {
    setFormData({
      ...formData,
      uses: [...formData.uses, {
        use_type: '',
        lot_area_sqft: '',
        lot_width_ft: '',
        lot_depth_ft: '',
        setback_front_ft: '',
        setback_back_ft: '',
        setback_side_ft: '',
        max_height_ft: '',
        parking_spaces_required: '',
      }],
    });
    toast.info('New use added.');
  };

  const handleRemoveUse = (index) => {
    const updatedUses = formData.uses.filter((_, i) => i !== index);
    setFormData({ ...formData, uses: updatedUses });
    toast.info('Use entry removed successfully.');
  };

  const handleSubmit = () => {
    axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/permitted-uses`, formData)
      .then(() => {
        toast.success('Permitted uses submitted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate('/adu-details');
        }, 2000);
      })
      .catch(() => {
        toast.error('Failed to submit permitted uses.', {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-300">
      <ToastContainer />
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Permitted Uses Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {formData.uses.map((use, index) => (
          <div key={index} className="p-4 border rounded-md bg-gray-100">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(use).map((field) => (
                <div key={field} className="flex flex-col">
                  <label htmlFor={`${field}_${index}`} className="font-semibold text-gray-800 mb-1 text-xs">
                    {field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                  {field === 'use_type' ? (
                    <select
                      id={`${field}_${index}`}
                      name={field}
                      value={use[field]}
                      onChange={(e) => handleChange(e, index)}
                      className="p-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select Use Type</option>
                      {useTypeOptions.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id={`${field}_${index}`}
                      name={field}
                      value={use[field]}
                      onChange={(e) => handleChange(e, index)}
                      className="p-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveUse(index)}
              className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md text-xs hover:bg-red-600 transition duration-300"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" /> Remove This Use
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddUse}
          className="bg-black text-white py-2 px-4 rounded-md text-xs hover:bg-green-500 hover:text-black transition duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Another Use
        </button>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded-md text-xs hover:bg-blue-700 transition duration-300">
            Next <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PermittedUsesForm;
