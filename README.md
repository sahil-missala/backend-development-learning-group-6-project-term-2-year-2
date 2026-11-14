# TrekGear Hub

**Backend Development Fundamentals – Modules 1 to 3**  
**Group:** ST-CSEQE2B-G06

TrekGear Hub is a simple backend application for managing trekkers, tents and tent rentals. It uses Node.js, Express.js and SQLite.

## Features

- Express server and REST API routes.
- SQLite database with three related tables: `trekkers`, `tents` and `rentals`.
- Get all and get one routes for tents.
- Add, update and delete tents.
- Validate required fields and return suitable HTTP status codes.
- Search tents by size using a query parameter.
- Create rentals and prevent renting a tent that is not available.
- Return a tent after a rental.
- Join rentals with trekkers and tents to show their names.
- `GET /tents/top` returns up to three most-rented tents, highest count first. Ties are sorted alphabetically by tent name.

## Technologies

- Node.js
- Express.js
- SQLite
- sqlite3 package
- Postman for API testing

## Requirements

Install Node.js and npm before starting.

## Setup

1. Download or clone this repository.
2. Open the project folder in the terminal.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

5. Open `http://localhost:3000` in a browser or Postman.

The SQLite database file `trekgear.db` is created automatically when the application starts.

## Database tables

### trekkers

| Column | Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Trekker name |
| email | TEXT | Unique email |

### tents

| Column | Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | TEXT | Tent name |
| size | TEXT | Tent size |
| status | TEXT | available, rented or damaged |

### rentals

| Column | Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| trekker_id | INTEGER | Foreign key to trekkers |
| tent_id | INTEGER | Foreign key to tents |
| rental_date | TEXT | Rental date |
| returned | INTEGER | 0 = not returned, 1 = returned |

## API routes

### Trekkers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/trekkers` | Get all trekkers |
| GET | `/trekkers/:id` | Get one trekker |
| POST | `/trekkers` | Add a trekker |

POST example:

```json
{
  "name": "Aarav",
  "email": "aarav@example.com"
}
```

### Tents

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tents` | Get all tents |
| GET | `/tents/:id` | Get one tent |
| POST | `/tents` | Add a tent |
| PUT | `/tents/:id` | Update a tent's name and size |
| DELETE | `/tents/:id` | Delete a tent |
| GET | `/tents?size=2-person` | Search tents by size |
| GET | `/tents/top` | Get the top three most-rented tents |

POST and PUT example:

```json
{
  "name": "Mountain Explorer",
  "size": "2-person"
}
```

### Rentals

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/rentals` | Get rentals with trekker and tent names |
| POST | `/rentals` | Create a rental |
| PUT | `/rentals/:id/return` | Mark a rental as returned |

POST example:

```json
{
  "trekker_id": 1,
  "tent_id": 1,
  "rental_date": "2026-11-14"
}
```

## Top three query

The `/tents/top` route uses an SQL `INNER JOIN` between tents and rentals, groups records by tent, counts rentals, sorts by rental count in descending order and sorts equal counts by tent name in ascending order. `LIMIT 3` returns up to three tents, so if only two tents have rental records, only two are returned.

## Suggested testing order

1. Add two or more trekkers using `POST /trekkers`.
2. Add at least three tents using `POST /tents`.
3. Create several rentals using `POST /rentals`.
4. View the joined rental details using `GET /rentals`.
5. Search by size using `GET /tents?size=2-person`.
6. Update a tent using `PUT /tents/:id`.
7. Check `GET /tents/top`.
8. Return a tent using `PUT /rentals/:id/return`.
9. Try missing fields and invalid IDs to check validation and error responses.

## Group contribution plan

Each member should work on their assigned part, make meaningful commits using their own GitHub account and explain their contribution during the demonstration. See `TEAM_WORK.md` for the suggested split and Git commands.

## Notes

- Do not upload `node_modules/` or the generated `trekgear.db` file.
- Use the included `.gitignore`.
- Test the application locally before the demonstration.
