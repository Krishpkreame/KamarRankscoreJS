import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Use your school KAMAR login")
  
  const [userdata, setUserdata] = useState({})

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const buttonRef = useRef(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  let handleFormSubmit = (event) => {

    buttonRef.current.classList.add("loading");
    event.preventDefault();
    // Simple PUT request with a JSON body using fetch
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
          !(async function () {
            requestOptions.body = JSON.stringify({
              student_id: user_auth_res.student_id,
              student_key: user_auth_res.student_key,
            });
            let user_results = await fetch(
              "http://localhost:3000/api/results",
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => {
                return data;
              });
            if (user_results.logon_level > 0) {
              setMessage("Success");
              buttonRef.current.classList.remove("loading");
              console.log(user_results);
              setUserdata(user_results);
              setUsername("");
              setPassword("");
              //! CONTINUE HERE
            }
            else {
              console.log(user_results);
              buttonRef.current.classList.remove("loading");
              setMessage(user_results.error);
            }
          })();
        } else {
          console.log(user_auth_res);
          buttonRef.current.classList.remove("loading");

          usernameRef.current.classList.add("invalid");
          passwordRef.current.classList.add("invalid");

          setMessage(user_auth_res.error);
          setUserdata({});

          setTimeout(() => {
            usernameRef.current.classList.remove("invalid");
            passwordRef.current.classList.remove("invalid");
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        buttonRef.current.classList.remove("loading");
      }
    })();
  };

  return (
    <>
      <div className="login-container">
        <h1 className="login-heading">Rankscore Calculator</h1>
        <a className="login-subheading">{message}</a>
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
          <button ref={buttonRef} type="submit" className="login-button">
            Get Results
          </button>
          <a>
            {JSON.stringify(userdata, null, 2)}
          </a>
        </form>
      </div>
    </>
  );
}

export default App;
