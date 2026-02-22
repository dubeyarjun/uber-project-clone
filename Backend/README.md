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
