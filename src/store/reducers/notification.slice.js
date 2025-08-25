import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  newNotificationCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setNewNotificationCount: (state, action) => {
      state.newNotificationCount = action.payload;
    },
  },
});

export const { setNotifications, setNewNotificationCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
