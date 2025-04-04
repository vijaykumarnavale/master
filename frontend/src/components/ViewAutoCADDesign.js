/* global Autodesk */
import React, { useState, useRef } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { ToastContainer, toast } from 'react-toastify';
import { FiDownload, FiPrinter, FiBox, FiArrowRight } from 'react-icons/fi';
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
    const models = res.data;
    return models.length ? models[models.length - 1] : null;
  };

  const checkAndLoadModel = async (urn) => {
    try {
      const res = await axios.get(`${API_BASE}/api/models/${urn}/status`);
      const translationStatus = res.data;
      setState(prev => ({ ...prev, translationStatus }));
      
      if (translationStatus.status === 'success') {
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

          if (view2D.length > 0) {
            newViewer.loadDocumentNode(doc, view2D[0]);
          } else if (view3D.length > 0) {
            newViewer.loadDocumentNode(doc, view3D[0]);
          } else {
            toast.error('❌ No 2D/3D views available');
          }
        }, (err) => {
          console.error('Viewer load error:', err);
          toast.error('❌ Failed to load model in viewer');
        });
      });
    } catch (err) {
      console.error('Viewer init failed:', err);
      toast.error('❌ Viewer initialization failed');
    }
  };

  const handlePrintView = () => {
    if (!viewer) return toast.error("Viewer not initialized");
    const canvas = viewer.impl?.canvas;
    if (!canvas) return toast.error("Canvas not found");

    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open('', '_blank');
    if (!printWindow) return toast.error("Failed to open print window");

    printWindow.document.write(`
      <html>
        <head><title>Print View</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-xl space-y-8 border border-gray-100">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="space-y-2">
        <h4 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiBox className="text-blue-600" />
          Floor Plan Generator
        </h4>
        <p className="text-gray-600">Create custom DXF designs with real-time preview</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { field: 'length', unit: 'mm', label: 'Plot Length' },
            { field: 'width', unit: 'mm', label: 'Plot Width' },
            { field: 'built_area', unit: 'm²', label: 'Built Area' },
          ].map(({ field, unit, label }) => (
            <div key={field} className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <div className="relative">
                <input
                  name={field}
                  type="number"
                  value={state.dimensions[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none pr-12"
                  min="1"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={state.loading}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              state.loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
            } text-white`}
          >
            {state.loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FiDownload className="w-5 h-5" />
                Generate Design
              </>
            )}
          </button>
        </div>
      </form>

      {state.translationStatus?.status === 'success' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FiBox className="text-green-600" />
              Design Preview
            </h2>
            <button
              onClick={handlePrintView}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all shadow-lg hover:shadow-green-200"
            >
              <FiPrinter className="w-4 h-4" />
              Print Preview
            </button>
          </div>
          
          <div className="relative group">
            <div
              ref={viewerRef}
              className="border rounded-xl shadow-lg overflow-hidden bg-gray-50"
              style={{ height: '600px', width: '100%' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => viewerRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 shadow-lg"
              >
                Explore 3D View
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {state.translationStatus?.status === 'processing' && (
        <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-4">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div>
            <h3 className="font-medium text-blue-900">Processing your design...</h3>
            <p className="text-sm text-blue-800">This usually takes 20-30 seconds</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanGen;