import { startStream } from "./start-stream";

const detectorConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: { width: 300, height: 243 },
  multiplier: 0.75,
  quantBytes: 2,
};

const WIDTH = 300
const HEIGHT = 243

await tf.setBackend('webgl')

const detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);

const drawPoints = (canvas, keypoints)=>{
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

pictureCanvas.width = WIDTH;
pictureCanvas.height = HEIGHT;
imgTaken.setAttribute("width", WIDTH);
imgTaken.setAttribute("height", HEIGHT);

analize.addEventListener("click", async ()=>{
    const context = pictureCanvas.getContext("2d");
    context.drawImage(video, 0, 0, WIDTH, HEIGHT);
    const data = pictureCanvas.toDataURL("image/png");
    imgTaken.setAttribute("src", data);
})

imgTaken.addEventListener('load', async ()=>{
  const [poses] = await detector.estimatePoses(imgTaken);
  console.log(poses)
  drawPoints(pictureCanvas, poses.keypoints)
})

video.style.display = 'none'
analize.disabled = true
await startStream()
video.style.display = 'block'
analize.disabled = false