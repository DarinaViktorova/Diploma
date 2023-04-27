import { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import "./login.css";
import { CircularProgress } from "@material-ui/core";
import {Link} from "react-router-dom";
import Register from "../register/Register";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

  const email = useRef();
  const password = useRef();
  const {user, isFetching, error, dispatch} = useContext(AuthContext)

  const handleLoginClick = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value }, dispatch);
  }

  console.log(user);

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
                <input
                  placeholder="Password" 
                  type="password" 
                  required
                  className="loginInput" 
                  minLength="6"
                  ref={password}
                />
                <span className="loginForgot">Forgot password?</span>
                <button className="loginButton">{ isFetching ? <CircularProgress size={24} color="inherit"/> : "Log in" }</button>

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
