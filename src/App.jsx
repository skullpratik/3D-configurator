import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Interface as UnderCounterInterface } from "./components/UnderCounterInterface";
import { Interface as VisicoolerInterface } from "./components/VisicoolerInterface";
import { Canvas, useThree } from "@react-three/fiber";
import { Experience as UnderCounterExperience } from "./components/UnderCounterExperience";
import { Experience as VisicoolerExperience } from "./components/VisicoolerExperience";
import * as THREE from "three";

// Helper component to get gl context and pass it to parent
function GLProvider({ setGL }) {
  const { gl } = useThree();
  useEffect(() => {
    setGL(gl);
  }, [gl, setGL]);
  return null;
}

function DownloadButton({ gl }) {
  if (!gl) return null; // Wait for gl to be ready

  const handleDownload = () => {
    const dataURL = gl.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "model-view.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        position: "fixed",
        bottom: 20,
        left: "90%",
        transform: "translateX(-50%)",
        padding: "10px 15px",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: 8,
        color: "white",
        fontSize: 16,
        cursor: "pointer",
        zIndex: 10000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
      title="Download current view"
      aria-label="Download current view"
    >
      &#8681; Download
    </button>
  );
}

function CanvasContent({
  modelType,
  hdri,
  materialProps,
  lightSettings,
  underCounterRef,
  visiCoolerRef,
  handleLEDToggle,
}) {
  return modelType === "undercounter" ? (
    <UnderCounterExperience
      ref={underCounterRef}
      lighting={hdri}
      metalness={materialProps.metalness}
      roughness={materialProps.roughness}
      lightSettings={lightSettings}
    />
  ) : (
    <VisicoolerExperience
      ref={visiCoolerRef}
      lighting={hdri}
      metalness={materialProps.metalness}
      roughness={materialProps.roughness}
      lightSettings={lightSettings}
      onLEDToggle={handleLEDToggle}
    />
  );
}

export default function App() {
  const underCounterRef = useRef();
  const visiCoolerRef = useRef();

  const [gl, setGL] = useState(null);





 



  const [modelType, setModelType] = useState("undercounter");
  const [hdri, setHdri] = useState("photo_studio_01_4k.hdr");
  const [materialProps, setMaterialProps] = useState({
    metalness: 1,
    roughness: 0.4,
  });
  const [lightSettings, setLightSettings] = useState({
    directional: { color: "#ffffff", intensity: 1 },
    ambient: { color: "#ffffff", intensity: 1 },
  });

  const handleDoorChange = (count, position) => {
    const ref =
      modelType === "undercounter" ? underCounterRef.current : visiCoolerRef.current;
    if (ref && ref.setDoorSelection) {
      ref.setDoorSelection(count, position);
    }
  };

  const handleHDRIChange = (file) => setHdri(file);

  const handleMaterialChange = (prop, value) => {
    setMaterialProps((prev) => ({ ...prev, [prop]: value }));
  };

  const handleLightChange = (lightName) => {
    setLightSettings((prev) => ({ ...prev, ledLight: lightName }));
  };

  const handleLEDToggle = (visible) => {
    if (visiCoolerRef.current?.toggleLEDLight1001) {
      visiCoolerRef.current.toggleLEDLight1001(visible);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Paper
        elevation={3}
        sx={{
          width: 380,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #f7f9fc 0%, #e9edf3 100%)",
          borderRight: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Box
  sx={{
    px: 3,
    py: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "2px solid #f28315",  // stronger border color and thickness
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // subtle shadow for elevation
    borderRadius: "12px 12px 0 0",  // rounded top corners
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 700,
      color: "#f28315",
      userSelect: "none",
      letterSpacing: 1,
    }}
  >
    Cabinet Configurator
  </Typography>

  <select
  value={modelType}
  onChange={(e) => setModelType(e.target.value)}
  style={{
    padding: "10px 20px",
    borderRadius: "30px",
    border: "2px solid #565350ff",
    backgroundColor: "#fff",
    color: "#e08f4cff",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    outline: "none",
    boxShadow: "0 4px 8px rgba(242, 131, 21, 0.25)",
    minWidth: "160px",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%23f28315' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
  }}
  onFocus={(e) => {
    e.target.style.borderColor = "#d97603";
    e.target.style.boxShadow = "0 0 10px #d97603";
  }}
  onBlur={(e) => {
    e.target.style.borderColor = "#f28315";
    e.target.style.boxShadow = "0 4px 8px rgba(242, 131, 21, 0.25)";
  }}
>
  <option value="undercounter">Undercounter</option>
  <option value="visicooler">Visicooler</option>
</select>
</Box>


        <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
          {modelType === "undercounter" ? (
            <UnderCounterInterface
              onDoorChange={handleDoorChange}
              onHDRIChange={handleHDRIChange}
              onMaterialChange={handleMaterialChange}
              onLightChange={handleLightChange}
            />
          ) : (
            <VisicoolerInterface
              onDoorChange={handleDoorChange}
              onHDRIChange={handleHDRIChange}
              onMaterialChange={handleMaterialChange}
              onLightChange={handleLightChange}
              onLEDToggle={handleLEDToggle}
            />
          )}
        </Box>
      </Paper>

      <Box sx={{ flex: 1, position: "relative" }}>
        <Canvas
          shadows
          camera={{ position: [-6, 0, 5], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ preserveDrawingBuffer: true }} // important for toDataURL to work
        >
          <GLProvider setGL={setGL} />
          <CanvasContent
            modelType={modelType}
            hdri={hdri}
            materialProps={materialProps}
            lightSettings={lightSettings}
            underCounterRef={underCounterRef}
            visiCoolerRef={visiCoolerRef}
            handleLEDToggle={handleLEDToggle}
          />
        </Canvas>

        <DownloadButton gl={gl} />
      </Box>
    </Box>
  );
}
