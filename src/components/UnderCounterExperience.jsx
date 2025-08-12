import React, { useEffect, useRef, useImperativeHandle, forwardRef, Suspense } from "react";
import { useThree } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const TARGET_GROUPS = [
  "Drawer-09001", "Drawer-03001", "Drawer-05", "Drawer-08",
  "Drawer-07", "Drawer-04", "Drawer-03", "Drawer-02", "Drawer-01001",
];

const CLOSED_Z = -0.327;
const OPEN_Z = 0;

const DOORS = ["Door_01", "Door_02", "Door_03"];
const PANELS = ["Door_Inside_Panel___01", "Door_Inside_Panel___02", "Door_Inside_Panel___03"];

const doorConfig = {
  Door_01: { axis: "z", angle: 90 },
  Door_02: { axis: "z", angle: -90 },
  Door_03: { axis: "z", angle: -90 }
};

const positionConfigs = {
  1: {
    1: { doors: ["Door_01"], panels: [PANELS[0]], hiddenDrawers: ["Drawer-01001", "Drawer-04", "Drawer-07","Door_02","Door_03","Drawer-01_Inside_Panal"] },
    2: { doors: ["Door_02"], panels: [PANELS[1]], hiddenDrawers: ["Drawer-05", "Drawer-08", "Drawer-02","Door_03","Door_01","Drawer-02_Inside_Panal"] },
    3: { doors: ["Door_03"], panels: [PANELS[2]], hiddenDrawers: ["Drawer-03", "Drawer-09001", "Drawer-03001","Door_01","Door_02","Drawer-03_Inside_Panal"] }
  },
  2: {
    1: { doors: ["Door_01", "Door_02"], panels: [PANELS[0], PANELS[1]], hiddenDrawers: ["Drawer-01001", "Drawer-05", "Drawer-02", "Drawer-08", "Drawer-07","Drawer-04","Door_03","Drawer-01_Inside_Panal","Drawer-02_Inside_Panal"] },
    2: { doors: ["Door_01", "Door_03"], panels: [PANELS[0], PANELS[2]], hiddenDrawers: ["Drawer-01001","Drawer-04", "Drawer-03", "Drawer-03001","Drawer-09001","Drawer-07","Door_02","Drawer-01_Inside_Panal","Drawer-03_Inside_Panal"] },
    3: { doors: ["Door_02", "Door_03"], panels: [PANELS[1], PANELS[2]], hiddenDrawers: ["Drawer-08", "Drawer-09001", "Drawer-05","Drawer-02","Drawer-03","Drawer-03001","Door_01","Drawer-03_Inside_Panal","Drawer-02_Inside_Panal"] }
  },
  3: {
    1: { doors: DOORS, panels: PANELS, hiddenDrawers: [
                                                  "Drawer-01001", "Drawer-04", "Drawer-07","Drawer-01_Inside_Panal",
                                                  "Drawer-05", "Drawer-08", "Drawer-02","Drawer-02_Inside_Panal",
                                                  "Drawer-03", "Drawer-09001", "Drawer-03001","Drawer-03_Inside_Panal"
                                                        ] }
  }
};

useGLTF.preload("/models/08.glb");

export const Experience = forwardRef(({ lighting = "photo_studio_01_4k.hdr", metalness = 1, roughness = 0.4, lightSettings = {} }, ref) => {
  const { scene: threeScene, camera, gl } = useThree();
  const { scene } = useGLTF("/models/08.glb");

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const allObjects = useRef({});
  const activeDrawers = useRef([]);
  const activeDoors = useRef([]);
  const drawerStates = useRef({});
  const doorStates = useRef({});
  const logoRef = useRef(null);
  const logo2Ref = useRef(null);
  const lastSelectionRef = useRef({ doors: [], panels: [], drawers: [] });
  const initialRotations = useRef({});

  const dirLightRef = useRef();
  const ambientLightRef = useRef();

  const findParentInList = (obj, names) => {
    while (obj) {
      if (names.includes(obj.name)) return obj;
      obj = obj.parent;
    }
    return null;
  };

  const updateActiveObjects = () => {
    activeDrawers.current = TARGET_GROUPS.filter(n => allObjects.current[n]?.visible).map(n => allObjects.current[n]);
    activeDoors.current = DOORS.filter(n => allObjects.current[n]?.visible).map(n => allObjects.current[n]);
  };

  const animateDoor = (doorName, open) => {
    const door = allObjects.current[doorName];
    if (!door) return;
    const config = doorConfig[doorName];
    const targetRotation = new THREE.Euler().copy(initialRotations.current[doorName]);
    if (open) targetRotation[config.axis] += THREE.MathUtils.degToRad(config.angle);
    gsap.to(door.rotation, { x: targetRotation.x, y: targetRotation.y, z: targetRotation.z, duration: 0.8, ease: "power2.out" });
    doorStates.current[doorName] = open ? "open" : "closed";
  };

  // NEW: Update logo visibility based on Door_03 and Drawer-03 visibility
  const updateLogoVisibility = () => {
    const door3 = allObjects.current["Door_03"];
    const drawer3 = allObjects.current["Drawer-03"];
    if (!door3 || !drawer3 || !logoRef.current || !logo2Ref.current) return;

    if (door3.visible) {
      // Door_03 visible → Logo hidden, Logo2 visible
      logoRef.current.visible = false;
      logo2Ref.current.visible = true;
    } else if (drawer3.visible) {
      // Drawer-03 visible → Logo2 hidden, Logo visible
      logo2Ref.current.visible = false;
      logoRef.current.visible = true;
    } else {
      // Neither visible, default to Logo visible, Logo2 hidden
      logoRef.current.visible = true;
      logo2Ref.current.visible = false;
    }
  };

  const resetToDefault = () => {
    scene.traverse((child) => {
      if ([...DOORS, ...PANELS].includes(child.name)) child.visible = false;
      if (TARGET_GROUPS.includes(child.name)) {
        child.position.z = CLOSED_Z;
        child.visible = true;
        drawerStates.current[child.name] = "closed";
      }
      if (DOORS.includes(child.name)) {
        child.rotation.copy(initialRotations.current[child.name]);
        doorStates.current[child.name] = "closed";
      }
    });
    if (logoRef.current) logoRef.current.position.set(0.522, 0.722, 0.39);
    if (logo2Ref.current) logo2Ref.current.visible = false;
    updateActiveObjects();
    updateLogoVisibility();  // Update logos on reset
    lastSelectionRef.current = { doors: [], panels: [], drawers: [] };
  };

  // Initialization: run only on scene, gl, camera, threeScene changes (exclude metalness, roughness)
  useEffect(() => {
    if (!scene) return;
    threeScene.background = null;
    scene.scale.set(2, 2, 2);
    scene.position.set(0, -1.2, 0);

    scene.traverse((child) => {
      if (!child || !child.name) return;
      allObjects.current[child.name] = child;

      if (DOORS.includes(child.name)) {
        initialRotations.current[child.name] = new THREE.Euler().copy(child.rotation);
        doorStates.current[child.name] = "closed";
        child.visible = false;
      }

      if (PANELS.includes(child.name)) child.visible = false;

      if (child.name === "Logo" || child.name === "Logo.001") {
        child.position.set(0.522, 0.722, 0.39);
        logoRef.current = child;
      }

      if (child.name === "Logo2") {
        logo2Ref.current = child;
        logo2Ref.current.visible = false; // Hide Logo2 initially
      }

      if (child.isMesh && child.material?.isMeshStandardMaterial) {
        child.material.metalness = metalness;
        child.material.roughness = roughness;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }

      if (TARGET_GROUPS.includes(child.name)) {
        child.position.z = CLOSED_Z;
        drawerStates.current[child.name] = "closed";
      }
    });

    updateActiveObjects();
    updateLogoVisibility();

    const handleClick = (event) => {
      const { left, top, width, height } = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - left) / width) * 2 - 1;
      mouse.current.y = -((event.clientY - top) / height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);

      // Drawers
      const drawerIntersects = raycaster.current.intersectObjects(activeDrawers.current, true);
      if (drawerIntersects.length > 0) {
        const parent = findParentInList(drawerIntersects[0].object, TARGET_GROUPS);
        if (parent) {
          const name = parent.name;
          const isOpen = drawerStates.current[name] === "open";
          gsap.to(parent.position, { z: isOpen ? CLOSED_Z : OPEN_Z, duration: 0.5, ease: "power2.out" });
          drawerStates.current[name] = isOpen ? "closed" : "open";

          if (name === "Drawer-03" && logoRef.current) {
            gsap.to(logoRef.current.position, { z: isOpen ? 0.39 : 0.718, duration: 0.5, ease: "power2.out" });
          }

          updateLogoVisibility(); // Update logos after drawer click
        }
        return;
      }

      // Doors
      const doorIntersects = raycaster.current.intersectObjects(activeDoors.current, true);
      if (doorIntersects.length > 0) {
        const doorName = findParentInList(doorIntersects[0].object, DOORS)?.name;
        if (doorName) {
          animateDoor(doorName, doorStates.current[doorName] !== "open");
          updateLogoVisibility(); // Update logos after door click
        }
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [scene, gl, camera, threeScene]); // <-- Removed metalness and roughness from here

  // Update material properties only on metalness or roughness changes
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh && child.material?.isMeshStandardMaterial) {
        child.material.metalness = metalness;
        child.material.roughness = roughness;
        child.material.needsUpdate = true;
      }
    });
  }, [metalness, roughness, scene]);

  useEffect(() => {
    if (dirLightRef.current) {
      dirLightRef.current.intensity = lightSettings?.directional?.intensity ?? 1;
      dirLightRef.current.color = new THREE.Color(lightSettings?.directional?.color ?? "#ffffff");
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = lightSettings?.ambient?.intensity ?? 1;
      ambientLightRef.current.color = new THREE.Color(lightSettings?.ambient?.color ?? "#ffffff");
    }
  }, [lightSettings]);

  useImperativeHandle(ref, () => ({
    resetToDefault,
    setDoorSelection(doorCount, position) {
      resetToDefault();
      if (!doorCount || !position) return;
      const config = positionConfigs[doorCount]?.[position];
      if (!config) return;
      config.doors.forEach(n => { if (allObjects.current[n]) { allObjects.current[n].visible = true; animateDoor(n, false); } });
      config.panels.forEach(n => { if (allObjects.current[n]) allObjects.current[n].visible = true; });
      config.hiddenDrawers.forEach(n => { if (allObjects.current[n]) allObjects.current[n].visible = false; });
      updateActiveObjects();
      lastSelectionRef.current = { doors: [...config.doors], panels: [...config.panels], drawers: [...config.hiddenDrawers] };

      updateLogoVisibility();  // Update logos after door selection change
    }
  }));

  return (
    <Suspense fallback={null}>
      {/* reloads HDRI when lighting changes */}
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
        <meshStandardMaterial color="#d8d8d8" roughness={5} metalness={0}/>
       
      </mesh>

      <ContactShadows position={[0, -1.29, 0]} opacity={1} scale={15} blur={2.5} far={10} />

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
});
