import React, { useRef, useState, useEffect } from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import { Interface as UnderCounterInterface } from "./components/UnderCounterInterface";
import { Interface as VisicoolerInterface } from "./components/VisicoolerInterface";
import { Interface as DeepFridgeInterface } from "./components/DeepFridgeInterface";

import { Canvas, useThree } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";

import { Experience as UnderCounterExperience } from "./components/UnderCounterExperience";
import { Experience as VisicoolerExperience } from "./components/VisicoolerExperience";
import { Experience as DeepFridgeExperience } from "./components/DeepFridgeExperience";
import { Loader } from "./components/Loader";

// ---------------- GL Provider ----------------
function GLProvider({ setGL }) {
  const { gl } = useThree();
  React.useEffect(() => setGL(gl), [gl, setGL]);
  return null;
}
function CameraShift({ sidebarOpen }) {
  const { camera } = useThree();

  useEffect(() => {
    if (sidebarOpen) {
      camera.position.set(4, 2, 8);
    } else {
      camera.position.set(4, 4, 8);
    }
    camera.updateProjectionMatrix();
  }, [sidebarOpen, camera]);

  return null;
}
// ---------------- Camera Fix ----------------
function CameraAspectFix() {
  const { camera, gl } = useThree();

  React.useEffect(() => {
    const resizeCamera = () => {
      const canvas = gl.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };

    resizeCamera();
    window.addEventListener("resize", resizeCamera);
    return () => window.removeEventListener("resize", resizeCamera);
  }, [camera, gl]);

  return null;
}

// ---------------- Download Button ----------------
function DownloadButton({ gl }) {
  if (!gl) return null;

  const handleDownload = () => {
    const dataURL = gl.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "model-view.png";
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
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
    >
      &#8681; Download
    </button>
  );
}

// ---------------- Canvas Content ----------------
function CanvasContent({
  modelType,
  materialProps,
  lightSettings,
  underCounterRef,
  visiCoolerRef,
  deepFridgeRef,
  doorType,
  canopyColor,
  bottomBorderColor,
  doorColor,
  topPanelColor,
  louverColor,
  colorShading,
}) {
  const { progress } = useProgress();

  return (
    <>
      {progress < 100 && (
        <Html fullscreen>
          <Loader progress={progress} />
        </Html>
      )}

      {modelType === "undercounter" && (
        <UnderCounterExperience
          ref={underCounterRef}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
          lightSettings={lightSettings}
          doorType={doorType}
        />
      )}

      {modelType === "visicooler" && (
        <VisicoolerExperience
          ref={visiCoolerRef}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
          lightSettings={lightSettings}
          canopyColor={canopyColor}
          bottomBorderColor={bottomBorderColor}
          doorColor={doorColor}
          topPanelColor={topPanelColor}
          ledVisible={lightSettings.ledVisible}
          louverColor={louverColor}
          colorShading={colorShading}
        />
      )}

      {modelType === "deepfridge" && (
        <DeepFridgeExperience
          ref={deepFridgeRef}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
          lightSettings={lightSettings}
        />
      )}
    </>
  );
}

// ---------------- App Component ----------------
export default function App() {
  const underCounterRef = useRef();
  const visiCoolerRef = useRef();
  const deepFridgeRef = useRef();

  const [gl, setGL] = useState(null);
  const [modelType, setModelType] = useState("undercounter");
  const [materialProps, setMaterialProps] = useState({ metalness: 1, roughness: 0.4 });
  const [lightSettings, setLightSettings] = useState({
    directional: { color: "#ffffff", intensity: 1 },
    ambient: { color: "#ffffff", intensity: 1 },
    ledVisible: false,
  });
  const [doorType, setDoorType] = useState("solid");

  const [canopyColor, setCanopyColor] = useState(null);
  const [bottomBorderColor, setBottomBorderColor] = useState(null);
  const [doorColor, setDoorColor] = useState(null);
  const [topPanelColor, setTopPanelColor] = useState(null);
  const [louverColor, setLouverColor] = useState(null);
  const [colorShading, setColorShading] = useState({ canopy: 0, bottom: 0, door: 0, toppanel: 0, louver: 0 });

  const [open, setOpen] = useState(true);

  const handleDoorChange = (count, position) => {
    const ref = modelType === "undercounter" ? underCounterRef.current
      : modelType === "visicooler" ? visiCoolerRef.current
      : deepFridgeRef.current;
    if (ref?.setDoorSelection) ref.setDoorSelection(count, position);
  };

  const handleMaterialChange = (prop, value) => setMaterialProps(prev => ({ ...prev, [prop]: value }));

  const handleLEDToggle = (visible) => {
    setLightSettings(prev => ({ ...prev, ledVisible: visible }));
    visiCoolerRef.current?.toggleLEDLight1001?.(visible);
  };
  
  // New handler functions for Deep Fridge
  const handleFrontTextureUpload = (url) => deepFridgeRef.current?.applyFrontTexture(url);
  const handleFrontTextureReset = () => deepFridgeRef.current?.resetFront();
  const handleLeftTextureUpload = (url) => deepFridgeRef.current?.applyLeftTexture(url);
  const handleLeftTextureReset = () => deepFridgeRef.current?.resetLeft();
  const handleRightTextureUpload = (url) => deepFridgeRef.current?.applyRightTexture(url);
  const handleRightTextureReset = () => deepFridgeRef.current?.resetRight();

  return (
    <Box sx={{ display: "flex", flexDirection: "row-reverse", height: "100vh", width: "100vw" }}>
      {/* Interface Panel */}
      <Paper
        elevation={3}
        sx={{
          width: open ? 500 : 0,
          transition: "width 0.3s ease",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #f7f9fc 0%, #e9edf3 100%)",
          borderLeft: open ? "1px solid rgba(0,0,0,0.08)" : "none",
          position: "relative",
        }}
      >
        {/* Toggle Button */}
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            position: "absolute",
            left: open ? -45 : -45,
            top: "50%",
            transform: "translateY(-50%)",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            "&:hover": { background: "#f0f0f0" },
            zIndex: 2000,
          }}
        >
          {open ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>

        {open && (
          <>
            {/* Header */}
            <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #f28315", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", borderRadius: "12px 12px 0 0" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#f28315", userSelect: "none", letterSpacing: 1 }}>Cabinet Configurator</Typography>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                style={{ padding: "10px 20px", borderRadius: "30px", border: "2px solid #565350ff", backgroundColor: "#fff", color: "#e08f4cff", fontWeight: 600, fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 8px rgba(242, 131, 21, 0.25)", minWidth: "160px" }}
              >
                <option value="undercounter">Undercounter</option>
                <option value="visicooler">Visicooler</option>
                <option value="deepfridge">Deep Fridge</option>
              </select>
            </Box>

            {/* Interface Body */}
            <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
              {modelType === "undercounter" && <UnderCounterInterface onDoorChange={handleDoorChange} onMaterialChange={handleMaterialChange} onDoorTypeChange={setDoorType} doorType={doorType} />}
              {modelType === "visicooler" && (
                <VisicoolerInterface
                  onLEDToggle={handleLEDToggle}
                  onCanopyColorChange={setCanopyColor}
                  canopyColor={canopyColor}
                  onBottomBorderColorChange={setBottomBorderColor}
                  bottomBorderColor={bottomBorderColor}
                  onDoorColorChange={setDoorColor}
                  doorColor={doorColor}
                  onTopPanelColorChange={setTopPanelColor}
                  topPanelColor={topPanelColor}
                  onLouverColorChange={setLouverColor}
                  louverColor={louverColor}
                  onColorShadingChange={setColorShading}
                  onCanopyTextureUpload={(url) => visiCoolerRef.current?.applyCanopyTexture(url)}
                  onCanopyTextureReset={() => visiCoolerRef.current?.resetCanopyTexture()}
                  onSidePanel1TextureUpload={(url) => visiCoolerRef.current?.applySidePanel1Texture(url)}
                  onSidePanel1TextureReset={() => visiCoolerRef.current?.resetSidePanel1Texture()}
                  onSidePanel2TextureUpload={(url) => visiCoolerRef.current?.applySidePanel2Texture(url)}
                  onSidePanel2TextureReset={() => visiCoolerRef.current?.resetSidePanel2Texture()}
                  onLouverTextureUpload={(url) => visiCoolerRef.current?.applyLouverTexture(url)}
                  onLouverTextureReset={() => visiCoolerRef.current?.resetLouverTexture()}
                />
              )}
              {modelType === "deepfridge" && (
                <DeepFridgeInterface 
                  onMaterialChange={handleMaterialChange} 
                  onFrontTextureUpload={handleFrontTextureUpload} 
                  onFrontTextureReset={handleFrontTextureReset}
                  onLeftTextureUpload={handleLeftTextureUpload} // Added prop
                  onLeftTextureReset={handleLeftTextureReset} // Added prop
                  onRightTextureUpload={handleRightTextureUpload} // Added prop
                  onRightTextureReset={handleRightTextureReset} // Added prop
                />
              )}
            </Box>
          </>
        )}
      </Paper>

      {/* Scene Panel */}
      <Box sx={{ flex: 1, position: "relative" }}>
        <Canvas shadows camera={{ position: [4, 4, 8], fov: 35 }} gl={{ preserveDrawingBuffer: true }}>
          <GLProvider setGL={setGL} />
          <CameraAspectFix />
          <CameraShift sidebarOpen={open} />
          <CanvasContent
            modelType={modelType}
            materialProps={materialProps}
            lightSettings={lightSettings}
            underCounterRef={underCounterRef}
            visiCoolerRef={visiCoolerRef}
            deepFridgeRef={deepFridgeRef}
            doorType={doorType}
            canopyColor={canopyColor}
            bottomBorderColor={bottomBorderColor}
            doorColor={doorColor}
            topPanelColor={topPanelColor}
            louverColor={louverColor}
            colorShading={colorShading}
          />
        </Canvas>
        <DownloadButton gl={gl} />
      </Box>
    </Box>
  );
}