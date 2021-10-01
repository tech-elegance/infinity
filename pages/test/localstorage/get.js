import React, { useEffect, useState } from "react";

const GetLocal = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(JSON.parse(window.localStorage.getItem("login")));
  }, []);
  return <p>{JSON.stringify(user)}</p>;
};

export default GetLocal;
