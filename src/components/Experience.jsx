import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const TARGET_GROUPS = [
  "Drawer-09001",
  "Drawer-03001",
  "Drawer-05",
  "Drawer-08",
  "Drawer-07",
  "Drawer-04",
  "Drawer-03",
  "Drawer-02",
  "Drawer-01001",
];

const CLOSED_Z = -0.327;
const OPEN_Z = 0;

export const Experience = forwardRef((props, ref) => {
  const gltf = useGLTF("/models/latest.glb");
  const scene = gltf.scene;
  const { camera, gl, scene: threeScene } = useThree();

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const allObjects = useRef({});
  const activeDrawers = useRef([]);
  const activeDoors = useRef([]);
  const drawerStates = useRef({});
  const doorStates = useRef({});
  const logoRef = useRef(null);
  const lastSelectionRef = useRef({ doors: [], panels: [], drawers: [] });
  const initialRotations = useRef({});
  const initialVisibility = useRef({});
  const initialPositions = useRef({});

  // Door configuration
  const doorConfig = {
    Door_01: { axis: 'z', angle: 90 },
    Door_02: { axis: 'z', angle: -90 },
    Door_03: { axis: 'z', angle: -90 }
  };

  // Complete position configurations
  const positionConfigs = {
    1: { // 1-Door
      1: {
        doors: ["Door_01"],
        panels: ["Door_Inside_Panel___01"],
        hiddenDrawers: ["Drawer-01001", "Drawer-04", "Drawer-07","Door_02","Door_03"]
      },
      2: {
        doors: ["Door_02"],
        panels: ["Door_Inside_Panel___02"],
        hiddenDrawers: ["Drawer-05", "Drawer-08", "Drawer-02","Door_03","Door_01"]
      },
      3: {
        doors: ["Door_03"],
        panels: ["Door_Inside_Panel___03"],
        hiddenDrawers: ["Drawer-03", "Drawer-09001", "Drawer-03001","Door_01","Door_02"]
      }
    },
    2: { // 2-Door
      1: {
        doors: ["Door_01", "Door_02"],
        panels: ["Door_Inside_Panel___01", "Door_Inside_Panel___02"],
        hiddenDrawers: ["Drawer-01001", "Drawer-05", "Drawer-02", "Drawer-08", "Drawer-07","Drawer-04" ,"Door_03"]
      },
      2: {
        doors: ["Door_01", "Door_03"],
        panels: ["Door_Inside_Panel___01", "Door_Inside_Panel___03"],
        hiddenDrawers: ["Drawer-01001","Drawer-04", "Drawer-03", "Drawer-03001","Drawer-09001","Drawer-07","Door_02"]
      },
      3: {
        doors: ["Door_02", "Door_03"],
        panels: ["Door_Inside_Panel___02", "Door_Inside_Panel___03"],
        hiddenDrawers: ["Drawer-08", "Drawer-09001", "Drawer-05","Drawer-02","Drawer-03","Drawer-03001","Door_01"]
      }
    },
    3: { // 3-Door
      1: {
        doors: ["Door_01", "Door_02", "Door_03"],
        panels: ["Door_Inside_Panel___01", "Door_Inside_Panel___02", "Door_Inside_Panel___03"],
        hiddenDrawers: [ "Drawer-09001",
  "Drawer-03001",
  "Drawer-05",
  "Drawer-08",
  "Drawer-07",
  "Drawer-04",
  "Drawer-03",
  "Drawer-02",
  "Drawer-01001"]
      }
    }
  };

  const findParentInList = (obj, names) => {
    while (obj) {
      if (names.includes(obj.name)) return obj;
      obj = obj.parent;
    }
    return null;
  };

  const animateDoor = (doorName, open) => {
    const door = allObjects.current[doorName];
    if (!door) return;
    
    const config = doorConfig[doorName];
    if (!config) return;

    const targetRotation = new THREE.Euler().copy(initialRotations.current[doorName]);
    if (open) {
      targetRotation[config.axis] += THREE.MathUtils.degToRad(config.angle);
    }

    gsap.to(door.rotation, {
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      duration: 0.8,
      ease: "power2.out"
    });

    doorStates.current[doorName] = open ? "open" : "closed";
  };

  const updateActiveObjects = () => {
    activeDrawers.current = TARGET_GROUPS
      .filter(name => allObjects.current[name]?.visible)
      .map(name => allObjects.current[name]);

    activeDoors.current = ["Door_01", "Door_02", "Door_03"]
      .filter(name => allObjects.current[name]?.visible)
      .map(name => allObjects.current[name]);
  };

  const resetToDefault = () => {
  scene.traverse((child) => {
    // Force hide all doors and panels
    if ([
      "Door_01", "Door_02", "Door_03",
      "Door_Inside_Panel___01", "Door_Inside_Panel___02", "Door_Inside_Panel___03"
    ].includes(child.name)) {
      child.visible = false;
    }

    // Reset drawer positions
    if (TARGET_GROUPS.includes(child.name)) {
      child.position.z = CLOSED_Z;
      drawerStates.current[child.name] = "closed";
      child.visible = true; // Ensure drawers are visible unless specifically hidden
    }

    // Reset door states
    if (["Door_01", "Door_02", "Door_03"].includes(child.name)) {
      child.rotation.copy(initialRotations.current[child.name]);
      doorStates.current[child.name] = "closed";
    }
  });

  // Reset logo position
  if (logoRef.current) {
    logoRef.current.position.set(0.522, 0.722, 0.39);
  }

  updateActiveObjects();
  lastSelectionRef.current = { doors: [], panels: [], drawers: [] };
};

  useEffect(() => {
    if (!scene) return;

    threeScene.background = null;
    scene.scale.set(2, 2, 2);
    scene.position.set(0, -1.2, 0);

    scene.traverse((child) => {
      allObjects.current[child.name] = child;
      initialVisibility.current[child.name] = child.visible;
      initialPositions.current[child.name] = child.position.clone();

      // Store initial rotations for all doors
      if (["Door_01", "Door_02", "Door_03"].includes(child.name)) {
        initialRotations.current[child.name] = new THREE.Euler().copy(child.rotation);
        doorStates.current[child.name] = "closed";
      }

      // Hide all doors and panels by default
      if ([
        "Door_01",
        "Door_02",
        "Door_03",
        "Door_Inside_Panel___01",
        "Door_Inside_Panel___02",
        "Door_Inside_Panel___03"
      ].includes(child.name)) {
        child.visible = false;
      }

      // Logo setup
      if (child.name === "Logo" || child.name === "Logo.001") {
        child.position.set(0.522, 0.722, 0.39);
        logoRef.current = child;
      }

      // Material adjustments
      if (child.isMesh && child.material?.isMeshStandardMaterial) {
        child.material.metalness = 1;
        child.material.roughness = 0.3;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }

      // Initialize drawers
      if (TARGET_GROUPS.includes(child.name)) {
        if (child.position) child.position.z = CLOSED_Z;
        drawerStates.current[child.name] = "closed";
      }
    });

    updateActiveObjects();

    const handleClick = (event) => {
      const { left, top, width, height } = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - left) / width) * 2 - 1;
      mouse.current.y = -((event.clientY - top) / height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      
      // First check for visible drawers
      const drawerIntersects = raycaster.current.intersectObjects(
        activeDrawers.current,
        true
      );

      if (drawerIntersects.length > 0) {
        const clickedObject = drawerIntersects[0].object;
        const parent = findParentInList(clickedObject, TARGET_GROUPS);
        if (parent) {
          const name = parent.name;
          const isOpen = drawerStates.current[name] === "open";

          gsap.to(parent.position, {
            z: isOpen ? CLOSED_Z : OPEN_Z,
            duration: 0.5,
            ease: "power2.out",
          });

          drawerStates.current[name] = isOpen ? "closed" : "open";

          if (name === "Drawer-03" && logoRef.current) {
            gsap.to(logoRef.current.position, {
              z: isOpen ? 0.39 : 0.718,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        }
        return;
      }

      // Then check for door clicks
      const doorIntersects = raycaster.current.intersectObjects(
        activeDoors.current,
        true
      );

      if (doorIntersects.length > 0) {
        const clickedObject = doorIntersects[0].object;
        const doorName = findParentInList(clickedObject, ["Door_01", "Door_02", "Door_03"])?.name;
        
        if (doorName) {
          const isOpen = doorStates.current[doorName] === "open";
          animateDoor(doorName, !isOpen);
        }
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [scene, gl, camera, threeScene]);

  useImperativeHandle(ref, () => ({
    resetToDefault,
    
    setDoorSelection(doorCount, position) {
      // First reset to default state
      this.resetToDefault();
      
      if (!doorCount || !position) return;

      const config = positionConfigs[doorCount]?.[position];
      if (!config) return;

      // Apply new selection
      config.doors.forEach(name => {
        if (allObjects.current[name]) {
          allObjects.current[name].visible = true;
          animateDoor(name, false); // Start closed
        }
      });
      config.panels.forEach(name => {
        if (allObjects.current[name]) allObjects.current[name].visible = true;
      });
      config.hiddenDrawers.forEach(name => {
        if (allObjects.current[name]) allObjects.current[name].visible = false;
      });

      updateActiveObjects();

      lastSelectionRef.current = {
        doors: [...config.doors],
        panels: [...config.panels],
        drawers: [...config.hiddenDrawers]
      };
    }
  }));

  return (
    <>
      <Environment files="/brown_photostudio_02_4k.hdr" background={false} intensity={1.2} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        
      />
      <ambientLight intensity={0.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#d8d8d8" roughness={5} metalness={0} />
      </mesh>
      <ContactShadows position={[0, -1.29, 0]} opacity={1} scale={15} blur={2.5} far={10} />
      <OrbitControls
        enableDamping
        dampingFactor={0.15}
        rotateSpeed={1.2}
        zoomSpeed={0.8}
        panSpeed={0.4}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
      {scene && <primitive object={scene} />}
    </>
  );
});