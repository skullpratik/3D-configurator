import React, { useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  Switch, 
  FormControlLabel, 
  Button,
  IconButton,
  Stack,
  CircularProgress
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

export const Interface = ({
  onLEDToggle,
  onCanopyColorChange,
  canopyColor,
  onBottomBorderColorChange,
  bottomBorderColor,
  onDoorColorChange,
  doorColor,
  onTopPanelColorChange,
  topPanelColor,
  onCanopyTextureUpload,
  onCanopyTextureReset
}) => {
  const [ledVisible, setLedVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [canopyImage, setCanopyImage] = useState(null);
  const fileInputRef = useRef(null);

  const colorOptions = [
    { label: "No Color", value: null },
    { label: "Red", value: "#ff4c4c" },
    { label: "Blue", value: "#4c6eff" },
    { label: "Green", value: "#4cff88" },
    { label: "Orange", value: "#ffa500" },
    { label: "Black", value: "#333333" }
  ];

  const handleLED = (e) => {
    setLedVisible(e.target.checked);
    onLEDToggle?.(e.target.checked);
  };

  const handleColorChange = (type, value) => {
    switch(type){
      case 'canopy': onCanopyColorChange?.(value); break;
      case 'bottom': onBottomBorderColorChange?.(value); break;
      case 'door': onDoorColorChange?.(value); break;
      case 'toppanel': onTopPanelColorChange?.(value); break;
      default: break;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setCanopyImage(imageUrl);
      
      if (onCanopyTextureUpload) {
        onCanopyTextureUpload(imageUrl);
      }
      
      setUploading(false);
    };
    
    reader.onerror = () => {
      setUploading(false);
      console.error("Error reading file");
    };
    
    reader.readAsDataURL(file);
  };

  const handleResetTexture = () => {
    setCanopyImage(null);
    if (onCanopyTextureReset) {
      onCanopyTextureReset();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const renderColorDropdown = (label, selectedColor, type) => (
    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{label}</Typography>
      <Select
        value={selectedColor ?? ""}
        onChange={(e) => handleColorChange(type, e.target.value || null)}
        displayEmpty
        sx={{
          borderRadius: 1.5,
          backgroundColor: "#f7f9fc",
          fontSize: 14,
          "& .MuiSelect-select": { py: 0.8, px: 1.2 },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#007bff" }
        }}
      >
        {colorOptions.map(c => (
          <MenuItem key={c.label} value={c.value ?? ""}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{
                width: 14, height: 14, borderRadius: "50%",
                backgroundColor: c.value || "#ffffff",
                border: c.value ? "1px solid #ccc" : "1px dashed #aaa"
              }} />
              <Typography sx={{ fontSize: 13 }}>{c.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 1 }}>
      <FormControlLabel
        control={
          <Switch
            checked={ledVisible}
            onChange={handleLED}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#007bff" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#007bff" },
              "& .MuiSwitch-track": { borderRadius: 20 }
            }}
          />
        }
        label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>LED Light</Typography>}
      />

      {/* Canopy Image Upload Section */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Canopy Image
        </Typography>
        
        {canopyImage ? (
          <Box sx={{ position: 'relative', mb: 1 }}>
            <Box 
              component="img" 
              src={canopyImage} 
              sx={{ 
                width: '100%', 
                height: 100, 
                objectFit: 'cover', 
                borderRadius: 1.5,
                border: '1px solid #e0e0e0'
              }} 
              alt="Canopy texture" 
            />
            <IconButton
              size="small"
              onClick={handleResetTexture}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
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
            startIcon={<CloudUploadIcon />}
            sx={{
              py: 1.2,
              backgroundColor: '#f7f9fc',
              border: '1px dashed #ccc',
              '&:hover': {
                border: '1px dashed #007bff',
                backgroundColor: '#e3f2fd'
              }
            }}
            onClick={triggerFileInput}
          >
            {uploading ? (
              <CircularProgress size={24} />
            ) : (
              "Upload Custom Image"
            )}
          </Button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          hidden
        />
        
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#666' }}>
          JPG, PNG, or GIF. Max 5MB.
        </Typography>
      </Box>

      {renderColorDropdown("Canopy Border Color", canopyColor, "canopy")}
      {renderColorDropdown("Bottom Border Color", bottomBorderColor, "bottom")}
      {renderColorDropdown("Door Color", doorColor, "door")}
      {renderColorDropdown("Top Panel Color", topPanelColor, "toppanel")}
      
      {/* Reset Button */}
      {canopyImage && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleResetTexture}
          fullWidth
          sx={{ mt: 1 }}
        >
          Reset Canopy Texture
        </Button>
      )}
    </Box>
  );
};