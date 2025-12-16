import React, { useEffect, useRef, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
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
import FinalExam from "../pages/grades/FinalExam1.jsx";
import FinalExam2 from "../pages/grades/FinalExam2.jsx";
import GraduationExam1 from "../pages/grades/GraduationExam1.jsx";
import GraduationExam2 from "../pages/grades/GraduationExam2.jsx";
import LookUpFinalExam from "../pages/grades/LookupFinalExam.jsx";
import LookUpGraduationExam from "../pages/grades/LookupGraduationExam.jsx";
import LookUpExternalStudent from "../pages/grades/LookUpExternalStudent.jsx";
import PrintTranscript from "../pages/grades/PrintTranscript.jsx";
import LearningResults from "../pages/result/LearningResults.jsx";
import Notification from "../pages/notification/Notification.jsx";
import NotificationDetail from "../pages/notification/NotificationDetail.jsx";
import FormNotification from "../pages/notification/FormNotification.jsx";
import ChangePassStudent from "../pages/system/ChangePassStudent.jsx";
import ChangePassTC from "../pages/system/ChangePassTC.jsx";
import Account from "../pages/system/Account.jsx";
import Home from "../pages/auth/Home.jsx";
import LoginTC from "../pages/auth/LoginTC.jsx";
import LoginHBD from "../pages/auth/LoginHBD.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { GetAccount } from "../redux/authSlice.js";
import ManagerNotify from "../pages/notification/ManagerNotify.jsx";
import StudentRegisterTC from "../pages/auth/StudentRegisterTC.jsx"
import StudentRegisterHBD from "../pages/auth/StudentRegisterHBD.jsx"
import Test from "../pages/test/Test.jsx"
import SurveyManager from "../pages/survey/ManagerSurvey.jsx"
import ManagerSurveyOther from "../pages/survey/ManagerSurveyOther.jsx"
import ManagerQuestion from "../pages/question/ManagerQuestion.jsx"
import SurveyPage from "../pages/survey/SurveyPage.jsx";
import SurveyDetail from "../pages/survey/SurveyDetail.jsx";
import { getSurveySubjectByStudentID } from "../redux/surveySlice.js";

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

const SurveyProtectedRoute = ({ children, SurveysByStudentList }) => {
  const location = useLocation();

  // Nếu SurveysByStudentList chưa có dữ liệu hoặc rỗng, cho phép truy cập
  if (!Array.isArray(SurveysByStudentList) || SurveysByStudentList.length === 0) {
    return children;
  }

  // Kiểm tra có survey nào chưa hoàn thành không
  const hasIncompleteSurvey = SurveysByStudentList.some(item => {
    return item && item.StatusID_Survey === null;
  });

  // Nếu có survey chưa hoàn thành
  if (hasIncompleteSurvey) {
    const currentPath = location.pathname;
    if (currentPath !== '/danh-sach-khao-sat' && currentPath !== '/survey-detail') {
      return <Navigate to="/danh-sach-khao-sat" replace />;
    }
  }

  return children;
};

function RouterRoot() {
  const dispatch = useDispatch();
  const { userInfo, isLoading, hasCheckedAuth } = useSelector((state) => state.auth);
  const { SurveysByStudentList, SurveysByStudentTotal } = useSelector((state) => state.survey);

  useEffect(() => {
    const fetchSurveyByID = async () => {
      const res = await dispatch(
        getSurveySubjectByStudentID({ page: 1, limit: 20 })
      );

      if (!res.payload || !res.payload.data) {
        toast.error(res.payload?.message);
      }
    };

    fetchSurveyByID();
  }, [dispatch]);


  useEffect(() => {
    if (!hasCheckedAuth && !isLoading) {
      dispatch(GetAccount());
    }
  }, [dispatch, hasCheckedAuth, isLoading]);

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
          path="/loginTC"
          element={
            <PublicRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <LoginTC />
            </PublicRoute>
          }
        />
        <Route
          path="/loginHBD"
          element={
            <PublicRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <LoginHBD />
            </PublicRoute>
          }
        />
        <Route
          path="/studentregisterTC"
          element={
            <PublicRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <StudentRegisterTC />
            </PublicRoute>
          }
        />
        <Route
          path="/studentregisterHBD"
          element={
            <PublicRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <StudentRegisterHBD />
            </PublicRoute>
          }
        />

        {/* private route */}
        <Route
          path="/"
          element={
            <ProtectedRoute userInfo={userInfo} isLoading={isLoading} hasCheckedAuth={hasCheckedAuth}>
              <SurveyProtectedRoute SurveysByStudentList={SurveysByStudentList}>
                <AuthenticatedLayout />
              </SurveyProtectedRoute>
            </ProtectedRoute>
          }
        >
          {/* route system */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="change-pass-student" element={<ChangePassStudent />} />
          <Route path="change-pass-tc" element={<ChangePassTC />} />
          <Route path="account" element={<Account />} />
          <Route path="test" element={<Test />} />
          <Route path="manager-survey-teacher" element={<SurveyManager />} />
          <Route path="manager-survey-other" element={<ManagerSurveyOther />} />
          <Route path="manager-question" element={<ManagerQuestion />} />
          <Route path="danh-sach-khao-sat" element={<SurveyPage />} />
          <Route path="survey-detail" element={<SurveyDetail />} />

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
          <Route path="final-exam-2" element={<FinalExam2 />} />
          <Route path="graduation-exam" element={<GraduationExam1 />} />
          <Route path="graduation-exam-2" element={<GraduationExam2 />} />
          <Route path="look-up-final-exam" element={<LookUpFinalExam />} />
          <Route path="look-up-graduation-exam" element={<LookUpGraduationExam />} />
          <Route path="look-up-external-student" element={<LookUpExternalStudent />} />
          <Route path="print-transcript" element={<PrintTranscript />} />

          {/* route result */}
          <Route path="learning-results" element={<LearningResults />} />

          {/* Notification */}
          <Route path="notification" element={<Notification />} />
          <Route path="notification-detail" element={<NotificationDetail />} />
          <Route path="/manager-notification" element={<ManagerNotify />} />
          <Route path="/manager-notification/form" element={<FormNotification />} />

        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default RouterRoot;
