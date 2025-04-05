# MERN-task

## API Documentation (PORT:3000)

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Description**: Authenticate and login a user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Category Endpoints

All category endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Create Category
- **POST** `/api/categories`
- **Description**: Create a new category
- **Request Body**:
  ```json
  {
    "name": "string",
    "status": "active"||"inactive"
  }
  ```

#### Get All Categories
- **GET** `/api/categories`
- **Description**: Retrieve all categories

#### Get Category by ID
- **GET** `/api/categories/:id`
- **Description**: Retrieve a specific category by ID

#### Update Category
- **PUT** `/api/categories/:id`
- **Description**: Update a specific category
- **Request Body**:
  ```json
  {
    "name": "string",
    "status": "active"||"inactive"
  }
  ```

#### Delete Category
- **DELETE** `/api/categories/:id`
- **Description**: Delete a specific category

## Error Handling

All endpoints use a centralized error handling middleware that returns appropriate HTTP status codes and error messages in the following format:

```json
{
  "error": {
    "message": "string",
    "code": "number"
  }
}
```

## Authentication

- JWT (JSON Web Tokens) are used for authentication
- Tokens should be included in the Authorization header for protected routes
- Token format: `Bearer <token>`

## Docker Commands
### Production Environment

1. **Run the production container in detached mode without any env file**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

Make sure to set up these files with appropriate values before running the containers.
