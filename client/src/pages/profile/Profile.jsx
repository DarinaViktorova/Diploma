import Topbar from '../../components/topbar/Topbar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./profile.css";

const Profile = () => {

  const [user, setUser] = useState({});
  const username = useParams().username;

  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/users?username=${username}`);
      setUser(response.data);
    }
    fetchUser();
  }, [username])

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img 
                src={user.coverPicture
                  ? publicFolder + user.coverPicture 
                  : publicFolder + "people/default_cover.png"} 
                alt="" 
                className="profileCoverImg" 
              />
              <img src={
                user.avatar
                  ? publicFolder + user.avatar
                  : publicFolder + "people/default_avatar.jpg"
              }
                alt=""
                className="profileUserImg" />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <h4 className="profileInfoDesc">{user.description}</h4>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
