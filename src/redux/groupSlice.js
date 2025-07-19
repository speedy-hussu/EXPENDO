import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  groups: [],
};
const groupSlice = createSlice({
  name: "expenseGroups",
  initialState,
  reducers: {
    expenseGroups: (state, action) => {
      state.groups = action.payload;
    },
  },
});
export const { expenseGroups } = groupSlice.actions;
export default groupSlice.reducer;
