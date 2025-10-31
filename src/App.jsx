import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SlideBar from "./pages/slideBar/Sidebar";
import Header from "./pages/header/Header";

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


// Component Placeholder: Nội dung chính sau khi đăng nhập
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-800">Dashboard chính</h1>
    <p className="text-gray-600 mt-2">Nội dung ứng dụng của bạn sẽ được hiển thị tại đây.</p>
  </div>
);


const AuthenticatedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar (cố định bên trái) */}
      <SlideBar isSidebarOpen={isSidebarOpen} />

      {/* Cột phải: Header + Main content */}
      <div
        className="flex flex-col h-full transition-all duration-300"
        style={{ marginLeft: isSidebarOpen ? '260px' : '80px' }}
      >
        {/* Header */}
        <Header 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />

        {/* Main Content */}
        <main className="flex-grow overflow-auto p-4 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
