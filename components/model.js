import { Suspense, forwardRef } from "react";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = forwardRef( ({ source },ref) => {
    const gltf = useLoader(GLTFLoader,source);
    return (
        <Suspense fallback = {null}>
            <primitive object = {gltf.scene} ref = {ref} />
        </Suspense>
    );
});

Model.displayName = "Model";

export { Model }