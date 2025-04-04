import { useState, useEffect, useRef } from 'react';

const AutodeskViewer = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const viewerRef = useRef(null);
  const fileInputRef = useRef(null);
  let viewer = null;

  useEffect(() => {
    if (typeof window.Autodesk !== 'undefined') {
      initializeViewer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js';
      script.onload = () => initializeViewer();
      document.body.appendChild(script);
    }

    return () => {
      if (viewer) {
        viewer.finish();
        viewer = null;
      }
    };
  }, []);

  const initializeViewer = () => {
    const options = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      getAccessToken: (onGetAccessToken) => {
        const accessToken = 'YOUR_ACCESS_TOKEN';
        const expireTime = 3600;
        onGetAccessToken(accessToken, expireTime);
      }
    };

    viewer = new window.Autodesk.Viewing.GuiViewer3D(viewerRef.current, {});
    window.Autodesk.Viewing.Initializer(options, () => {
      viewer.start();
      loadModel('YOUR_DEFAULT_URN');
    });
  };

  const loadModel = (urn) => {
    setIsLoading(true);
    window.Autodesk.Viewing.Document.load(
      `urn:${urn}`,
      (doc) => {
        const viewables = doc.getRoot().getDefaultGeometry();
        viewer.loadDocumentNode(doc, viewables).then(() => {
          setIsLoading(false);
        });
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );
  };

  const handleUpload = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const newModel = { urn: 'NEW_URN', name: file.name };
      setModels([...models, newModel]);
      setSelectedModel(newModel.urn);
      loadModel(newModel.urn);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 bg-gray-900 text-white shadow-md flex-wrap gap-4 sm:gap-0">
        <select 
          className="px-4 py-2 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            loadModel(e.target.value);
          }}
        >
          {models.map((model) => (
            <option key={model.urn} value={model.urn}>
              {model.name}
            </option>
          ))}
        </select>
        
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 
                     transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleUpload}
        >
          Upload
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Viewer Container */}
      <div className="flex-1 relative">
        <div ref={viewerRef} className="w-full h-full" />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute top-[60px] right-5 bg-white/95 p-2.5 rounded-lg shadow-sm z-50">
            Loading model...
          </div>
        )}
      </div>
    </div>
  );
};

export default AutodeskViewer;