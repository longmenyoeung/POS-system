# POS-system

REST API for the **TECHPOS** point-of-sale system. Built with Node.js and Express 5,
backed by MySQL, with JWT authentication and role based access control.

The API is consumed by the `react-web` front end and uses the `techpos_db` MySQL schema.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js (CommonJS) |
| Web framework | Express 5 |
| Database | MySQL via `mysql2/promise` (connection pool, named placeholders) |
| Auth | `jsonwebtoken` (JWT) + `bcrypt` password hashing |
| Validation | `express-validator` |
| Other | `cors`, `moment` |
| Dev tooling | `nodemon` |

## Requirements

- Node.js 18 or newer
- MySQL 8.x server running on `localhost:3306`
- Database `techpos_db` created and populated

## Getting Started

```bash
# 1. install dependencies
npm install

# 2. start in watch mode (nodemon)
npm run dev

# or start normally
npm start
```

The server listens on **http://localhost:8081**.

## Configuration

All runtime settings live in `src/utils/config.js`:

```js
db:    { HOST, PORT, USER, NAME: 'techpos_db', PASSWORD }
token: { access_token_key }
```

The database pool is created in `src/config/conection.js` from those values.
Change the `db` block to match your local MySQL credentials before starting the server.

## API Endpoints

Base path: `/api`

### Auth / Users

| Method | Endpoint | Description | Middleware |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | – |
| POST | `/api/auth/login` | Login, returns JWT | – |
| POST | `/api/auth/profile` | Current user profile | `validate_token` |
| DELETE | `/api/auth/change_password` | Change password | – |
| GET | `/api/auth/user` | List users | – |
| PUT | `/api/auth/user/:id` | Update user | – |
| DELETE | `/api/auth/user/:id` | Delete user | – |

### Categories

| Method | Endpoint | Description | Middleware |
| --- | --- | --- | --- |
| GET | `/api/categories` | List categories | `validate_token` |
| POST | `/api/categories` | Create category | `validate_token` |
| PUT | `/api/categories/:id` | Update category | – |
| DELETE | `/api/categories/:id` | Delete category | – |

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/product` | List products |

### Suppliers

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/supplier` | List suppliers |
| POST | `/api/supplier` | Create supplier |
| PUT | `/api/supplier/:id` | Update supplier |
| DELETE | `/api/supplier/:id` | Delete supplier |

### Customers

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/customer` | List customers |

### Roles

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/role` | List roles |
| POST | `/api/role` | Create role |
| PUT | `/api/role/:id` | Update role |
| DELETE | `/api/role/:id` | Delete role |

### System Config

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/config` | List configuration values |

## Project Structure

```
node-api/
├── index.js                  # Express app bootstrap, route registration, PORT 8081
├── package.json
└── src/
    ├── config/
    │   └── conection.js      # mysql2 connection pool
    ├── controllers/          # auth, category, config, customer, product, role, supplier
    ├── middleware/
    │   └── validate_access.js
    ├── routes/               # one route module per resource, registered in index.js
    └── utils/
        ├── config.js         # db + token configuration
        ├── helper.js         # shared exports (db connection, logError)
        └── logError.js       # writes error logs to ./logs
```

## Notes

- Runtime error logs are written to the `logs/` folder, which is git ignored.
- Authentication tokens are sent to `validate_token` as a bearer token.
- This repository contains the API only; the React front end and MySQL scripts live
  in the sibling `react-web` and `db` folders of the local project.

## License

ISC
