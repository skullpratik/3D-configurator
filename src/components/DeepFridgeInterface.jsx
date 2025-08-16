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

  
};
