// Loader.jsx
import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export const Loader = ({ progress = 0 }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
        color: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Loading {Math.round(progress)}%
      </Typography>
      <Box sx={{ width: "300px" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              background: "linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)",
            },
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />
      </Box>
    </Box>
  );
};
