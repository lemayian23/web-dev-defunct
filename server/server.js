const http = require("http");

const db = require("./database");

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

        db.all(
            "SELECT * FROM users",
            function (error, rows) {

                if (error) {

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

                    return;
                }


                response.statusCode = 200;

                response.setHeader(
                    "Content-Type",
                    "application/json"
                );

                response.end(
                    JSON.stringify(rows)
                );

            }
        );

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


        db.get(
            "SELECT * FROM users WHERE id = ?",
            [id],
            function (error, user) {

                if (error) {

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

                    return;
                }


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

            }
        );

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


            db.run(
                `
                INSERT INTO users (name, course)
                VALUES (?, ?)
                `,
                [
                    newUser.name.trim(),
                    newUser.course.trim()
                ],
                function (error) {

                    if (error) {

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

                        return;
                    }


                    const user = {
                        id: this.lastID,
                        name: newUser.name.trim(),
                        course: newUser.course.trim()
                    };


                    response.statusCode = 201;

                    response.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    response.end(
                        JSON.stringify(user)
                    );

                }
            );

        });

        return;
    }


    // PATCH /users/:id
    if (
        request.method === "PATCH" &&
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


        db.get(
            "SELECT * FROM users WHERE id = ?",
            [id],
            function (error, user) {

                if (error) {

                    console.error(error);

                    response.statusCode = 500;

                    response.setHeader(
                        "Content-Type",
                        "application/json"
                    );

                    response.end(
                        JSON.stringify({
                            error: "Failed to find user"
                        })
                    );

                    return;
                }


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


                request.on("data", function (chunk) {

                    body += chunk;

                });


                request.on("end", function () {

                    let updates;


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
                                    error:
                                        "Name must be a non-empty string"
                                })
                            );

                            return;
                        }

                    }


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
                                    error:
                                        "Course must be a non-empty string"
                                })
                            );

                            return;
                        }

                    }


                    const updatedName =
                        updates.name !== undefined
                            ? updates.name.trim()
                            : user.name;


                    const updatedCourse =
                        updates.course !== undefined
                            ? updates.course.trim()
                            : user.course;


                    db.run(
                        `
                        UPDATE users
                        SET name = ?, course = ?
                        WHERE id = ?
                        `,
                        [
                            updatedName,
                            updatedCourse,
                            id
                        ],
                        function (error) {

                            if (error) {

                                console.error(error);

                                response.statusCode = 500;

                                response.setHeader(
                                    "Content-Type",
                                    "application/json"
                                );

                                response.end(
                                    JSON.stringify({
                                        error:
                                            "Failed to update user"
                                    })
                                );

                                return;
                            }


                            const updatedUser = {
                                id: id,
                                name: updatedName,
                                course: updatedCourse
                            };


                            response.statusCode = 200;

                            response.setHeader(
                                "Content-Type",
                                "application/json"
                            );

                            response.end(
                                JSON.stringify(updatedUser)
                            );

                        }
                    );

                });

            }
        );

        return;
    }


    // DELETE /users/:id
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


        db.run(
            "DELETE FROM users WHERE id = ?",
            [id],
            function (error) {

                if (error) {

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

                    return;
                }


                if (this.changes === 0) {

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

            }
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