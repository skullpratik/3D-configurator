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
  Divider
} from "@mui/material";
import { useState } from "react";

export const Interface = ({ onDoorChange, children }) => {
  const [doorCount, setDoorCount] = useState(null);
  const [doorPosition, setDoorPosition] = useState(null);

  const handleDoorCountChange = (event) => {
    const count = Number(event.target.value);
    setDoorCount(count);
    setDoorPosition(null);
    onDoorChange(count, null);
  };

  const handlePositionChange = (event) => {
    const position = Number(event.target.value);
    setDoorPosition(position);
    onDoorChange(doorCount, position);
  };

  const getPositionOptions = () => {
    switch(doorCount) {
      case 1:
        return [
          { value: 1, label: "Left Position" },
          { value: 2, label: "Center Position" },
          { value: 3, label: "Right Position" }
        ];
      case 2:
        return [
          { value: 1, label: "Left + Center" },
          { value: 2, label: "Left + Right" },
          { value: 3, label: "Center + Right" }
        ];
      case 3:
        return [
          { value: 1, label: "Left + Center + Right" }
        ];
      default:
        return [];
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    >
      {/* Left Panel - Controls */}
      <Paper
        elevation={3}
        sx={{
          width: '350px',
          height: '100%',
          padding: '24px',
          background: 'linear-gradient(145deg, #f5f7fa 0%, #e4e8ed 100%)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3,
            fontWeight: '600',
            color: '#2d3748',
            textAlign: 'center'
          }}
        >
          Cabinet Configurator
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3} sx={{ flex: 1, overflowY: 'auto' }}>
          {/* Door Count Selection */}
          <Paper elevation={0} sx={{ p: 2, background: 'rgba(255, 255, 255, 0.7)' }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel 
                component="legend" 
                sx={{ 
                  mb: 2, 
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  color: '#4a5568'
                }}
              >
                Number of Doors
              </FormLabel>
              <RadioGroup
                value={doorCount || ""}
                onChange={handleDoorCountChange}
              >
                <FormControlLabel 
                  value={1} 
                  control={<Radio color="primary" />} 
                  label="1 Door" 
                  sx={{ mb: 1 }}
                />
                <FormControlLabel 
                  value={2} 
                  control={<Radio color="primary" />} 
                  label="2 Doors" 
                  sx={{ mb: 1 }}
                />
                <FormControlLabel 
                  value={3} 
                  control={<Radio color="primary" />} 
                  label="3 Doors" 
                />
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Position Selection */}
          {doorCount && (
            <Paper elevation={0} sx={{ p: 2, background: 'rgba(255, 255, 255, 0.7)' }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: '500',
                    fontSize: '1.1rem',
                    color: '#4a5568'
                  }}
                >
                  {doorCount === 1 ? "Door Position" : "Door Combination"}
                </FormLabel>
                <RadioGroup
                  value={doorPosition || ""}
                  onChange={handlePositionChange}
                >
                  {getPositionOptions().map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio color="primary" />}
                      label={option.label}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          )}
        </Stack>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              textAlign: 'center',
              color: '#718096'
            }}
          >
            Click on doors and drawers to interact
          </Typography>
        </Box>
      </Paper>

      {/* Right Panel - 3D Scene */}
      <Box 
        sx={{
          flex: 1,
          height: '100vh',
          position: 'relative',
          marginLeft: '350px',
          width: 'calc(100vw - 350px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};