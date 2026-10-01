const sqlite3 =
    require("sqlite3").verbose();

const path =
    require("path");


const db =
    new sqlite3.Database(
        path.join(__dirname, "students.db"),
        function (error) {

            if (error) {

                console.error(
                    "Database connection failed:",
                    error.message
                );

                return;
            }

            console.log(
                "Connected to SQLite database."
            );

        }
    );


function initializeDatabase() {

    return new Promise(function (resolve, reject) {

        db.run(
            `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                course TEXT NOT NULL
            )
            `,
            function (error) {

                if (error) {

                    console.error(
                        "Could not create users table:",
                        error.message
                    );

                    reject(error);

                    return;
                }


                console.log(
                    "Users table is ready."
                );

                resolve();

            }
        );

    });

}


module.exports = {
    db: db,
    initializeDatabase: initializeDatabase
};