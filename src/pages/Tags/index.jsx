import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Post } from "../../components";
import { fetchPosts } from "../../redux/slices/posts";

const Tags = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);

  const isPostLoading = posts.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts());
    // eslint-disable-next-line
  }, []);

  if (isPostLoading) {
    return <Post isLoading={true} />;
  }

  return (
    <>
      {posts?.items.map(
        (post) =>
          post.tags.includes(tag) && (
            <Post
              id={post._id}
              key={post._id}
              title={post.title}
              imageUrl={post.imgUrl ? post.imgUrl : ""}
              user={post.user}
              createdAt={post.createdAt}
              viewsCount={post.viewsCount}
              commentsCount={3}
              tags={post.tags}
              isEditable={userData?._id === post.user._id}
            />
          )
      )}
    </>
  );
};

export default Tags;
