// Creating a div
import { Div, Modal, Icon } from "atomize";
import { glasses } from "../constants";
import { GlassesCard } from "../components/glasses-card";
import { Fragment, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Webcam } from "../components/webcam";
import { Model } from "../components/model";
import { SceneOutput } from "../components/scene-output";
import { MainLayout } from "../components/main-layout";

import { PerspectiveCamera } from "@react-three/drei";

//Tensorflow model
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';



export default function Home() {
  
  const [ webcamOpen, setWebcamOpen ] = useState(false);
  const [ videoReady, setVideoReady ] = useState(false);
  const [ currentGlasses, setCurrentGlasses ] = useState(null);
  const webcamRef = useRef();
  const outputRef = useRef();
  const overlayRef = useRef();
  const cameraRef = useRef();
  const glassesRef = useRef();
  
  const toggleWebcam = () => { setWebcamOpen(!webcamOpen) }

  useTrackFace(
    currentGlasses,
    webcamRef,
    outputRef,
    overlayRef,
    cameraRef,
    glassesRef,
    videoReady
  );

  return (
    <MainLayout>
      <Div
        bg="gray200"
        d="flex"
        align="center"
        justify = "center"
        flexDir = "column"
        p="1rem"
        h="100%"
      >
        <Div d = "flex">
          { glasses.map( (glass,index) => (
            <Div key = {index} p ="1.5rem">
              <GlassesCard item = {glass} onClick = { () => {
                setCurrentGlasses(glass);
                toggleWebcam();
              }} />
            </Div>
          ))}
        </Div>
        <Modal maxW = "80%" h = "90%" bg = "transparent" isOpen={webcamOpen} onClose={ () => { 
          setWebcamOpen(false); 
          setVideoReady(false);
        }} align="center" rounded="md">
          <Icon
            name="Cross"
            pos="absolute"
            top="1rem"
            right="1rem"
            size="28px"
            color = "#FFF"
            onClick={toggleWebcam}
            cursor="pointer"
          />
          <Div className = "canvas-container" pos = "relative" align = "center" h = "100%" d = "flex" flexDir = "column" justify = "center">
            <Webcam ref = {webcamRef} onLoadedData = {() => {
              setVideoReady(true);
            }} />

            <Fragment>
              <Div className = "canvas-content">
                <canvas id = "output" ref = {outputRef} />
              </Div>
              { currentGlasses && (
                <SceneOutput ref = {overlayRef} >
                  <ambientLight color = "0xcccccc" intensity = {0.4} />
                  <pointLight color = "0xffffff" intensity = {0.8} />
                  <PerspectiveCamera
                    fov = {45}
                    far = {1}
                    near = {0.1}
                    aspect = {2000}
                    ref = {cameraRef}
                  >
                    <Model source = {currentGlasses.modelPath} ref = {glassesRef} />
                  </PerspectiveCamera>
                </SceneOutput>
              )}
            </Fragment>
          </Div>
        </Modal>
      </Div>
    </MainLayout>
  );
}

const useTrackFace = (
  currentGlasses,
  videoRef,
  canvasRef,
  overlayRef, 
  cameraRef, 
  glassesRef, 
  videoReady
) => {

  const [model,setModel] = useState(null);

  function drawLine( ctx, x1, y1, x2, y2 ) {
    ctx.beginPath();
    ctx.moveTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.stroke();
  }

  //Cargamos es modelo de tensorflow
  useEffect( () => {
    const loadFaceLandmarkDetection = async () => {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
      setModel(model);
    }
    loadFaceLandmarkDetection();
  }, []);

  useLayoutEffect( () => {
    let video = videoRef.current;
    let overlay = overlayRef.current;
    let camera = cameraRef.current;
    if( overlay && video ){
      setTimeout( () => {
        overlay.width = video.width;
        overlay.height = video.height;
        overlay.style.height = video.height + "px";
        overlay.style.width = video.width + "px";
      } , 200 )
    }

    if( camera && video ){
      setTimeout( () => {
        let videoWidth = video.width;
        let videoHeight = video.height;
        camera.position.x = videoWidth / 2;
        camera.position.y = -videoHeight / 2;
        camera.position.z = -( videoHeight / 2 ) / Math.tan( 45 / 2 );

        camera.lookAt( { 
          x: videoWidth / 2, 
          y: -videoHeight / 2, 
          z: 0, isVector3: true 
        } );
      } , 200);
    }
  });


  useEffect( () => {

    const trackFace = async () => {
      let video = videoRef.current;
      let canvas = canvasRef.current;
      let glasses = glassesRef.current;
      let camera = cameraRef.current;

      if(video && canvas) {
        canvas.width = video.width;
        canvas.height = video.height;
      }

      if( video && canvas && model && glasses ){
        let output = canvas.getContext("2d");
        output.translate( canvas.width, 0 );
        output.scale( -1, 1 ); // Mirror cam
        output.drawImage(
          video,
          0, 0, video.width, video.height,
          0, 0, video.width, video.height,
        );

        if( videoReady ){
          try {
            const faces = await model.estimateFaces( {
              input: video,
              returnTensors: false,
              flipHorizontal: false,
            });

            faces.forEach( face => {

              const { 
                rotationX, 
                x : offsetX, 
                z : offsetZ,
                scaleX,
                scaleY,
                scaleZ
              } = currentGlasses.config;

              // Draw the bounding box
              const x1 = face.boundingBox.topLeft[ 0 ];
              const y1 = face.boundingBox.topLeft[ 1 ];
              const x2 = face.boundingBox.bottomRight[ 0 ];
              const y2 = face.boundingBox.bottomRight[ 1 ];
              const bWidth = x2 - x1;
              const bHeight = y2 - y1;
              drawLine( output, x1, y1, x2, y1 );
              drawLine( output, x2, y1, x2, y2 );
              drawLine( output, x1, y2, x2, y2 );
              drawLine( output, x1, y1, x1, y2 );

              glasses.position.x = offsetX + face.annotations.midwayBetweenEyes[ 0 ][ 0 ];
              glasses.position.y = -face.annotations.midwayBetweenEyes[ 0 ][ 1 ];
              glasses.position.z = offsetZ - camera.position.z + face.annotations.midwayBetweenEyes[ 0 ][ 2 ];

              // Calculate an Up-Vector using the eyes position and the bottom of the nose
              glasses.up.x = face.annotations.midwayBetweenEyes[ 0 ][ 0 ] - face.annotations.noseBottom[ 0 ][ 0 ];
              glasses.up.y = -( face.annotations.midwayBetweenEyes[ 0 ][ 1 ] - face.annotations.noseBottom[ 0 ][ 1 ] );
              glasses.up.z = face.annotations.midwayBetweenEyes[ 0 ][ 2 ] - face.annotations.noseBottom[ 0 ][ 2 ];
              const length = Math.sqrt( glasses.up.x ** 2 + glasses.up.y ** 2 + glasses.up.z ** 2 );
              glasses.up.x /= length;
              glasses.up.y /= length;
              glasses.up.z /= length;

              // Scale to the size of the head
              const eyeDist = Math.sqrt(
                  ( face.annotations.leftEyeUpper1[ 3 ][ 0 ] - face.annotations.rightEyeUpper1[ 3 ][ 0 ] ) ** 2 +
                  ( face.annotations.leftEyeUpper1[ 3 ][ 1 ] - face.annotations.rightEyeUpper1[ 3 ][ 1 ] ) ** 2 +
                  ( face.annotations.leftEyeUpper1[ 3 ][ 2 ] - face.annotations.rightEyeUpper1[ 3 ][ 2 ] ) ** 2
              );
              glasses.scale.x =  scaleX * eyeDist / 6;
              glasses.scale.y =  scaleY * eyeDist / 6;
              glasses.scale.z =  scaleZ * eyeDist / 6;

              glasses.rotation.y = Math.PI;
              glasses.rotation.z = Math.PI / 2 - Math.acos( glasses.up.x );
              glasses.rotation.x =  rotationX;
          });

          }catch (err){
            console.log(err);
          }

        }

      }

      requestAnimationFrame(trackFace);

    }

    trackFace();

  } , [model, videoReady ] )

}