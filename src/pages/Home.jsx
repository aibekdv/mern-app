import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPopularPosts,
  fetchPosts,
  fetchTags,
} from "../redux/slices/posts";

export const Home = () => {
  const [tabId, setTabId] = React.useState(0);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    // eslint-disable-next-line
  }, []);

  const changeTabs = (val) => {
    if (val === 0) {
      dispatch(fetchPosts());
    } else {
      dispatch(fetchPopularPosts());
    }
    setTabId(val);
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabId}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={() => changeTabs(0)} />
        <Tab label="Популярные" onClick={() => changeTabs(1)} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((post, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
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
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
