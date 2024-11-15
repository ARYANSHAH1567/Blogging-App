import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * CreatePost component allows users to create a new post with a title, category,
 * description (using a rich text editor), and thumbnail image. It requires the user
 * to be authenticated (using `UserContext`), and upon submission, the post data is sent
 * to the server.
 *
 * @returns {JSX.Element} A form to create a new post.
 */
const CreatePost = () => {
  // State to manage form inputs
  const [title, setTitle] = useState(""); // Title of the post
  const [category, setCategory] = useState("Uncategorized"); // Category of the post
  const [description, setDescription] = useState(""); // Rich text description of the post
  const [thumbnail, setThumbnail] = useState(""); // Thumbnail image for the post
  const [error, setError] = useState(null); // Error message, if any

  // Get current user and token from context
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Quill editor modules and formats configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // Predefined categories for the post
  const POST_CATEGORIES = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "Uncategorized",
    "Weather",
  ];

  // Hook to navigate the user after successful post creation
  const navigate = useNavigate();

  /**
   * createPost function handles the form submission. It constructs a FormData object,
   * appends the form data, and sends a POST request to the server to create the post.
   * If successful, the user is redirected to the homepage. If there's an error, the error
   * message is set in the state and displayed on the form.
   *
   * @param {Event} e - The submit event triggered when the user submits the form.
   */
  const createPost = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/"); // Redirect to homepage on successful post creation
    } catch (error) {
      setError(error.response.data.message); // Set error message in case of failure
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>

        {/* Display error message if there was an error */}
        {error && <p className="form_error-message">{error}</p>}

        {/* Form for creating a post */}
        <form className="form create-post_form" onSubmit={createPost}>
          {/* Input for title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          {/* Select input for category */}
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* Quill editor for description */}
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />

          {/* Input for thumbnail image */}
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpg, jpeg"
          />

          {/* Submit button to create the post */}
          <button type="submit" className="btn primary">
            Create Post
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
