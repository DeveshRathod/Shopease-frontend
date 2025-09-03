import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const init = JSON.parse(localStorage.getItem("currentUser"));

const initialState = {
  currentUser: init || null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
