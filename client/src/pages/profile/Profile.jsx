import Topbar from '../../components/topbar/Topbar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../../components/notFound/NotFound';
import "./profile.css";
import {getUserByUsername} from "../../api/users.js";

const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

const Profile = () => {

  const username = useParams().username;

  const [user, setUser] = useState({});
  const [isNotFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByUsername(username);
        setNotFoundError(false);
        setUser(response.data);
      } catch (error) {
        setNotFoundError(true);
      }
    }
    fetchUser();
  }, [username])

  const UserProfile = () => {
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
              <Feed username={username} />
              <Rightbar user={user} />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {
        !isNotFoundError ? <UserProfile /> : <NotFound /> 
      }
    </>
  )
}

export default Profile
