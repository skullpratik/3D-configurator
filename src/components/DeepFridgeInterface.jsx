// components/DeepfridgerInterface.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, Stack, FormControl, FormLabel, Select, MenuItem, Button } from "@mui/material";

export const Interface = ({ onDoorChange, onHDRIChange, onMaterialChange, onLightChange, onLEDToggle }) => {
  const [doorCount, setDoorCount] = useState("");

  const handleDoorChange = (event) => {
    const count = Number(event.target.value);
    setDoorCount(count);
    onDoorChange?.(count, null);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Stack spacing={3}>
        {/* Door Config */}
        <Paper sx={{ p: 3, borderRadius: 3, background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Deepfridger Configuration
          </Typography>

          <FormControl fullWidth>
            <FormLabel>Number of Doors</FormLabel>
            <Select value={doorCount} onChange={handleDoorChange} displayEmpty>
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value={1}>1 Door</MenuItem>
              <MenuItem value={2}>2 Doors</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Example: LED Toggle */}
        <Paper sx={{ p: 3, borderRadius: 3, background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Lighting
          </Typography>
          <Button variant="contained" onClick={() => onLEDToggle?.(true)}>Turn On LED</Button>
          <Button variant="outlined" onClick={() => onLEDToggle?.(false)} sx={{ ml: 2 }}>Turn Off LED</Button>
        </Paper>
      </Stack>
    </Box>
  );
};
