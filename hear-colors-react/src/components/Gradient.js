import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, GradientTexture } from "@react-three/drei";
import { ColorNoteMapping } from "../ColorNoteMapping";

export default function Gradient({ isPlaying = false, colors = null }) {
  const ref = useRef();
  function createFloatArray(length) {
    const increment = length > 1 ? 1 / (length - 1) : 1;
    return Array.from({ length }, (_, i) => i * increment);
  }

  const floatArray = createFloatArray(colors ? colors.length : 1);
  const hexColorArray = colors
    ? colors.map((color) => ColorNoteMapping[color][1])
    : ["white"];
  useFrame(() => {
    ref.current.distort = THREE.MathUtils.lerp(
      ref.current.distort,
      isPlaying ? 0.4 : 0,
      isPlaying ? 0.05 : 0.01
    );
  });
  return (
    <mesh
      rotation={[0, 0, Math.PI / 2]}
      position={[5, 1, -2]}
      scale={[6, 18, 1]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <MeshDistortMaterial ref={ref} speed={5}>
        <GradientTexture stops={floatArray} colors={hexColorArray} size={100} />
      </MeshDistortMaterial>
    </mesh>
  );
}
