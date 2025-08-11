import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Typography,
  Paper,
  Divider,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ChromePicker } from "react-color";

export const Interface = ({
  onDoorChange,
  onHDRIChange,
  onMaterialChange,
  onLightChange,
  children
}) => {
  const [doorCount, setDoorCount] = useState(null);
  const [doorPosition, setDoorPosition] = useState(null);
  const [metalness, setMetalness] = useState(1);
  const [roughness, setRoughness] = useState(0.4);
  const [directional, setDirectional] = useState({ color: "#ffffff", intensity: 1 });
  const [ambient, setAmbient] = useState({ color: "#ffffff", intensity: 1 });
  const [selectedHDRI, setSelectedHDRI] = useState("photo_studio_01_4k.hdr"); // default

  const handleDoorCountChange = useCallback((event) => {
    const count = Number(event.target.value);
    setDoorCount(count);
    setDoorPosition(null);
    onDoorChange?.(count, null);
  }, [onDoorChange]);

  const handlePositionChange = useCallback((event) => {
    const pos = Number(event.target.value);
    setDoorPosition(pos);
    onDoorChange?.(doorCount, pos);
  }, [doorCount, onDoorChange]);

  const positionOptions = useMemo(() => {
    switch (doorCount) {
      case 1:
        return [
          { value: 1, label: "Left" },
          { value: 2, label: "Center" },
          { value: 3, label: "Right" }
        ];
      case 2:
        return [
          { value: 1, label: "Left + Center" },
          { value: 2, label: "Left + Right" },
          { value: 3, label: "Center + Right" }
        ];
      case 3:
        return [{ value: 1, label: "All Three" }];
      default:
        return [];
    }
  }, [doorCount]);

  const hdriOptions = [
    { file: "studio_small_09_4k.hdr", label: "Small Studio" },
    { file: "photo_studio_01_4k.hdr", label: "Photo Studio" },
    { file: "old_hall_4k.hdr", label: "Industrial Hall" },
    { file: "billiard_hall_4k.hdr", label: "Apartment" },
    { file: "empty_warehouse_01_4k.hdr", label: "Warehouse" }
  ];

  return (
    <Box sx={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      fontFamily: "Inter, sans-serif",
      // Removed position fixed to prevent overlap
    }}>
      {/* Left Panel */}
      <Paper elevation={3} sx={{
        width: "380px",
        height: "100%",
        p: "24px",
        background: "linear-gradient(160deg, #f7f9fc 0%, #e9edf3 100%)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        zIndex: 1,
        flexShrink: 0 // ensure fixed width
      }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#1a202c", textAlign: "center" }}>
          Cabinet Configurator
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3} sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
          {/* Door count */}
          <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 2, fontWeight: 500 }}>Number of Doors</FormLabel>
              <RadioGroup value={doorCount || ""} onChange={handleDoorCountChange}>
                <FormControlLabel value={1} control={<Radio />} label="1 Door" />
                <FormControlLabel value={2} control={<Radio />} label="2 Doors" />
                <FormControlLabel value={3} control={<Radio />} label="3 Doors" />
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Door position */}
          {doorCount && (
            <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 2, fontWeight: 500 }}>
                  {doorCount === 1 ? "Door Position" : "Door Combination"}
                </FormLabel>
                <RadioGroup value={doorPosition || ""} onChange={handlePositionChange}>
                  {positionOptions.map(opt => (
                    <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          )}

          {/* HDRI Selector */}
          <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <FormLabel sx={{ mb: 2, fontWeight: 500 }}>Environment Lighting</FormLabel>
            <RadioGroup
              value={selectedHDRI}
              onChange={(e) => {
                const file = e.target.value;
                setSelectedHDRI(file);
                onHDRIChange?.(file);
              }}
            >
              {hdriOptions.map((h) => (
                <FormControlLabel
                  key={h.file}
                  value={h.file}
                  control={<Radio />}
                  label={h.label}
                />
              ))}
            </RadioGroup>
          </Paper>

          {/* Material Controls */}
          <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <FormLabel sx={{ fontWeight: 500, mb: 1 }}>Material Properties</FormLabel>
            <Typography variant="body2" sx={{ mb: 1 }}>Metalness</Typography>
            <Slider value={metalness} min={0} max={1} step={0.01} onChange={(e, v) => { setMetalness(v); onMaterialChange?.("metalness", v); }} />
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Roughness</Typography>
            <Slider value={roughness} min={0} max={1} step={0.01} onChange={(e, v) => { setRoughness(v); onMaterialChange?.("roughness", v); }} />
          </Paper>

          {/* Directional Light */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 500 }}>Directional Light</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">Intensity</Typography>
              <Slider value={directional.intensity} min={0} max={3} step={0.01} onChange={(e, v) => {
                const ns = { ...directional, intensity: v };
                setDirectional(ns);
                onLightChange?.("directional", ns);
              }} />
              <Typography variant="body2" sx={{ mt: 2 }}>Color</Typography>
              <ChromePicker color={directional.color} onChange={(c) => {
                const ns = { ...directional, color: c.hex };
                setDirectional(ns);
                onLightChange?.("directional", ns);
              }} disableAlpha />
            </AccordionDetails>
          </Accordion>

          {/* Ambient Light */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 500 }}>Ambient Light</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">Intensity</Typography>
              <Slider value={ambient.intensity} min={0} max={3} step={0.01} onChange={(e, v) => {
                const ns = { ...ambient, intensity: v };
                setAmbient(ns);
                onLightChange?.("ambient", ns);
              }} />
              <Typography variant="body2" sx={{ mt: 2 }}>Color</Typography>
              <ChromePicker color={ambient.color} onChange={(c) => {
                const ns = { ...ambient, color: c.hex };
                setAmbient(ns);
                onLightChange?.("ambient", ns);
              }} disableAlpha />
            </AccordionDetails>
          </Accordion>
        </Stack>

        <Box sx={{ mt: "auto", pt: 2 }}>
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#718096" }}>
            Click on doors and drawers to interact
          </Typography>
        </Box>
      </Paper>

      {/* Right Panel - Scene */}
      <Box sx={{ flex: 1, height: "100vh", position: "relative" }}>
        {children}
      </Box>
    </Box>
  );
};
