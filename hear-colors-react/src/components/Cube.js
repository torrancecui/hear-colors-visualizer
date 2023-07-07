import { useState, useRef } from "react";
import { MeshTransmissionMaterial, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Cube({
  color = "white",
  thickness = 2,
  roughness = 0.4,
  envMapIntensity = 2,
  transmission = 1,
  metalness = 0,
  ...props
}) {
  const [hovered, setHover] = useState(false);
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.x += props.selected ? delta : 0;
    ref.current.rotation.y += props.selected ? delta : 0;
  });

  useCursor(hovered);
  return (
    <mesh
      {...props}
      ref={ref}
      scale={props.selected ? 1.05 : 1}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={(e) => setHover(false)}
    >
      <boxGeometry />
      <MeshTransmissionMaterial
        resolution={128}
        samples={16}
        color={color}
        roughness={roughness}
        thickness={thickness}
        envMapIntensity={envMapIntensity}
        transmission={transmission}
        metalness={metalness}
      />
      <meshBasicMaterial transparent color="#333" depthTest={false} />
    </mesh>
  );
}
