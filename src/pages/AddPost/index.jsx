import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Navigate, Link } from "react-router-dom";
import { isAuthSelect } from "../../redux/slices/auth";
import { useRef } from "react";

export const AddPost = () => {
  const isAuth = useSelector(isAuthSelect);
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const userData = useSelector((state) => state.auth.data);
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [userPost, setUserPost] = React.useState(null);
  const [imgUrl, setImgUrl] = React.useState("");
  const [value, setValue] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);

      const { data } = await axios.post("/upload", formData);
      setImgUrl(data.url);
    } catch (error) {
      console.log(error);
      alert("Ошибка при загрузке файла!");
    }
  };

  const onClickRemoveImage = () => {
    setImgUrl("");
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imgUrl,
        text: value,
        tags,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const idx = isEditing ? id : data._id;
      setUserPost(data.user);

      navigate(`/posts/${idx}`);
    } catch (error) {
      console.log(error);
      alert("Ошибка при создание поста!");
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setValue(data.text);
          setImgUrl(data.imgUrl);
          setTags(data.tags);
          setUserPost(data.user);
        })
        .catch((e) => console.warn(e));
    }
    // eslint-disable-next-line
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Paper style={{ padding: 30 }} className="hidden">
        <Button
          variant="outlined"
          size="large"
          onClick={() => inputFileRef.current.click()}
          disabled={id && userData?._id !== userPost?._id}
        >
          Загрузить превью
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
        {imgUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
              disabled={id && userData?._id !== userPost?._id}
            >
              Удалить
            </Button>
            <img
              className={styles.image}
              src={`http://localhost:4444${imgUrl}`}
              alt="Uploaded"
            />
          </>
        )}

        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          disabled={id && userData?._id !== userPost?._id}
        />
        <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Тэги"
          fullWidth
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <SimpleMDE
          className={styles.editor}
          value={value}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <Button
            size="large"
            variant="contained"
            onClick={onSubmit}
            disabled={id && userData?._id !== userPost?._id}
          >
            {isEditing ? "Сохранить" : "Опубликовать"}
          </Button>
          <Link to="/">
            <Button size="large">Отмена</Button>
          </Link>
        </div>
      </Paper>
    </>
  );
};
