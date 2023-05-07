import "./conversation.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {

  const [user, setUser] = useState(null);
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find(m => m !== currentUser._id);

    const getUser = async () => {
      try {
        const response = await axios("/users?userId=" + friendId);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation])

  return (
    <div className="conversation">
       {user && 
      <>
        <img 
         src={
          user?.avatar
            ? publicFolder + user.avatar
            : publicFolder + "people/default_avatar.jpg"
        }
          alt="" 
          className="conversationImg" 
        />
        <span className="conversationName">{user?.username}</span>
      </>
    }
    </div>
  )
}

export default Conversation
