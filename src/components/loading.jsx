// src/components/Loader.jsx
import React from "react";
import { Html, useProgress } from "@react-three/drei";

export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        background: "rgba(0,0,0,0.7)",
        padding: "20px 40px",
        borderRadius: 8,
        textAlign: "center",
      }}>
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}
