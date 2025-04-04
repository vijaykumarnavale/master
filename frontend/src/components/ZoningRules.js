import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const apiBaseUrl = process.env.REACT_APP_NODE_API_URL;

const ZoningRules = () => {
  const [zoneCodes, setZoneCodes] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [zoneData, setZoneData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [zonesLoading, setZonesLoading] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      setZonesLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiBaseUrl}/zones`);
        if (!response.ok) throw new Error("Failed to load zone codes.");
        const data = await response.json();
        setZoneCodes([...new Set(data.map((item) => item.zone_code))]);
      } catch (error) {
        console.error("Error fetching zone codes:", error);
        setError(error.message);
      } finally {
        setZonesLoading(false);
      }
    };
    fetchZones();
  }, []);

  const fetchZoneData = async () => {
    if (!selectedZone) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/zones/${selectedZone}`);
      if (!response.ok) throw new Error("Failed to fetch zoning data.");
      const data = await response.json();
      setZoneData(data.length > 0 ? data[0] : null);
      if (data.length === 0) setError("No data found for the selected zone.");
    } catch (error) {
      console.error("Error fetching zone data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!zoneData) return [];
    return Object.entries(zoneData).filter(([key]) => key !== "id" && key !== "last_updated");
  }, [zoneData]);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">{error}</div>}

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <label htmlFor="zone-select" className="text-gray-700 font-medium text-sm flex items-center">
          <FaMapMarkerAlt className="text-blue-500 mr-2" /> Select Zone Code:
        </label>
        <div className="relative w-full md:w-1/3">
          <select
            id="zone-select"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 transition appearance-none"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            disabled={zonesLoading}
          >
            <option value="">Select a Zone Code</option>
            {zoneCodes.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FaMapMarkerAlt className="text-gray-400" />
          </div>
        </div>

        <button
          onClick={fetchZoneData}
          className="flex items-center justify-center w-full md:w-auto px-5 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !selectedZone || zonesLoading}
        >
          {loading ? "Fetching..." : <><FaSearch className="mr-2" /> Search</>}
        </button>
      </div>

      {loading && <p className="text-gray-600 text-sm text-center">🔄 Loading data...</p>}

      {zoneData && (
        <div className="mt-6 w-full overflow-x-auto">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <table className="w-full text-sm bg-white border border-gray-300 shadow-md rounded-lg">
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="px-4 py-2 font-medium text-gray-700 bg-gray-200">
                        {key.replace(/_/g, " ").toUpperCase()}:
                      </td>
                      <td className="px-4 py-2 text-gray-600">{value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-4 py-2 text-center text-gray-500">
                      🚫 No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoningRules;
