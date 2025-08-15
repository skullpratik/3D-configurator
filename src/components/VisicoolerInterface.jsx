import React, { useState } from "react";
import { Box, Typography, Switch, FormControlLabel } from "@mui/material";

export const Interface = ({
  onLEDToggle,
  onCanopyColorChange,
  canopyColor,
  onBottomBorderColorChange,
  bottomBorderColor,
  onDoorColorChange,
  doorColor
}) => {
  const [ledVisible, setLedVisible] = useState(false);

  const colorOptions = [
    { label: "Red", value: "#ff0000" },
    { label: "Blue", value: "#0000ff" },
    { label: "Green", value: "#00ff00" },
    { label: "Orange", value: "#ffa500" },
    { label: "black", value: "#000000" }
  ];

  const handleLED = (e) => {
    setLedVisible(e.target.checked);
    onLEDToggle?.(e.target.checked);
  };

  const handleColorSelect = (color, type) => {
    switch(type){
      case 'canopy': onCanopyColorChange?.(color); break;
      case 'bottom': onBottomBorderColorChange?.(color); break;
      case 'door': onDoorColorChange?.(color); break;
      default: break;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <FormControlLabel
        control={<Switch checked={ledVisible} onChange={handleLED} />}
        label="LED Light"
      />

      {/* Canopy color */}
      <Box>
        <Typography variant="subtitle2">Canopy Border Color</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {colorOptions.map(c => (
            <Box
              key={c.label}
              onClick={() => handleColorSelect(c.value,'canopy')}
              sx={{
                width: 32, height: 32, borderRadius: "50%",
                backgroundColor: c.value,
                border: canopyColor === c.value ? "3px solid #333" : "1px solid #ccc",
                cursor: "pointer"
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Bottom border color */}
      <Box>
        <Typography variant="subtitle2">Bottom Border Color</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {colorOptions.map(c => (
            <Box
              key={c.label}
              onClick={() => handleColorSelect(c.value,'bottom')}
              sx={{
                width: 32, height: 32, borderRadius: "50%",
                backgroundColor: c.value,
                border: bottomBorderColor === c.value ? "3px solid #333" : "1px solid #ccc",
                cursor: "pointer"
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Door color */}
      <Box>
        <Typography variant="subtitle2">Door Color</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          {colorOptions.map(c => (
            <Box
              key={c.label}
              onClick={() => handleColorSelect(c.value,'door')}
              sx={{
                width: 32, height: 32, borderRadius: "50%",
                backgroundColor: c.value,
                border: doorColor === c.value ? "3px solid #333" : "1px solid #ccc",
                cursor: "pointer"
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
