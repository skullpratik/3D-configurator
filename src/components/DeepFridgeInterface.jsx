import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

export function Interface({
  onFrontTextureUpload,
  onFrontTextureReset,
  onLeftTextureUpload,
  onLeftTextureReset,
  onRightTextureUpload,
  onRightTextureReset,
}) {
  const [uploadingFront, setUploadingFront] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const frontInputRef = useRef(null);

  const [uploadingLeft, setUploadingLeft] = useState(false);
  const [leftImage, setLeftImage] = useState(null);
  const leftInputRef = useRef(null);

  const [uploadingRight, setUploadingRight] = useState(false);
  const [rightImage, setRightImage] = useState(null);
  const rightInputRef = useRef(null);

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
    <Card variant="outlined" sx={{ mb: 2 }}>
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
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            sx={{
              py: 1.5,
              backgroundColor: "#f7f9fc",
              border: "1px dashed #ccc",
              "&:hover": {
                border: "1px dashed #007bff",
                backgroundColor: "#e3f2fd",
              },
              borderRadius: 1,
            }}
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
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
          JPG, PNG, or GIF. Max 5MB.
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Deep Freezer Customization
      </Typography>

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
    </Box>
  );
}
