import React, { useRef, useState } from "react";
import { Interface } from "./components/Interface";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

export default function App() {
  const experienceRef = useRef();

  const [doorConfig, setDoorConfig] = useState({ count: null, position: null });
  const [hdri, setHdri] = useState("photo_studio_01_4k.hdr");
  const [materialProps, setMaterialProps] = useState({ metalness: 1, roughness: 0.4 });
  const [lightSettings, setLightSettings] = useState({
    directional: { color: "#ffffff", intensity: 1 },
    ambient: { color: "#ffffff", intensity: 1 },
  });

  const handleDoorChange = (count, position) => {
    setDoorConfig({ count, position });
    if (experienceRef.current) {
      experienceRef.current.setDoorSelection(count, position);
    }
  };

  const handleHDRIChange = (file) => setHdri(file);

  const handleMaterialChange = (prop, value) => {
    setMaterialProps((prev) => ({ ...prev, [prop]: value }));
  };

  const handleLightChange = (type, value) => {
    setLightSettings((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ width: 350, flexShrink: 0 }}>
        <Interface
          onDoorChange={handleDoorChange}
          onHDRIChange={handleHDRIChange}
          onMaterialChange={handleMaterialChange}
          onLightChange={handleLightChange}
        />
      </div>
      <div style={{ flexGrow: 1, position: "relative" }}>
        <Canvas
          shadows
          camera={{ position: [5, 5, 10], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Experience
            ref={experienceRef}
            lighting={hdri}
            metalness={materialProps.metalness}
            roughness={materialProps.roughness}
            lightSettings={lightSettings}
          />
        </Canvas>
      </div>
    </div>
  );
}
