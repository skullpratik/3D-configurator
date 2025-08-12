import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Switch
} from "@mui/material";

export const Interface = ({
  onDoorChange,
  onHDRIChange,
  onMaterialChange,
  onLEDToggle // new prop for LED toggle callback
}) => {
  const [selectedHDRI, setSelectedHDRI] = useState("photo_studio_01_4k.hdr.hdr");
  const [metalness, setMetalness] = useState(0.8);
  const [roughness, setRoughness] = useState(0.5);
  const [ledVisible, setLedVisible] = useState(false); // off by default

  const hdriOptions = [
    { file: "lowintensity.hdr", label: "Store (Billiard Hall)" },
    { file: "photo_studio_01_4k.hdr", label: "Photo Studio" },
    { file: "empty_warehouse_01_4k.hdr", label: "Warehouse" }
  ];

  const handleLedToggle = (event) => {
    const isOn = event.target.checked;
    setLedVisible(isOn);
    onLEDToggle?.(isOn); // notify parent
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack spacing={3} sx={{ flex: 1 }}>

        {/* Environment */}
        <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px" }}>
          <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Environment Lighting</FormLabel>
          <RadioGroup
            value={selectedHDRI}
            onChange={(e) => {
              setSelectedHDRI(e.target.value);
              onHDRIChange?.(e.target.value);
            }}
          >
            {hdriOptions.map((h) => (
              <FormControlLabel key={h.file} value={h.file} control={<Radio />} label={h.label} />
            ))}
          </RadioGroup>
        </Paper>

        {/* Material */}
        <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px" }}>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Material</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>Metalness</Typography>
          <Slider
            value={metalness}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, v) => {
              setMetalness(v);
              onMaterialChange?.("metalness", v);
            }}
          />
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Roughness</Typography>
          <Slider
            value={roughness}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, v) => {
              setRoughness(v);
              onMaterialChange?.("roughness", v);
            }}
          />
        </Paper>

        {/* LEDLight1001 Toggle */}
        <Paper elevation={0} sx={{ p: 2, background: "#fff", borderRadius: "12px" }}>
          <FormControlLabel
            control={
              <Switch
                checked={ledVisible}
                onChange={handleLedToggle}
                color="primary"
              />
            }
            label="Light"
          />
        </Paper>
      </Stack>

      {/* Footer */}
      <Box sx={{ mt: "auto", pt: 2 }}>
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", color: "#718096" }}
        >
          Visicooler options will be expanded later
        </Typography>
      </Box>
    </Box>
  );
};
