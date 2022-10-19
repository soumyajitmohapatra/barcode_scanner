let stream;

const videoElem = document.querySelector("#video");
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
const canvas = document.getElementById("canvas");
canvas.style.display = "none";
const capBtn = document.getElementById("capture");

capBtn.onclick = () => {
  let capturer = new ImageCapture(stream.getVideoTracks()[0]);
  step(capturer);
  canvas
    .getContext("2d")
    .drawImage(videoElem, 0, 0, canvas.width, canvas.height);

  canvas.style.display = "block";
  videoElem.style.display = "none";
};
function step(capturer) {
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
        document.getElementById("barcodes").innerHTML = "None";
      });
  });
}
