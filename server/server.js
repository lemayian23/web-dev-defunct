const http = require("http");

const {
    initializeDatabase,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("./database");

const { URL } = require("url");


const server = http.createServer(function (request, response) {

    const requestUrl = new URL(
        request.url,
        "http://localhost:3000"
    );

    const pathname = requestUrl.pathname;


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
    console.log("Path:", pathname);


    // Handle CORS preflight request
    if (request.method === "OPTIONS") {

        response.statusCode = 204;

        response.end();

        return;
    }


    // GET /
    if (
        request.method === "GET" &&
        pathname === "/"
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
        pathname === "/users"
    ) {

        getAllUsers()
            .then(function (users) {

                response.statusCode = 200;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify(users)
                );

            })
            .catch(function (error) {

                console.error(error);

                response.statusCode = 500;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Failed to retrieve users"
                    })
                );

            });

        return;
    }


    // GET /users/:id
    if (
        request.method === "GET" &&
        pathname.startsWith("/users/")
    ) {

        const id = Number(
            pathname.split("/")[2]
        );


        if (Number.isNaN(id)) {

            response.statusCode = 400;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify({
                    error: "Invalid user ID"
                })
            );

            return;
        }


        getUserById(id)
            .then(function (user) {

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

            })
            .catch(function (error) {

                console.error(error);

                response.statusCode = 500;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Failed to retrieve user"
                    })
                );

            });

        return;
    }


    // POST /users
    if (
        request.method === "POST" &&
        pathname === "/users"
    ) {

        let body = "";


        request.on("data", function (chunk) {

            body += chunk;

        });


        request.on("end", function () {

            let newUser;


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


            createUser(
                newUser.name.trim(), 
                newUser.course.trim()
            )

                .then(function (user) {

                    response.statusCode = 201;

                    response.setHeader(
                        "Content-Type",
                        "application/json"
                    );
                    response.end(JSON.stringify(user));
                })
                .catch(function (error) {

                    console.error(error);

                    response.statusCode = 500;

                    response.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    response.end(
                        JSON.stringify({
                            error: "Failed to create user"
                        })
                    );

                });


        });

        return;
    }


    // PATCH /users/:id
    if (
        request.method === "PATCH" &&
        pathname.startsWith("/users/")
    ) {
        const id = Number(pathname.split("/")[2]);

        if (Number.isNaN(id)) {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({
                error: "Invalid user ID"
            }));
            return;
        }

        getUserById(id)
            .then(function(user) {
                if (!user) {
                    response.statusCode = 404;
                    response.setHeader("Content-Type", "application/json");
                    response.end(JSON.stringify({
                        error: "User not found"
                    }));
                    return;
                }

                let body = "";

                request.on("data", function (chunk) {
                    body += chunk;
                });

                request.on("end", function () {
                    let updates;

                    try {
                        updates = JSON.parse(body);
                    } catch (error) {
                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json");
                        response.end(JSON.stringify({
                            error: "Invalid JSON"
                        }));
                        return;
                    }

                    if (
                        updates === null ||
                        typeof updates !== "object" ||
                        Array.isArray(updates)
                    ) {
                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json");
                        response.end(JSON.stringify({
                            error: "Request body must be a JSON object"
                        }));
                        return;
                    }

                    if (
                        updates.name !== undefined &&
                        (
                            typeof updates.name !== "string" ||
                            updates.name.trim() === ""
                        )
                    ) {
                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json");
                        response.end(JSON.stringify({
                            error: "Name must be a non-empty string"
                        }));
                        return;
                    }

                    if (
                        updates.course !== undefined &&
                        (
                            typeof updates.course !== "string" ||
                            updates.course.trim() == ""
                        )
                    ) {
                        response.statusCode = 400;
                        response.setHeader("Content-Type", "application/json");
                        response.end(JSON.stringify({
                            error: "Course must be a non empty string"
                        }));
                        return;
                    }

                    const updatedName =
                        updates.name !== undefined
                            ? updates.name.trim()
                            : user.name;

                    const updatedCourse = 
                        updates.course !== undefined
                            ? updates.course.trim()
                            : user.course;

                    updateUser(id, updatedName, updatedCourse)
                        .then(function (updatedUser) {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");
                            response.end(JSON.stringify(updatedUser));

                        })
                        .catch(function (error) {
                            console.error(error);
                            response.statusCode = 500;
                            response.setHeader("Content-Type", "application/json");
                            response.end(JSON.stringify({
                                error: "Failed to update user"
                            }));
                            });
                        });
                })
            .catch(function (error) {
                console.error(error);
                response.statusCode = 500;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({
                    error: "Failed to retrieve user"
                }));
            });

        return;
    }

    if (
        request.method === "DELETE" &&
        pathname.startsWith("/users/")
    ) {

        const id = Number(
            pathname.split("/")[2]
        );


        if (Number.isNaN(id)) {

            response.statusCode = 400;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify({
                    error: "Invalid user ID"
                })
            );

            return;
        }


        deleteUser(id)
            .then(function (deleted) {

                if (!deleted) {

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
                    JSON.stringify({
                        message: "User deleted successfully",
                        id: id
                    })
                );

            })
            .catch(function (error) {

                console.error(error);

                response.statusCode = 500;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify({
                        error: "Failed to delete user"
                    })
                );

            });

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


initializeDatabase()
    .then(function () {

        server.listen(3000, function () {

            console.log(
                "Server is running on http://localhost:3000"
            );
        });

    })
    .catch(function (error) {   
        console.error("Failed to initialize database:", error);
    });