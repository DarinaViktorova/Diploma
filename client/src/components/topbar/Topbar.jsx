import "./topbar.css";
import { Link } from "react-router-dom";
import { Search, Person, Chat, Notifications, ExitToAppRounded } from "@material-ui/icons";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Logout } from "../../context/AuthActions";
import NotFound from "../notFound/NotFound";
import axios from "axios";

const Topbar = () => {

    const { user, dispatch } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
    const history = useHistory();

    const handleLogout = () => {
        dispatch(Logout());
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery !== "") {
            try {
                const response = await axios.get(`/users?username=${searchQuery}`);
                const searchedUser = searchQuery;
                if (searchedUser === response.data.username) {
                  history.push("/profile/" + searchedUser);
                } 
              } catch (error) {
                 alert(`User doesn't exist`);
              }
          }
    }

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">SpeakUp</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <form className="searchBar">
                    <Search className="searchIcon" />
                    <input
                        type="text"
                        className="searchInput"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for friend, post or video"
                    />
                        <button type="submit" onClick={handleSearch}>Search</button>
                </form>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to="/" style={{ textDecoration: "none", color: "white", cursor: "pointer" }}>
                        <span className="topbarLink">Homepage</span>
                    </Link>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <Link to="/chat" style={{ textDecoration: "none", color: "white", cursor: "pointer"}}>
                        <div className="topbarIconItem">
                            <Chat />
                            <span className="topbarIconBadge">1</span>
                        </div>
                    </Link>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">1</span>
                    </div>

                </div>
                <Link to={`/profile/${user.username}`}>
                    <img src={user.avatar
                        ? publicFolder + user.avatar
                        : `${publicFolder}people/default_avatar.jpg`}
                        alt=""
                        className="topbarImg"
                    />
                </Link>

                <div className="topbarIconItem" onClick={handleLogout}>
                    <ExitToAppRounded />
                </div>

            </div>
        </div>
    )
}

export default Topbar;