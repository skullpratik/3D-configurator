import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Interface } from "./components/Interface";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function App() {
  const experienceRef = useRef();

  const handleDoorChange = (doorCount, position) => {
    if (experienceRef.current && typeof experienceRef.current.setDoorSelection === "function") {
      experienceRef.current.setDoorSelection(doorCount, position);
    }
  };

  return (
    <Interface onDoorChange={handleDoorChange}>
      <Canvas
        shadows
        camera={{ position: [5, 5, 10], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.physicallyCorrectLights = true;
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 'calc(100vw - 350px)',
          height: '100vh'
        }}
      >
        <Suspense fallback={null}>
          <Experience ref={experienceRef} />
        </Suspense>
      </Canvas>
    </Interface>
  );
}

export default App;