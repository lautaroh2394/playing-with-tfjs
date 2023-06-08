export const startStream = async ()=>{
  const constraints = {
    audio: false,
    video: {
      width: 300,
      height: 243,
    }
  }
  video.width = 300;
  video.height = 243;
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  video.srcObject = stream
  let v = await (new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  }));
  v.play()
  return v
}