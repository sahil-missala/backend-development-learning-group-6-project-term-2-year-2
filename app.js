const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

const PORT = 3000;

// Basic home route
app.get("/", (request, response) => {
    response.status(200).send("Welcome to TrekGear Hub API");
});

// ---------------- TREKKER ROUTES ----------------

// Get all trekkers
app.get("/trekkers", (request, response) => {
    db.all("SELECT * FROM trekkers ORDER BY id", [], (error, rows) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(rows);
    });
});

// Get one trekker
app.get("/trekkers/:id", (request, response) => {
    db.get("SELECT * FROM trekkers WHERE id = ?", [request.params.id], (error, row) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        if (!row) {
            return response.status(404).json({ error: "Trekker not found" });
        }
        response.status(200).json(row);
    });
});

// Add a trekker
app.post("/trekkers", (request, response) => {
    const { name, email } = request.body;

    if (!name || !email) {
        return response.status(400).json({ error: "Name and email are required" });
    }

    db.run(
        "INSERT INTO trekkers (name, email) VALUES (?, ?)",
        [name, email],
        function (error) {
            if (error) {
                if (error.message.includes("UNIQUE")) {
                    return response.status(409).json({ error: "Email already exists" });
                }
                return response.status(500).json({ error: error.message });
            }

            response.status(201).json({
                message: "Trekker added successfully",
                id: this.lastID
            });
        }
    );
});

// ---------------- TENT ROUTES ----------------

// Top three tents must be declared before /tents/:id
app.get("/tents/top", (request, response) => {
    const sql = `
        SELECT tents.id, tents.name, tents.size, COUNT(rentals.id) AS rental_count
        FROM tents
        INNER JOIN rentals ON tents.id = rentals.tent_id
        GROUP BY tents.id, tents.name, tents.size
        ORDER BY rental_count DESC, tents.name ASC
        LIMIT 3
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(rows);
    });
});

// Get all tents and search by size using a query parameter
app.get("/tents", (request, response) => {
    const size = request.query.size;

    let sql = "SELECT * FROM tents";
    let values = [];

    if (size) {
        sql += " WHERE size = ?";
        values.push(size);
    }

    sql += " ORDER BY id";

    db.all(sql, values, (error, rows) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(rows);
    });
});

// Get one tent
app.get("/tents/:id", (request, response) => {
    db.get("SELECT * FROM tents WHERE id = ?", [request.params.id], (error, row) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        if (!row) {
            return response.status(404).json({ error: "Tent not found" });
        }
        response.status(200).json(row);
    });
});

// Add a tent
app.post("/tents", (request, response) => {
    const { name, size } = request.body;

    if (!name || !size) {
        return response.status(400).json({ error: "Tent name and size are required" });
    }

    db.run(
        "INSERT INTO tents (name, size) VALUES (?, ?)",
        [name, size],
        function (error) {
            if (error) {
                return response.status(500).json({ error: error.message });
            }

            response.status(201).json({
                message: "Tent added successfully",
                id: this.lastID
            });
        }
    );
});

// Update a tent
app.put("/tents/:id", (request, response) => {
    const { name, size } = request.body;

    if (!name || !size) {
        return response.status(400).json({ error: "Tent name and size are required" });
    }

    db.run(
        "UPDATE tents SET name = ?, size = ? WHERE id = ?",
        [name, size, request.params.id],
        function (error) {
            if (error) {
                return response.status(500).json({ error: error.message });
            }
            if (this.changes === 0) {
                return response.status(404).json({ error: "Tent not found" });
            }
            response.status(200).json({ message: "Tent updated successfully" });
        }
    );
});

// Delete a tent
app.delete("/tents/:id", (request, response) => {
    db.run("DELETE FROM tents WHERE id = ?", [request.params.id], function (error) {
        if (error) {
            if (error.message.includes("FOREIGN KEY")) {
                return response.status(409).json({
                    error: "This tent has rental records and cannot be deleted"
                });
            }
            return response.status(500).json({ error: error.message });
        }
        if (this.changes === 0) {
            return response.status(404).json({ error: "Tent not found" });
        }
        response.status(200).json({ message: "Tent deleted successfully" });
    });
});

// ---------------- RENTAL ROUTES ----------------

// Get rentals with trekker and tent names using JOIN
app.get("/rentals", (request, response) => {
    const sql = `
        SELECT rentals.id, trekkers.name AS trekker_name,
               tents.name AS tent_name, rentals.rental_date,
               rentals.returned
        FROM rentals
        INNER JOIN trekkers ON rentals.trekker_id = trekkers.id
        INNER JOIN tents ON rentals.tent_id = tents.id
        ORDER BY rentals.id
    `;

    db.all(sql, [], (error, rows) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        }
        response.status(200).json(rows);
    });
});

// Add a rental
app.post("/rentals", (request, response) => {
    const { trekker_id, tent_id, rental_date } = request.body;

    if (!trekker_id || !tent_id || !rental_date) {
        return response.status(400).json({
            error: "Trekker ID, tent ID and rental date are required"
        });
    }

    db.get(
        "SELECT * FROM tents WHERE id = ?",
        [tent_id],
        (error, tent) => {
            if (error) {
                return response.status(500).json({ error: error.message });
            }
            if (!tent) {
                return response.status(404).json({ error: "Tent not found" });
            }
            if (tent.status !== "available") {
                return response.status(409).json({ error: "Tent is not available" });
            }

            db.get(
                "SELECT * FROM trekkers WHERE id = ?",
                [trekker_id],
                (trekkerError, trekker) => {
                    if (trekkerError) {
                        return response.status(500).json({ error: trekkerError.message });
                    }
                    if (!trekker) {
                        return response.status(404).json({ error: "Trekker not found" });
                    }

                    db.run(
                        "INSERT INTO rentals (trekker_id, tent_id, rental_date) VALUES (?, ?, ?)",
                        [trekker_id, tent_id, rental_date],
                        function (insertError) {
                            if (insertError) {
                                return response.status(500).json({ error: insertError.message });
                            }

                            const rentalId = this.lastID;

                            db.run(
                                "UPDATE tents SET status = 'rented' WHERE id = ?",
                                [tent_id],
                                (updateError) => {
                                    if (updateError) {
                                        return response.status(500).json({ error: updateError.message });
                                    }
                                    response.status(201).json({
                                        message: "Rental created successfully",
                                        id: rentalId
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Mark a rental as returned
app.put("/rentals/:id/return", (request, response) => {
    db.get(
        "SELECT * FROM rentals WHERE id = ?",
        [request.params.id],
        (error, rental) => {
            if (error) {
                return response.status(500).json({ error: error.message });
            }
            if (!rental) {
                return response.status(404).json({ error: "Rental not found" });
            }
            if (rental.returned === 1) {
                return response.status(400).json({ error: "Rental is already returned" });
            }

            db.run(
                "UPDATE rentals SET returned = 1 WHERE id = ?",
                [request.params.id],
                (updateError) => {
                    if (updateError) {
                        return response.status(500).json({ error: updateError.message });
                    }

                    db.run(
                        "UPDATE tents SET status = 'available' WHERE id = ?",
                        [rental.tent_id],
                        (tentError) => {
                            if (tentError) {
                                return response.status(500).json({ error: tentError.message });
                            }
                            response.status(200).json({ message: "Tent returned successfully" });
                        }
                    );
                }
            );
        }
    );
});

// Handle unknown routes
app.use((request, response) => {
    response.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`TrekGear Hub server running at http://localhost:${PORT}`);
});
