import React from "react";
import { useSelector } from "react-redux";

const MyComponent = () => {
  const count = useSelector((state) => state.counter.value);
  return (
    <div>
      MyComponent
      <div>{count}</div>
    </div>
  );
};

export default MyComponent;
