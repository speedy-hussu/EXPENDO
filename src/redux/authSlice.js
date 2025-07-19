import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logoutUser: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});
export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
