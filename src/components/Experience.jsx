import {
  Environment,
  Text,
  useTexture,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14}>
        {loadingText}
        <meshBasicMaterial attach="material" color="white" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const texture = window.innerHeight<window.innerWidth ? useTexture("textures/background1.jpg"): useTexture("textures/background1-vert.png");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <Environment preset="sunset" />
      <mesh scale={1} position={[0, 0, 0]}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <Suspense>
        <Dots position={[-0.1, 0.75, 12]} />
      </Suspense>
      <Avatar position={[0, -2.9, 12]} scale={2} />
    </>
  );
};
