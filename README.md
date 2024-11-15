# Blogging Website

## Project Overview

This is a blogging platform where users can create, edit, and view blog posts. It provides features like user authentication, post creation, categories, and a comment section for each blog post. The website allows users to share their thoughts and interact with others through comments, creating a dynamic and engaging environment for writers and readers alike.

## Tech Stack

- **Frontend**: 
  - HTML, CSS, JavaScript
  - React.js (for building UI components and managing application state)
  - Axios (for making HTTP requests)
  
- **Backend**:
  - Node.js with Express (for handling API routes)
  - MongoDB (for storing user data, posts, and comments)
  - JWT (for user authentication)

- **Authentication**:
  - JWT (JSON Web Tokens) for secure authentication

- **Styling**:
  - CSS for custom styling
  - Bootstrap And CSS (for responsive design)

## Setup Instructions

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB instance (either local or cloud)

### Steps to run locally:

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/blogging-website.git
    ```

2. Navigate to the `blog` directory and install the required dependencies:
    ```bash
    cd blog
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `server` directory and configure the following:
      ```
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```

4. Start the project:
    ```bash
    npm start
    ```

5. Visit `http://localhost:3000` in your browser to see the app in action.

## API Documentation

### 1. User Routes

- **POST /api/users/register**  
  Registers a new user.  
  - **Body**: 
    - `name` (string): The name of the user.
    - `email` (string): The email of the user.
    - `password` (string): The password for the user.
    - `confirmPassword` (string): Confirmation of the password.  
  - **Response**: 
    - A success message upon successful registration.
      ```json
      { "message": "User registered successfully" }
      ```

- **POST /api/users/login**  
  Logs in an existing user.  
  - **Body**: 
    - `email` (string): The email of the user.
    - `password` (string): The password for the user.  
  - **Response**: 
    - An object containing the user's ID, name, and JWT token for authentication.
      ```json
      {
        "userId": "1",
        "name": "User name",
        "token": "JWT_TOKEN"
      }
      ```

- **POST /api/users/change-avatar**  
  Allows the logged-in user to change their avatar. (Requires authentication)  
  - **Body**: 
    - `avatar` (File): The new avatar image to upload.  
  - **Response**: 
    - The updated user object with the new avatar.
      ```json
      {
        "id": "1",
        "name": "User name",
        "email": "user@example.com",
        "avatar": "new_avatar_url"
      }
      ```

- **PATCH /api/users/edit-user**  
  Edits user details such as name, email, and password. (Requires authentication)  
  - **Body**: 
    - `name` (string): The new name of the user (optional).
    - `email` (string): The new email of the user (optional).
    - `currentPassword` (string): The current password for verification (if changing password).
    - `newPassword` (string): The new password (if updating).
    - `confirmNewPassword` (string): Confirmation of the new password.  
  - **Response**: 
    - The updated user object.
      ```json
      {
        "id": "1",
        "name": "Updated name",
        "email": "updated_email@example.com",
        "avatar": "avatar_url"
      }
      ```

- **GET /api/users/authors**  
  Fetches all authors (users) in the system.  
  - **Response**: 
    - An array of all users (authors) in the system.
      ```json
      [
        { "id": "1", "name": "Author name", "email": "author@example.com" },
        { "id": "2", "name": "Another Author", "email": "another@example.com" }
      ]
      ```

- **POST /api/users/:id**  
  Fetches a specific user's profile by ID.  
  - **Params**: 
    - `id` (string): The ID of the user to retrieve.  
  - **Response**: 
    - The user object with the specified ID.
      ```json
      {
        "id": "1",
        "name": "User name",
        "email": "user@example.com",
        "avatar": "avatar_url"
      }
      ```

### 2. Post Routes

- **POST /api/posts**  
  Creates a new blog post. (Requires authentication)  
  - **Body**: 
    - `title` (string): The title of the post.
    - `description` (string): The content of the post.
    - `category` (string): The category of the post (e.g., Agriculture, Business, etc.).
    - `thumbnail` (File): The thumbnail image for the post.  
  - **Response**: 
    - The newly created post object.
      ```json
      {
        "id": "1",
        "title": "Post title",
        "description": "Post content",
        "category": "Business",
        "thumbnail": "image_url"
      }
      ```

- **GET /api/posts**  
  Fetches all blog posts.  
  - **Response**: 
    - An array of all posts.
      ```json
      [
        {
          "id": "1",
          "title": "Post title",
          "description": "Post content",
          "category": "Business",
          "thumbnail": "image_url"
        },
        {
          "id": "2",
          "title": "Another post title",
          "description": "More content",
          "category": "Technology",
          "thumbnail": "image_url"
        }
      ]
      ```

- **GET /api/posts/:id**  
  Fetches a specific blog post by its ID.  
  - **Params**: 
    - `id` (string): The ID of the post to retrieve.  
  - **Response**: 
    - The post with the specified ID.
      ```json
      {
        "id": "1",
        "title": "Post title",
        "description": "Post content",
        "category": "Business",
        "thumbnail": "image_url"
      }
      ```

- **PATCH /api/posts/:id**  
  Edits a specific blog post. (Requires authentication)  
  - **Params**: 
    - `id` (string): The ID of the post to edit.
  - **Body**: 
    - `title` (string): The updated title of the post.
    - `description` (string): The updated description of the post.
    - `category` (string): The updated category of the post.
    - `thumbnail` (File): The updated thumbnail image for the post.  
  - **Response**: 
    - The updated post object.
      ```json
      {
        "id": "1",
        "title": "Updated title",
        "description": "Updated content",
        "category": "Education",
        "thumbnail": "updated_image_url"
      }
      ```

- **GET /api/posts/categories/:category**  
  Fetches all blog posts in a specific category.  
  - **Params**: 
    - `category` (string): The category to filter posts by (e.g., Business, Education).  
  - **Response**: 
    - An array of posts in the specified category.
      ```json
      [
        {
          "id": "1",
          "title": "Business Post",
          "description": "Business content",
          "category": "Business",
          "thumbnail": "image_url"
        }
      ]
      ```

- **GET /api/posts/users/:id**  
  Fetches all blog posts created by a specific user.  
  - **Params**: 
    - `id` (string): The ID of the user to retrieve posts for.  
  - **Response**: 
    - An array of posts created by the specified user.
      ```json
      [
        {
          "id": "1",
          "title": "User's Post",
          "description": "User's content",
          "category": "Business",
          "thumbnail": "image_url"
        }
      ]
      ```

- **DELETE /api/posts/:id**  
  Deletes a specific blog post. (Requires authentication)  
  - **Params**: 
    - `id` (string): The ID of the post to delete.  
  - **Response**: 
    - A message confirming the post has been deleted.
      ```json
      {
        "message": "Post deleted successfully"
      }
      ```


### 3. Comment Routes

- **GET /api/comments/:id**  
  Fetches all comments for a specific blog post.  
  - **Params**: 
    - `id` (string): The ID of the post to retrieve comments for.  
  - **Response**: 
    - An array of comments associated with the post.
      ```json
      [
        { "comment": "This is a comment", "author": "Author name" },
        { "comment": "Another comment", "author": "Author name" }
      ]
      ```

- **POST /api/comments/:id**  
  Adds a new comment to a specific blog post. (Requires authentication)  
  - **Params**: 
    - `id` (string): The ID of the post to create a comment on.  
  - **Body**: 
    - `{ "comment": "This is a new comment" }`
  - **Response**: 
    - The newly created comment object.
      ```json
      { "comment": "This is a new comment", "author": "Author name" }
      ```

- **DELETE /api/comments/:id/:commentId**  
  Deletes a comment from a specific blog post. (Requires authentication)  
  - **Params**: 
    - `id` (string): The ID of the post containing the comment.
    - `commentId` (string): The ID of the comment to delete.  
  - **Response**: 
    - A message confirming the comment has been deleted.
      ```json
      { "message": "Comment deleted successfully" }
      ```

## Future Improvements

- **Likes & Dislikes**: Implement a voting system for blog posts and comments, allowing users to like or dislike content.
- **Real-time Comments**: Use WebSockets to update the comment section in real-time when new comments are added.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
