import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // Your custom styles should come AFTER Bootstrap
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import PostDetail from "./Pages/PostDetail";
import Login from "./Pages/Login";
import UserProfile from "./Pages/UserProfile";
import Authors from "./Pages/Authors";
import CreatePost from "./Pages/CreatePost";
import AuthorPosts from "./Pages/AuthorPosts";
import Dashboard from "./Pages/Dashboard";
import EditPost from "./Pages/EditPost";
import Logout from "./Pages/Logout";
import CategoryPosts from "./Pages/CategoryPosts";
import Register from "./Pages/Register";
import DeletePost from "./Pages/DeletePost";
import UserProvider from "./context/userContext";
import ProtectedRoute from "./Components/ProtectedRoute";

/**
 * Main router configuration for the application using `createBrowserRouter`.
 * Defines all the routes and their components, along with nested child routes.
 * @type {import('react-router-dom').RouteObject[]}
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      /** Home page route */
      { index: true, element: <Home /> },

      /** Post details page route */
      { path: "posts/:id", element: <PostDetail /> },

      /** User registration page route */
      { path: "register", element: <Register /> },

      /** User login page route */
      { path: "login", element: <Login /> },

      /**
       * User profile page route.
       * Protected with `ProtectedRoute` to ensure only authenticated users can access it.
       */
      {
        path: "profile/:id",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },

      /** Authors list page route */
      { path: "authors", element: <Authors /> },

      /**
       * Create post page route.
       * Protected with `ProtectedRoute` to ensure only authenticated users can access it.
       */
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        ),
      },

      /** Posts filtered by category route */
      { path: "posts/categories/:category", element: <CategoryPosts /> },

      /** Posts created by a specific author route */
      { path: "posts/users/:id", element: <AuthorPosts /> },

      /**
       * User dashboard route for managing user's own posts.
       * Protected with `ProtectedRoute` to ensure only authenticated users can access it.
       */
      {
        path: "myposts/:id",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      /**
       * Edit post page route.
       * Protected with `ProtectedRoute` to ensure only authenticated users can access it.
       */
      {
        path: "posts/:id/edit",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },

      /**
       * Delete post page route.
       * Protected with `ProtectedRoute` to ensure only authenticated users can access it.
       */
      {
        path: "posts/:id/delete",
        element: (
          <ProtectedRoute>
            <DeletePost />
          </ProtectedRoute>
        ),
      },

      /** Logout page route */
      { path: "logout", element: <Logout /> },
    ],
  },
]);

/**
 * Root element for rendering the React application.
 * Initializes the application with StrictMode and RouterProvider.
 */
const root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * Renders the React application into the DOM.
 * Uses `RouterProvider` to supply the configured router to the app.
 */
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
