import React, { useState, useEffect, useCallback, useMemo, Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane, Box, Environment, Grid, Loader, Text } from "@react-three/drei";
import * as THREE from "three";

const scale = 1;

const App = () => {
  const [formData, setFormData] = useState({
    width: "",
    depth: "",
    rooms: "",
    plans: ""
  });

  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planType, setPlanType] = useState('3d');

  useEffect(() => {
    setFloorPlans([]);
  }, [planType]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchFloorPlans = useCallback(async () => {
    const { width, depth, rooms, plans } = formData;

    if (!width || !depth || !rooms || !plans) {
      setError("All fields are required.");
      return;
    }

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
        body: JSON.stringify({ width, depth, rooms, plans, planType }),
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
  }, [formData, planType]);

  return (
    <div className="flex flex-col items-center p-6 w-full bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="w-full max-w-3xl mb-12 p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="flex items-end gap-4 mb-6 w-full">
          <div className="flex gap-4">
            {[
              { label: "Width (m)", name: "width", icon: "📏" },
              { label: "Depth (m)", name: "depth", icon: "📐" },
              { label: "Rooms", name: "rooms", icon: "🚪" },
              { label: "Plans", name: "plans", icon: "🏗️" }
            ].map((input, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <label className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <span>{input.icon}</span>
                  {input.label}
                </label>
                <input
                  type="number"
                  name={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="w-28 px-3 py-2 text-sm rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  min="1"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
             <button
                onClick={() => setPlanType('2d')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${planType === '2d'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
              >
                2D Plan
              </button>
              <button
                onClick={() => setPlanType('3d')}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${planType === '3d'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
              >
                3D Plan
              </button>
            </div>
            <button
              onClick={fetchFloorPlans}
              disabled={loading}
              className="py-2 px-5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                `Generate ${planType.toUpperCase()} Plan`
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-3xl mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {floorPlans.map((plan, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="relative h-96 bg-slate-50">
                {planType === '3d' ? (
                  <Canvas key={`3d-${index}`} shadows camera={{ position: [15, 20, 15], fov: 45 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight
                      position={[10, 20, 10]}
                      intensity={1.5}
                      castShadow
                      shadow-mapSize={[2048, 2048]}
                    />
                    <Environment preset="sunset" />
                    <Suspense fallback={<Loader />}>
                      <Room3D plan={plan} width={formData.width} depth={formData.depth} />
                    </Suspense>
                    <OrbitControls
                      enableDamping
                      dampingFactor={0.05}
                      minDistance={5}
                      maxDistance={50}
                    />
                  </Canvas>
                ) : (
                  <Canvas
                    key={`2d-${index}`}
                    orthographic
                    camera={{
                      zoom: 40,
                      position: [0, 100, 0],
                      left: -window.innerWidth / 2,
                      right: window.innerWidth / 2,
                      top: window.innerHeight / 2,
                      bottom: -window.innerHeight / 2
                    }}
                  >
                    <ambientLight intensity={1.5} />
                    <Suspense fallback={<Loader />}>
                      <Room2D plan={plan} width={formData.width} depth={formData.depth} />
                    </Suspense>
                    <OrbitControls
                      enableRotate={false}
                      zoomSpeed={0.8}
                      minZoom={20}
                      maxZoom={100}
                    />
                  </Canvas>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-slate-700 backdrop-blur-sm">
                  Plan {index + 1} ({planType.toUpperCase()})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Loader />
    </div>
  );
};

const Room3D = memo(({ plan, width, depth }) => {
  const xOffset = (width / 2) * scale;
  const zOffset = (depth / 2) * scale;

  const floorTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(
      createFloorPattern(512, "#f1f5f9", "#e2e8f0")
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 4, depth / 4);
    return texture;
  }, [width, depth]);

  if (!Array.isArray(plan)) return null;

  return (
    <>
      <Plane
        args={[width * scale, depth * scale]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          attach="material"
          map={floorTexture}
          roughness={0.6}
          metalness={0.1}
        />
      </Plane>
      {plan.map((line, index) => (
        <Wall3D
          key={index}
          start={line.start}
          end={line.end}
          color="#94a3b8"
          xOffset={xOffset}
          zOffset={zOffset}
        />
      ))}
    </>
  );
});

const Wall3D = memo(({ start, end, color, xOffset, zOffset }) => {
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
    <Box
      args={[width, 3, 0.3]}
      position={[centerX, 1.5, centerZ]}
      rotation={[0, -angle, 0]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.2}
      />
    </Box>
  );
});

const Room2D = memo(({ plan, width, depth }) => {
  const wallHeight = 0.3;
  const wallThickness = 0.2;

  // Get max coordinates from the plan
  const maxX = Math.max(...plan.flatMap(line => [line.start[0], line.end[0]]));
  const maxZ = Math.max(...plan.flatMap(line => [line.start[1], line.end[1]]));

  // Force width-based scaling
  const scale = width / maxX;
  const scaledWidth = maxX * scale;
  const scaledDepth = maxZ * scale;
  
  // Centering offsets
  const offsetX = (width - scaledWidth) / 2;
  const offsetZ = (depth - scaledDepth) / 2;

  return (
    <group position={[-width/2 + offsetX, 0, -depth/2 + offsetZ]}>
      {/* Floor base */}
      <Box args={[width, 0.03, depth]} position={[width/2, -0.005, depth/2]}>
        <meshBasicMaterial color="#f8fafc" />
      </Box>

      {/* Walls */}
      {plan.map((line, index) => {
        const startX = line.start[0] * scale;
        const startZ = line.start[1] * scale;
        const endX = line.end[0] * scale;
        const endZ = line.end[1] * scale;

        const dx = endX - startX;
        const dz = endZ - startZ;
        const length = Math.sqrt(dx ** 2 + dz ** 2);
        const angle = Math.atan2(dz, dx);

        return (
          <Box
            key={`wall-${index}`}
            args={[length, wallHeight, wallThickness]}
            position={[
              (startX + endX)/2,
              wallHeight/2,
              (startZ + endZ)/2
            ]}
            rotation={[0, -angle, 0]}
          >
            <meshBasicMaterial color="#334155" />
          </Box>
        );
      })}

      {/* Boundary box */}
      <Box args={[width, 0.02, depth]} position={[width/2, -0.01, depth/2]}>
        <meshBasicMaterial wireframe color="red" />
      </Box>
    </group>
  );
});

const createFloorPattern = (size, color1, color2) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = size;

  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = color2;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color1;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 8, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
};

export default App;