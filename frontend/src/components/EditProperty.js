import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProperty = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state || {};

  const [formData, setFormData] = useState(propertyData || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.property_id) {
      toast.error('Missing property ID.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/property_update/${formData.property_id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || result.message || 'Update failed');
        return;
      }

      toast.success('Property updated successfully!');
      setTimeout(() => {
        navigate('/property-details', { state: { propertyData: formData } });
      }, 1500);
    } catch (error) {
      toast.error('Something went wrong while updating the property.');
    }
  };

  const capitalizeFieldName = (fieldName) =>
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');

  if (!propertyData) {
    return (
      <div className="text-center text-gray-600 mt-10 text-sm">
        No data to edit.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        Edit Property Details
      </h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        {Object.entries(formData).map(([key, value]) =>
          key === 'property_id' ? null : (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                {capitalizeFieldName(key)}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                readOnly={key === 'apn'}
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm transition ${
                  key === 'apn'
                    ? 'bg-gray-100 cursor-not-allowed border-gray-200 text-gray-500'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
            </div>
          )
        )}
      </form>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-md transition"
        >
          Save Changes
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProperty;
