// src/components/BeamsDemo.jsx
import React from "react";
import Beams from "../blocks/Backgrounds/Beams/Beams.jsx";
import "../blocks/Backgrounds/Beams/Beams.css";

const BeamsDemo = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
    </div>
  );
};

export default BeamsDemo;
