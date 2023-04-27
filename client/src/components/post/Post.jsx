import { useState, useEffect, useContext } from "react";
import { MoreVert } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import "./post.css";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post }) => {

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [user, setUser] = useState({});

  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  const {user: currentUser} = useContext(AuthContext)

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
    } catch (error) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  }

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

            <Link to={`profile/${user.username}`}  style={{ textDecoration: "none", color: "black" }}>
              <span className="postUserName">
              {user.username}
            </span>
            </Link>

            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.description}</span>
          {/*console.log(publicFolder + post?.image)*/}
          {/* <img className="postImg" src={publicFolder + post?.image} alt="" /> */}
          <img className="postImg" src={post.image ? publicFolder + post.image : ''} alt="" />

        </div>
        <div className="postBottom">
          <div className="postButtonLeft">
            <img src={`${publicFolder}like.png`} alt="" className="likeIcon" onClick={likeHandler} />
            <img src={`${publicFolder}heart.png`} alt="" className="likeIcon" onClick={likeHandler} />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postButtonRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
