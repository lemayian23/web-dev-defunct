const logoutButton = document.querySelector("button");
const welcomeMessage = document.querySelector("#welcome-message");

logoutButton.addEventListener("click", function () {
    welcomeMessage.textContent = "You have been logged out.";
    logoutButton.textContent = "Logged Out";

    logoutButton.classList.add("logged-out");
});

const profileForm = document.querySelector("#profile-form");
const studentNameInput = document.querySelector("#student-name");

profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    welcomeMessage.textContent =
    "Welcome " + studentNameInput.value + "!";
});

const apiUser = document.querySelector("#api-user");

fetch("https://jsonplaceholder.typicode.com/users/1")
     .then(function (response) {
        return response.json();
     })
     .then(function (data) {
        apiUser.textContent = "ÄPI User: " + data.name; 
     })
     .catch(function (error) {
        console.error(error);
     });