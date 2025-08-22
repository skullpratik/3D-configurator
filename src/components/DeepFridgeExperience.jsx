import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

useGLTF.preload("/models/abcd.glb");

export const Experience = forwardRef(function DeepFridgeExperience(
  { ledEnabled = true, onAssetLoaded },
  ref
) {
  const { scene: threeScene, camera, gl } = useThree();
  const { scene } = useGLTF("/models/abcd.glb");

  const door1Ref = useRef(null);
  const door2Ref = useRef(null);
  const isDoor1Open = useRef(false);
  const isDoor2Open = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const light1Ref = useRef();
  const light2Ref = useRef();

  // helper to apply texture
  const applyTexture = (mesh, imagePath) => {
    if (!imagePath) return;
    const loader = new THREE.TextureLoader();
    loader.load(imagePath, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;

      const newMaterial = mesh.material.clone();
      newMaterial.map = tex;
      newMaterial.map.needsUpdate = true;
      newMaterial.needsUpdate = true;

      mesh.material = newMaterial;
    });
  };

  const applyToTarget = (name, imagePath) => {
    const target = scene.getObjectByName(name);
    if (target) {
      if (target.isMesh && target.geometry?.attributes?.uv) {
        applyTexture(target, imagePath);
      } else if (target.isObject3D) {
        target.traverse((child) => {
          if (child.isMesh && child.geometry?.attributes?.uv) {
            applyTexture(child, imagePath);
          }
        });
      }
    }
  };

  // ✅ Expose methods to App.jsx
  useImperativeHandle(ref, () => ({
    applyFrontTexture: (url) => applyToTarget("FrontPannel", url),
    resetFront: () => applyToTarget("FrontPannel", "/texture/Deepfront.jpg"),
    applyLeftTexture: (url) => applyToTarget("SidePannelLeft", url),
    resetLeft: () => applyToTarget("SidePannelLeft", "/texture/DeepleftRight.jpg"),
    applyRightTexture: (url) => applyToTarget("SidePannelRight", url),
    resetRight: () => applyToTarget("SidePannelRight", "/texture/DeepleftRight.jpg"),
  }));

  // Model setup
  useEffect(() => {
    if (!scene || !threeScene) return;

    threeScene.background = null;
    scene.scale.set(2, 2, 2);
    scene.position.set(0.2, -1.16, 0);

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    // Default textures
    applyToTarget("FrontPannel", "/texture/Deepfront.jpg");
    applyToTarget("SidePannelLeft", "/texture/DeepleftRight.jpg");
    applyToTarget("SidePannelRight", "/texture/DeepleftRight.jpg");

    // Door references
    door1Ref.current = scene.getObjectByName("Door1");
    door2Ref.current = scene.getObjectByName("Door2");
    if (door1Ref.current) door1Ref.current.rotation.x = 0;
    if (door2Ref.current) door2Ref.current.rotation.x = 0;

    // Door click handler
    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      // Door1
      if (door1Ref.current) {
        const intersects = raycaster.current.intersectObject(door1Ref.current, true);
        if (intersects.length > 0) {
          const targetRotation = isDoor1Open.current ? 0 : -(Math.PI / 2);
          gsap.to(door1Ref.current.rotation, { x: targetRotation, duration: 1, ease: "power2.inOut" });

          if (ledEnabled && light1Ref.current) {
            const targetIntensity = isDoor1Open.current ? 0 : 1;
            gsap.to(light1Ref.current, { intensity: targetIntensity, duration: 0.5, ease: "power2.out" });
          }

          isDoor1Open.current = !isDoor1Open.current;
          return;
        }
      }

      // Door2
      if (door2Ref.current) {
        const intersects = raycaster.current.intersectObject(door2Ref.current, true);
        if (intersects.length > 0) {
          const targetRotation = isDoor2Open.current ? 0 : -Math.PI / 2;
          gsap.to(door2Ref.current.rotation, { x: targetRotation, duration: 1, ease: "power2.inOut" });

          if (ledEnabled && light2Ref.current) {
            const targetIntensity = isDoor2Open.current ? 0 : 1;
            gsap.to(light2Ref.current, { intensity: targetIntensity, duration: 0.5, ease: "power2.out" });
          }

          isDoor2Open.current = !isDoor2Open.current;
        }
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [scene, threeScene, camera, gl, ledEnabled]);

  return (
    <>
      <Environment files="photo_studio_01_1k.hdr" background={false} intensity={1.2} onLoad={onAssetLoaded} />
      <ContactShadows position={[0, -1.1, 0]} opacity={0.8} scale={15} blur={2.5} far={10} />
     <OrbitControls
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={1.1}
        zoomSpeed={1}
        panSpeed={0.8}
        enablePan
        minDistance={2.5}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.5, 0]}
        makeDefault
      />     the orbit control for the deepfridger is not well its too harsh


      {scene && <primitive object={scene} />}
    </>
  );
});
