import "./rightbar.css";
import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {getFriendsList, putUserUnfollow, putUserFollow} from "../../api/users.js";
import {postUserConversation} from "../../api/conversations.js";

const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

const Rightbar = ({ user }) => {

  const [friends, setFriends] = useState([]);
  const {user: currentUser, dispatch} = useContext(AuthContext);
  const history = useHistory();

  const isFollowed = () => {
    return currentUser?.followings?.includes(user?._id);
  }

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (!user._id) return;
        const friendList = await getFriendsList(user._id);
        setFriends(friendList.data)
      } catch (error) {
        console.log(error)
      }
    };
    getFriends();
  }, [user._id]);

  const handleClickFollow = async () => {
    try {
      if (isFollowed()) {
        await putUserUnfollow(user._id, currentUser._id);
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await putUserFollow(user._id, currentUser._id);
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleClickMessage = async () => {
    try {
      const response = await postUserConversation(user._id, currentUser._id);
      history.push(`/chat/messages/${response.data._id}`);
    } catch (error) {
      console.log(error);
    }
  }

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <>
            <button className="rightbarFollowButton" onClick={handleClickFollow}>
              {isFollowed() ? "Unfollow" : "Follow"}
            </button>
            <button className="rightbarFollowButton" onClick={handleClickMessage}> 
              Message
            </button>
          </>
        )}
  
        <span className="rightbarTitle"> Information about {user.username}</span>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>

          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1 ? "Single" 
              : user.relationship === 2 ? "Married" 
              : "-"}
            </span>
          </div>
        </div>

        <h4 className="rightbarTitle"> User followings</h4>
        <div className="rightbarFollowings">
          { friends.map((friend) => (
            <Link key={friend._id} to={"/profile/" + friend.username} style={{textDecoration: "none"}}>
              <div className="rightbarFollowing">
                <img src={friend.avatar 
                    ? publicFolder + friend.avatar
                    : publicFolder + "people/default_avatar.jpg"
                  } 
                  alt="" 
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <ProfileRightbar />
      </div>
    </div>
  )
}

export default Rightbar
