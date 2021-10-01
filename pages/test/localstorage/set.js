import React, { useEffect } from "react";

const SetLocal = () => {
  const value = { name: "Jame", code: "007" };
  useEffect(() => {
    window.localStorage.setItem('login', JSON.stringify(value));
  }, []);
  return <p>OK</p>;
};

export default SetLocal;
