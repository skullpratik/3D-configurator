import React, { useState } from "react";
import { Box, Paper, Typography, FormControlLabel, Switch, Stack } from "@mui/material";

export const Interface = ({ onLEDToggle }) => {
  const [ledVisible, setLedVisible] = useState(false);

  const handleLedToggle = (event) => {
    const isOn = event.target.checked;
    setLedVisible(isOn);
    onLEDToggle?.(isOn);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack spacing={3} sx={{ flex: 1 }}>
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
