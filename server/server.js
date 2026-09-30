const http = require("http");

const users = [
    {
        id: 1,
        name: "Denis",
        course: "Web Development"
    },
    {
        id: 2,
        name: "Allan",
        course: "Artificial Intelligence"
    }
];


const server = http.createServer(function (request, response) {

    response.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );

    response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    console.log("Method:", request.method);
    console.log("URL:", request.url);


    // Handle CORS preflight request
    if (request.method === "OPTIONS") {

        response.statusCode = 204;

        response.end();

        return;
    }


    // GET /
    if (
        request.method === "GET" &&
        request.url === "/"
    ) {

        response.statusCode = 200;

        response.setHeader(
            "Content-Type",
            "text/plain"
        );

        response.end(
            "Welcome to my Student Portal backend!"
        );

        return;
    }


    // GET /users
    if (
        request.method === "GET" &&
        request.url === "/users"
    ) {

        response.statusCode = 200;

        response.setHeader(
            "Content-Type",
            "application/json"
        );

        response.end(
            JSON.stringify(users)
        );

        return;
    }


    // GET /users/:id
    if (
        request.method === "GET" &&
        request.url.startsWith("/users/")
    ) {

        const id = Number(
            request.url.split("/")[2]
        );

        const user = users.find(function (user) {

            return user.id === id;

        });


        if (!user) {

            response.statusCode = 404;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify({
                    error: "User not found"
                })
            );

            return;
        }


        response.statusCode = 200;

        response.setHeader(
            "Content-Type",
            "application/json"
        );

        response.end(
            JSON.stringify(user)
        );

        return;
    }


    // POST /users
    if (
        request.method === "POST" &&
        request.url === "/users"
    ) {

        let body = "";


        // Receive request body
        request.on("data", function (chunk) {

            body += chunk;

        });


        // Process complete request body
        request.on("end", function () {

            let newUser;


            // Convert JSON text into JavaScript object
            try {

                newUser = JSON.parse(body);

            } catch (error) {

                response.statusCode = 400;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Invalid JSON"
                    })
                );

                return;
            }


            // Validate name
            if (
                !newUser.name ||
                typeof newUser.name !== "string" ||
                newUser.name.trim() === ""
            ) {

                response.statusCode = 400;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Name is required"
                    })
                );

                return;
            }


            // Validate course
            if (
                !newUser.course ||
                typeof newUser.course !== "string" ||
                newUser.course.trim() === ""
            ) {

                response.statusCode = 400;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Course is required"
                    })
                );

                return;
            }


            // Create server-owned ID
            const newId = users.length + 1;


            // Create new user
            const user = {
                id: newId,
                name: newUser.name.trim(),
                course: newUser.course.trim()
            };


            // Add user to array
            users.push(user);


            // Send successful response
            response.statusCode = 201;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify(user)
            );

        });

        return;
    }


    // PATCH /users/:id
    if (
        request.method === "PATCH" &&
        request.url.startsWith("/users/")
    ) {

        const id = Number(
            request.url.split("/")[2]
        );

        const user = users.find(function (user) {

            return user.id === id;

        });


        // Check whether the user exists
        if (!user) {

            response.statusCode = 404;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify({
                    error: "User not found"
                })
            );

            return;
        }


        let body = "";


        // Receive request body
        request.on("data", function (chunk) {

            body += chunk;

        });


        // Process complete request body
        request.on("end", function () {

            let updates;


            // Convert JSON into JavaScript object
            try {

                updates = JSON.parse(body);

            } catch (error) {

                response.statusCode = 400;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Invalid JSON"
                    })
                );

                return;
            }


            // Update name if provided
            if (updates.name !== undefined) {

                if (
                    typeof updates.name !== "string" ||
                    updates.name.trim() === ""
                ) {

                    response.statusCode = 400;

                    response.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    response.end(
                        JSON.stringify({
                            error: "Name must be a non-empty string"
                        })
                    );

                    return;
                }

                user.name = updates.name.trim();
            }


            // Update course if provided
            if (updates.course !== undefined) {

                if (
                    typeof updates.course !== "string" ||
                    updates.course.trim() === ""
                ) {

                    response.statusCode = 400;

                    response.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    response.end(
                        JSON.stringify({
                            error: "Course must be a non-empty string"
                        })
                    );

                    return;
                }

                user.course = updates.course.trim();
            }


            // Send updated user
            response.statusCode = 200;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify(user)
            );

        });

        return;
    }

    //DELETE /users/:id
    if (
        request.method === "DELETE" &&
        request.url.startsWith("/users/")
    ) {


        const id = Number(
            request.url.split("/")[2]
        );


        const userIndex = users.findIndex( function (user) {

            return user.id === id;

        });

        // Check whether user exists
        if (userIndex === -1) {

            response.statusCode = 404;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify({
                    error: "User not found"
                })
            );

            return;
        }

        // Remove user from array
        const deletedUser = users.splice(
            userIndex,
            1
        )[0];

        // Send deleted user back to client
        response.statusCode = 200;

        response.setHeader(
            "Content-Type",
            "application/json"
        );

        response.end(
            JSON.stringify({
                message:"Üser deleted successfully",
                user: deletedUser
            })
        );
        return;
    }


    // Route not found
    response.statusCode = 404;

    response.setHeader(
        "Content-Type",
        "text/plain"
    );

    response.end(
        "Route not found"
    );

});


server.listen(3000, function () {

    console.log(
        "Server running on http://localhost:3000"
    );

});