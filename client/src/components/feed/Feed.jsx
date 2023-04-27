import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";

const Feed = ({ username }) => {

  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect( () => {
    const fetchPosts = async () =>{
      const response = username 
        ? await axios.get(`/posts/profile/${username}`) 
        : await axios.get(`/posts/timeline/${user._id}`);
      setPosts(response.data);
  }
  fetchPosts();
  }, [username, user._id])

  return (
    <div className="feed">
      <div className="feedWrapper">
      {(!username || username === user.username) && <Share />}
    
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  )
}

export default Feed

