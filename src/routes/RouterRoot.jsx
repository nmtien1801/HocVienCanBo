import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import Dashboard from "../pages/system/Dashboard";
import ScheduleMonth from "../pages/schedule/Schedule_teach_month.jsx";
import Lookup from "../pages/schedule/Lookup.jsx";
import ScheduleExamMonth from "../pages/schedule/Schedule_exam_month.jsx";
import TimetableClass from "../pages/schedule/Timetable_class.jsx";
import Timetable from "../pages/schedule/Timetable.jsx";
import Lesson from "../pages/schedule/Lesson.jsx";
import ScheduleDay from "../pages/schedule/Schedule_day.jsx";

const useSelector = (selector) => {
  const mockState = {
    auth: { isAuthenticated: true },
  };
  return selector(mockState);
};
const useDispatch = () => () => console.log('Dispatch MOCK called');

const Login = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="p-10 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800">Login Page</h2>
      <p className="text-gray-600 mt-2">Dùng mock state để chuyển hướng.</p>
      <p className="mt-4 text-sm text-red-500">Giả lập: Bạn được coi là đã đăng nhập.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function RouterRoot() {
  return (
    <Router>
      <Routes>
        {/* public route */}
        <Route path="/login" element={<Login />} />

        {/* private route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          {/* route system */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* route schedule */}
          <Route path="scheduleMonth" element={<ScheduleMonth />} />
          <Route path="lookup" element={<Lookup />} />
          <Route path="schedule-exam-month" element={<ScheduleExamMonth />} />
          <Route path="timetable-class" element={<TimetableClass />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="lesson" element={<Lesson />} />
          <Route path="schedule-day" element={<ScheduleDay />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default RouterRoot;
