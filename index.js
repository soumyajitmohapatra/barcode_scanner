let stream;
let capturing = true;
const videoElem = document.querySelector("#video");
const capBtn = document.getElementById("capture");

const canvas = document.getElementById("canvas");
canvas.style.display = "none";

const startVideo = () => {
  capturing = false;
  canvas.style.display = "none";
  videoElem.style.display = "block";
  navigator.mediaDevices.enumerateDevices().then(async (devices) => {
    let id = devices
      .filter((device) => device.kind === "videoinput")
      .slice(-1)
      .pop().deviceId;
    let constrains = {
      video: {
        optional: [{ sourceId: id }],
      },
    };

    stream = await navigator.mediaDevices.getUserMedia(constrains);
    videoElem.onplaying = () =>
      console.log("video playing stream:", videoElem.srcObject);
    videoElem.srcObject = stream;
  });
};
startVideo();

capBtn.onclick = () => {
  if (capturing) {
    window.location.reload();
  } else {
    capturing = true;
    canvas.style.display = "block";
    videoElem.style.display = "none";
    capBtn.innerHTML = "RECAPTURE";

    let capturer = new ImageCapture(stream.getVideoTracks()[0]);
    step(capturer);
    canvas
      .getContext("2d")
      .drawImage(videoElem, 0, 0, canvas.width, canvas.height);

    canvas.style.display = "block";
    videoElem.style.display = "none";
    stream.getTracks().forEach((track) => track.stop());
  }
};
function step(capturer) {
  console.log(capturer);
  capturer.grabFrame().then((bitmap) => {
    const barcodeDetector = new BarcodeDetector();
    barcodeDetector
      .detect(bitmap)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          alert(barcode.rawValue);
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => console.log("called"));
  });
}
