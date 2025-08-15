// components/DeepfridgerExperience.jsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useGLTF, Environment } from "@react-three/drei";

export const Experience = forwardRef(({ lighting, metalness, roughness, lightSettings }, ref) => {
  const group = useRef();
  const { scene } = useGLTF("/models/Deepfridger.glb"); // Change path to your model

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    setDoorSelection: (count, position) => {
      console.log("Deepfridger door selection:", count, position);
      // TODO: Implement model door selection logic here
    },
    toggleLEDLight1001: (visible) => {
      console.log("Deepfridger LED toggle:", visible);
      // TODO: Implement LED toggle logic here
    },
  }));

  return (
    <group ref={group}>
      {/* Optional lighting */}
      {/* <ambientLight intensity={lightSettings?.ambient?.intensity || 1} /> */}
      <primitive object={scene} />
      <Environment files="photo_studio_01_4k.hdr" background={false} intensity={1.2} />
    </group>
  );
});

useGLTF.preload("/models/Deepfridger.glb");
