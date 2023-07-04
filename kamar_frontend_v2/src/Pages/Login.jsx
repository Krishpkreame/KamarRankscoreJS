import "./Login.css";
import { useState, useRef } from "react";
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  // React States for Error Info, Username, Password, and User Key once logged in
  const [error_info, set_error_info] = useState("Use your school KAMAR login");
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");

  // React Refs for Username, Password, and Login Button (Used for animations triggers)
  const error_infoRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const login_buttonRef = useRef(null);

  // React Event Handlers for Username and Password, onChange
  const handleUsernameChange = (event) => set_username(event.target.value);
  const handlePasswordChange = (event) => set_password(event.target.value);

  // React Event Handler for when the Login Button is clicked
  let handleFormSubmit = (event) => {
    event.preventDefault(); // Prevents the page from reloading

    // Start the loading animation
    login_buttonRef.current.classList.add("loading");

    // KAMAR API headers and body
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    };

    !(async function () {
      try {
        let user_auth_res = await fetch(
          "http://192.168.86.42:3000/api/auth",
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            return data;
          });

        if (user_auth_res.logon_level > 0) {
          navigate('/results', {replace : true, state: user_auth_res});
        } else {
          console.log(user_auth_res);
          login_buttonRef.current.classList.remove("loading");

          usernameRef.current.classList.add("invalid");
          passwordRef.current.classList.add("invalid");

          set_error_info(user_auth_res.error);
          error_infoRef.current.classList.add("invalid");

          setTimeout(() => {
            usernameRef.current.classList.remove("invalid");
            passwordRef.current.classList.remove("invalid");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        login_buttonRef.current.classList.remove("loading");
      }
    })();
  };

  return (
    <>
      <div className="login-container">
        <h1 className="login-heading">Rankscore Calculator</h1>
        <a ref={error_infoRef} className="login-subheading">{error_info}</a>
        <form onSubmit={handleFormSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username : </label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password : </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button ref={login_buttonRef} type="submit" className="login-button">
            Get Results
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
