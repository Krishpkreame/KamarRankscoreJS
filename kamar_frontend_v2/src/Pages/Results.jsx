import { useBeforeUnload, useNavigate, useLocation } from "react-router-dom";
import React from "react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();


  useBeforeUnload(
    React.useCallback(() => {
      navigate({ ...location, state: undefined });
    }, [location, navigate])
  );

  if (!location.state) {
    return (
      <>
        <h1>You must login to see results</h1>
        <button onClick={() => navigate("/", { replace: true })}>Logout</button>
      </>
    );
  }
  const user_key = location.state;
  return (
    <>
      <h1>Logon level: {user_key.logon_level}</h1>
      <h1>Student ID: {user_key.student_id}</h1>
      <h1>Student Key: {user_key.student_key}</h1>
      <button onClick={() => navigate("/", { replace: true })}>Logout</button>
    </>
  );
};

export default Results;
