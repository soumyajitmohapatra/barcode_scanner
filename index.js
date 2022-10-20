// let stream;
// let capturing = true;
// const videoElem = document.querySelector("#video");
// const capBtn = document.getElementById("capture");

// const canvas = document.getElementById("canvas");
// canvas.style.display = "none";

// const startVideo = () => {
//   capturing = false;
//   canvas.style.display = "none";
//   videoElem.style.display = "block";
//   navigator.mediaDevices.enumerateDevices().then(async (devices) => {
//     let id = devices
//       .filter((device) => device.kind === "videoinput")
//       .slice(-1)
//       .pop().deviceId;
//     let constrains = {
//       video: {
//         optional: [{ sourceId: id }],
//       },
//     };

//     stream = await navigator.mediaDevices.getUserMedia(constrains);
//     videoElem.onplaying = () =>
//       console.log("video playing stream:", videoElem.srcObject);
//     videoElem.srcObject = stream;
//   });
// };
// startVideo();

// capBtn.onclick = () => {
//   if (capturing) {
//     window.location.reload();
//   } else {
//     capturing = true;
// canvas.style.display = "block";
// videoElem.style.display = "none";
// capBtn.innerHTML = "RECAPTURE";

//     let capturer = new ImageCapture(stream.getVideoTracks()[0]);
//     step(capturer);
//     canvas
//       .getContext("2d")
//       .drawImage(videoElem, 0, 0, canvas.width, canvas.height);

//     canvas.style.display = "block";
//     videoElem.style.display = "none";
//     stream.getTracks().forEach((track) => track.stop());
//   }
// };
// function step(capturer) {
//   console.log(capturer);
//   capturer.grabFrame().then((bitmap) => {
//     const barcodeDetector = new BarcodeDetector();
//     barcodeDetector
//       .detect(bitmap)
//       .then((barcodes) => {
//         barcodes.forEach((barcode) => {
//           alert(barcode.rawValue);
//           console.log(barcode.rawValue);
//         });
//         step(capturer);
//       })
//       .catch((e) => {
//         console.error(e.message);
//       })
//       .finally(() => console.log("called"));
//   });
// }

// Get the modal
const modal = document.getElementById("myModal");
modal.style.display = "none";

//TURN ON VIDEO
const videoElem = document.querySelector("#video");
let stream;
// stop  camera
function stopVideo(stream) {
  stream.getTracks().forEach(function (track) {
    track.stop();
  });
}
const turnOnVideo = (control = true) => {
  navigator.mediaDevices.enumerateDevices().then(async (devices) => {
    console.log(JSON.stringify(devices));
    let id = devices
      .filter((device) => device.kind === "videoinput")
      .slice(-1)
      .pop().deviceId;
    let constrains = { video: { optional: [{ sourceId: id }] } };

    stream = await navigator.mediaDevices.getUserMedia(constrains);
    videoElem.srcObject = stream;
  });
};
turnOnVideo();

//CAPTURE BTN
const capBtn = document.getElementById("capture");

capBtn.onclick = () => {
  let capturer = new ImageCapture(stream.getVideoTracks()[0]);
  step(capturer);
  canvas.style.display = "block";
  videoElem.style.display = "none";
  capBtn.innerHTML = "RECAPTURE";
};

// Get the <span> element that closes the modal
const close = document.getElementsByClassName("close")[0];

const empName = document.getElementById("empName");
const degi = document.getElementById("degi");
const img = document.getElementById("img");
const barcode = document.getElementById("barcode");

const openModal = (modalData) => {
  setTimeout(() => {
    empName.innerHTML = `${modalData?.emp_name} (${modalData?.emp_id})`;
    img.src = modalData?.profile_img;
    barcode.src = modalData?.barcode;
    degi.innerHTML = modalData?.designation;
    modal.style.display = "block";
  }, 2000);
};

close.onclick = function () {
  modal.style.display = "none";

  window.location.reload();
};

let canvas = document.getElementById("canvas");
canvas.style.display = "none";

function step(capturer) {
  console.log(capturer);
  capturer.grabFrame().then((bitmap) => {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(
      bitmap,
      0,
      0,
      bitmap.width,
      bitmap.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    const barcodeDetector = new BarcodeDetector();
    barcodeDetector
      .detect(capturer)
      .then((barcodes) => {
        barcodes.forEach((barcode) => {
          userData.find((ele) => {
            ele.id == barcode.rawValue
              ? openModal(ele)
              : alert("no user found");
          });
        });
        console.log(barcodes);
        step(capturer);
      })
      .catch((e) => {
        console.error(e);
        document.getElementById("barcodes").innerHTML = "None";
      });
  });
}

const userData = [
  {
    id: 53790547,
    emp_name: "Soumyajit Mohapatra",
    profile_img: "https://avatars.githubusercontent.com/u/30226045?s=263&v=4",
    emp_id: 497,
    designation: "Software Engineer",
    barcode:
      "https://qrcg-media.s3.eu-central-1.amazonaws.com/wp-content/uploads/2020/03/31114611/02-blog-barcode-structure.png",
  },
];
