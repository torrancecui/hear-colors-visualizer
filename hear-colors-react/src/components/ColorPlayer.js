import React, { useEffect, useMemo, useState } from "react";
import { ColorNoteMapping } from "../ColorNoteMapping";
import { Canvas } from "@react-three/fiber";
import * as Tone from "tone";
import { IconButton } from "rsuite";
import { Reload } from "@rsuite/icons";
import { attachEffectsChain, playSynth, stopSynth } from "./SynthUtils";

import {
  PresentationControls,
  // OrbitControls,
  // ContactShadows,
  Sky,
  Environment,
} from "@react-three/drei";
import Cube from "./Cube";
import Gradient from "./Gradient";

export default function ColorPlayer() {
  const synth = useMemo(() => {
    return new Tone.MonoSynth();
  }, []);
  let arpeggiator = useMemo(() => {
    return new Tone.Pattern();
  }, []);

  attachEffectsChain(synth);

  const [selectedColors, setSelectedColors] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // auto reset & resume synth when colors are added/removed during playback
  useEffect(() => {
    stopSynth();
    playSynth(arpeggiator, synth, selectedColors);
    Object.keys(selectedColors).length === 0
      ? setIsPlaying(false)
      : setIsPlaying(true);
  }, [arpeggiator, synth, isPlaying, selectedColors]);

  function resetSynth() {
    setSelectedColors([]);
    stopSynth();
    setIsPlaying(false);
  }

  function processColorClick(color) {
    // if color is already selected we remove from state array, else we add to state array
    if (selectedColors.includes(color)) {
      setSelectedColors((previousState) => {
        return previousState.filter(function (element) {
          return element !== color;
        });
      });
    } else {
      Object.keys(selectedColors).length > 4
        ? alert("Maximum colors reached.")
        : setSelectedColors((previousState) => {
            return [...previousState, color];
          });
    }
  }

  function ColorBar() {
    let colorBar = [];
    let index = -2;
    for (let color in ColorNoteMapping) {
      let hexColor = ColorNoteMapping[color][1];
      colorBar.push(
        <Cube
          position={[index * 1.4, -4, 0]}
          color={hexColor}
          selected={selectedColors.includes(color)}
          onClick={() => {
            processColorClick(color);
          }}
        ></Cube>
      );
      index += 1;
    }
    return colorBar;
  }

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
          <pointLight position={[20, 50, 10]} castShadow />
          <Environment preset="city" />

          {/* <OrbitControls
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            enableZoom={false}
            enablePan={false}
          /> */}
          {/* You can uncomment this and comment out ^OrbitControls if you want to try different controls */}
          <PresentationControls
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 300 }}
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Gradient
              isPlaying={isPlaying}
              colors={selectedColors.length > 0 && selectedColors}
            />
            <ColorBar></ColorBar>
          </PresentationControls>
        </Canvas>
      </div>
      <div className="Buttons">
        {/* don't think we need this button since there is autoplay now */}
        {/* <IconButton
          icon={<Off />}
          className="button"
          onClick={() => {
            setIsPlaying(true);
            playSynth(arpeggiator, synth, selectedColors);
          }}
          disabled={
            // must select at least one color
            Object.keys(selectedColors).length === 0 ||
            // must be less than 4 to constrain octaves
            Object.keys(selectedColors).length > 4
          }
          size="lg"
        /> */}
        <IconButton
          icon={<Reload />}
          className="button"
          onClick={() => {
            resetSynth();
          }}
          circle
          size="lg"
        />
      </div>
    </div>
  );
}
