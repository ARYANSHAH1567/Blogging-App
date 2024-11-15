import React, { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

/**
 * EditPost component allows users to edit an existing post.
 * It fetches the current post data and allows the user to update the title, category, description, and thumbnail.
 *
 * @returns {JSX.Element} A form to edit the post.
 */
const EditPost = () => {
  // State variables for form data and error handling
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Categorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState(null);

  // Hooks for navigation and route params
  const navigate = useNavigate();
  const { id } = useParams();

  // Accessing current user's token from context
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Quill editor configuration for rich text editing
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

  // Fetch the current post data when the component is mounted
  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
      } catch (error) {
        setError(error.response?.data.message || "An error occurred.");
      }
    };
    getPost();
  }, [id]);

  /**
   * Handles the form submission to update the post.
   * It sends a PATCH request to update the post data.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const editPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);

    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/"); // Redirect to homepage after successful update
    } catch (error) {
      setError(error.response?.data.message || "An error occurred.");
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form_error-message">{error}</p>}
        <form className="form create-post_form" onSubmit={editPost}>
          {/* Title input */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          {/* Category select */}
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* ReactQuill rich text editor for description */}
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />

          {/* Thumbnail upload */}
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/png, image/jpeg"
          />

          {/* Submit button */}
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
