import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Details.css'; // Optional CSS file for styling

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state;

  const [popupData, setPopupData] = useState(null);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleCreateAP = () => {
    console.log('Creating architectural plan for:', propertyData);
    alert('Architectural plan created successfully!');
  };

  const capitalizeFieldName = (fieldName) => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');
  };

  const handleKeyClick = (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      setPopupData({ key, value });
    }
  };

  const renderPopupContent = () => (
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <h3>{capitalizeFieldName(popupData.key)}</h3>
      <ul>
        {Object.entries(popupData.value).map(([key, value]) => (
          <li key={key}>
            <strong>{capitalizeFieldName(key)}:</strong> {value.toString()}
          </li>
        ))}
      </ul>
      <button onClick={() => setPopupData(null)}>Close</button>
    </div>
  );

  const renderNestedTable = (nestedData) => (
    <table className="nested-table">
      <tbody>
        {Object.entries(nestedData).map(([subKey, subValue]) => (
          <tr key={subKey}>
            <th
              className="clickable-key"
              onClick={() => handleKeyClick(subKey, subValue)}
            >
              {capitalizeFieldName(subKey)}
            </th>
            <td>
              {typeof subValue === 'object' && !Array.isArray(subValue)
                ? renderNestedTable(subValue)
                : subValue.toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="details-container">
      <h2>Property Details</h2>
      <table className="details-table">
        <tbody>
          {Object.entries(propertyData).map(([key, value]) => (
            <tr key={key}>
              <th
              
                onClick={() => handleKeyClick(key, value)}
              >
                {capitalizeFieldName(key)}
              </th>
              <td>
                {typeof value === 'object' && !Array.isArray(value)
                  ? renderNestedTable(value)
                  : value.toString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="details-footer">
        <button onClick={handleBack} className="footer-back-button">
          Back
        </button>
        <button onClick={handleCreateAP} className="footer-create-ap-button">
          Create AP
        </button>
      </div>

      {popupData && (
        <div className="popup-overlay" onClick={() => setPopupData(null)}>
          {renderPopupContent()}
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
