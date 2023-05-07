import { useState, useEffect, useContext, useRef } from "react";
import { MoreVert, FavoriteRounded, Edit, RemoveCircleOutlineOutlined } from "@material-ui/icons";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import "./post.css";
import { AuthContext } from "../../context/AuthContext";
import {io} from "socket.io-client";


const Post = ({ post }) => {

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [arrivalComment, setArrivalComment] = useState(null);
  const [user, setUser] = useState({});
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const socket = useRef();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [deletePost, setDeletePost] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  /* Likes */

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id))
  }, [currentUser._id, post.likes])

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/users?userId=${post.userId}`);
      setUser(response.data);
    }
    fetchUser();
  }, [post.userId])

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (error) { }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  }

  /* Comments */

  /**Show */
  const handleShowComments = () => {
    setShowComments((shown) => !shown);
  };

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("newComment", (newComment) => {
      setArrivalComment(newComment);
    });
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`/posts/${post._id}/comments`);
      setComment(response.data);
    }
    fetchComments();
  }, [post._id, arrivalComment]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/posts/${post._id}/comments`, {
        userId: currentUser._id,
        text: commentText,
      });
      socket.current.emit("addComment", {
        postId: post._id,
      });
      setComment([...comment, { text: commentText, userId: currentUser._id }]);
      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  /** DELETE / UPDATE THE POST CAN ONLY AUTHOR */

  const handleDelete = async () => {
      // Проверяем, что текущий пользователь является автором поста
      if (currentUser._id === post.userId) {
        try{
          await axios.delete(`/posts/${ post._id }`, {
            data: { userId: currentUser._id },
          });
          // Если удаление прошло успешно, удаляем пост из состояния (state)
          setIsDeleted(true);
          window.location.reload();
        } catch (error) {}
      }
  };

  // Проверяем, что текущий пользователь является автором поста
  useEffect(() => {
    currentUser._id === post.userId && setIsCurrentUser(true);
    }, [currentUser._id, post.userId]);


    useEffect(() => {
      if (isDeleted) {
        // Загружаем обновленные данные из сервера и обновляем состояние компонента
        axios.get(`/posts/${ post._id }`)
          .then(res => {
            // Обновляем состояние компонента, чтобы он перерендерился с новыми данными
            setIsDeleted(false);
            setPosts(res.data);
          })
          .catch(error => console.error(error));
      }
    }, [isDeleted, post._id]);
  

  return (

    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">

            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.avatar
                    ? publicFolder + user.avatar
                    : publicFolder + "people/default_avatar.jpg"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>

            <Link to={`profile/${user.username}`} style={{ textDecoration: "none", color: "black" }}>
              <span className="postUserName">
                {user.username}
              </span>
            </Link>

            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          {isCurrentUser && (
            // <div className="postTopRight" onClick={handleDelete}>
            //   <RemoveCircleOutlineOutlined />
            // </div>

<div>
<IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={handleDelete}>
        <RemoveCircleOutlineOutlined /> Delete
        </MenuItem>
      </Menu>
      </div> 

          )}
        </div>
        <div className="postCenter">
          <span className="postText">{post?.description}</span>
          <img className="postImg" src={post.image ? publicFolder + post.image : ''} alt="" />

        </div>
        <div className="postBottom">
          <div className="postButtonLeft">
            <div onClick={likeHandler}>
              <FavoriteRounded style={{ color: isLiked ? "red" : "grey", coursor: "pointer" }} />
            </div>
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <Link to="#" onClick={handleShowComments}>
            <span className="postCommentCounter">{comment.length} comments</span>
          </Link>

        </div>
        <form onSubmit={handleCommentSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="commentInput"
      />
      <button type="submit" className="postCommentButton">Post</button>
    </form>
        {showComments && (
          <div className="postButtonRight" onClick={handleShowComments}>

            {comment.map((c) => (
              <div key={c._id} className="comment">
                <Link
                  to={`/profile/${c.userId.username}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  {/* <img
            src={c.userId.avatar}
            alt={c.userId.username}
            className="commentAvatar"
          /> */}
                  <span className="commentUserName">{c.userId.username} : </span>
                  <span className="commentText">{c.text}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post
