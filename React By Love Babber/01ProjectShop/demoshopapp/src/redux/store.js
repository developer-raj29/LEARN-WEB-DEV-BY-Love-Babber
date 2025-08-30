import { configureStore } from "@reduxjs/toolkit";
// import { CounterSlice } from "./Slice's/counter-slice";
import counterReducer from "./Slice's/counter-slice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
export default store;
