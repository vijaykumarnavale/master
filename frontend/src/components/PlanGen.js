/* global Autodesk */
import React, { useState, useRef } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { ToastContainer, toast } from 'react-toastify';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'REACT_APP_NODE_API_URL';
const DXF_GENERATOR_URL = process.env.REACT_APP_DXF_GENERATOR_URL || 'https://dxffile-production.up.railway.app';

const PlanGen = () => {
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [state, setState] = useState({
    dimensions: { length: 70, width: 50, built_area: 1200 },
    translationStatus: null,
    loading: false,
    error: '',
    success: ''
  });

  const handleInputChange = (e) => {
    setState(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [e.target.name]: parseInt(e.target.value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '', success: '' }));

    try {
      const postRes = await axios.post(`${DXF_GENERATOR_URL}/generate`, state.dimensions);
      const dxfUrl = postRes.data.dxf_url;
      if (!dxfUrl) throw new Error('DXF generation failed');

      const fileRes = await axios.get(`${DXF_GENERATOR_URL}${dxfUrl}`, { responseType: 'blob' });

      const zip = new JSZip();
      const filename = `design-${Date.now()}.dxf`;
      zip.file(filename, fileRes.data);
      const zipContent = await zip.generateAsync({ type: 'blob' });

      const formData = new FormData();
      formData.append('model-file', new File([zipContent], `${filename}.zip`));
      formData.append('model-zip-entrypoint', filename);

      await axios.post(`${API_BASE}/api/models`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setState(prev => ({ ...prev, loading: false }));
      toast.success('✅ DXF generated and uploaded successfully!');

      const latest = await getLatestModel();
      if (latest?.urn) await checkAndLoadModel(latest.urn);

    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    }
  };

  const getLatestModel = async () => {
    const res = await axios.get(`${API_BASE}/api/models`);
    return res.data.length ? res.data[res.data.length - 1] : null;
  };

  const checkAndLoadModel = async (urn) => {
    try {
      const res = await axios.get(`${API_BASE}/api/models/${urn}/status`);
      setState(prev => ({ ...prev, translationStatus: res.data }));
      
      if (res.data.status === 'success') {
        await loadModel(urn);
      }
    } catch (err) {
      console.error('Check/load failed:', err);
      setState(prev => ({ ...prev, error: 'Failed to load model.' }));
      toast.error('❌ Failed to load model.');
    }
  };

  const loadModel = async (urn) => {
    try {
      const tokenRes = await axios.get(`${API_BASE}/api/auth/token`);
      const accessToken = tokenRes.data.access_token;

      Autodesk.Viewing.Initializer({
        env: 'AutodeskProduction',
        accessToken
      }, () => {
        if (viewer) viewer.finish();

        const newViewer = new Autodesk.Viewing.GuiViewer3D(viewerRef.current);
        setViewer(newViewer);
        newViewer.start();

        const documentId = `urn:${urn}`;
        Autodesk.Viewing.Document.load(documentId, (doc) => {
          const view2D = doc.getRoot().search({ type: 'geometry', role: '2d' });
          const view3D = doc.getRoot().search({ type: 'geometry', role: '3d' });

          view2D.length > 0 
            ? newViewer.loadDocumentNode(doc, view2D[0])
            : view3D.length > 0 && newViewer.loadDocumentNode(doc, view3D[0]);
        }, (err) => console.error('Viewer load error:', err));
      });
    } catch (err) {
      console.error('Viewer init failed:', err);
      toast.error('❌ Viewer initialization failed');
    }
  };

  const handlePrintView = () => {
    if (!viewer?.impl?.canvas) return toast.error("Viewer not initialized");
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head><title>Print View</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; }
          </style>
        </head>
        <body>
          <img src="${viewer.impl.canvas.toDataURL("image/png")}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow?.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Architectural Plan Generator
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform dimensional parameters into professional CAD designs with real-time 3D visualization
          and instant documentation.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { field: 'length', unit: 'mm', label: 'Plot Length' },
              { field: 'width', unit: 'mm', label: 'Plot Width' },
              { field: 'built_area', unit: 'm²', label: 'Built Area' },
            ].map(({ field, unit, label }) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {label}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    name={field}
                    type="number"
                    value={state.dimensions[field]}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg text-lg font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    min="1"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">{unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={state.loading}
              className={`w-full py-4 px-6 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
                state.loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {state.loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Blueprint...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-6 h-6" />
                  <span>Generate Professional Design</span>
                </>
              )}
            </button>
          </div>
        </form>

        {state.translationStatus?.status === 'success' && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Design Visualization
                <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Ready for Review
                </span>
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={handlePrintView}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  <FiPrinter className="w-5 h-5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            <div className="relative bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
              <div
                ref={viewerRef}
                className="w-full h-[700px] rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-gray-600">
                Interactive 3D Viewer
              </div>
            </div>
          </div>
        )}

        {state.translationStatus?.status === 'processing' && (
          <div className="mt-12 p-6 rounded-xl bg-blue-50 border-2 border-blue-200 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Processing Design</h3>
              <p className="text-sm text-blue-800 mt-1">
                Status: Converting DXF to SVF format ({state.translationStatus?.progress}%)
              </p>
              <div className="mt-2 w-48 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${state.translationStatus?.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {state.error && (
        <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-red-700">
              <p className="font-medium">Generation Error:</p>
              <p>{state.error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanGen;