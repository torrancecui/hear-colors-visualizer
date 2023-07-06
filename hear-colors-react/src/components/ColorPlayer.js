import React, { useState, useRef } from "react";
import { ColorNoteMapping } from "../ColorNoteMapping";
import { Canvas } from "@react-three/fiber";
import * as Tone from "tone";
import { attachEffectsChain, playSynth, stopSynth } from "./SynthUtils";
import {
  Cloud,
  PresentationControls,
  OrbitControls,
  ContactShadows,
  Sky,
  Environment,
} from "@react-three/drei";
import Cube from "./Cube";
import Gradient from "./Gradient";
export default function ColorPlayer() {
  const synth = new Tone.MonoSynth();
  attachEffectsChain(synth);

  const [selectedColors, setSelectedColors] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  function resetColors() {
    setSelectedColors([]);
    stopSynth();
    setIsPlaying(false);

    console.log(selectedColors);
  }

  function processColorSelect(color) {
    setSelectedColors((previousState) => {
      return [...previousState, color];
    });
    console.log(selectedColors);
  }

  function ColorBar() {
    let colorBar = [];
    let radius = 3;

    let index = -5.5;
    for (let color in ColorNoteMapping) {
      // calculate position in circle
      let angle =
        index * ((2 * Math.PI) / Object.keys(ColorNoteMapping).length);
      let x = radius * Math.cos(angle);
      let y = radius * Math.sin(angle);

      let hexColor = ColorNoteMapping[color][1];
      colorBar.push(
        <Cube
          // rotation={[0, 0, 0]}
          position={[index * 1.3, -4, 0]}
          color={hexColor}
          selected={selectedColors.includes(color)}
          onClick={() => processColorSelect(color)}
        ></Cube>
      );
      index += 1;
    }
    return colorBar;
  }

  // function ColorSphere(props) {
  //   const ref = useRef();
  //   return (
  //     <mesh {...props} ref={ref} scale={props.selected ? 1.3 : 1}>
  //       <sphereGeometry args={[0.5, 32, 16]} />
  //       <meshStandardMaterial color={props.color} />
  //     </mesh>
  //   );
  // }

  return (
    <div className="ColorPlayer">
      <div className="Canvas">
        <Canvas
          shadows
          orthographic
          camera={{ position: [-10, 5, 10], zoom: 50 }}
        >
          <Sky
            distance={450000}
            sunPosition={[100, 90, 100]}
            inclination={0}
            azimuth={0.2}
          />

          <OrbitControls
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            enableZoom={false}
            enablePan={false}
          />
          <pointLight position={[20, 50, 10]} castShadow />
          <Environment preset="city" />

          {/* <PresentationControls
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 300 }}
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          > */}
          <Gradient
            isPlaying={isPlaying}
            colors={selectedColors.length > 0 && selectedColors}
          />
          <ColorBar></ColorBar>
          {/* </PresentationControls> */}
        </Canvas>
      </div>
      <div className="Buttons">
        <button
          onClick={() => {
            setIsPlaying(true);

            playSynth(synth, selectedColors);
          }}
          disabled={
            // must select at least one color
            Object.keys(selectedColors).length === 0 ||
            // must be less than five to constrain octaves
            Object.keys(selectedColors).length > 5
          }
        >
          play
        </button>
        <button
          onClick={() => {
            resetColors();
          }}
        >
          reset
        </button>
      </div>
    </div>
  );
}
