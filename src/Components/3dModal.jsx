/* eslint-disable react/prop-types */
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
const Model = ({ isTalking }) => {
    const { scene, animations,materials } = useGLTF("/modals/Teacher_Nanami.glb"); 
    const mixer = useRef(null);
    const mouthOpen = useRef(null);
    console.log(materials,"========console.log");
    
    useEffect(() => {
        if (animations.length > 0) {
            mixer.current = new THREE.AnimationMixer(scene);
            const action = mixer.current.clipAction(animations[0]);
            action.play();
        }
    }, [animations, scene]);
    useFrame((_, delta) => {
        if (mixer.current) mixer.current.update(delta);
        // Animate mouth movement if talking
        if (mouthOpen.current) {
            mouthOpen.current.weight = isTalking ? Math.sin(Date.now() * 0.01) * 0.5 + 0.5 : 0;
        }
    });


    // eslint-disable-next-line react/no-unknown-property
    return <primitive object={scene} scale={[0.8, 0.5, 0.8]} position={[0, -0.5, 0]} />;
};
export default Model;
