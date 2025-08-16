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
        background: "linear-gradient(135deg, #1a2a6c, #2c3e50, #4b6cb7)",
        color: "#fff",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          zIndex: -1,
        }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200vw",
          height: "200vh",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          animation: "rotate 20s linear infinite",
          "@keyframes rotate": {
            "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
            "100%": { transform: "translate(-50%, -50%) rotate(360deg)" }
          }
        }}
      />
      
      <Box sx={{ 
        textAlign: "center", 
        mb: 4,
        animation: "fadeIn 0.8s ease-out, pulse 2s infinite",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" }
        }
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 1,
            letterSpacing: "0.1em",
            textShadow: "0 0 10px rgba(255,255,255,0.3)",
            background: "linear-gradient(90deg, #fff, #f5f7fa)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          CABINET CONFIGURATOR
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            mb: 3,
            color: "#e0e0e0",
            letterSpacing: "0.05em",
          }}
        >
          Loading {Math.round(progress)}%
        </Typography>
      </Box>
      
      <Box sx={{ 
        width: "min(400px, 80vw)",
        position: "relative",
        mb: 2,
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        borderRadius: "12px",
        overflow: "hidden",
      }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 16,
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.15)",
            "& .MuiLinearProgress-bar": {
              borderRadius: "12px",
              background: "linear-gradient(90deg, #ff8a00, #ffc400, #ff8a00)",
              backgroundSize: "300% 100%",
              animation: "gradient 2s ease infinite",
              boxShadow: "0 0 10px rgba(255,200,0,0.4)",
              transition: "transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
              "@keyframes gradient": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" }
              }
            },
          }}
        />
      </Box>
      
      <Typography 
        variant="caption" 
        sx={{ 
          mt: 2, 
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.85rem",
          letterSpacing: "0.05em",
        }}
      >
        Preparing your 3D experience...
      </Typography>
      
      <Box 
        sx={{ 
          position: "absolute", 
          bottom: "10%", 
          display: "flex",
          gap: 1,
          animation: "fadeIn 1.2s ease-out",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box 
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#ffc400",
              animation: "bounce 1.5s infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-10px)" }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};