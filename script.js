const video = document.getElementById('video');
let model = null;
let lastY = null;

const modelParams = {
  flipHorizontal: true,   
  maxNumBoxes: 1,         
  iouThreshold: 0.5,
  scoreThreshold: 0.6,
};


handTrack.startVideo(video).then(status => {
  if (status) {
    handTrack.load(modelParams).then(lmodel => {
      model = lmodel;
      runDetection();
    });
  } else {
    alert('Please enable webcam access');
  }
});

function runDetection() {
  model.detect(video).then(predictions => {
    if (predictions.length > 0) {
      const bbox = predictions[0].bbox;
      const handY = bbox[1] + bbox[3] / 2; 

      if (lastY !== null) {
        const diff = handY - lastY;

        if (diff < -10) {
          window.scrollBy(0, -50); // scroll up
        } else if (diff > 10) {
          window.scrollBy(0, 50); // scroll down
        }
      }

      lastY = handY;
    } else {
      lastY = null; 
    }

    requestAnimationFrame(runDetection);
  });
}
