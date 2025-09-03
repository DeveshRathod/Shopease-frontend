import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.slice";
import cartReducer from "./reducers/cart.slice";
import notificationReducer from "./reducers/notification.slice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  current: cartReducer,
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
