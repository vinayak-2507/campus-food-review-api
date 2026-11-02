# Campus Food Review API

A beginner-friendly REST API for sharing and browsing food reviews around campus. It uses Express, Mongoose, MongoDB Atlas, and `bcryptjs` for password hashing.

## Requirements

- Node.js 20.19.0 or newer
- npm
- A MongoDB Atlas cluster or local MongoDB instance

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root (it is ignored by Git):

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database-name>?retryWrites=true&w=majority
   PORT=3000
   ```

   Copy the application connection string from Atlas. URL-encode special characters in the database username or password. Never commit `.env` or share its contents.

3. Start the server:

   ```bash
   npm run dev
   ```

   Or use `npm start` for a normal start. The server connects to MongoDB before it begins listening.

## API

All request and response bodies are JSON. The server uses `http://localhost:3000` by default.

### Status

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Basic API status text |
| GET | `/api/health` | API and MongoDB connection status |

### Food reviews

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/reviews` | List reviews; optionally filter with `?category=snacks`, `?rating=4`, or both |
| GET | `/api/reviews/:id` | Get one review |
| POST | `/api/reviews` | Create a review |
| PATCH | `/api/reviews/:id` | Update one or more review fields |
| DELETE | `/api/reviews/:id` | Delete a review |

Review fields:

```json
{
  "name": "Masala Dosa",
  "location": "Student Centre",
  "category": "South Indian",
  "rating": 5,
  "price": 60,
  "review": "Crispy, filling, and good value."
}
```

`rating` must be a number from 1 to 5. `price` must be a non-negative number. All six fields are required when creating a review; updates may include any non-empty subset of them.

Example:

```bash
curl "http://localhost:3000/api/reviews?category=South%20Indian&rating=5"
```

### Accounts

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account; password must be 8–72 characters |
| POST | `/api/auth/login` | Check an email and password |

Registration body:

```json
{
  "name": "A Student",
  "email": "student@example.com",
  "password": "a-strong-password"
}
```

Passwords are hashed with `bcryptjs` before they are stored. Responses never include the password or password hash. Login returns the account profile; this project does not issue authentication tokens.

## Status codes

- `200` successful read, update, delete, login, or status request
- `201` review or account created
- `400` invalid JSON, input, or ID
- `401` invalid login credentials
- `404` route or review not found
- `409` email already registered
- `500` unexpected server error
- `503` health check while MongoDB is disconnected

## Project layout

```text
src/
  app.js
  index.js
  controllers/
    authController.js
    reviewController.js
  middleware/
    errorHandler.js
  models/
    Review.js
    User.js
  routes/
    authRoutes.js
    reviewRoutes.js
```

## Notes

- Review routes are open for this college project; user accounts are not yet tied to review ownership.
- Keep credentials in `.env`; `.gitignore` excludes it from Git.
