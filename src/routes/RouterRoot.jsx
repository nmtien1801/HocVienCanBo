import React, { useEffect, useRef, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import Dashboard from "../pages/system/Dashboard";
import ScheduleTeachMonth from "../pages/schedule/Schedule_teach_month.jsx";
import Lookup from "../pages/schedule/Lookup.jsx";
import ScheduleExamMonth from "../pages/schedule/Schedule_exam_month.jsx";
import TimetableClass from "../pages/schedule/Timetable_class.jsx";
import Timetable from "../pages/schedule/Timetable.jsx";
import Lesson from "../pages/schedule/Lesson.jsx";
import ScheduleDay from "../pages/schedule/Schedule_day.jsx";
import ScheduleMonth from "../pages/schedule/Schedule_month.jsx";
import FinalExam from "../pages/grades/FinalExam.jsx";
import GraduationExam from "../pages/grades/GraduationExam.jsx";
import LookUpFinalExam from "../pages/grades/LookupFinalExam.jsx";
import LookUpGraduationExam from "../pages/grades/LookupGraduationExam.jsx";
import PrintTranscript from "../pages/grades/PrintTranscript.jsx";
import LearningResults from "../pages/result/LearningResults.jsx";
import Notification from "../pages/notification/Notification.jsx";
import NotificationDetail from "../pages/notification/NotificationDetail.jsx";
import ChangePassStudent from "../pages/system/ChangePassStudent.jsx";
import ChangePassTC from "../pages/system/ChangePassTC.jsx";
import Account from "../pages/system/Account.jsx";
import Home from "../pages/auth/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { GetAccount } from "../redux/authSlice.js";
import ManagerNotify from "../pages/notification/ManagerNotify.jsx";

const ProtectedRoute = ({ children, userInfo, isLoading, hasCheckedAuth }) => {
  if (isLoading || !hasCheckedAuth) {
    return <LoadingSpinner />;
  }

  if (!userInfo) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const PublicRoute = ({ children, userInfo, isLoading, hasCheckedAuth }) => {
  if (isLoading || !hasCheckedAuth) {
    return <LoadingSpinner />;
  }

  if (userInfo && userInfo.UserID) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function RouterRoot() {
  const dispatch = useDispatch();
  const { userInfo, isLoading, hasCheckedAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!hasCheckedAuth && !isLoading) {
      dispatch(GetAccount());
    }
  }, [dispatch, hasCheckedAuth, isLoading]);

  console.log('userInfo ', userInfo);

  return (
    <Router>
      <Routes>
        {/* public route */}
        <Route
          path="/home"
          element={
            <PublicRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/test" element={<ManagerNotify />} />

        {/* private route */}
        <Route
          path="/"
          element={
            <ProtectedRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          {/* route system */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="change-pass-student" element={<ChangePassStudent />} />
          <Route path="change-pass-tc" element={<ChangePassTC />} />
          <Route path="account" element={<Account />} />


          {/* route schedule */}
          <Route path="schedule-teach-month" element={<ScheduleTeachMonth />} />
          <Route path="lookup" element={<Lookup />} />
          <Route path="schedule-exam-month" element={<ScheduleExamMonth />} />
          <Route path="schedule-month" element={<ScheduleMonth />} />
          <Route path="timetable-class" element={<TimetableClass />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="lesson" element={<Lesson />} />
          <Route path="schedule-day" element={<ScheduleDay />} />

          {/* route grades */}
          <Route path="final-exam" element={<FinalExam />} />
          <Route path="graduation-exam" element={<GraduationExam />} />
          <Route path="look-up-final-exam" element={<LookUpFinalExam />} />
          <Route path="look-up-graduation-exam" element={<LookUpGraduationExam />} />
          <Route path="print-transcript" element={<PrintTranscript />} />

          {/* route result */}
          <Route path="learning-results" element={<LearningResults />} />

          {/* Notification */}
          <Route path="notification" element={<Notification />} />
          <Route path="notification-detail" element={<NotificationDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default RouterRoot;
