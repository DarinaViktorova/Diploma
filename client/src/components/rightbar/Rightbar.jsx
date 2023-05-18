import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove, Message } from "@material-ui/icons";


const Rightbar = ({ user }) => {

  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const {user: currentUser, dispatch} = useContext(AuthContext);
  const [followed, setFollowed] = useState(currentUser?.followings?.includes(user?.id));
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data)
      } catch (error) {
        console.log(error)
      }
    };
    getFriends();
  }, [user]);

  const handleClickFollow = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        await dispatch({ type: "UNFOLLOW", payload: user._id });
        setFollowed(false);
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        await dispatch({ type: "FOLLOW", payload: user._id });
        setFollowed(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleClickMessage = async () => {
    try {
      const response = await axios.post("/conversations", {
        senderId: currentUser._id,
        receiverId: user._id,
      });
      history.push(`/chat/messages/${response.data._id}`);
    } catch (error) {
      console.log(error);
    }
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift-boxes.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Jasmine Jordan</b> and <b>3 others friends</b> have a Birthday today!
          </span>
        </div>
        <img src="/assets/ad.jpg" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online friends</h4>
        <ul className="rightbarFriendList">
          {Users.map(u => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <>
            <button className="rightbarFollowButton" onClick={handleClickFollow}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
            <button className="rightbarFollowButton" onClick={handleClickMessage}> 
              Message <Message />
            </button>
          </>
        )}
        <span className="rightbarTitle"> {user.username} info</span>
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
            <Link key={friend.id} to={"/profile/" + friend.username} style={{textDecoration: "none"}}>
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
        {user ? <ProfileRightbar /> : <HomeRightbar/>}
      </div>
    </div>
  )
}

export default Rightbar
