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

    console.log("Method:", request.method);
    console.log("URL:", request.url);


    if (request.method === "GET" && request.url === "/") {

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


    if (request.method === "GET" && request.url === "/users") {

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


    if (request.method === "POST" && request.url === "/users") {

        let body = "";

        request.on("data", function (chunk) {
            body += chunk;
        });


        request.on("end", function () {

            const newUser = JSON.parse(body);

            newUser.id = users.length + 1;

            users.push(newUser);


            response.statusCode = 201;

            response.setHeader(
                "Content-Type",
                "application/json"
            );

            response.end(
                JSON.stringify(newUser)
            );
        });

        return;
    }


    response.statusCode = 404;

    response.setHeader(
        "Content-Type",
        "text/plain"
    );

    response.end("Route not found");

});


server.listen(3000, function () {

    console.log(
        "Server running on http://localhost:3000"
    );

});