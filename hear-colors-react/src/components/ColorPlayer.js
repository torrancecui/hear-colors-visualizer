import React, { useState, useRef } from "react";
import { ColorNoteMapping } from "../ColorNoteMapping";
import { Canvas } from "@react-three/fiber";
import * as Tone from "tone";
import { attachEffectsChain, playSynth, stopSynth } from "./SynthUtils";

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
    let index = -5.5;
    for (let color in ColorNoteMapping) {
      let hexColor = ColorNoteMapping[color][1];
      colorBar.push(
        <ColorSphere
          position={[index, 0, 0]}
          color={hexColor}
          selected={selectedColors.includes(color)}
          onClick={() => processColorSelect(color)}
        ></ColorSphere>
      );
      index += 1;
    }
    return colorBar;
  }

  function ColorSphere(props) {
    const ref = useRef();
    return (
      <mesh {...props} ref={ref} scale={props.selected ? 1.3 : 1}>
        <sphereGeometry args={[0.5, 32, 16]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    );
  }

  return (
    <div className="ColorPlayer">
      <div className="Canvas">
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <ColorBar></ColorBar>
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
