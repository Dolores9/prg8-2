function classifyHandPose(landmarks) {
    if (!landmarks || landmarks.length === 0) {
        console.error("No landmarks detected.");
        return {};
    }

    const thumbBase = landmarks[0];
    const thumbTip = landmarks[4];
    const indexBase = landmarks[5];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const pinkyTip = landmarks[16];

    // Calculate distances for commonly used points
    const thumbBaseToTip = calculateDistance(thumbBase, thumbTip);
    const indexBaseToTip = calculateDistance(indexBase, indexTip);
    const indexBaseToMiddle = calculateDistance(indexBase, middleTip);

    // Open Hand: Check if the index, middle, and pinky fingers are extended and separated
    const isOpenHand = indexBaseToTip > 1.2 * calculateDistance(indexBase, pinkyTip);

    // Peace Sign: Check if the index and middle fingers are extended and separated
    const isPeaceSign = indexTip[1] < landmarks[6][1] && indexBaseToMiddle > 1.5 * calculateDistance(indexTip, middleTip);

    // Middle Finger: Check if the middle finger is extended and others are closed
    const isMiddleFinger = middleTip[1] < landmarks[10][1] && middleTip[1] < landmarks[11][1] && middleTip[1] < landmarks[13][1] && middleTip[1] < landmarks[14][1];

    // Fist: Check if all fingers are closed
    const isFist = landmarks.every((point, index) => index !== 0 && point[1] > landmarks[0][1]);

    // Okay Hand Sign: Check if the thumb and index finger form a circle
    const isOkayHandSign = thumbBaseToTip > 1.5 * calculateDistance(thumbTip, indexBase) && thumbBaseToTip < 2.5 * calculateDistance(thumbTip, indexBase);

    return {
        isOpenHand,
        isPeaceSign,
        isMiddleFinger,
        isFist,
        isOkayHandSign
    };
}

function calculateDistance(point1, point2) {
    return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
}
