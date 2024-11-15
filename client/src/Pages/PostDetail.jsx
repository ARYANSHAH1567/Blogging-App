import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Loader from "../Components/Loader";
import DeletePost from "./DeletePost";
import axios from "axios";
import PostAuthor from "../Components/PostAuthor";

/**
 * PostDetail component displays the details of a specific post,
 * including the title, description, author, and comments.
 * Allows the current user to leave and delete comments.
 *
 * @returns {JSX.Element} The rendered post detail page with comments and actions.
 */
const PostDetail = () => {
  const { id } = useParams(); // Get post ID from URL params
  const { currentUser } = useContext(UserContext); // Access current user from context
  const [post, setPost] = useState(null); // Store post data
  const [error, setError] = useState(null); // Store error messages
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [comment, setComment] = useState(""); // Store comment input value
  const [postComments, setPostComments] = useState([]); // Store comments for the post

  const token = currentUser?.token; // Extract token from current user for authentication

  /**
   * Handles the submission of a comment.
   * Sends the comment to the server and updates the post's comments list.
   *
   * @param {React.FormEvent} event The form submit event.
   */
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      if (comment === "") return alert("Please enter a comment!"); // Ensure comment is not empty
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/comments/${id}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }, // Include token in headers for authentication
      );
      setPostComments([...postComments, response.data]); // Update comments
      setComment(""); // Clear the comment input field
      window.location.reload(); // Reload the page to reflect the new comment
    } catch (error) {
      setError(error.response.data.message); // Set error if the request fails
    }
  };

  /**
   * Handles the deletion of a comment.
   * Deletes the comment from the server and updates the comments list.
   *
   * @param {React.FormEvent} event The form submit event.
   * @param {string} commentId The ID of the comment to be deleted.
   */
  const handleDelete = async (event, commentId) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state while deleting
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/comments/${id}/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Include token for authentication
        },
      );
      setPostComments(
        postComments.filter((deleteCom) => deleteCom._id !== commentId),
      ); // Remove deleted comment
      window.location.reload(); // Reload page to reflect the deletion
    } catch (error) {
      setError(error.response.data.message); // Set error if the request fails
    }
    setIsLoading(false); // Reset loading state
  };

  /**
   * Fetches post and comment data when the component is mounted.
   *
   * @returns {void}
   */
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true); // Set loading state while fetching data
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`, // Get post data by ID
        );
        setPost(response.data); // Set the fetched post
        const response2 = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/comments/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }, // Get comments for the post
        );
        setPostComments(response2.data); // Set the fetched comments
      } catch (error) {
        setError(error.message); // Set error if fetching data fails
      }
      setIsLoading(false); // Reset loading state
    };

    getPost(); // Call the function to fetch data
  }, []); // Empty dependency array to run on component mount only

  if (isLoading) return <Loader />; // Show loader while fetching data
  if (error) return <p className="error-page">{error}</p>; // Show error message if there is an error

  return (
    <section className="post-detail">
      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor creatorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === post.creator && (
              <div className="post-detail_buttons">
                <Link to={`/posts/${id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail-thumbnail">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post?.thumbnail}`}
              alt="Thumbnail"
            />
          </div>
          <br />
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
          <hr style={{ margin: "2rem 0", color: "var(--color-gray-300)" }} />
          <div className="col-10 offset-1 mb-3 mt-2">
            {currentUser && (
              <>
                <h4>Leave A Comment</h4>
                <form
                  onSubmit={handleCommentSubmit}
                  noValidate
                  className="needs-validation"
                >
                  <div className="mb-2 mt-2">
                    <label className="form-label" htmlFor="comment"></label>
                    <textarea
                      placeholder="Write Your Comment ..."
                      className="form-control"
                      name="text"
                      id="text"
                      cols="50"
                      rows="2"
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    className="mt-3 btn btn-outline-success"
                    type="submit"
                  >
                    Submit&nbsp;<i className="fa fa-paper-plane"></i>
                  </button>
                </form>
                <hr />
              </>
            )}
            <p>
              <b>All Comments</b>
            </p>
            <div className="comments row">
              {postComments.map((Comment) => (
                <div
                  key={Comment.id}
                  className="col-12 col-md-5 p-2 mt-2 ms-md-5 comment-card"
                >
                  <div className="card h-100">
                    <div className="card-body mb-2">
                      {
                        <h5 className="card-title">
                          <img
                            className="comment-avatar"
                            src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${Comment.creator.avatar}`}
                            alt=""
                          />
                          {Comment.creator.name}
                        </h5>
                      }
                      <p className="card-text">{Comment.comment}</p>
                    </div>
                    {currentUser.id === Comment.creator._id && (
                      <form
                        onSubmit={(event) =>
                          handleDelete(event, Comment.creator._id)
                        }
                        className="p-2"
                      >
                        <button
                          className="btn btn-outline-danger"
                          style={{
                            "--bs-btn-padding-y": ".25rem",
                            "--bs-btn-padding-x": ".5rem",
                            "--bs-btn-font-size": ".75rem",
                          }}
                          type="submit"
                        >
                          Delete&nbsp;&nbsp;
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
