import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Details.css'; // Optional styling for vertical table

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state;

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleCreateAP = () => {
    // Logic to create an architectural plan
    console.log('Creating architectural plan for:', propertyData);
    alert('Architectural plan created successfully!');
  };

  return (
    <div className="details-container">
      <table className="details-table">
        <tbody>
          {Object.entries(propertyData).map(([key, value]) => (
            <tr key={key}>
              <th>{key}</th>
              <td>{value}</td>
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
    </div>
  );
};

export default PropertyDetails;
