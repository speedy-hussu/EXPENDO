import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import groupReducer from "./groupSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    expenseGroups: groupReducer,
  },
});
export default store;
