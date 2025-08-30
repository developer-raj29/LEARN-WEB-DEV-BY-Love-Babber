// Component folder: ChildA.js
import React, { useContext } from "react";
import { AppContext } from "../context/context";

const ChildA = () => {
  const { theme, setTheme } = useContext(AppContext);

  function toggleHandler() {
    if (theme === "light") {
      setTheme("dark");
      console.log("dark");
    } else {
      setTheme("light");
      console.log("light");
    }
  }
  return (
    <div>
      <button onClick={toggleHandler}>Theme</button>
    </div>
  );
};

export default ChildA;
