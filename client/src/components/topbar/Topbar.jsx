import "./topbar.css";
import { Link } from "react-router-dom";
import { HomeOutlined, MailOutline, ExitToAppRounded } from "@material-ui/icons";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from '../../apiCalls'
import { getUserByUsername } from "../../api/users";

const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

const Topbar = () => {

    const { user, dispatch } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = useState("");

    const history = useHistory();


    const handleLogout = () => {
        logoutCall(dispatch);
        history.push("/login");
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery !== "") {
            try {
                const response = await getUserByUsername(searchQuery);
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
                    <input
                        type="text"
                        className="searchInput"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for friend..."
                    />
                        <button type="submit" className="searchButton" onClick={handleSearch}>Search</button>
                </form>
            </div>

            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to="/" style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
                        <HomeOutlined />
                    </Link>
                </div>

                <div className="topbarIcons">
                    <Link to="/chat" style={{ textDecoration: "none", color: "white", cursor: "pointer"}}>
                        <div className="topbarIconItem">
                            <MailOutline style={{"color":"blue"}}/>
                        </div>
                    </Link>
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
                    <ExitToAppRounded style={{"color":"blue"}}/>
                </div>
            </div>
        </div>

    )
}

export default Topbar;