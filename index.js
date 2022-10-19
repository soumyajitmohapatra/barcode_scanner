const captureBtn = document.querySelector("#start");
const videoElem = document.querySelector("#video");
const canvas = document.querySelector("#canvas");

let stream;
let capture = true;

canvas.style.display = "none";

captureBtn.onclick = async () => {
  console.log("click");
  if (capture) {
    capture = false;

    canvas.style.display = "none";
    videoElem.style.display = "block";
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElem.onplaying = () =>
      console.log("video playing stream:", videoElem.srcObject);
    videoElem.srcObject = stream;
  } else {
    capture = true;
    canvas.style.display = "block";
    videoElem.style.display = "none";
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL("image/jpeg");

    // data url of the image
    console.log(image_data_url);
    //====================///
    const barcodeDetector = new BarcodeDetector();
    barcodeDetector
      .detect(image_data_url)
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
