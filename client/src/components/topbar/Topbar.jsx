import "./topbar.css";
import { Link } from "react-router-dom";
import { Search, HomeOutlined, MailOutline, ExitToAppRounded } from "@material-ui/icons";
import { useContext, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from '../../apiCalls'
import axios from "axios";
import {io} from "socket.io-client";
import { useEffect } from "react";


const Topbar = () => {

    const { user, dispatch } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState("");
   // const [unreadCount, setUnreadCount] = useState(0);
    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
    const history = useHistory();


    // const socket = useRef();

    // useEffect(() => {
    //     socket.current = io("ws://localhost:8900");
    //     socket.current.on("unreadCount", (newCount) => {
    //         setUnreadCount(newCount);
    //     })
    // }, []);

    // const updateUnreadCount = (newCount) => {

    // }


    const handleLogout = () => {
        logoutCall(dispatch);
        history.push("/login");
    }

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
                    {/* <Search className="searchIcon" /> */}
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
                    <Link to="/" style={{ textDecoration: "none", color: "yellow", cursor: "pointer" }}>
                        <HomeOutlined />
                    </Link>
                </div>
                <div className="topbarIcons">

                    <Link to="/chat" style={{ textDecoration: "none", color: "white", cursor: "pointer"}}>
                        <div className="topbarIconItem">
                            <MailOutline style={{"color":"yellow"}}/>
                            <span className="topbarIconBadge">1</span>
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
                    <ExitToAppRounded style={{"color":"yellow"}}/>
                </div>

            </div>
        </div>
    )
}

export default Topbar;