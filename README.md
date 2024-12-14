# Task Manager with Node.js and SQLite

## Objective
Build a Task Manager application using Node.js and SQLite. The app will allow users to register, log in, and manage their tasks. Tasks will be stored in an SQLite database.

## Features

1. **User Registration**:
   - Users can register with a unique username and password.
   - Passwords are hashed before storing in the database.

2. **User Login**:
   - Users can log in with their username and password.
   - A JWT token is generated upon successful login.

3. **Task Management**:
   - **Add a Task**: Users can add new tasks with a title, description, and due date.
   - **List Tasks**: Users can list all their tasks.
   - **Update a Task**: Users can update the title, description, due date, and status of their tasks.
   - **Delete a Task**: Users can delete their tasks.

## Requirements
- Node.js
- SQLite3
- Express
- Body-parser
- JWT (jsonwebtoken)
- Bcrypt

## Setup

1. **Initialize the Project**:
   ```bash
   npm init -y
   ```

2. **Install Dependencies**:
   ```bash
   npm install express body-parser sqlite3 jsonwebtoken bcrypt
   ```

3. **Create Required Files**:
   - Create a `server.js` file for the server logic.
   - Create a `db` directory and an empty `tasks.db` file to act as the database.
   - Create `routes` and `middleware` directories for organizing routes and middleware.

## Database Setup

- The database is set up in the `server.js` file. It creates `users` and `tasks` tables if they do not exist.

## API Endpoints

1. **Register a New User**:
   ```bash
   POST /register
   ```
   - Request Body: `{ "username": "your_username", "password": "your_password" }`
   - Response: `{ "message": "User registered successfully" }`

2. **Login User**:
   ```bash
   POST /login
   ```
   - Request Body: `{ "username": "your_username", "password": "your_password" }`
   - Response: `{ "token": "your_jwt_token" }`

3. **Get Tasks for Authenticated User**:
   ```bash
   GET /tasks
   ```
   - Headers: `{ "Authorization": "Bearer your_jwt_token" }`
   - Response: `[ { "id": 1, "title": "Task title", "description": "Task description", "due_date": "YYYY-MM-DD", "status": "pending" } ]`

4. **Add a New Task**:
   ```bash
   POST /tasks
   ```
   - Headers: `{ "Authorization": "Bearer your_jwt_token" }`
   - Request Body: `{ "title": "Task title", "description": "Task description", "due_date": "YYYY-MM-DD" }`
   - Response: `{ "id": 1, "title": "Task title", "description": "Task description", "due_date": "YYYY-MM-DD", "status": "pending" }`

5. **Update a Task**:
   ```bash
   PUT /tasks/:id
   ```
   - Headers: `{ "Authorization": "Bearer your_jwt_token" }`
   - Request Body: `{ "title": "New title", "description": "New description", "due_date": "YYYY-MM-DD", "status": "completed" }`
   - Response: `{ "message": "Task updated successfully" }`

6. **Delete a Task**:
   ```bash
   DELETE /tasks/:id
   ```
   - Headers: `{ "Authorization": "Bearer your_jwt_token" }`
   - Response: `{ "message": "Task deleted successfully" }`

## Running the Server

1. **Start the Server**:
   ```bash
   node server.js
   ```
   - The server will run on `http://localhost:3000`.

## Extensions (Optional)
- Add a "priority" field for tasks and allow sorting tasks by priority.
- Implement pagination for listing tasks.
- Add more detailed error handling and validation.

This project introduces basic CRUD operations, user authentication, and working with SQLite in a Node.js environment.
