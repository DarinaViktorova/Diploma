import { useRef, useContext, useState } from "react";
import { loginCall } from "../../apiCalls";
import "./login.css";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

const Login = () => {
  const email = useRef();
  const password = useRef();

  const { isFetching, dispatch } = useContext(AuthContext);
  
  const [shownPassword, setShownPassword] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value }, dispatch);
  }

  const togglePasswordVisibility = () => {
    setShownPassword(!shownPassword);
  }

  // console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SpeakUp</h3>
          <span className="loginDescription">
            Connect, share, and be heard.
          </span>
        </div>
        
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleLoginClick}>
            <input
              placeholder="E-mail"
              type="email"
              required
              className="loginInput"
              ref={email}
            />

            <div className="passwordInputWrapper">
              <input
                placeholder="Password"
                type={shownPassword ? "text" : "password"}
                required
                className="loginInput"
                minLength="6"
                ref={password}
              />
              <small className="passwordToggle" onClick={togglePasswordVisibility}>
                {shownPassword
                  ? <VisibilityOffOutlinedIcon title="Hide" />
                  : <VisibilityOutlinedIcon title="Show" />
                }
              </small>
            </div>

            <button className="loginButton">{isFetching ? <CircularProgress size={24} color="inherit" /> : "Log in"}</button>

            <Link to="/register">
              <button className="loginRegisterButton" >
                {isFetching ? <CircularProgress size={24} color="inherit" /> : "Create a new account"}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
