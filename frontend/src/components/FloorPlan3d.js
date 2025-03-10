import React, { useState, useCallback, useMemo, Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane, Box, Html, Environment } from "@react-three/drei";

const scale = 1;

const App = () => {
  const [width, setWidth] = useState(15);
  const [depth, setDepth] = useState(20);
  const [rooms, setRooms] = useState(7);
  const [plans, setPlans] = useState(3);
  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFloorPlans = useCallback(async () => {
    if (width <= 0 || depth <= 0 || rooms <= 0 || plans <= 0) {
      setError("All values must be positive numbers.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authResponse = await fetch("https://fpglogin-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: "testuser", password: "password123" }),
      });

      if (!authResponse.ok) throw new Error("Authentication failed.");
      const authData = await authResponse.json();
      const token = authData.access_token || authData.token;
      if (!token) throw new Error("No token received.");

      const response = await fetch("https://fpglogin-production.up.railway.app/generate-floor-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ width, depth, rooms, plans }),
      });

      if (!response.ok) throw new Error("Failed to fetch floor plans.");
      const data = await response.json();

      if (!data || Object.keys(data).length === 0) {
        throw new Error("No valid floor plans received. Try adjusting the parameters.");
      }

      setFloorPlans(Object.values(data));
    } catch (error) {
      setError(error.message);
      setFloorPlans([]);
    } finally {
      setLoading(false);
    }
  }, [width, depth, rooms, plans]);

  return (
    <div className="flex flex-col items-center p-6 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Generate 3D Floor Plans</h1>

      <div className="grid grid-cols-2 gap-4 mb-4 p-6 border rounded-lg shadow-lg bg-white">
        {[{ label: "Width (m)", value: width, setter: setWidth },
          { label: "Depth (m)", value: depth, setter: setDepth },
          { label: "Rooms", value: rooms, setter: setRooms },
          { label: "Plans", value: plans, setter: setPlans }].map((input, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">{input.label}</label>
            <input type="number" min="1" value={input.value} onChange={(e) => input.setter(Number(e.target.value))} className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400" disabled={loading} />
          </div>
        ))}
        <div className="col-span-2 flex justify-center mt-4">
          <button onClick={fetchFloorPlans} disabled={loading} className={`px-6 py-3 rounded-lg shadow-md text-white transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? "Generating..." : "Generate 3D Floor Plans"}
          </button>
        </div>
      </div>

      {loading && <p className="text-blue-500 mt-2 animate-pulse">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="overflow-x-auto w-full flex flex-wrap gap-6 mt-6">
        {floorPlans.length > 0 ? (
          floorPlans.map((plan, index) => (
            <div key={index} className="w-full h-[400px] border rounded-lg shadow-lg p-4 bg-white">
              <h2 className="text-lg font-semibold text-center mb-2 text-gray-700">3D Plan {index + 1}</h2>
              <Canvas shadows camera={{ position: [10, 10, 20], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 15, 10]} castShadow />
                <Environment preset="city" />
                <Suspense fallback={<Html><p className="text-gray-500">Loading 3D Plan...</p></Html>}>
                  <Room plan={plan} width={width} depth={depth} />
                </Suspense>
                <OrbitControls />
              </Canvas>
            </div>
          ))
        ) : (
          !loading && <p className="text-gray-600">No plans available. Try again.</p>
        )}
      </div>
    </div>
  );
};

const Room = memo(({ plan, width, depth }) => {
  if (!Array.isArray(plan) || plan.length === 0) return null;
  
  const xOffset = (width / 2) * scale;
  const zOffset = (depth / 2) * scale;

  return (
    <>
      <Plane args={[width * scale, depth * scale]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial attach="material" color="#d1bfa4" />
      </Plane>
      {plan.map((line, index) => <Wall key={index} start={line.start} end={line.end} color="#cfcfcf" xOffset={xOffset} zOffset={zOffset} />)}
    </>
  );
});

const Wall = memo(({ start, end, color, xOffset, zOffset }) => {
  const { centerX, centerZ, width, angle } = useMemo(() => {
    const x1 = start[0] * scale;
    const z1 = start[1] * scale;
    const x2 = end[0] * scale;
    const z2 = end[1] * scale;
    return {
      centerX: (x1 + x2) / 2 - xOffset,
      centerZ: (z1 + z2) / 2 - zOffset,
      width: Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2),
      angle: Math.atan2(z2 - z1, x2 - x1)
    };
  }, [start, end, xOffset, zOffset]);

  return (
    <Box args={[width, 3, 0.3]} position={[centerX, 1.5, centerZ]} rotation={[0, -angle, 0]} castShadow>
      <meshStandardMaterial attach="material" color={color} />
    </Box>
  );
});

export default App;
