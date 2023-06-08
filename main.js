import { startStream } from "./start-stream";

let draws = 0;
const WIDTH = 300
const HEIGHT = 243

const detectorConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: { width: WIDTH, height: HEIGHT },
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

const constantAnalisis = async ()=>{
  constantAnalisisCanvas.height = HEIGHT
  constantAnalisisCanvas.width = WIDTH
  const canvasToDrawPic = document.createElement('canvas')
  canvasToDrawPic.height = HEIGHT
  canvasToDrawPic.width = WIDTH

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
    [poses] = await detector.estimatePoses(video, estimationConfig);
    drawPoints(constantAnalisisCanvas, poses.keypoints)
    requestAnimationFrame(analize)
  }
  
  requestAnimationFrame(analize)
}


constantAnalisisButton.addEventListener('click', ()=>{
  constantAnalisis()
})

video.style.display = 'none'
constantAnalisisButton.style.display = 'none'
await startStream()
video.style.display = 'block'
constantAnalisisButton.style.display = 'block'