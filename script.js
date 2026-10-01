const logoutButton = document.querySelector("button");

const welcomeMessage = document.querySelector("#welcome-message");

const profileForm = document.querySelector("#profile-form");

const studentNameInput =
    document.querySelector("#student-name");

const studentCourseInput =
    document.querySelector("#student-course");

const apiUser = document.querySelector("#api-user");

const apiError = document.querySelector("#api-error");


// Logout button
logoutButton.addEventListener("click", function () {

    welcomeMessage.textContent =
        "You have been logged out.";

    logoutButton.textContent =
        "Logged Out";

    logoutButton.classList.add("logged-out");

});


// Student form
profileForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    apiError.textContent = "";

    await createUser(
        studentNameInput.value,
        studentCourseInput.value
    );

});


// Load first user
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


// Load all users
async function loadUsers() {

    try {

        const response = await fetch(
            "http://localhost:3000/users"
        );

        const users = await response.json();

        if (!response.ok) {

            throw new Error(
                "Failed to load users"
            );

        }

        const usersList =
            document.querySelector("#users-list");

        usersList.innerHTML = "";


        users.forEach(function (user) {

            const article =
                document.createElement("article");

            const heading =
                document.createElement("h3");

            heading.textContent =
                user.name;


            const course =
                document.createElement("p");

            course.textContent =
                "Course: " + user.course;

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "Delete";

            deleteButton.addEventListener(
                "click",
                async function () {

                    await deleteUser(user.id);
                }
            );

            const editButton =
                document.createElement("button");

            editButton.textContent =
                "Edit";

            editButton.addEventListener(
                "click",
                async function () {

                    await editUser(user.id);
                }
            );


            article.appendChild(heading);

            article.appendChild(course);

            article.appendChild(deleteButton);

            article.appendChild(editButton);

            usersList.appendChild(article);

        });

    } catch (error) {

        console.error(error);

    }

}

async function deleteUser(userId) {

    try {

        const response = await fetch(
            "http://localhost:3000/users/" + userId,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        console.log(data);

        await loadUsers();
    } catch (error) {

        apiError.textContent =
            error.message;
    }

}

async function editUser(userId) {

    const newName =
        prompt("Enter the new Student name:");

    const newCourse =
        prompt("Enter the new course:");

    if (!newName || !newCourse) {

        return;

    }

    try {

        const response = await fetch(
            "http://localhost:3000/users/" + userId,
            {

                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: newName,
                    course: newCourse
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(data.error);

        }

        console.log(data);

        await loadUsers();
    } catch (error) {

        apiError.textContent =
            error.message;
    }
}

// Run when page loads
loadUser();

loadUsers();


// Create a new user
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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(data.error);

        }


        console.log(data);


        apiUser.textContent =
            "Created user: " +
            data.name +
            " (ID: " +
            data.id +
            ")";


        welcomeMessage.textContent =
            "Welcome " +
            data.name +
            "!";


        profileForm.reset();

        loadUsers();


    } catch (error) {

        console.error(error);

        apiError.textContent =
            error.message;

    }

}
