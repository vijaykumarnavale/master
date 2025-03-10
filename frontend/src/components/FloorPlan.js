import React, { useState } from "react";

const scale = 40;

const FloorPlan = ({ plan, title }) => {
  if (!Array.isArray(plan) || plan.length === 0) return null;

  const minX = Math.min(...plan.flatMap(line => [line.start[0], line.end[0]]));
  const maxX = Math.max(...plan.flatMap(line => [line.start[0], line.end[0]]));
  const minY = Math.min(...plan.flatMap(line => [line.start[1], line.end[1]]));
  const maxY = Math.max(...plan.flatMap(line => [line.start[1], line.end[1]]));

  const width = (maxX - minX) * scale + 20;
  const height = (maxY - minY) * scale + 20;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg border border-gray-500 w-96">
      <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
      <svg
        viewBox={`${minX * scale - 10} ${-maxY * scale - 10} ${width} ${height}`}
        width="100%"
        height="400px"
        className="border border-gray-500 bg-gray-100"
      >
        <rect x="0" y="0" width={width} height={height} stroke="red" strokeWidth="2" fill="none" />
        {plan.map((line, index) => (
          <line
            key={index}
            x1={line.start[0] * scale}
            y1={-line.start[1] * scale}
            x2={line.end[0] * scale}
            y2={-line.end[1] * scale}
            stroke={index % 2 === 0 ? "blue" : "black"}
            strokeWidth="3"
          />
        ))}
      </svg>
    </div>
  );
};

const App = () => {
  const [width, setWidth] = useState(15);
  const [depth, setDepth] = useState(20);
  const [rooms, setRooms] = useState(7);
  const [plans, setPlans] = useState(3);
  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFloorPlans = async () => {
    if (width <= 0 || depth <= 0 || rooms <= 0 || plans <= 0) {
      setError("All values must be positive numbers.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Authenticate and get token
      const authResponse = await fetch("https://fpglogin-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: "testuser", // Replace with actual credentials
          password: "password123",
        }),
      });

      if (!authResponse.ok) {
        const authErrorText = await authResponse.text();
        throw new Error(`Authentication failed: ${authErrorText}`);
      }

      const authData = await authResponse.json();
      console.log("Auth Response:", authData);

      const token = authData.access_token || authData.token;

      if (!token) {
        throw new Error("No token received. Check login API response.");
      }

      console.log("Using Token:", token);

      // Step 2: Request floor plans with the token
      const response = await fetch("https://fpglogin-production.up.railway.app/generate-floor-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ width, depth, rooms, plans }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch floor plans: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No floor plans received. Try different parameters.");
      }

      setFloorPlans(Object.values(data));
    } catch (error) {
      console.error("Error fetching floor plans:", error);
      setError(error.message);
      setFloorPlans([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Generate 2D Floor Plans</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded shadow bg-white">
        {/* Width Input */}
        <div className="flex flex-col">
          <label htmlFor="width" className="text-sm font-medium mb-1">Width (meters)</label>
          <input 
            type="number" 
            id="width"
            value={width} 
            onChange={(e) => setWidth(Number(e.target.value))} 
            placeholder="Width" 
            className="border p-2 rounded"
          />
        </div>

        {/* Depth Input */}
        <div className="flex flex-col">
          <label htmlFor="depth" className="text-sm font-medium mb-1">Depth (meters)</label>
          <input 
            type="number" 
            id="depth"
            value={depth} 
            onChange={(e) => setDepth(Number(e.target.value))} 
            placeholder="Depth" 
            className="border p-2 rounded"
          />
        </div>

        {/* Rooms Input */}
        <div className="flex flex-col">
          <label htmlFor="rooms" className="text-sm font-medium mb-1">Number of Rooms</label>
          <input 
            type="number" 
            id="rooms"
            value={rooms} 
            onChange={(e) => setRooms(Number(e.target.value))} 
            placeholder="Rooms" 
            className="border p-2 rounded"
          />
        </div>

        {/* Plans Input */}
        <div className="flex flex-col">
          <label htmlFor="plans" className="text-sm font-medium mb-1">Number of Plans</label>
          <input 
            type="number" 
            id="plans"
            value={plans} 
            onChange={(e) => setPlans(Number(e.target.value))} 
            placeholder="Plans" 
            className="border p-2 rounded"
          />
        </div>

        {/* Generate Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button 
            onClick={fetchFloorPlans} 
            disabled={loading} 
            className={`px-4 py-2 rounded shadow ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? "Generating..." : "Generate Floor Plans"}
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto w-full flex flex-wrap gap-4">
        {floorPlans.length > 0 ? (
          floorPlans.map((plan, index) => <FloorPlan key={index} plan={plan} title={`Plan ${index + 1}`} />)
        ) : (
          !loading && <p>No plans available. Try again with different parameters.</p>
        )}
      </div>
    </div>
  );
};

export default App;
