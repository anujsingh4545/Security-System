import React, {useRef,useState} from 'react'
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
// import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import {drawMesh} from "../pages/utilities"
import { MdVerified } from 'react-icons/md'

function VideoSection({verifys}) {




const webcamRef = useRef(null)
const canvasRef = useRef(null)
const [value,setValue]= useState(0)

console.log(value);

const runFeshMesh = async()=>{
  
    const net = await facemesh.load({
         inputResolution: { width: 640, height: 480 },
          scale: 0.8,
         });

        detect(net);
      
    
}

if(value ===3){
    verifys(true)
}

if(value <3 ){
    runFeshMesh()
}

const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // OLD MODEL
      //       const face = await net.estimateFaces(video);
      // NEW MODEL
      const face = await net.estimateFaces(video);
      console.log(face.length);
      if(face.length > 0 ){
          setValue(value+1)
      }

          console.log(face ,value)
        console.log(value);
      

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  };

  return (
    <div className='w-[95%] m-auto mb-10  md:my-0  h-[40rem] md:h-[100vh] md:w-[50%] border-0 border-black relative ' >

<Webcam ref={webcamRef} className= " absolute top-[50%] left-[50%] h-[35rem] transform translate-x-[-50%] translate-y-[-50%] w-[100%]  m-auto text-center z-10  rounded-xl shadow-md shadow-black bg-black " />
<canvas ref={canvasRef}   className= " absolute top-[50%] left-[50%] transform h-[35rem]  translate-x-[-50%] translate-y-[-50%] w-[100%] m-aut0 text-center z-10 "> </canvas> 


{value === 3 &&


<div className='  absolute top-[50%] left-[50%]  transform translate-x-[-50%] translate-y-[-50%]   z-20 w-[100%] py-3 text-center justify-center flex items-center h-fit  bg-slate-200' >
    <MdVerified className='text-[2rem]  text-green-700 ' />
    <p className='font-serif text-[1.5rem] font-medium italic tracking-wider px-5 text-green-700 ' >
     Verified
    </p>
     
     </div>
}


    </div>
  )
}

export default VideoSection