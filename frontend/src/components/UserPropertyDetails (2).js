import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserPropertyDetails.css'; // Optional CSS file for styling

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state;

  const [popupData, setPopupData] = useState(null);
  const [isSectionOpen, setIsSectionOpen] = useState({
    propertyDetails: true,
    setbackDetails: false,
    permittedUses: false,
    aduDetails: false,
    jaduDetails: false,
  });

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
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
                ? renderNestedTable(subValue) // Recursively render nested rows
                : subValue.toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const toggleSection = (section) => {
    setIsSectionOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

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
        typeof propertyData.permitted_uses === 'object' && !Array.isArray(propertyData.permitted_uses)
          ? renderNestedTable(propertyData.permitted_uses)
          : propertyData.permitted_uses?.toString() || 'N/A',
    },
    {
      title: 'ADU Details',
      key: 'aduDetails',
      render: () =>
        typeof propertyData.adu_details === 'object' && !Array.isArray(propertyData.adu_details)
          ? renderNestedTable(propertyData.adu_details)
          : propertyData.adu_details?.toString() || 'N/A',
    },
    {
      title: 'JADU Details',
      key: 'jaduDetails',
      render: () =>
        typeof propertyData.jadu_details === 'object' && !Array.isArray(propertyData.jadu_details)
          ? renderNestedTable(propertyData.jadu_details)
          : propertyData.jadu_details?.toString() || 'N/A',
    },
  ];

  return (
    <div className="details-container">
      {sections.map(({ title, key, fields, render }) => (
        <div key={key}>
          <div className="collapsible-header" onClick={() => toggleSection(key)}>
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
