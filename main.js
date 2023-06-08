import { startStream } from "./start-stream";
let draws = 0;
const detectorConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: { width: 300, height: 243 },
  multiplier: 0.75,
  quantBytes: 2,
};

await tf.setBackend('webgl')

const detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);

const drawPoints = (canvas, keypoints)=>{
  draws++
  if (!keypoints) return
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const drawablePoints = keypoints.filter(keypoint => keypoint.score > 0.85)
  drawablePoints.forEach(point => drawPoint(ctx, point));
}

const drawPoint = (ctx, keypoint)=>{
  ctx.strokeStyle = "green";
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.roundRect(keypoint.x, keypoint.y, 5, 5, 50);
  ctx.fill()
  ctx.stroke();
}

analize.addEventListener("click", async ()=>{
    const context = pictureCanvas.getContext("2d");
    pictureCanvas.width = 300;
    pictureCanvas.height = 243;
    imgTaken.setAttribute("width", pictureCanvas.width);
    imgTaken.setAttribute("height", pictureCanvas.height);

    context.drawImage(video, 0, 0, pictureCanvas.width, pictureCanvas.height);
    const data = pictureCanvas.toDataURL("image/png");
    imgTaken.setAttribute("src", data);
})

imgTaken.addEventListener('load', async ()=>{
  //how to do this for every frame
  pictureCanvas.height = imgTaken.height
  pictureCanvas.width = imgTaken.width

  const [poses] = await detector.estimatePoses(imgTaken);
  console.log(poses)
  drawPoints(pictureCanvas, poses.keypoints)
})

const constantAnalisis = async ()=>{
  constantAnalisisCanvas.height = 243
  constantAnalisisCanvas.width = 300
  const canvasToDrawPic = document.createElement('canvas')
  canvasToDrawPic.height = 243
  canvasToDrawPic.width = 300
  /*
  const img = document.createElement('img')
  img.addEventListener('load', async ()=>{
    const [poses] = await detector.estimatePoses(img);
    console.log(poses)
    drawPoints(constantAnalisisCanvas, poses.keypoints)
    requestAnimationFrame(analize)
  })
  */
  setInterval(()=>{
    console.log(`${draws} per second`)
    draws = 0;
  }, 1000)

  const estimationConfig = {
    maxPoses: 5,
    flipHorizontal: false,
    scoreThreshold: 0.1,
    nmsRadius: 20
  };

  let poses;
  const analize = async ()=>{
    /*
    const context = canvasToDrawPic.getContext("2d");
    context.drawImage(video, 0, 0, canvasToDrawPic.width, canvasToDrawPic.height);
    const data = canvasToDrawPic.toDataURL("image/png");
    img.setAttribute("src", data);  
    */
    [poses] = await detector.estimatePoses(video, estimationConfig);
    //console.log(poses)
    drawPoints(constantAnalisisCanvas, poses.keypoints)
    requestAnimationFrame(analize)
  }
  
  requestAnimationFrame(analize)
}

/*
const constantAnalisisV2 = async ()=>{
  //todo -- fix. a bit too slow. maybe not show video and show each take?
  video.style.display = 'none'
  constantAnalisisCanvasTwo.height = 243
  constantAnalisisCanvasTwo.width = 300
  constantAnalisisCanvasThree.height = 243
  constantAnalisisCanvasThree.width = 300

  const canvasToDrawPic = constantAnalisisCanvasTwo
  const img = document.createElement('img')
  img.addEventListener('load', async ()=>{
    const [poses] = await detector.estimatePoses(img);
    console.log(poses)
    drawPoints(constantAnalisisCanvas, poses.keypoints)
    requestAnimationFrame(analize)
  })
  const analize = async ()=>{
    
    const context = canvasToDrawPic.getContext("2d");
    context.drawImage(video, 0, 0, canvasToDrawPic.width, canvasToDrawPic.height);
    const data = canvasToDrawPic.toDataURL("image/png");
    img.setAttribute("src", data);  
    
    const [poses] = await detector.estimatePoses(img);
    console.log(poses)
    drawPoints(constantAnalisisCanvasThree, poses.keypoints)
    requestAnimationFrame(analize)
  }
  
  requestAnimationFrame(analize)
}
*/

constantAnalisisButton.addEventListener('click', ()=>{
  constantAnalisis()
})
/*
constantAnalisisV2Button.addEventListener('click', ()=>{
  constantAnalisisV2()
})
*/

video.style.display = 'none'
constantAnalisisButton.style.display = 'none'
await startStream()
video.style.display = 'block'
constantAnalisisButton.style.display = 'block'