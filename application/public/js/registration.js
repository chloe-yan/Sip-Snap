// let registration = document.getElementById("registration");
// registration.onsubmit = function(event) {
//     let inputFields = registration.getElementsByTagName("input");
//     let username = inputFields[0].value;
//     let password = inputFields[2].value;
//     let passwordConfirm = inputFields[3].value;
//     if (!/^[a-zA-Z]/.test(username)) {
//         alert("Your username must begin with a character");
//     } else if (!/[a-zA-Z0-9]{3}/.test(username)) {
//         alert("Your username must consist of at least 3 alphanumeric characters");
//     } else if (!/.{8,}/.test(password)) {
//         alert("Your password must contain at least 8 characters");
//     } else if (!/[A-Z]+/.test(password)) {
//         alert("Your password must contain at least one uppercase character");
//     } else if (!/[0-9]+/.test(password)) {
//         alert("Your password must contain at least one number");
//     } else if (!/[/*-+!@$^&*]+/.test(password)) {
//         alert("Your password must contain at least one special character");
//     } else if (password !== passwordConfirm) {
//         alert("Your password does not match the confirmation password");
//     } else {
//         alert("Welcome! Your account was successfully created.");
//     }
// }