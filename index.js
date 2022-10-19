const captureBtn = document.querySelector("#start");
const videoElem = document.querySelector("#video");
const canvas = document.querySelector("#canvas");

let stream;
let capture = true;

canvas.style.display = "none";

captureBtn.onclick = async () => {
  if (capture) {
    capture = false;

    canvas.style.display = "none";
    videoElem.style.display = "block";

    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let id = devices
        .filter((device) => device.kind === "videoinput")
        .slice(-1)
        .pop().deviceId;
      let constrains = {
        audio: false,
        video: {
          optional: [{ sourceId: id }],
          facingMode: "environment",
        },
      };

      stream = await navigator.mediaDevices.getUserMedia(constrains);
      videoElem.onplaying = () =>
        console.log("video playing stream:", videoElem.srcObject);
      videoElem.srcObject = stream;
    });
  } else {
    capture = true;
    canvas.style.display = "block";
    videoElem.style.display = "none";
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    //====================///
    const barcodeDetector = new BarcodeDetector();
    barcodeDetector
      .detect(canvas)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          alert(barcode.rawValue);
        });
      })
      .catch((e) => {
        alert(e.message);
      });

    //====================///

    // close the camera
    stream.getTracks().forEach((track) => track.stop());
  }
};
