# User Registration Endpoint Documentation

## Endpoint: `/users/register`

### Method

`POST`

### Description

This endpoint allows users to register a new account. It validates the input data, hashes the password, creates a new user in the database, and returns an authentication token along with the user details.

---

## Request Data Format

The endpoint expects a JSON request body with the following structure:

```json
{
  "fullname": {
    "firstname": "string (required, min 3 characters)",
    "lastname": "string (optional, min 3 characters if provided)"
  },
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

### Request Parameters

| Field                | Type   | Required | Validation                   | Description                                  |
| -------------------- | ------ | -------- | ---------------------------- | -------------------------------------------- |
| `fullname.firstname` | String | Yes      | Min 3 characters             | User's first name                            |
| `fullname.lastname`  | String | No       | Min 3 characters if provided | User's last name                             |
| `email`              | String | Yes      | Valid email format           | User's email address (must be unique)        |
| `password`           | String | Yes      | Min 6 characters             | User's password (will be hashed with bcrypt) |

---

## Response

### Status Code: 201 (Created)

**Success Response**

```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "createdAt": "2026-02-21T10:00:00.000Z",
    "updatedAt": "2026-02-21T10:00:00.000Z"
  }
}
```

### Status Code: 400 (Bad Request)

**Validation Error Response**

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

---

## Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Validation Rules

The following validations are applied to the request:

1. **Email**: Must be a valid email format
2. **First Name**: Must be at least 3 characters long
3. **Password**: Must be at least 6 characters long
4. **First Name** (Database): Must be at least 3 characters long
5. **Last Name** (Database): Must be at least 3 characters long if provided
6. **Email** (Database): Must be unique in the database

---

## Error Handling

- If validation fails, the endpoint returns a 400 status with an array of validation errors
- The password is automatically hashed using bcrypt with a salt round of 10 before being stored in the database
- A JWT authentication token is generated using the user's MongoDB `_id` and the `JWT_SECRET` environment variable

---

## Authentication

Upon successful registration, the endpoint returns a JWT token that can be used for authenticating subsequent requests. The token is signed with:

- **Payload**: `{ _id: user._id }`
- **Secret**: `process.env.JWT_SECRET`

---

## Endpoint: `/users/login`

### Method

`POST`

### Description

This endpoint authenticates an existing user. It validates the provided credentials, compares the password with the stored hash, and returns a JWT token and user details on success.

---

## Request Data Format

The endpoint expects a JSON request body with the following structure:

```json
{
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

### Request Parameters

| Field      | Type   | Required | Validation         | Description          |
| ---------- | ------ | -------- | ------------------ | -------------------- |
| `email`    | String | Yes      | Valid email format | User's email address |
| `password` | String | Yes      | Min 6 characters   | User's password      |

---

## Response

### Status Code: 200 (OK)

**Success Response**

```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}
```

### Status Code: 400 (Bad Request)

**Validation Error Response**

```json
{
  "errors": [
    /* array of validation errors from express-validator */
  ]
}
```

### Status Code: 401 (Unauthorized)

**Invalid Credentials Response**

```json
{ "message": "Invalid email or password" }
```

---

## Example Request

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Validation Rules (login)

1. **Email**: Must be a valid email format
2. **Password**: Must be at least 6 characters long

---

## Error Handling (login)

- If validation fails, the endpoint returns a 400 status with an array of validation errors.
- If credentials are invalid, the endpoint returns a 401 status with a generic error message to avoid leaking which field failed.

---

## Endpoint: `/users/profile`

### Method

`GET`

### Description

This endpoint retrieves the authenticated user's profile information. It requires a valid JWT token for authentication.

---

## Authentication

This endpoint requires authentication. The JWT token can be sent via:

- **Cookie**: `token` cookie
- **Header**: `Authorization: Bearer <jwt_token>`

---

## Response

### Status Code: 200 (OK)

**Success Response**

```json
{
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null,
    "createdAt": "2026-02-21T10:00:00.000Z",
    "updatedAt": "2026-02-21T10:00:00.000Z"
  }
}
```

### Status Code: 401 (Unauthorized)

**Unauthorized Response**

```json
{ "message": "Unauthorized" }
```

---

## Example Request

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Endpoint: `/users/logout`

### Method

`GET`

### Description

This endpoint logs out the authenticated user. It clears the authentication cookie, blacklists the JWT token to prevent further use, and returns a success message.

---

## Authentication

This endpoint requires authentication. The JWT token can be sent via:

- **Cookie**: `token` cookie
- **Header**: `Authorization: Bearer <jwt_token>`

---

## Response

### Status Code: 200 (OK)

**Success Response**

```json
{
  "message": "Logged out successfully"
}
```

### Status Code: 401 (Unauthorized)

**Unauthorized Response**

```json
{ "message": "Unauthorized" }
```

---

## Example Request

```bash
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Error Handling (logout)

- The endpoint clears the `token` cookie from the client
- The token is added to the blacklist to prevent its use in future requests
- If the user is not authenticated, the endpoint returns a 401 status

---

# Captain Endpoints Documentation

## Endpoint: `/captains/register`

### Method

`POST`

### Description

Register a new captain (driver) account. Input is validated, password is hashed, and the captain document containing personal and vehicle details is stored. A JWT token is returned on success.

---

## Request Data Format

License allows the following JSON structure:

```json
{
  "fullname": {
    "firstname": "string (required, min 3 characters)",
    "lastname": "string (required, min 3 characters)"
  },
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)",
  "vehicle": {
    "color": "string (required, min 3 characters)",
    "plate": "string (required, min 3 characters)",
    "capacity": "integer (required, min 1)",
    "vehicleType": "string (required, one of car, motorcycle, auto)"
  }
}
```

### Request Parameters

| Field                 | Type    | Required | Validation                         | Description                            |
| --------------------- | ------- | -------- | ---------------------------------- | -------------------------------------- |
| `fullname.firstname`  | String  | Yes      | Min 3 characters                   | Captain's first name                   |
| `fullname.lastname`   | String  | Yes      | Min 3 characters                   | Captain's last name                    |
| `email`               | String  | Yes      | Valid email format                 | Captain's email (must be unique)       |
| `password`            | String  | Yes      | Min 6 characters                   | Password (hashed before storage)       |
| `vehicle.color`       | String  | Yes      | Min 3 characters                   | Color of the vehicle                   |
| `vehicle.plate`       | String  | Yes      | Min 3 characters                   | License plate number                   |
| `vehicle.capacity`    | Integer | Yes      | Minimum 1                          | Number of passengers vehicle can carry |
| `vehicle.vehicleType` | String  | Yes      | One of `car`, `motorcycle`, `auto` | Type of vehicle                        |

---

## Response

### Status Code: 201 (Created)

**Success Response**

```json
{
  "token": "jwt_token_string",
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "createdAt": "2026-02-26T12:00:00.000Z",
    "updatedAt": "2026-02-26T12:00:00.000Z"
  }
}
```

### Status Code: 400 (Bad Request)

**Validation Error Response**

```json
{
  "errors": [
    /* array of validation errors from express-validator */
  ]
}
```

---

## Example Request

```bash
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane@example.com",
    "password": "password123",
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }'
```

---

## Validation Rules (captain registration)

1. **Email**: Must be a valid email format
2. **First Name**: Must be at least 3 characters long
3. **Last Name**: Must be at least 3 characters long
4. **Password**: Must be at least 6 characters long
5. **Vehicle Color**: At least 3 characters
6. **Vehicle Plate**: At least 3 characters
7. **Vehicle Capacity**: Integer ≥ 1
8. **Vehicle Type**: One of `car`, `motorcycle`, or `auto`

---

## Error Handling (captain registration)

- Returns 400 with validation errors if input is invalid
- Checks for existing captain by email and returns 400 if found
- Password is hashed with bcrypt before saving
- A JWT token is generated using the captain's `_id` and `JWT_SECRET`
