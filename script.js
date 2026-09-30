const logoutButton = document.querySelector("button");

const welcomeMessage = document.querySelector("#welcome-message");

logoutButton.addEventListener("click", function () {
    welcomeMessage.textContent = "You have been logged out.";

    logoutButton.textContent = "Logged Out";

    logoutButton.classList.add("logged-out");
});


const profileForm = document.querySelector("#profile-form");

const studentNameInput = document.querySelector("#student-name");

profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    await createUser(studentNameInput.value);

    welcomeMessage.textContent =
        "Welcome " + studentNameInput.value + "!";
});


const apiUser = document.querySelector("#api-user");

const apiError = document.querySelector("#api-error");


async function loadUser() {
    try {
        const response = await fetch(
            "http://localhost:3000/users"
        );

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const data = await response.json();

        apiUser.textContent =
            "First user: " + data[0].name;

    } catch (error) {
        console.error(error);

        apiError.textContent =
            "Could not load users. Please try again.";
    }
}


loadUser();


async function createUser(name) {
    try {
        const response = await fetch(
            "http://localhost:3000/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    course: "Web Development"
                })
            }
        );

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const data = await response.json();

        console.log(data);

        apiUser.textContent =
            "Created user: " + data.name +
            " (ID: " + data.id + ")";

    } catch (error) {
        console.error(error);

        apiError.textContent =
            "Could not create user. Please try again.";
    }
}