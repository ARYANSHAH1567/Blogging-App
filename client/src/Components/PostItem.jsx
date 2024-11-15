import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

/**
 * PostItem component displays a single post with its details like title, description, and category.
 * It also shows the author information and category as a link.
 *
 * @param {Object} props - The component props.
 * @param {string} props.postId - The ID of the post.
 * @param {string} props.category - The category of the post.
 * @param {string} props.title - The title of the post.
 * @param {string} props.description - A brief description of the post.
 * @param {string} props.creatorID - The ID of the post creator.
 * @param {string} props.thumbnail - The thumbnail image for the post.
 * @param {string} props.createdAt - The creation date of the post.
 * @returns {JSX.Element} The rendered PostItem component.
 */
const PostItem = ({
  postId,
  category,
  title,
  description,
  creatorID,
  thumbnail,
  createdAt,
}) => {
  // Truncate description to a maximum length of 145 characters
  const shrortDescription =
    description.length > 145 ? description.substr(0, 145) + "..." : description;

  // Truncate title to a maximum length of 30 characters
  const postTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;

  return (
    <article className="post">
      {/* Post Thumbnail */}
      <div className="post_thumbnail">
        <img
          src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`}
          alt={title}
        />
      </div>

      <div className="post_content">
        {/* Post Title with Link */}
        <Link to={`/posts/${postId}`}>
          <h3> {postTitle} </h3>
        </Link>
      </div>

      {/* Shortened Description */}
      <p dangerouslySetInnerHTML={{ __html: shrortDescription }} />

      <div className="post_footer">
        {/* Author Information */}
        <PostAuthor creatorID={creatorID} createdAt={createdAt} />

        {/* Category Link */}
        <Link to={`/posts/categories/${category}`} className="btn category">
          {category}
        </Link>
      </div>
    </article>
  );
};

export default PostItem;
