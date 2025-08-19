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
  CircularProgress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

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
  onCanopyTextureReset,
  onSidePanel1TextureUpload,
  onSidePanel1TextureReset,
  onSidePanel2TextureUpload,
  onSidePanel2TextureReset,
  onLouverTextureUpload,     
  onLouverTextureReset    
}) => {
  const [ledVisible, setLedVisible] = useState(false);

  const [uploadingCanopy, setUploadingCanopy] = useState(false);
  const [canopyImage, setCanopyImage] = useState(null);

  const [uploadingSP1, setUploadingSP1] = useState(false);
  const [sidePanel1Image, setSidePanel1Image] = useState(null);

  const [uploadingSP2, setUploadingSP2] = useState(false);
  const [sidePanel2Image, setSidePanel2Image] = useState(null);

  const [uploadingLouver, setUploadingLouver] = useState(false);
  const [louverImage, setLouverImage] = useState(null);

  const canopyInputRef = useRef(null);
  const sp1InputRef = useRef(null);
  const sp2InputRef = useRef(null);
  const louverInputRef = useRef(null);

  const colorOptions = [
    { label: "No Color", value: null },
    { label: "Red", value: "#ff4c4c" },
    { label: "Blue", value: "#4c6eff" },
    { label: "Green", value: "#4cff88" },
    { label: "Orange", value: "#ffa500" },
    { label: "Black", value: "#333333" },
  ];

  const handleLED = (e) => {
    setLedVisible(e.target.checked);
    onLEDToggle?.(e.target.checked);
  };

  const handleColorChange = (type, value) => {
    switch (type) {
      case "canopy":
        onCanopyColorChange?.(value);
        break;
      case "bottom":
        onBottomBorderColorChange?.(value);
        break;
      case "door":
        onDoorColorChange?.(value);
        break;
      case "toppanel":
        onTopPanelColorChange?.(value);
        break;
      default:
        break;
    }
  };

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

  const renderColorDropdown = (label, selectedColor, type) => (
    <FormControl fullWidth size="small" sx={{ mb: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {label}
      </Typography>
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
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#007bff" },
        }}
      >
        {colorOptions.map((c) => (
          <MenuItem key={c.label} value={c.value ?? ""}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: c.value || "#ffffff",
                  border: c.value ? "1px solid #ccc" : "1px dashed #aaa",
                }}
              />
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
              "& .MuiSwitch-track": { borderRadius: 20 },
            }}
          />
        }
        label={<Typography sx={{ fontWeight: 600, fontSize: 14 }}>LED Light</Typography>}
      />

      {/* Canopy Upload */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Canopy Image
        </Typography>
        {canopyImage ? (
          <Box sx={{ position: "relative", mb: 1 }}>
            <Box
              component="img"
              src={canopyImage}
              sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, border: "1px solid #e0e0e0" }}
              alt="Canopy texture"
            />
            <IconButton
              size="small"
              onClick={() => {
                setCanopyImage(null);
                if (canopyInputRef.current) canopyInputRef.current.value = "";
                onCanopyTextureReset?.();
              }}
              sx={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" } }}
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
            sx={{ py: 1.2, backgroundColor: "#f7f9fc", border: "1px dashed #ccc", "&:hover": { border: "1px dashed #007bff", backgroundColor: "#e3f2fd" } }}
            onClick={() => canopyInputRef.current?.click()}
          >
            {uploadingCanopy ? <CircularProgress size={24} /> : "Upload Custom Image"}
          </Button>
        )}
        <input
          type="file"
          ref={canopyInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readImage(file, (url) => {
              setCanopyImage(url);
              onCanopyTextureUpload?.(url);
            }, setUploadingCanopy);
            e.target.value = "";
          }}
          accept="image/*"
          hidden
        />
        <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "#666" }}>
          JPG, PNG, or GIF. Max 5MB.
        </Typography>
      </Box>

      {/* Side Panel 1 Upload */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Side Panel 1 Image (SidePannel1)
        </Typography>
        {sidePanel1Image ? (
          <Box sx={{ position: "relative", mb: 1 }}>
            <Box
              component="img"
              src={sidePanel1Image}
              sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, border: "1px solid #e0e0e0" }}
              alt="Side panel 1 texture"
            />
            <IconButton
              size="small"
              onClick={() => {
                setSidePanel1Image(null);
                if (sp1InputRef.current) sp1InputRef.current.value = "";
                onSidePanel1TextureReset?.();
              }}
              sx={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" } }}
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
            sx={{ py: 1.2, backgroundColor: "#f7f9fc", border: "1px dashed #ccc", "&:hover": { border: "1px dashed #007bff", backgroundColor: "#e3f2fd" } }}
            onClick={() => sp1InputRef.current?.click()}
          >
            {uploadingSP1 ? <CircularProgress size={24} /> : "Upload Side Panel 1 Image"}
          </Button>
        )}
        <input
          type="file"
          ref={sp1InputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readImage(file, (url) => {
              setSidePanel1Image(url);
              onSidePanel1TextureUpload?.(url);
            }, setUploadingSP1);
            e.target.value = "";
          }}
          accept="image/*"
          hidden
        />
      </Box>

      {/* Side Panel 2 Upload */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Side Panel 2 Image (SidePannel2)
        </Typography>
        {sidePanel2Image ? (
          <Box sx={{ position: "relative", mb: 1 }}>
            <Box
              component="img"
              src={sidePanel2Image}
              sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, border: "1px solid #e0e0e0" }}
              alt="Side panel 2 texture"
            />
            <IconButton
              size="small"
              onClick={() => {
                setSidePanel2Image(null);
                if (sp2InputRef.current) sp2InputRef.current.value = "";
                onSidePanel2TextureReset?.();
              }}
              sx={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" } }}
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
            sx={{ py: 1.2, backgroundColor: "#f7f9fc", border: "1px dashed #ccc", "&:hover": { border: "1px dashed #007bff", backgroundColor: "#e3f2fd" } }}
            onClick={() => sp2InputRef.current?.click()}
          >
            {uploadingSP2 ? <CircularProgress size={24} /> : "Upload Side Panel 2 Image"}
          </Button>
        )}
        <input
          type="file"
          ref={sp2InputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readImage(file, (url) => {
              setSidePanel2Image(url);
              onSidePanel2TextureUpload?.(url);
            }, setUploadingSP2);
            e.target.value = "";
          }}
          accept="image/*"
          hidden
        />
      </Box>

      {/* Louver Upload */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Louver Texture</Typography>
        {louverImage ? (
          <Box sx={{ position: "relative", mb: 1 }}>
            <Box
              component="img"
              src={louverImage}
              sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1.5, border: "1px solid #e0e0e0" }}
              alt="Louver texture"
            />
            <IconButton
              size="small"
              onClick={() => {
                setLouverImage(null);
                if (louverInputRef.current) louverInputRef.current.value = "";
                onLouverTextureReset?.();
              }}
              sx={{ position: "absolute", top: 4, right: 4, backgroundColor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" } }}
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
            sx={{ py: 1.2, backgroundColor: "#f7f9fc", border: "1px dashed #ccc", "&:hover": { border: "1px dashed #007bff", backgroundColor: "#e3f2fd" } }}
            onClick={() => louverInputRef.current?.click()}
          >
            {uploadingLouver ? <CircularProgress size={24} /> : "Upload Louver Image"}
          </Button>
        )}
        <input
          type="file"
          ref={louverInputRef}
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            readImage(file, (url) => {
              setLouverImage(url);
              onLouverTextureUpload?.(url);
            }, setUploadingLouver);
            e.target.value = "";
          }}
        />
      </Box>

      {/* Color dropdowns */}
      {renderColorDropdown("Canopy Border Color", canopyColor, "canopy")}
      {renderColorDropdown("Bottom Border Color", bottomBorderColor, "bottom")}
      {renderColorDropdown("Door Color", doorColor, "door")}
      {renderColorDropdown("Top Panel Color", topPanelColor, "toppanel")}
    </Box>
  );
};
