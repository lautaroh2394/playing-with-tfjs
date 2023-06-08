const detectorConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: { width: 300, height: 243 },
  multiplier: 0.75,
  quantBytes: 2,
};

await tf.setBackend('webgl')
const detector = await poseDetection.createDetector(poseDetection.SupportedModels.PoseNet, detectorConfig);

imageInput.addEventListener('input', ()=>{
  const file = imageInput.files[0]
  uploadedImg.src = URL.createObjectURL(file)
  uploadedImg.height = 250
})

uploadedImg.addEventListener('load', async ()=>{
  posePoints.height = uploadedImg.height
  posePoints.width = uploadedImg.width

  const [poses] = await detector.estimatePoses(uploadedImg);
  console.log(poses)
  drawPoints(posePoints, poses.keypoints)
})

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