import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './UserPropertyDetails.css';

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreateAP = () => {
    if (propertyData) {
      console.log('Creating architectural plan for:', propertyData);
      alert('Architectural plan created successfully!');
    }
  };

  const handleCreateAP1 = (key) => {
    console.log(`Creating architectural plan for Permitted Uses: ${key}`);
    alert(`Architectural plan created for ${key}!`);
  };

  const capitalizeFieldName = (fieldName) => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');
  };

  const handleKeyClick = (key, value) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      setPopupData({ key, value });
    }
  };

  const renderPopupContent = () => (
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <h3>{capitalizeFieldName(popupData.key)}</h3>
      <ul>
        {Object.entries(popupData.value).map(([key, value]) => (
          <li key={key}>
            <strong>{capitalizeFieldName(key)}:</strong> {value?.toString() || 'N/A'}
          </li>
        ))}
      </ul>
      <button onClick={() => setPopupData(null)}>Close</button>
    </div>
  );

  const renderNestedTable = (nestedData, isOuterRow = false) => {
    if (!nestedData || typeof nestedData !== 'object') {
      return <div>No data available</div>;
    }

    return (
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
                {typeof subValue === 'object' && subValue !== null && !Array.isArray(subValue)
                  ? renderNestedTable(subValue)
                  : subValue?.toString() || 'N/A'}
              </td>
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
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (propertyData) {
      const doc = new jsPDF();
      doc.text('Property Details', 10, 10);
      doc.autoTable({ html: '.details-table' });
      doc.save('property-details.pdf');
    } else {
      alert('No data available to download as PDF.');
    }
  };

  if (!propertyData) {
    return <div>No property data available.</div>;
  }

  const sections = [
    {
      title: 'Property Details',
      key: 'propertyDetails',
      fields: [
        'address',
        'zoning',
        'plot_area_sqft',
        'pincode',
        'height_limit_ft',
        'depth_ft',
        'width_ft',
        'building_sqft',
        'parking_spaces',
        'garages',
      ],
    },
    {
      title: 'Setback Details',
      key: 'setbackDetails',
      fields: ['front_ft', 'back_ft', 'side_ft'],
    },
    {
      title: 'Permitted Uses',
      key: 'permittedUses',
      render: () =>
        propertyData.permitted_uses &&
        typeof propertyData.permitted_uses === 'object' &&
        !Array.isArray(propertyData.permitted_uses)
          ? renderNestedTable(propertyData.permitted_uses, true)
          : propertyData.permitted_uses?.toString() || 'N/A',
    },
    {
      title: 'ADU Details',
      key: 'aduDetails',
      render: () =>
        propertyData.adu_details &&
        typeof propertyData.adu_details === 'object' &&
        !Array.isArray(propertyData.adu_details)
          ? renderNestedTable(propertyData.adu_details, true)
          : propertyData.adu_details?.toString() || 'N/A',
    },
    {
      title: 'JADU Details',
      key: 'jaduDetails',
      render: () =>
        propertyData.jadu_details &&
        typeof propertyData.jadu_details === 'object' &&
        !Array.isArray(propertyData.jadu_details)
          ? renderNestedTable(propertyData.jadu_details, true)
          : propertyData.jadu_details?.toString() || 'N/A',
    },
  ];

  return (
    <div className="details-container">
      {sections.map(({ title, key, fields, render }) => (
        <div key={key}>
          <div
            className="collapsible-header"
            onClick={() =>
              setIsSectionOpen((prevState) => ({
                ...prevState,
                [key]: !prevState[key],
              }))
            }
          >
            {title}
            <span>{isSectionOpen[key] ? '-' : '+'}</span>
          </div>
          {isSectionOpen[key] && (
            <div className="collapsible-content">
              {fields ? (
                <table className="details-table">
                  <tbody>
                    {fields.map((field) => (
                      <tr key={field}>
                        <th>{capitalizeFieldName(field)}</th>
                        <td>{propertyData[field] || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                render && render()
              )}
            </div>
          )}
        </div>
      ))}

      <div className="details-footer">
        <button onClick={handleBack} className="footer-back-button">
          Back
        </button>
        <button onClick={handleCreateAP} className="footer-create-ap-button">
          Create AP
        </button>
      </div>

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
