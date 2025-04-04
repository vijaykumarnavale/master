import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state || {};

  const [isSectionOpen, setIsSectionOpen] = useState({
    propertyDetails: true,
  });

  const handleBack = () => navigate(-1);

  const capitalizeFieldName = (fieldName) =>
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');

  if (!propertyData) {
    return <div className="text-center text-gray-600 mt-6 text-lg">No property data available.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg"
    >
      <motion.div
        className="bg-blue-700 text-white p-3 rounded-t-md cursor-pointer flex justify-between items-center text-lg font-semibold"
        onClick={() => setIsSectionOpen((prevState) => ({ ...prevState, propertyDetails: !prevState.propertyDetails }))}
        whileTap={{ scale: 0.95 }}
      >
        Property Details
        <span>{isSectionOpen.propertyDetails ? '-' : '+'}</span>
      </motion.div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isSectionOpen.propertyDetails ? 'auto' : 0, opacity: isSectionOpen.propertyDetails ? 1 : 0 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div className="p-3 bg-white border border-gray-200 rounded-b-md">
          <table className="w-full border-collapse border border-gray-300 text-base">
            <tbody>
              {Object.entries(propertyData).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-200">
                  <th className="p-2 bg-gray-100 text-gray-700">{capitalizeFieldName(key)}</th>
                  <td className="p-2 text-gray-600">{value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="mt-5 flex justify-between">
        <motion.button 
          onClick={handleBack} 
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-red-500 transition text-base"
          whileHover={{ scale: 1.05 }}
        >
          Back
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
