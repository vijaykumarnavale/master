import React, { useEffect, useRef } from 'react';
import { Viewer } from 'forge-dataviz-iot-react-components';

const AutodeskViewer = ({ urn }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (urn && viewerRef.current) {
      const initializeViewer = async () => {
        try {
          const accessToken = await getAccessToken();
          
          const config = {
            auth: {
              accessToken,
              env: 'AutodeskProduction'
            },
            viewerConfig: {
              extensions: ['Autodesk.DXF']
            }
          };

          viewerRef.current.initializeViewer(config, [urn]);
        } catch (error) {
          console.error('Viewer initialization error:', error);
        }
      };

      initializeViewer();
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.uninitializeViewer();
      }
    };
  }, [urn]);

  return <Viewer ref={viewerRef} style={{ height: '600px', width: '100%' }} />;
};

// Get APS access token
const getAccessToken = async () => {
  const response = await fetch('https://developer.api.autodesk.com/authentication/v1/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: 'nMqxsmSwq48uKvNV4qm0udpSqFP7EgFmrGCQ0gG9SXGVOBCN',
      client_secret: 'oPc3pvvcDGkFD3Wy9BJuGm4kSOH08ZaCzLqNqhmiJkaFflbTLvGy8cMQs1zfXWIz',
      grant_type: 'client_credentials',
      scope: 'data:read'
    })
  });

  const data = await response.json();
  return data.access_token;
};

export default AutodeskViewer;