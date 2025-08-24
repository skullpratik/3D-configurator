import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Grid, // Import Grid for the new layout
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

// Styled component for the cards to add a hover effect and consistent styling
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
  borderRadius: theme.shape.borderRadius * 2,
}));

// Styled component for the upload button to customize its appearance
const UploadButton = styled(Button)(({ theme }) => ({
  py: 1.5,
  backgroundColor: "#f7f9fc",
  border: "1px dashed #ccc",
  "&:hover": {
    border: "1px dashed #007bff",
    backgroundColor: "#e3f2fd",
  },
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontSize: '0.875rem'
}));

export function Interface({
  onFrontTextureUpload,
  onFrontTextureReset,
  onLeftTextureUpload,
  onLeftTextureReset,
  onRightTextureUpload,
  onRightTextureReset,
}) {
  // State and refs for each panel
  const [uploadingFront, setUploadingFront] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const frontInputRef = useRef(null);

  const [uploadingLeft, setUploadingLeft] = useState(false);
  const [leftImage, setLeftImage] = useState(null);
  const leftInputRef = useRef(null);

  const [uploadingRight, setUploadingRight] = useState(false);
  const [rightImage, setRightImage] = useState(null);
  const rightInputRef = useRef(null);

  /**
   * Reads an image file and converts it to a data URL.
   * @param {File} file - The image file to read.
   * @param {function(string): void} onDone - Callback function with the data URL.
   * @param {function(boolean): void} setUploading - State setter for the uploading status.
   */
  const readImage = (file, onDone, setUploading) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      onDone(e.target.result);
      setUploading(false);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Renders a customizable upload section for an image.
   * @param {string} title - The title of the panel (e.g., "Front Panel").
   * @param {string} image - The data URL of the uploaded image.
   * @param {function(string|null): void} setImage - State setter for the image.
   * @param {React.MutableRefObject} inputRef - Ref for the file input element.
   * @param {boolean} uploading - The uploading state.
   * @param {function(boolean): void} setUploading - State setter for the uploading status.
   * @param {function(string): void} onUpload - Callback for when an image is uploaded.
   * @param {function(): void} onReset - Callback for when an image is reset.
   */
  const renderUploadSection = (
    title,
    image,
    setImage,
    inputRef,
    uploading,
    setUploading,
    onUpload,
    onReset
  ) => (
    <StyledCard variant="outlined">
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ImageIcon sx={{ mr: 1, fontSize: 18 }} /> {title}
        </Typography>

        {image ? (
          <Box sx={{ position: "relative", mb: 1.5 }}>
            <Box
              component="img"
              src={image}
              sx={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              alt={title}
            />
            <IconButton
              size="small"
              onClick={() => {
                setImage(null);
                if (inputRef.current) inputRef.current.value = "";
                onReset?.();
              }}
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.9)" },
                width: 28,
                height: 28,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <UploadButton
            variant="outlined"
            component="label"
            fullWidth
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </UploadButton>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readImage(file, (url) => {
              setImage(url);
              onUpload?.(url);
            }, setUploading);
            e.target.value = "";
          }}
          accept="image/*"
          hidden
        />
        <Typography
          variant="caption"
          sx={{ mt: 1, display: "block", color: "text.secondary" }}
        >
          JPG, PNG. Max 5MB.
        </Typography>
      </CardContent>
    </StyledCard>
  );

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
    }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#333' }}>
        Deep Freezer Customization
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          {renderUploadSection(
            "Front Panel",
            frontImage,
            setFrontImage,
            frontInputRef,
            uploadingFront,
            setUploadingFront,
            onFrontTextureUpload,
            onFrontTextureReset
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {renderUploadSection(
            "Left Panel",
            leftImage,
            setLeftImage,
            leftInputRef,
            uploadingLeft,
            setUploadingLeft,
            onLeftTextureUpload,
            onLeftTextureReset
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {renderUploadSection(
            "Right Panel",
            rightImage,
            setRightImage,
            rightInputRef,
            uploadingRight,
            setUploadingRight,
            onRightTextureUpload,
            onRightTextureReset
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
