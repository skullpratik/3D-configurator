import React, { useEffect, useRef, useImperativeHandle, forwardRef, Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

useGLTF.preload("/models/Fekani.glb");

export const Experience = forwardRef(({ canopyColor, bottomBorderColor, doorColor }, ref) => {
  const { scene: threeScene, camera, gl } = useThree();
  const { scene } = useGLTF("/models/Fekani.glb");

  const doorRef = useRef();
  const glassRef = useRef();
  const ledLight1001Ref = useRef();
  const isDoorOpen = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // ----------------------- INITIAL SCENE SETUP -----------------------
  useEffect(() => {
    if(!scene) return;

    const led = scene.getObjectByName("LEDLight1001");
    if(led){ ledLight1001Ref.current = led; led.visible=false;}

    doorRef.current = scene.getObjectByName("Door") || null;
    glassRef.current = scene.getObjectByName("Glass") || null;

    if(doorRef.current) doorRef.current.rotation.y=0;
    if(glassRef.current) glassRef.current.rotation.y=0;

    const handleClick = (event)=>{
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left)/rect.width)*2-1;
      mouse.current.y = -((event.clientY - rect.top)/rect.height)*2+1;
      raycaster.current.setFromCamera(mouse.current, camera);

      const intersectsDoor = doorRef.current? raycaster.current.intersectObject(doorRef.current,true):[];
      const intersectsGlass = glassRef.current? raycaster.current.intersectObject(glassRef.current,true):[];

      if(intersectsDoor.length>0 || intersectsGlass.length>0){
        const targetRotation = isDoorOpen.current?0:Math.PI/2;
        if(doorRef.current) gsap.to(doorRef.current.rotation,{y:targetRotation,duration:1,ease:"power2.inOut"});
        if(glassRef.current) gsap.to(glassRef.current.rotation,{y:targetRotation,duration:1,ease:"power2.inOut"});
        isDoorOpen.current = !isDoorOpen.current;
      }
    }

    gl.domElement.addEventListener("click",handleClick);
    return ()=> gl.domElement.removeEventListener("click",handleClick);
  },[scene, gl, camera]);

  // ----------------------- APPLY CANOPY COLOR -----------------------
// Canopy color
useEffect(() => {
  if (!scene || !canopyColor) return;

  const canopyMeshes = [
    "Kanopiborder1",
    "Kanopiborder2",
    "Kanopiborder3",
    "Kanopiborder4"
  ];

  const applyColor = (mesh) => {
    if (!mesh.isMesh) return;
    mesh.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(canopyColor),
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
  };

  canopyMeshes.forEach((name) => {
    const obj = scene.getObjectByName(name);
    if (!obj) return;

    if (obj.isMesh) applyColor(obj);
    else obj.traverse((child) => {
      if (child.isMesh) applyColor(child);
    });
  });
}, [scene, canopyColor]);



  // ----------------------- APPLY BOTTOM BORDER COLOR -----------------------
  useEffect(() => {
    if (!scene || !bottomBorderColor) return;
    const bottomBorders = ["Bottomborder1", "Bottomborder2"];
    const applyColor = (mesh) => {
      if (!mesh.isMesh) return;
      mesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(bottomBorderColor),
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
    };
    bottomBorders.forEach(name => {
      const obj = scene.getObjectByName(name);
      if (!obj) return;
      if (obj.isMesh) applyColor(obj);
      else obj.traverse(c => { if (c.isMesh) applyColor(c); });
    });
  }, [scene, bottomBorderColor]);

  // ----------------------- APPLY DOOR COLOR -----------------------
  useEffect(() => {
    if (!scene || !doorColor || !doorRef.current) return;
    const applyColor = (mesh) => {
      if (!mesh.isMesh) return;
      mesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(doorColor),
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
    };
    if (doorRef.current.isMesh) applyColor(doorRef.current);
    else doorRef.current.traverse(c => { if(c.isMesh) applyColor(c); });
  }, [scene, doorColor]);

  // ----------------------- SCENE TRANSFORM & SHADOWS -----------------------
  useEffect(()=>{
    if(!scene || !threeScene) return;
    threeScene.background = null;
    scene.scale.set(2,2,2);
    scene.position.set(0.5,2.5,-1);
    scene.traverse(c=>{
      if(c.isMesh && c.name!=="Door"){c.castShadow=true;c.receiveShadow=true;}
    });
  },[scene, threeScene]);

  // ----------------------- EXPOSE API -----------------------
  useImperativeHandle(ref,()=>({
    toggleLEDLight1001(visible){if(ledLight1001Ref.current) ledLight1001Ref.current.visible=visible;}
  }));

  // ----------------------- RENDER -----------------------
  return (
    <Suspense fallback={null}>
      <Environment files="photo_studio_01_4k.hdr" background={false} intensity={1.2} />
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.3,0]} receiveShadow>
        <planeGeometry args={[1000,1000]} />
        <meshStandardMaterial color="#d8d8d8" roughness={0} metalness={0} visible={false}/>
      </mesh>
      <ContactShadows position={[0,-1.29,0]} opacity={1.5} scale={15} blur={2.5} far={10} />
      <OrbitControls enableDamping dampingFactor={0.12} rotateSpeed={1.1} zoomSpeed={1} panSpeed={0.8} enablePan minDistance={2.5} maxDistance={20} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2.05} target={[0,0.5,0]} makeDefault />
      {scene && <primitive object={scene} />}
    </Suspense>
  );
});
