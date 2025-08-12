import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  Suspense,
  useState,
} from "react";
import { useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

useGLTF.preload("/models/Visilatest.glb");

export const Experience = forwardRef(
  (
    {
      lighting = "billiard_hall_4k.hdr",
      metalness = 1,
      roughness = 0.4,
      lightSettings = {},
    },
    ref
  ) => {
    const { scene: threeScene, camera, gl } = useThree();
    const { scene } = useGLTF("/models/Visilatest.glb");

    const doorRef = useRef();
    const glassRef = useRef(); // Added glass ref
    const dirLightRef = useRef();
    const ambientLightRef = useRef();

    const isDoorOpen = useRef(false);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());

    const ledLight1001Ref = useRef();
    const [ledLightOn, setLedLightOn] = useState(false);

    // One shared red material for Door
    const redMaterial = useRef(new THREE.MeshStandardMaterial({ color: "grey" }));

    useEffect(() => {
      // Find LED light
      const led1 = scene.getObjectByName("LEDLight1001");
      if (led1) {
        ledLight1001Ref.current = led1;
        led1.visible = false;
      }

      // Find Door mesh/group
      const doorObj = scene.getObjectByName("Door");
      doorRef.current = doorObj;

      // Find Glass mesh
      const glassObj = scene.getObjectByName("Glass");
      glassRef.current = glassObj;

      // Assign red material to Door mesh or Door group children
      if (doorObj) {
        if (doorObj.isMesh) {
          doorObj.material = redMaterial.current;
          doorObj.material.needsUpdate = true;
        } else if (doorObj.isGroup) {
          doorObj.children.forEach((child) => {
            if (child.isMesh) {
              child.material = redMaterial.current;
              child.material.needsUpdate = true;
            }
          });
        }
      }

      // Initialize rotation
      if (doorRef.current) {
        doorRef.current.rotation.y = 0;
      }
      if (glassRef.current) {
        glassRef.current.rotation.y = 0;
      }

      // Handle click to toggle door + glass rotation
      const handleClick = (event) => {
  const rect = gl.domElement.getBoundingClientRect();
  mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.current.setFromCamera(mouse.current, camera);

  // Check intersects against both Door and Glass
  const intersectsDoor = raycaster.current.intersectObject(doorRef.current, true);
  const intersectsGlass = glassRef.current
    ? raycaster.current.intersectObject(glassRef.current, true)
    : [];

  if (intersectsDoor.length > 0 || intersectsGlass.length > 0) {
    const targetRotation = isDoorOpen.current ? 0 : Math.PI / 2;

    gsap.to(doorRef.current.rotation, {
      y: targetRotation,
      duration: 1,
      ease: "power2.inOut",
    });

    if (glassRef.current) {
      gsap.to(glassRef.current.rotation, {
        y: targetRotation,
        duration: 1,
        ease: "power2.inOut",
      });
    }

    isDoorOpen.current = !isDoorOpen.current;
  }
};


      gl.domElement.addEventListener("click", handleClick);
      return () => {
        gl.domElement.removeEventListener("click", handleClick);
      };
    }, [scene, gl, camera]);

    const resetToDefault = () => {
      if (camera) {
        gsap.to(camera.position, {
          x: 5,
          y: 3,
          z: 8,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    };

    const setDoorSelection = (doorCount, position) => {
      console.log("Visicooler setDoorSelection called:", doorCount, position);
    };

    const toggleLEDLight1001 = (visible) => {
      if (ledLight1001Ref.current) {
        ledLight1001Ref.current.visible = visible;
        setLedLightOn(visible);
      }
    };

    useImperativeHandle(ref, () => ({
      resetToDefault,
      setDoorSelection,
      toggleLEDLight1001,
    }));

    useEffect(() => {
      if (!scene || !threeScene) return;

      threeScene.background = null;
      scene.scale.set(2, 2, 2);
      scene.position.set(0, -1.2, 0);

      scene.traverse((child) => {
        // Skip Door material to keep redMaterial
        if (
          child.isMesh &&
          child.material?.isMeshStandardMaterial &&
          child.name !== "Door"
        ) {
          child.material.metalness = metalness;
          child.material.roughness = roughness;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }, [scene, threeScene, metalness, roughness]);

    useEffect(() => {
      if (dirLightRef.current) {
        dirLightRef.current.intensity = lightSettings?.directional?.intensity ?? 1;
        dirLightRef.current.color = new THREE.Color(
          lightSettings?.directional?.color ?? "#ffffff"
        );
      }
      if (ambientLightRef.current) {
        ambientLightRef.current.intensity = lightSettings?.ambient?.intensity ?? 1;
        ambientLightRef.current.color = new THREE.Color(
          lightSettings?.ambient?.color ?? "#ffffff"
        );
      }
    }, [lightSettings]);

    return (
      <Suspense fallback={null}>
        <Environment files={`/${lighting}`} background={false} intensity={1.2} />

        <directionalLight
          ref={dirLightRef}
          position={[5, 5, 25]}
          intensity={lightSettings?.directional?.intensity ?? 1}
          color={lightSettings?.directional?.color ?? "#ffffff"}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <ambientLight
          ref={ambientLightRef}
          intensity={lightSettings?.ambient?.intensity ?? 1}
          color={lightSettings?.ambient?.color ?? "#ffffff"}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#d8d8d8" roughness={5} metalness={0} />
        </mesh>

        <ContactShadows
          position={[0, -1.29, 0]}
          opacity={1.5}
          scale={15}
          blur={2.5}
          far={10}
        />

        <OrbitControls
          enableDamping
          dampingFactor={0.12}
          rotateSpeed={1.1}
          zoomSpeed={1.0}
          panSpeed={0.8}
          enablePan
          minDistance={2.5}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.5, 0]}
          makeDefault
        />

        {scene && <primitive object={scene} />}
      </Suspense>
    );
  }
);
