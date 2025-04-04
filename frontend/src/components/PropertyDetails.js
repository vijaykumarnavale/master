import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { propertyData } = location.state || {};

  const [isSectionOpen, setIsSectionOpen] = useState({
    propertyDetails: true,
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

  const capitalizeFieldName = (fieldName) => {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');
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
    return <div className="text-gray-700 text-center text-lg">No property data available.</div>;
  }

  return (
    <div className="details-container text-gray-800 bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto border border-gray-200">
      <div>
        <div
          className="collapsible-header bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 cursor-pointer flex justify-between items-center mb-4 rounded-lg hover:from-orange-500 hover:to-red-500 hover:text-black transition-all duration-300"
          onClick={() =>
            setIsSectionOpen((prevState) => ({
              ...prevState,
              propertyDetails: !prevState.propertyDetails,
            }))
          }
        >
          <span className="text-lg font-semibold">Property Details</span>
          <span className="text-xl">{isSectionOpen.propertyDetails ? '-' : '+'}</span>
        </div>
        {isSectionOpen.propertyDetails && (
          <div className="collapsible-content">
            <table className="details-table w-full border-collapse mb-6 text-gray-700">
              <tbody>
                {Object.entries(propertyData).map(([key, value]) => (
                  <tr key={key} className="border-b hover:bg-gray-100 transition-all duration-200">
                    <th className="p-3 bg-gray-200 font-semibold text-left text-sm uppercase">{capitalizeFieldName(key)}</th>
                    <td className="p-3 text-gray-800 text-sm">{value || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="details-footer flex justify-between mt-6">
        <button onClick={handleBack} className="footer-back-button bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-red-500 hover:text-black transition-all duration-300">
          Back
        </button>
        <button onClick={handleCreateAP} className="footer-create-ap-button bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:text-black transition-all duration-300">
          Create AP
        </button>
      </div>

      <div className="bottom-right-buttons flex justify-center gap-6 mt-6">
        <button onClick={handlePrint} className="print-button bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-all duration-300">
          Print
        </button>
        <button onClick={handleDownloadPDF} className="download-pdf-button bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition-all duration-300">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PropertyDetails;
