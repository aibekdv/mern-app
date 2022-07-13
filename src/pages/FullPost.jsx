import React from "react";
import ReactMarkdown from "react-markdown";

import { Post } from "../components/Post";
import { useNavigate, useParams } from "react-router-dom";
import axios from "./../api/axios";

export const FullPost = () => {
  const [post, setPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получение статью");
        return navigate("/");
      });
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <Post isFullPost isLoading={true} />;
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imgUrl}
        user={post.user}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={3}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
    </>
  );
};
