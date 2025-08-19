import React, { useEffect, useRef, useImperativeHandle, forwardRef, Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

useGLTF.preload("/models/UV.glb");

export const Experience = forwardRef(({ canopyColor, bottomBorderColor, doorColor, topPanelColor, ledVisible, onAssetLoaded }, ref) => {
  const { scene: threeScene, camera, gl } = useThree();
  const { scene } = useGLTF("/models/UV.glb", undefined, undefined, (loader) => {
    if (onAssetLoaded) onAssetLoaded();
  });

  const doorRef = useRef();
  const glassRef = useRef();
  const ledLight1001Ref = useRef();
  const pointLightRef = useRef();
  const ambientLightRef = useRef();
  const isDoorOpen = useRef(false);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  const canopyTextureRef = useRef(null);
  const canopyMeshRef = useRef(null);

  const sidePanel1MeshRef = useRef(null);
  const sidePanel1TextureRef = useRef(null);
  const sidePanel1OriginalMatRef = useRef(null);

  const sidePanel2MeshRef = useRef(null);
  const sidePanel2TextureRef = useRef(null);
  const sidePanel2OriginalMatRef = useRef(null);

  // --- Check UV mapping & store original materials ---
  useEffect(() => {
    if (!scene) return;

    const checkUV = (meshName) => {
      const obj = scene.getObjectByName(meshName);
      if (obj && obj.isMesh) {
        if (obj.geometry.attributes.uv) {
          console.log(`${meshName} ✅ has UV mapping`);
        } else {
          console.warn(`${meshName} ❌ has NO UV mapping`);
        }
      } else {
        console.warn(`${meshName} not found or not a mesh`);
      }
    };

    checkUV("SidePannel1");
    checkUV("SidePannel2");

    // canopy
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("canopy")) {
        canopyMeshRef.current = child;
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone();
        }
      }
    });

    // SidePannel1
    const sp1 = scene.getObjectByName("SidePannel1");
    if (sp1 && sp1.isMesh) {
      sidePanel1MeshRef.current = sp1;
      if (!sp1.userData.originalMaterial) {
        sp1.userData.originalMaterial = sp1.material.clone();
      }
      sidePanel1OriginalMatRef.current = sp1.userData.originalMaterial;
    }

    // SidePannel2
    const sp2 = scene.getObjectByName("SidePannel2");
    if (sp2 && sp2.isMesh) {
      sidePanel2MeshRef.current = sp2;
      if (!sp2.userData.originalMaterial) {
        sp2.userData.originalMaterial = sp2.material.clone();
      }
      sidePanel2OriginalMatRef.current = sp2.userData.originalMaterial;
    }
  }, [scene]);

  // --- Door, Lights, Click Logic ---
  useEffect(() => {
    if (!scene) return;

    const led = scene.getObjectByName("LEDLight1001");
    if (led) {
      ledLight1001Ref.current = led;
      led.visible = false;
    }

    doorRef.current = scene.getObjectByName("Door") || null;
    glassRef.current = scene.getObjectByName("Glass") || null;
    if (doorRef.current) doorRef.current.rotation.y = 0;
    if (glassRef.current) glassRef.current.rotation.y = 0;

    const pointLight = scene.getObjectByName("Point");
    if (pointLight) {
      pointLightRef.current = pointLight;
      pointLightRef.current.intensity = 1.2;
      pointLightRef.current.visible = false;
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    ambient.visible = false;
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const handleClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);

      const intersectsDoor = doorRef.current ? raycaster.current.intersectObject(doorRef.current, true) : [];
      const intersectsGlass = glassRef.current ? raycaster.current.intersectObject(glassRef.current, true) : [];

      if (intersectsDoor.length > 0 || intersectsGlass.length > 0) {
        const targetRotation = isDoorOpen.current ? 0 : Math.PI / 2;
        if (doorRef.current) gsap.to(doorRef.current.rotation, { y: targetRotation, duration: 1, ease: "power2.inOut" });
        if (glassRef.current) gsap.to(glassRef.current.rotation, { y: targetRotation, duration: 1, ease: "power2.inOut" });
        isDoorOpen.current = !isDoorOpen.current;
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [scene, gl, camera]);

  useEffect(() => {
    if (!ledLight1001Ref.current || !pointLightRef.current || !ambientLightRef.current) return;
    ledLight1001Ref.current.visible = ledVisible;
    pointLightRef.current.visible = ledVisible;
    ambientLightRef.current.visible = ledVisible;
  }, [ledVisible]);

  // --- Color Helper ---
  const applyColor = (objName, color) => {
    if (!scene) return;
    const obj = scene.getObjectByName(objName);
    if (!obj) return;
    obj.traverse(c => {
      if (c.isMesh) {
        c.material = color
          ? new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.3, metalness: 0.2, side: THREE.DoubleSide })
          : new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.3, metalness: 0.2, side: THREE.DoubleSide });
      }
    });
  };

  // --- Canopy Branding ---
  const applyCanopyTexture = (imageUrl) => {
    if (!canopyMeshRef.current) return;

    if (canopyTextureRef.current) {
      canopyTextureRef.current.dispose();
      canopyTextureRef.current = null;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const squeezeY = 0.4;
      const newHeight = img.height * squeezeY;
      const offsetY = (canvas.height - newHeight) / 2;

      ctx.drawImage(img, 0, offsetY, canvas.width, newHeight);

      const tex = new THREE.CanvasTexture(canvas);
      tex.encoding = THREE.sRGBEncoding;
      tex.anisotropy = 16;
      tex.flipY = false;

      canopyMeshRef.current.material = new THREE.MeshStandardMaterial({
        map: tex,
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.2,
        side: THREE.DoubleSide,
      });

      canopyTextureRef.current = tex;
    };

    img.crossOrigin = "anonymous";
    img.src = imageUrl;
  };

  const resetCanopy = () => {
    if (canopyMeshRef.current && canopyMeshRef.current.userData.originalMaterial) {
      canopyMeshRef.current.material = canopyMeshRef.current.userData.originalMaterial;
    }
    if (canopyTextureRef.current) {
      canopyTextureRef.current.dispose();
      canopyTextureRef.current = null;
    }
  };

  // --- Apply Side Panel 1 & 2 Texture ---
  const applySidePanelTexture = (imageUrl) => {
    const tex = new THREE.TextureLoader().load(
      imageUrl,
      (t) => {
        t.encoding = THREE.sRGBEncoding;
        t.anisotropy = 16;
        t.flipY = false;
        t.offset.y = -0.2;
        t.center.set(0.5, 0.5);
        t.rotation = Math.PI / 2;
        t.repeat.set(0.85, 3);
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;

        if (sidePanel1MeshRef.current) {
          sidePanel1MeshRef.current.material = new THREE.MeshStandardMaterial({
            map: t,
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide,
          });
          sidePanel1MeshRef.current.material.needsUpdate = true;
          sidePanel1TextureRef.current = t;
        }

        if (sidePanel2MeshRef.current) {
          sidePanel2MeshRef.current.material = new THREE.MeshStandardMaterial({
            map: t,
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide,
          });
          sidePanel2MeshRef.current.material.needsUpdate = true;
          sidePanel2TextureRef.current = t;
        }

        console.log("✅ Side panel 1 & 2 texture applied");
      }
    );
  };

  const resetSidePanel = () => {
    if (sidePanel1MeshRef.current && sidePanel1OriginalMatRef.current) {
      sidePanel1MeshRef.current.material = sidePanel1OriginalMatRef.current;
    }
    if (sidePanel2MeshRef.current && sidePanel2OriginalMatRef.current) {
      sidePanel2MeshRef.current.material = sidePanel2OriginalMatRef.current;
    }
    if (sidePanel1TextureRef.current) sidePanel1TextureRef.current.dispose();
    if (sidePanel2TextureRef.current) sidePanel2TextureRef.current.dispose();

    sidePanel1TextureRef.current = null;
    sidePanel2TextureRef.current = null;

    console.log("♻️ Side panels reset");
  };

  // --- Colors ---
  useEffect(() => {
    ["Kanopiborder1","Kanopiborder2","Kanopiborder3","Kanopiborder4"].forEach(name => applyColor(name, canopyColor));
  }, [canopyColor]);

  useEffect(() => {
    ["Bottomborder1","Bottomborder2"].forEach(name => applyColor(name, bottomBorderColor));
  }, [bottomBorderColor]);

  useEffect(() => { if (doorRef.current) applyColor("Door", doorColor); }, [doorColor]);
 useEffect(() => {
  ["Toppannel", "Back1", "Back2", "Back3", "Back4"].forEach((name) => {
    applyColor(name, topPanelColor);
  });
}, [topPanelColor]);


  // --- Scene Setup ---
  useEffect(() => {
    if (!scene || !threeScene) return;
    threeScene.background = null;
    scene.scale.set(2,2,2);
    scene.position.set(0.15,-1.1,-0.19);
    scene.traverse(c => { if (c.isMesh && c.name!=="Door") { c.castShadow = true; c.receiveShadow = true; } });
    
    if (onAssetLoaded) onAssetLoaded();
  }, [scene, threeScene, onAssetLoaded]);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      if (canopyTextureRef.current) canopyTextureRef.current.dispose();
      if (sidePanel1TextureRef.current) sidePanel1TextureRef.current.dispose();
      if (sidePanel2TextureRef.current) sidePanel2TextureRef.current.dispose();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    toggleLEDLight1001(visible) {
      if (ledLight1001Ref.current) ledLight1001Ref.current.visible = visible;
      if (pointLightRef.current) pointLightRef.current.visible = visible;
      if (ambientLightRef.current) ambientLightRef.current.visible = visible;
    },
    applyCanopyTexture,
    resetCanopy,
    applySidePanelTexture,  // ✅ now applies to both panels
    resetSidePanel
  }));

  return (
    <Suspense fallback={null}>
      {!ledVisible && <Environment 
        files="photo_studio_01_1k.hdr" 
        background={false} 
        intensity={1.2} 
        onLoad={onAssetLoaded}
      />}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.3,0]} receiveShadow>
        <planeGeometry args={[1000,1000]} />
        <meshStandardMaterial color="#d8d8d8" roughness={0} metalness={0} visible={false}/>
      </mesh>
      <ContactShadows position={[0,-1.42,0]} opacity={1.5} scale={15} blur={2.5} far={10} />
      <OrbitControls enableDamping dampingFactor={0.12} rotateSpeed={1.1} zoomSpeed={1} panSpeed={0.8} enablePan minDistance={2.5} maxDistance={20} minPolarAngle={Math.PI/6} maxPolarAngle={Math.PI/2.05} target={[0,0.5,0]} makeDefault />
      {scene && <primitive object={scene} />}
    </Suspense>
  );
});
