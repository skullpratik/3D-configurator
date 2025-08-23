// components/ARButton.jsx
import React, { useState } from 'react';
import { Button, Modal, Box, Typography, CircularProgress } from '@mui/material';
import QRCode from 'qrcode.react';

const ARButton = ({ modelUrl = "/models/Visicooler.glb" }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  const handleOpenAR = () => {
    if (isMobile) {
      setLoading(true);
      // Mobile AR experience
      if (isIOS) {
        // For iOS, we'll use QuickLook (USDZ format)
        // You'll need to create a USDZ version of your model
        window.location.href = `/models/Visicooler.usdz`;
      } else if (isAndroid) {
        // For Android, use Scene Viewer
        const intent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(window.location.origin + modelUrl)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
        window.location.href = intent;
      }
      setLoading(false);
    } else {
      // Desktop - show QR code
      setOpen(true);
    }
  };

  const arLink = `${window.location.origin}?model=${encodeURIComponent(modelUrl)}&ar=true`;

  return (
    <>
      <Button 
        variant="contained" 
        onClick={handleOpenAR}
        disabled={loading}
        sx={{ mt: 2, backgroundColor: '#1e64ff', '&:hover': { backgroundColor: '#235eff' } }}
      >
        {loading ? <CircularProgress size={24} /> : 'View in AR'}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" gutterBottom>
            Scan to view in AR
          </Typography>
          <QRCode value={arLink} size={256} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Scan this QR code with your mobile device to view the model in AR
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ARButton;