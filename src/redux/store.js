import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import scheduleReducer from "./scheduleSlice";
import learningClassReducer from "./learningClassSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    schedule: scheduleReducer,
    learningClass: learningClassReducer,
  },
});
