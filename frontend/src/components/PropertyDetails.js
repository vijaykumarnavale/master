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
  const [isPermittedUsesOpen, setIsPermittedUsesOpen] = useState(false); // State for collapsible section
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(true); // State for property details collapsible
  const [isSetbackDetailsOpen, setIsSetbackDetailsOpen] = useState(false); // State for setback details collapsible
  const [isAdUJaduDetailsOpen, setIsAdUJaduDetailsOpen] = useState(false); // State for ADU-JADU details collapsible
  const [isParkingDetailsOpen, setIsParkingDetailsOpen] = useState(false); // State for parking details collapsible

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
    <table className="nested-table"> {/* Use nested-table class to avoid unwanted styles */}
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

  const propertyFields = [
    'address',
    'zoning',
    'plot_area_sqft',
    'pincode',
    'height_limit_ft',
    'depth_ft',
    'width_ft',
    'building_sqft',
  ];

  const setbackFields = ['front_ft', 'back_ft', 'side_ft'];

  const aduJaduFields = [
    'adu_type',
    'adu_max_sqft',
    'adu_count',
    'jadu_count',
    'jadu_max_sqf'
  ];

  // Only parking_spaces field
  const parkingFields = ['parking_spaces'];

  return (
    <div className="details-container">
      {/* Collapsible Section for Property Details */}
      <div
        className="collapsible-header"
        onClick={() => setIsPropertyDetailsOpen(!isPropertyDetailsOpen)}
      >
        Property Details
        <span>{isPropertyDetailsOpen ? '-' : '+'}</span>
      </div>
      {isPropertyDetailsOpen && (
        <div className="collapsible-content">
          <table className="details-table">
            <tbody>
              {propertyFields.map((field) => (
                <tr key={field}>
                  <th>{capitalizeFieldName(field)}</th>
                  <td>{propertyData[field] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Collapsible Section for Setback Details */}
      <div
        className="collapsible-header"
        onClick={() => setIsSetbackDetailsOpen(!isSetbackDetailsOpen)}
      >
        Setback Details
        <span>{isSetbackDetailsOpen ? '-' : '+'}</span>
      </div>
      {isSetbackDetailsOpen && (
        <div className="collapsible-content">
          <table className="details-table">
            <tbody>
              {setbackFields.map((field) => (
                <tr key={field}>
                  <th>{capitalizeFieldName(field)}</th>
                  <td>{propertyData[field] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Collapsible Section for Permitted Uses */}
      <div
        className="collapsible-header"
        onClick={() => setIsPermittedUsesOpen(!isPermittedUsesOpen)}
      >
        Permitted Uses
        <span>{isPermittedUsesOpen ? '-' : '+'}</span>
      </div>
      {isPermittedUsesOpen && (
        <div className="collapsible-content">
          {typeof propertyData.permitted_uses === 'object' && !Array.isArray(propertyData.permitted_uses)
            ? renderNestedTable(propertyData.permitted_uses, true) // Pass true for outer rows
            : propertyData.permitted_uses.toString()}
        </div>
      )}

      {/* Collapsible Section for ADU-JADU Details */}
      <div
        className="collapsible-header"
        onClick={() => setIsAdUJaduDetailsOpen(!isAdUJaduDetailsOpen)}
      >
        ADU-JADU Details
        <span>{isAdUJaduDetailsOpen ? '-' : '+'}</span>
      </div>
      {isAdUJaduDetailsOpen && (
        <div className="collapsible-content">
          <table className="details-table">
            <tbody>
              {aduJaduFields.map((field) => (
                <tr key={field}>
                  <th>{capitalizeFieldName(field)}</th>
                  <td>{propertyData[field] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Collapsible Section for Parking Details */}
      <div
        className="collapsible-header"
        onClick={() => setIsParkingDetailsOpen(!isParkingDetailsOpen)}
      >
        Parking Details
        <span>{isParkingDetailsOpen ? '-' : '+'}</span>
      </div>
      {isParkingDetailsOpen && (
        <div className="collapsible-content">
          <table className="details-table">
            <tbody>
              {parkingFields.map((field) => (
                <tr key={field}>
                  <th>{capitalizeFieldName(field)}</th>
                  <td>{propertyData[field] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
