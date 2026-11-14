# Team Work and GitHub Commit Instructions

Group: ST-CSEQE2B-G06  
Project: TrekGear Hub

## Suggested division (one part per member)

1. Server and routes
   - Set up Express.
   - Understand the route structure and HTTP status codes.
   - Suggested files: `app.js` (server setup and route integration).

2. Database
   - Create the three SQLite tables.
   - Understand primary keys, foreign keys and SQL queries.
   - Suggested file: `db.js`.

3. REST endpoints
   - Work on GET, POST, PUT and DELETE for tents.
   - Check correct status codes and responses.
   - Suggested contribution: tent routes in `app.js`.

4. Validation and search
   - Check required fields and error messages.
   - Test the size query parameter.
   - Suggested contribution: validation and `/tents?size=` route.

5. Twist rule
   - Understand and test `GET /tents/top`.
   - Check JOIN, GROUP BY, COUNT, ORDER BY and LIMIT.
   - Make all three required test scenarios pass.

6. Postman and README
   - Test the API endpoints in Postman.
   - Save example requests and responses.
   - Update README with setup, routes and test instructions.

The project files may be edited by more than one person. Coordinate before editing the same section of `app.js` to avoid merge conflicts.

## First-time Git setup

One member creates an empty GitHub repository named `trekgear-hub` and adds the other five members as collaborators.

The member who creates the repository runs:

```bash
git init
git add .
git commit -m "Initial TrekGear Hub project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

## Instructions for every teammate

Each teammate should:

1. Accept the GitHub repository collaboration invitation.
2. Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

3. Open the folder:

```bash
cd trekgear-hub
```

4. Install the project packages:

```bash
npm install
```

5. Create a separate branch for their work:

```bash
git checkout -b feature/your-part
```

Example:

```bash
git checkout -b feature/database
```

6. Make their assigned changes and test them.
7. Check changed files:

```bash
git status
```

8. Add and commit their work:

```bash
git add .
git commit -m "Add database tables"
```

Use a commit message that describes the actual work. Do not copy the example message if the work is different.

9. Push the branch:

```bash
git push -u origin feature/database
```

10. Open the GitHub repository in a browser and create a Pull Request from their branch into `main`.
11. Ask the team lead to review and merge the Pull Request.

## Before starting another task

After a teammate's changes are merged, update the local main branch:

```bash
git checkout main
git pull origin main
```

Then create a new branch for the next task.

## Important Git rules

- Every member must use their own GitHub account.
- Every member must make real commits for work they actually completed.
- Do not share GitHub passwords or personal access tokens.
- Do not make empty commits just to increase the commit count.
- Do not upload `node_modules/`, database files or passwords.
- Pull the latest `main` before starting a new task.
- If two people edit the same file, communicate and resolve conflicts before merging.
- Keep commit messages short and meaningful.

## Suggested commit message examples

```text
Set up Express server
Create SQLite database tables
Add tent CRUD endpoints
Add request validation
Add tent size search
Add top three rental query
Add Postman API tests
Update project README
```

Each student should be ready to explain their own code and commits during the live demonstration.
