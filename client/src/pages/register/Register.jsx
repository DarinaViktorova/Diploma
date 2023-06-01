import { useRef, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { postRegisterUser } from "../../api/auth.js";
import "./register.css";
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();

  const [shownPassword, setShownPassword] = useState(false);
  const [shownPassword2, setShownPassword2] = useState(false);

  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShownPassword(!shownPassword);
  }

  const togglePasswordVisibility2 = () => {
    setShownPassword2(!shownPassword2);
  }

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
      try {
        await postRegisterUser(user);
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

            <div className="passwordInputWrapper">
              <input
                placeholder="Password"
                type={shownPassword ? "text" : "password"}
                className="loginInput"
                ref={password}
                required
                minLength="6"
              />
              <small className="passwordToggle" onClick={togglePasswordVisibility}>
                {shownPassword
                  ? <VisibilityOffOutlinedIcon title="Hide" />
                  : <VisibilityOutlinedIcon title="Show" />
                }
              </small>
            </div>

            <div className="passwordInputWrapper">
              <input
                placeholder="Confirm password"
                type={shownPassword2 ? "text" : "password"}
                className="loginInput"
                ref={confirmPassword}
                required
                minLength="6"
              />
              <small className="passwordToggle" onClick={togglePasswordVisibility2}>
                {shownPassword2
                  ? <VisibilityOffOutlinedIcon title="Hide" />
                  : <VisibilityOutlinedIcon title="Show" />
                }
              </small>
            </div>

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
