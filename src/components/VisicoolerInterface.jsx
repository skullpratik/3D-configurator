import React, { useState } from "react";
import { Box, Typography, FormControl, Select, MenuItem, Switch, FormControlLabel } from "@mui/material";

export const Interface = ({
  onLEDToggle,
  onCanopyColorChange,
  canopyColor,
  onBottomBorderColorChange,
  bottomBorderColor,
  onDoorColorChange,
  doorColor,
  onTopPanelColorChange,
  topPanelColor
}) => {
  const [ledVisible, setLedVisible] = useState(false);

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

      {renderColorDropdown("Canopy Border Color", canopyColor, "canopy")}
      {renderColorDropdown("Bottom Border Color", bottomBorderColor, "bottom")}
      {renderColorDropdown("Door Color", doorColor, "door")}
      {renderColorDropdown("Top Panel Color", topPanelColor, "toppanel")}
    </Box>
  );
};
