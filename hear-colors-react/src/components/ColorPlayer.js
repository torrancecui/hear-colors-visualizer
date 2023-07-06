import React, { useState, useRef } from "react";
import { ColorNoteMapping } from "../ColorNoteMapping";
import { Canvas } from "@react-three/fiber";
import * as Tone from "tone";
import { attachEffectsChain, playSynth, stopSynth } from "./SynthUtils";
import {
  OrbitControls,
  ContactShadows,
  Sky,
  Environment,
} from "@react-three/drei";
import Cube from "./Cube";
export default function ColorPlayer() {
  const synth = new Tone.MonoSynth();
  attachEffectsChain(synth);

  const [selectedColors, setSelectedColors] = useState([]);

  function resetColors() {
    setSelectedColors([]);
    stopSynth();
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

    let index = -5;
    for (let color in ColorNoteMapping) {
      // calculate position in circle
      let angle =
        index * ((2 * Math.PI) / Object.keys(ColorNoteMapping).length);
      let x = radius * Math.cos(angle);
      let y = radius * Math.sin(angle);

      let hexColor = ColorNoteMapping[color][1];
      colorBar.push(
        <Cube
          position={[index * 1.4, -7, 0]}
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
        <Canvas orthographic camera={{ position: [-10, 10, 10], zoom: 100 }}>
          <ambientLight />
          <OrbitControls
            enabled={true}
            makeDefault={true}
            enableZoom={true}
            enablePan={true}
          />
          <pointLight position={[10, 10, 10]} />
          <Environment preset="city" />
          <ContactShadows
            frames={1}
            position={[0, -0.5, 0]}
            scale={10}
            opacity={0.4}
            far={1}
            blur={2}
          />
          <ColorBar></ColorBar>
          <Sky />
        </Canvas>
      </div>
      <div className="Buttons">
        <button
          onClick={() => {
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
