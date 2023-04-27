import { useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./register.css";


const Register = () => {

  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const history = useHistory();

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      confirmPassword.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value
      }
      try{
        await axios.post("/auth/register", user);
        history.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  }

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
          <form className="loginBox" onSubmit={handleRegisterClick}>
            <input
              placeholder="Username"
              className="loginInput"
              ref={username}
              required
            />
            <input
              placeholder="E-mail"
              type="email"
              className="loginInput"
              ref={email}
              required
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              ref={password}
              required
              minLength="6"
            />
            <input
              placeholder="Confirm password"
              type="password"
              className="loginInput"
              ref={confirmPassword}
              required
              minLength="6"
            />
            <button className="loginButton" type="submit">Sign up</button>
            <Link to="/login">
            <button className="loginRegisterButton">Have an account? Log in!</button>
            </Link>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Register;
