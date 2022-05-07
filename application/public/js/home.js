// let photoCount = document.getElementById("count");
// photoCount.innerText = 0;
// let photoContainer = document.getElementById("photo-container");
// let photos = photoContainer.getElementsByClassName("photo");

// function buildPhotoDiv(img, titleText) {
//     let container = document.createElement("div");
//     let photo = document.createElement("img");
//     photo.style.opacity = 1
//     photo.src = img;

//     let title = document.createElement("p")
//     title.innerText = titleText;

//     container.setAttribute("class", "photo");
//     container.appendChild(photo);
//     container.appendChild(title);

//     container.addEventListener("click", () => {
//         fadeOut = setInterval(() => {
//             if (photo.style.opacity > 0) {
//                 photo.style.opacity -= 0.02;
//             } else {
//                 photoContainer.removeChild(container);
//                 clearInterval(fadeOut);
//             }
//         }, 12);

//         fadeOut;

//         let count = parseInt(photoCount.innerText);
//         photoCount.innerText = count - 1;
//     })
//     photoContainer.appendChild(container);

//     let count = parseInt(photoCount.innerText);
//     photoCount.innerText = count + 1;
// }

// let photoReq = new XMLHttpRequest();
// photoReq.open("GET", "https://jsonplaceholder.typicode.com/albums/2/photos");

// photoReq.onload = () => {
//     if (photoReq.readyState == 4) {
//         let response = JSON.parse(photoReq.response);
//         response.forEach( (photo) => {
//             buildPhotoDiv(photo.url, photo.title);
//         });
//     }
// }

// photoReq.send();

// function setFlashMessageFadeOut() {
//     setTimeout(() => {
//         let currentOpacity = 1.0;
//         let timer = setInterval(() => {
//             if (currentOpacity < 0.05) {
//                 clearInterval(timer);
//                 flashElement.remove();
//             }
//             currentOpacity = currentOpacity - 0.05;
//             flashElement.style.opacity = currentOpacity;
//         }, 50);
//     }, 4000);
// }

// let flashElement = document.getElementById('flash-message');
// if (flashElement) {
//     setFlashMessageFadeOut();
// }