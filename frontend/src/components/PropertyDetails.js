import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the plugin
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

  const handleCreateAP1 = (key) => {
    console.log(`Creating architectural plan for Permitted Uses: ${key}`);
    alert(`Architectural plan created for ${key}!`);
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

  const renderNestedTable = (nestedData, isOuterRow = false) => (
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
                ? renderNestedTable(subValue, false) // False for nested rows
                : subValue.toString()}
            </td>
            {/* Render "Create AP1" button only for outer rows */}
            {isOuterRow && (
              <td>
                <button
                  onClick={() => handleCreateAP1(subKey)}
                  className="create-ap1-button"
                >
                  Create AP1 for {capitalizeFieldName(subKey)}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const handlePrint = () => {
    window.print(); // Print the current page
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Property Details', 10, 10);
    doc.autoTable({ html: '.details-table' }); // Automatically generate a table from the HTML
    doc.save('property-details.pdf');
  };

  return (
    <div className="details-container">
      <h2>Property Details</h2>
      <table className="details-table">
        <tbody>
          {Object.entries(propertyData).map(([key, value]) => (
            <tr key={key}>
              <th onClick={() => handleKeyClick(key, value)}>
                {capitalizeFieldName(key)}
              </th>
              <td>
                {key === 'permitted_uses' ? (
                  <>
                    {typeof value === 'object' && !Array.isArray(value)
                      ? renderNestedTable(value, true) // Pass `true` for outer rows
                      : value.toString()}
                  </>
                ) : (
                  typeof value === 'object' && !Array.isArray(value)
                    ? renderNestedTable(value)
                    : value.toString()
                )}
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

      {/* Buttons at bottom-right */}
      <div className="bottom-right-buttons">
        <button onClick={handlePrint} className="print-button">
          Print
        </button>
        <button onClick={handleDownloadPDF} className="download-pdf-button">
          Download PDF
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
