const logoutButton = document.querySelector("button");

const welcomeMessage = document.querySelector("#welcome-message");

const profileForm = document.querySelector("#profile-form");

const studentNameInput = document.querySelector("#student-name");

const studentCourseInput =
    document.querySelector("#student-course");

const apiUser = document.querySelector("#api-user");

const apiError = document.querySelector("#api-error");


logoutButton.addEventListener("click", function () {

    welcomeMessage.textContent = "You have been logged out.";

    logoutButton.textContent = "Logged Out";

    logoutButton.classList.add("logged-out");

});


profileForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    apiError.textContent = "";

    await createUser(
        studentNameInput.value,
        studentCourseInput.value
    );

});


async function loadUser() {

    try {

        const response = await fetch(
            "http://localhost:3000/users"
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        apiUser.textContent =
            "First user: " + data[0].name;

    } catch (error) {

        console.error(error);

        apiError.textContent =
            error.message;

    }

}


loadUser();


async function createUser(name, course) {

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
                    course: course
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.error);

        }


        console.log(data);

        apiUser.textContent =
            "Created user: " + data.name +
            " (ID: " + data.id + ")";


        welcomeMessage.textContent =
            "Welcome " + data.name + "!";


        profileForm.reset();


    } catch (error) {

        console.error(error);

        apiError.textContent =
            error.message;

    }

}