

const message = document.querySelector("#message");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let handpose;
let predictions;
let width = 1280;
let height = 720;

function startApp() {
    initWebcam();
}

// Create a webcam capture
function initWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.srcObject = stream;
            video.play();
            initHandpose();
        }).catch((error) => {
            console.error("Error accessing the webcam:", error);
        });
    } else {
        console.error("getUserMedia is not supported");
    }
}

function initHandpose() {
    handpose = ml5.handpose(video, modelLoaded);
    handpose.on("predict", results => {
        predictions = results;
        draw();
    });
}

function modelLoaded() {
    message.innerHTML = "Show your hand to the camera";
    draw();
}

let frameCount = 0;

function draw() {
    frameCount++;

    if (frameCount % 5 !== 0) { // Render every 5 frames (adjust as needed)
        requestAnimationFrame(draw);
        return;
    }

    // Draw the webcam feed on the canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Draw hand landmarks for each detected hand
    if (predictions && predictions.length > 0) {
        predictions.forEach(prediction => {
            const landmarks = prediction.landmarks;
            drawKeypoints(landmarks);
            drawSkeleton(landmarks);
            classifyAndDisplayHandPose(landmarks);
        });
    }

    requestAnimationFrame(draw);
}


function drawKeypoints(landmarks) {
    landmarks.forEach(point => {
        const [x, y] = point;
        const scaledX = (x / video.videoWidth) * canvas.width;
        const scaledY = (y / video.videoHeight) * canvas.height;
        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(scaledX, scaledY, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawSkeleton(landmarks) {
    const fingers = [
        [0, 1, 2, 3, 4],
        [0, 5, 6, 7, 8],
        [0, 9, 10, 11, 12],
        [0, 13, 14, 15, 16],
        [0, 17, 18, 19, 20]
    ];

    fingers.forEach(finger => {
        ctx.beginPath();
        ctx.moveTo(
            (landmarks[finger[0]][0] / video.videoWidth) * canvas.width,
            (landmarks[finger[0]][1] / video.videoHeight) * canvas.height
        );
        for (let i = 1; i < finger.length; i++) {
            const [x, y] = landmarks[finger[i]];
            ctx.lineTo(
                (x / video.videoWidth) * canvas.width,
                (y / video.videoHeight) * canvas.height
            );
        }
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function classifyAndDisplayHandPose(landmarks) {
    const handPose = classifyHandPose(landmarks);
    let displayText = "";

    if (handPose.isOpenHand) {
        displayText = "Open Hand";
    } else if (handPose.isPeaceSign) {
        displayText = "Peace Sign";
    } else if (handPose.isMiddleFinger) {
        displayText = "Middle Finger";
    } else if (handPose.isFist) {
        displayText = "Fist";
    } else if (handPose.isOkayHandSign) {
        displayText = "Okay Hand Sign";
    }

    message.innerHTML = displayText;
}

startApp();
