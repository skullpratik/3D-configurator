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
    camera.position.set(4, sidebarOpen ? 2 : 4, 8);
    camera.updateProjectionMatrix();
  }, [sidebarOpen, camera]);
  return null;
}
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
// The Loader is moved out of this component.
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
  return (
    <>
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

// ---------------- Header Dropdown ----------------
const models = [
  { value: "undercounter", name: "Undercounter", img: "/images/undercounter.png" },
  { value: "visicooler", name: "Visicooler", img: "/images/visicooler.png" },
  { value: "deepfridge", name: "Deep Fridge", img: "/images/deepfridger.png" },
];

function HeaderDropdown({ modelType, setModelType, panelWidth }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedModel = models.find((m) => m.value === modelType);

  const availableModels = models.filter((model) => model.value !== modelType);

  return (
    <Box
      sx={{ position: "relative", width: "100%" }}
      ref={dropdownRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "14px 14px",
          borderRadius: 2,
          background: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.25s ease",
          "&:hover": { transform: "scale(1.02)", background: "#fafafa" },
        }}
      >
        <Box
          component="img"
          src={selectedModel.img}
          alt={selectedModel.name}
          sx={{
            width: 75,
            height: 55,
            objectFit: "contain",
            borderRadius: 2,
            backgroundColor: "#f9f9f936",
          }}
        />
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#222",
            letterSpacing: "0.5px",
          }}
        >
          {selectedModel.name}
        </Typography>
      </Box>

      {open && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: -6,
            width: panelWidth - 70,
            maxHeight: "none",
            overflowY: "hidden",
            mt: 0.6,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 2,
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            backgroundColor: "#fff",
            animation: "fadeIn 0.25s ease-in-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(-10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {availableModels.map((model) => (
            <Box
              key={model.value}
              onClick={() => {
                setModelType(model.value);
                setOpen(false);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: "10px 14px",
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "#f0f4ff",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box
                component="img"
                src={model.img}
                alt={model.name}
                sx={{
                  width: 65,
                  height: 65,
                  objectFit: "contain",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#333",
                  letterSpacing: "0.3px",
                }}
              >
                {model.name}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
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

  // Hook to get the loading progress
  const { progress } = useProgress();

  const handleDoorChange = (count, position) => {
    const ref =
      modelType === "undercounter"
        ? underCounterRef.current
        : modelType === "visicooler"
          ? visiCoolerRef.current
          : deepFridgeRef.current;
    if (ref?.setDoorSelection) ref.setDoorSelection(count, position);
  };

  const handleMaterialChange = (prop, value) =>
    setMaterialProps((prev) => ({ ...prev, [prop]: value }));
  const handleLEDToggle = (visible) => {
    setLightSettings((prev) => ({ ...prev, ledVisible: visible }));
    visiCoolerRef.current?.toggleLEDLight1001?.(visible);
  };

  const handleFrontTextureUpload = (url) => deepFridgeRef.current?.applyFrontTexture(url);
  const handleFrontTextureReset = () => deepFridgeRef.current?.resetFront();
  const handleLeftTextureUpload = (url) => deepFridgeRef.current?.applyLeftTexture(url);
  const handleLeftTextureReset = () => deepFridgeRef.current?.resetLeft();
  const handleRightTextureUpload = (url) => deepFridgeRef.current?.applyRightTexture(url);
  const handleRightTextureReset = () => deepFridgeRef.current?.resetRight();

  const panelWidth = open ? 500 : 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "row-reverse", height: "100vh", width: "100vw" }}>
      {/* Interface Panel */}
      <Paper
        elevation={3}
        sx={{
          width: panelWidth,
          transition: "width 0.3s ease",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #ffffffff 0%, #e9edf3 100%)",
          borderLeft: open ? "1px solid rgba(0,0,0,0.08)" : "none",
          position: "relative",
        }}
      >
        {/* Toggle Button */}
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            position: "absolute",
            left: -45,
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
            <Box
              sx={{
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                borderBottom: "2px solid #f28315",
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <HeaderDropdown modelType={modelType} setModelType={setModelType} panelWidth={panelWidth} />
            </Box>

            {/* Interface Body */}
            <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
              {modelType === "undercounter" && (
                <UnderCounterInterface
                  onDoorChange={handleDoorChange}
                  onMaterialChange={handleMaterialChange}
                  onDoorTypeChange={setDoorType}
                  doorType={doorType}
                />
              )}
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
                  onLeftTextureUpload={handleLeftTextureUpload}
                  onLeftTextureReset={handleLeftTextureReset}
                  onRightTextureUpload={handleRightTextureUpload}
                  onRightTextureReset={handleRightTextureReset}
                />
              )}
            </Box>
          </>
        )}
      </Paper>

      {/* Scene Panel */}
      <Box sx={{ flex: 1, position: "relative" }}>
        {/* Render the loader outside the Canvas but in the same parent Box */}
        {progress < 100 && <Loader progress={progress} />}

        <Canvas
          shadows
          camera={{ position: [4, 4, 8], fov: 35 }}
          gl={{ preserveDrawingBuffer: true }}
          // Hide the canvas when loading to prevent the empty screen flash
          style={{ visibility: progress === 100 ? "visible" : "hidden" }}
        >
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