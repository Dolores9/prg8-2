const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }
  video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadHandpose() {
  const net = await handpose.load();
  console.log('Handpose model loaded.');
  return net;
}

async function detect(net) {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function runDetection() {
    const predictions = await net.estimateHands(video);
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    if (predictions.length > 0) {
      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].landmarks;
        for (let j = 0; j < keypoints.length; j++) {
          const [x, y] = keypoints[j];
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 3 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }
    }
    requestAnimationFrame(runDetection);
  }

  runDetection();
}

async function main() {
  await setupCamera();
  video.play();
  const net = await loadHandpose();
  detect(net);
}

main();
