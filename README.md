# MERN-task

## API Documentation

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
    "description": "string"
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
    "description": "string"
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

### Development Environment

1. **Build the development image**:
   ```bash
   docker build -t mern-task-dev .
   ```

2. **Run the development container**:
   ```bash
   docker-compose up
   ```

3. **Run the development container in detached mode**:
   ```bash
   docker-compose up -d
   ```

4. **Stop the development container**:
   ```bash
   docker-compose down
   ```

### Production Environment

1. **Build the production image**:
   ```bash
   docker build -f Dockerfile.prod -t mern-task-prod .
   ```

2. **Run the production container**:
   ```bash
   docker-compose -f docker-compose.prod.yml up
   ```

3. **Run the production container in detached mode**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Stop the production container**:
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

### Common Docker Commands

- **View running containers**:
  ```bash
  docker ps
  ```

- **View all containers (including stopped ones)**:
  ```bash
  docker ps -a
  ```

- **View container logs**:
  ```bash
  docker logs <container_id>
  ```

- **Execute command in running container**:
  ```bash
  docker exec -it <container_id> <command>
  ```

- **Remove all stopped containers**:
  ```bash
  docker container prune
  ```

- **Remove unused images**:
  ```bash
  docker image prune
  ```

### Environment Variables

The application uses the following environment variables:

- Development: `.env`
- Production: `.env.prod`

Make sure to set up these files with appropriate values before running the containers.
