import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export const Interface = ({
  onDoorChange,
  onDoorTypeChange,
  doorType = "solid",
}) => {
  const [doorCount, setDoorCount] = useState("");
  const [doorPosition, setDoorPosition] = useState("");
  const [localDoorType, setLocalDoorType] = useState(doorType);

  useEffect(() => setLocalDoorType(doorType), [doorType]);

  const handleDoorCountChange = (event) => {
    const count = Number(event.target.value);
    setDoorCount(count);

    if (count === 3) {
      setDoorPosition(1); // auto-assign for 3 doors
      onDoorChange?.(3, 1);
    } else {
      setDoorPosition(""); // reset for 1 or 2 doors
      onDoorChange?.(count, null);
    }
  };

  const handlePositionChange = (event) => {
    const pos = Number(event.target.value);
    setDoorPosition(pos);
    onDoorChange?.(doorCount, pos);
  };

  const positionOptions = useMemo(() => {
    switch (doorCount) {
      case 1:
        return [
          { value: 1, label: "Left" },
          { value: 2, label: "Center" },
          { value: 3, label: "Right" },
        ];
      case 2:
        return [
          { value: 1, label: "Left + Center" },
          { value: 2, label: "Left + Right" },
          { value: 3, label: "Center + Right" },
        ];
      default:
        return [];
    }
  }, [doorCount]);

  const cardStyle = {
    p: 3,
    borderRadius: 3,
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  };

  const labelStyle = { fontWeight: 600, mb: 1, color: "#333" };

  const showDoorType = doorCount === 3 || doorPosition !== "";

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Stack spacing={3}>
        {/* Door Config Card */}
        <Paper sx={cardStyle}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Door Configuration
          </Typography>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <FormLabel sx={labelStyle}>Number of Doors</FormLabel>
              <Select value={doorCount} onChange={handleDoorCountChange} displayEmpty>
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value={1}>1 Door</MenuItem>
                <MenuItem value={2}>2 Doors</MenuItem>
                <MenuItem value={3}>3 Doors</MenuItem>
              </Select>
            </FormControl>

            {(doorCount === 1 || doorCount === 2) && (
              <FormControl fullWidth>
                <FormLabel sx={labelStyle}>
                  {doorCount === 1 ? "Door Position" : "Door Combination"}
                </FormLabel>
                <Select value={doorPosition} onChange={handlePositionChange} displayEmpty>
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {positionOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Paper>

        {/* Door Type */}
        {showDoorType && (
          <Paper sx={cardStyle}>
            <FormControl fullWidth>
              <FormLabel sx={labelStyle}>Door Type</FormLabel>
              <RadioGroup
                row
                value={localDoorType}
                onChange={(e) => {
                  setLocalDoorType(e.target.value);
                  onDoorTypeChange?.(e.target.value);
                }}
              >
                <FormControlLabel value="solid" control={<Radio />} label="Solid" />
                <FormControlLabel value="glass" control={<Radio />} label="Glass" />
              </RadioGroup>
            </FormControl>
          </Paper>
        )}
      </Stack>

      <Typography sx={{ mt: 2, textAlign: "center", color: "#777" }} variant="caption">
        Click on doors and drawers to interact
      </Typography>
    </Box>
  );
};
