import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  let handleFormSubmit = (event) => {
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
      let user_auth_res = await fetch("http://localhost:3000/api/auth",requestOptions)
        .then((response) => response.json()).then((data) => {return data});

      if (user_auth_res.logon_level > 0) {
        !(async function () {
          requestOptions.body = JSON.stringify({"student_id": user_auth_res.student_id, "student_key": user_auth_res.student_key});
          let user_results = await fetch("http://localhost:3000/api/results",requestOptions)
            .then((response) => response.json()).then((data) => {return data});
            if (user_results.logon_level > 0) {
              //! CONTINUE CODE HERE
              console.log(user_results);
            }
        })();
      }
      else console.log(user_auth_res);
    })();
  };

  return (
    <>
      <div className="login-container">
        <h1 className="login-heading">Rankscore Calculator</h1>
        <a className="login-subheading">Use your school KAMAR login</a>
        <form onSubmit={handleFormSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username : </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="login-button">
            Get Results
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
