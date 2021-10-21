// Creating a div
import { Canvas } from "@react-three/fiber";
import { Fragment, Suspense, forwardRef } from "react";

const SceneOutput = forwardRef( (props,ref) => {
    return (
        <Fragment>
            {process.browser && (
                <Suspense fallback = {null} >
                    <Canvas ref = {ref} className = "canvas-content">
                        {props.children}
                    </Canvas>
                </Suspense>
            )}
        </Fragment>
    );
});

SceneOutput.displayName = "SceneOutput";

export { SceneOutput };