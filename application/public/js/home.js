function setFlashMessageFadeOut(flashMessageElement) {
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if (currentOpacity < 0.05) {
                clearInterval(timer);
                flashMessageElement.remove();
            }
            currentOpacity = currentOpacity - 0.1;
            flashMessageElement.style.opacity = currentOpacity;
        }, 50);
    }, 2500);
}

// function createCard(postData) {
//     return `<div id="post-${postData.id}" class="card">
//         <a class="card-details" href="/post/${postData.id}" class="anchor-buttons"><img src="../images/arrow.png" alt=""></a>
//         <img class="card-image" draggable="false" src="/${postData.thumbnail}" alt="Missing image">
//         <div class="card-body">
//             <p class="card-title">${postData.title}</p>
//             <p class="card-text">${postData.content}</p>
//         </div>
//     </div>`;
// }

// // // function addFlashFromFrontEnd(message) {
// // //     let flashMessageDiv = document.createElement('div');
// // //     let innerFlashDiv = document.createElement('div');
// // //     let innerTextNode = document.createTextNode(message);
// //     innerFlashDiv.appendChild(innerTextNode);
// //     flashMessageDiv.appendChild(innerFlashDiv);
// //     flashMessageDiv.setAttribute('id', 'flash-message');
// //     innerFlashDiv.setAttribute('class', 'alert alert-info');
// //     document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
// //     setFlashMessageFadeOut(flashMessageDiv);
// // }

// // function executeSearch() {
// //     let searchTerm = document.getElementById("search-input").value;
// //     if (!searchTerm) {
// //         location.replace("/");
// //         return;
// //     }
// //     let mainContent = document.getElementById("photo-container");
// //     let searchURL = `/posts/search?q=${searchTerm}`;
// //     fetch(searchURL)
// //     .then((data) => {
// //         return data.json();
// //     })
// //     .then((dataJSON) => {
// //         let newMainContentHTML = '';
// //         dataJSON.results.forEach((row) => {
// //             newMainContentHTML += createCard(row);
// //         });
// //         console.log(newMainContentHTML);
// //         mainContent.innerHTML = newMainContentHTML;
// //         console.log();
// //         console.log(mainContent.innerHTML);
// //         if (dataJSON.message) {
// //             addFlashFromFrontEnd(dataJSON.message);
// //         }
// //     })
// //     .catch((err) => console.log(err));
// // }

let flashElement = document.getElementById('flash-message');
if (flashElement) {
    setFlashMessageFadeOut(flashElement);
}

// let searchForm = document.getElementById("search-bar");
// if (searchForm) {
//     searchForm.onsubmit = executeSearch;
// }