import * as Tone from "tone";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { colorNoteMapping } from "../colorNoteMapping";
import "./App.css";

export default function App() {
  const filter = new Tone.Filter(1000, "lowpass").toDestination();
  const reverb = new Tone.Reverb(6).connect(filter);
  const pingPong = new Tone.PingPongDelay("8n", 0.3).connect(reverb);
  const synth = new Tone.MonoSynth().connect(pingPong);

  const [selectedNotes, setSelectedNotes] = useState([]);

  function playSynth(notes) {
    var pattern = new Tone.Pattern(function (time, note) {
      synth.triggerAttackRelease(note, 0.125);
    }, selectedNotes);
    pattern.start(0);
    Tone.Transport.start();
  }

  function stopSynth() {
    Tone.Transport.stop();
    setSelectedNotes([]);
    console.log(selectedNotes);
  }

  function processClick(noteName) {
    setSelectedNotes((previousState) => {
      return [...previousState, noteName];
    });
    console.log(selectedNotes);
  }

  function ColorBar(props) {
    let colorBar = [];
    let index = -5.5;
    for (let note in colorNoteMapping) {
      let hexColor = colorNoteMapping[note][1];
      let noteName = colorNoteMapping[note][0];
      colorBar.push(
        <ColorSphere
          position={[index, 0, 0]}
          color={hexColor}
          onClick={() => processClick(noteName)}
          noteName={noteName}
        ></ColorSphere>
      );
      index += 1;
    }
    return colorBar;
  }

  function ColorSphere(props) {
    const ref = useRef();
    return (
      <mesh
        {...props}
        ref={ref}
        scale={props.noteName in selectedNotes ? 1.3 : 1}
      >
        <sphereGeometry args={[0.5, 32, 16]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    );
  }

  return (
    <div className="App">
      <div className="Header">how to hear colors.</div>
      <div className="Canvas">
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <ColorBar></ColorBar>
        </Canvas>
      </div>
      <div>current notes: {...selectedNotes}</div>
      <div className="Buttons">
        <button
          onClick={playSynth}
          disabled={Object.keys(selectedNotes).length == 0}
        >
          play
        </button>
        <button onClick={stopSynth}>reset</button>
      </div>
    </div>
  );
}
