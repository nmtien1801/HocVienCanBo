import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import scheduleReducer from "./scheduleSlice";
import learningClassReducer from "./learningClassSlice";
import newReducer from "./newSlice";
import pointReducer from "./pointSlice";
import studentReducer from "./studentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    schedule: scheduleReducer,
    learningClass: learningClassReducer,
    news: newReducer,
    point: pointReducer,
    student: studentReducer
  },
});
