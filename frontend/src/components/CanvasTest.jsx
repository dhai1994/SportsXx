// src/components/CanvasTest.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";

const CanvasTest = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <ambientLight />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default CanvasTest;
