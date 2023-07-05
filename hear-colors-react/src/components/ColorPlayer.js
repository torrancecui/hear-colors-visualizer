import React, { useState, useRef } from "react";
import { ColorNoteMapping } from "../ColorNoteMapping";
import { Canvas } from "@react-three/fiber";
import * as Tone from "tone";

export default function ColorPlayer() {
  const filter = new Tone.Filter(1000, "lowpass").toDestination();
  const reverb = new Tone.Reverb(6).connect(filter);
  const pingPong = new Tone.PingPongDelay("8n", 0.3).connect(reverb);
  const synth = new Tone.MonoSynth().connect(pingPong);

  const [selectedColors, setSelectedColors] = useState([]);

  function convertColorsToNotes(selectedColors) {
    let notes = [];
    let octaveIndex = 1;
    for (const color of selectedColors) {
      let [noteName, hexColor] = ColorNoteMapping[color];
      notes.push(noteName + octaveIndex.toString());
      octaveIndex++;
    }
    return notes;
  }

  function playSynth(selectedColors) {
    let notes = convertColorsToNotes(selectedColors);
    var pattern = new Tone.Pattern(function (time, note) {
      synth.triggerAttackRelease(note, 0.125);
    }, notes);
    pattern.start(0);
    Tone.Transport.start();
  }

  function stopSynth() {
    Tone.Transport.stop();
    setSelectedColors([]);
    console.log(selectedColors);
  }

  function processClick(color) {
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
          onClick={() => processClick(color)}
        ></ColorSphere>
      );
      index += 1;
    }
    return colorBar;
  }

  function ColorSphere(props) {
    const ref = useRef();
    return (
      <mesh {...props} ref={ref}>
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
          onClick={playSynth(selectedColors)}
          disabled={
            // must select at least one color
            Object.keys(selectedColors).length === 0 ||
            // must be less than five to constrain octaves
            Object.keys(selectedColors).length > 5
          }
        >
          play
        </button>
        <button onClick={stopSynth}>reset</button>
      </div>
    </div>
  );
}
