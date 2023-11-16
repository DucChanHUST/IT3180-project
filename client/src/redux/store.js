import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import registrationReducer from "./registrationSlice";
import residentReducer from "./residentSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    registration: registrationReducer,
    resident: residentReducer,
  },
});
