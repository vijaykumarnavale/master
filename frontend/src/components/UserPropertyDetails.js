import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state || {};

  const [popupData, setPopupData] = useState(null);
  const [isSectionOpen, setIsSectionOpen] = useState({
    propertyDetails: true,
    setbackDetails: false,
    permittedUses: false,
    aduDetails: false,
    jaduDetails: false,
  });

  const handleBack = () => navigate(-1);

  const capitalizeFieldName = (fieldName) =>
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');

  const handleKeyClick = (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      setPopupData({ key, value });
    }
  };

  const renderPopupContent = () => (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white p-5 rounded-lg shadow-xl w-80" 
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
        {capitalizeFieldName(popupData.key)}
      </h3>
      <ul className="space-y-1">
        {Object.entries(popupData.value).map(([key, value]) => (
          <li key={key} className="text-gray-700 text-base">
            <strong className="text-gray-900">{capitalizeFieldName(key)}:</strong> {value?.toString() || 'N/A'}
          </li>
        ))}
      </ul>
      <button 
        onClick={() => setPopupData(null)} 
        className="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Close
      </button>
    </motion.div>
  );

  const renderNestedTable = (nestedData) => {
    if (!nestedData || typeof nestedData !== 'object') {
      return <div className="text-gray-500 text-sm">No data available</div>;
    }
    return (
      <table className="w-full border border-gray-200 mt-1 text-base">
        <tbody>
          {Object.entries(nestedData).map(([subKey, subValue]) => (
            <tr key={subKey} className="border-b border-gray-200">
              <th
                className="p-2 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleKeyClick(subKey, subValue)}
              >
                {capitalizeFieldName(subKey)}
              </th>
              <td className="p-2">{typeof subValue === 'object' ? renderNestedTable(subValue) : subValue?.toString() || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const toggleSection = (section) => {
    setIsSectionOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  if (!propertyData) {
    return <div className="text-center text-gray-600 mt-6 text-lg">No property data available.</div>;
  }

  const sections = [
    { title: 'Property Details', key: 'propertyDetails', fields: ['address', 'zoning', 'plot_area_sqft', 'pincode', 'height_limit_ft', 'depth_ft', 'width_ft', 'building_sqft', 'parking_spaces', 'garages'] },
    { title: 'Setback Details', key: 'setbackDetails', fields: ['front_ft', 'back_ft', 'side_ft'] },
    { title: 'Permitted Uses', key: 'permittedUses', render: () => renderNestedTable(propertyData.permitted_uses) },
    { title: 'ADU Details', key: 'aduDetails', render: () => renderNestedTable(propertyData.adu_details) },
    { title: 'JADU Details', key: 'jaduDetails', render: () => renderNestedTable(propertyData.jadu_details) },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      {sections.map(({ title, key, fields, render }) => (
        <div key={key} className="mb-4">
          <motion.div 
            className="bg-blue-700 text-white p-3 rounded-t-md cursor-pointer flex justify-between items-center text-lg font-semibold"
            onClick={() => toggleSection(key)}
            whileTap={{ scale: 0.95 }}
          >
            {title}
            <span>{isSectionOpen[key] ? '-' : '+'}</span>
          </motion.div>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isSectionOpen[key] ? 'auto' : 0, opacity: isSectionOpen[key] ? 1 : 0 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-white border border-gray-200 rounded-b-md">
              {fields ? (
                <table className="w-full border-collapse border border-gray-300 text-base">
                  <tbody>
                    {fields.map((field) => (
                      <tr key={field} className="border-b border-gray-200">
                        <th className="p-2 bg-gray-100 text-gray-700">{capitalizeFieldName(field)}</th>
                        <td className="p-2 text-gray-600">{propertyData[field] || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                render && render()
              )}
            </div>
          </motion.div>
        </div>
      ))}

      <div className="mt-5 flex justify-between">
        <motion.button 
          onClick={handleBack} 
          className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-red-500 transition text-base"
          whileHover={{ scale: 1.05 }}
        >
          Back
        </motion.button>
      </div>

      {popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setPopupData(null)}>
          {renderPopupContent()}
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;