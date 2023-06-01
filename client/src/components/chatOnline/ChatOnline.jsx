import { useState, useEffect } from "react";
import "./chatOnline.css";
import axios from "axios";

const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

const ChatOnline = ({ onlineUsers, currentId }) => {

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const response = await axios.get("/users/friends/" + currentId);
      setFriends(response.data);
    }
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);
  // console.log(friends)
  return (
    <div className="chatOnline">
      <h1>Online</h1>
      {
        onlineFriends.map((online) => (

          <div className="chatOnlineFriend">
            <div className="chatOnlineImgContainer">
              <img
                src={online?.avatar
                  ? publicFolder + online.avatar
                  : `${publicFolder}people/default_avatar.jpg`}
                alt="" 
                className="chatOnlineImg" />

              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{online.username}</span>
          </div>
        ))}
    </div>
  )
}

export default ChatOnline
