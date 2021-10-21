import { Div } from "atomize";
import { forwardRef, Fragment, useEffect } from "react"


const Webcam = forwardRef( ({ id , onLoadedData },ref) => {

    const webcamId = id || "webcam";

    useEffect( () => {
        let webcamEl = document.getElementById(webcamId);
        const setupWebcam = async () => {    
            return new Promise( (resolve,reject) => {    
                const navigatorAny = navigator;

                navigator.getUserMedia = 
                    navigator.getUserMedia ||
                    navigatorAny.webkitGetUserMedia || 
                    navigatorAny.mozGetUserMedia ||
                    navigatorAny.msGetUserMedia;

                if( navigator.getUserMedia ){
                    navigator.getUserMedia(
                        { video: true },
                        stream => {
                            webcamEl.srcObject = stream;
                            webcamEl.addEventListener('loadeddata',resolve,false);
                        },
                        error => {
                            reject(error);
                        }
                    )
                }
            })
        }
        setupWebcam().then( () => {
            webcamEl.play();
            onLoadedData();
        } );
    }, [webcamId]);

    return (
        <Fragment>
            <Div
                ref = {ref}
                w = "100%"
                h = "100%"
                maxH = "390px"
                tag = "video"
                id = {webcamId}
                playsInline 
                width = {500} 
                height = {300} 
                style = {{
                    visibility: 'hidden'
                }}
            />  
        </Fragment>        
    );
});

Webcam.displayName = "Webcam";

export { Webcam };