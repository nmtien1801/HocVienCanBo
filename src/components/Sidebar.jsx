import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileEdit, BarChart3, TrendingUp, Calendar, ChevronDown, User, X, ClipboardList } from 'lucide-react';
import { useSelector } from "react-redux";
import { TypeUserIDCons } from "../utils/constants";
import { useNavigate } from 'react-router-dom';

export default function SlideBar({ isSidebarOpen, onToggleSidebar }) {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState('system');
  const [role, setRole] = useState({ role: "", canAccess: false });

  useEffect(() => {
    const userType = userInfo?.TypeUserID;
    const studentType = userInfo?.TypeStudentID;
    if (userType) {
      if (userType !== TypeUserIDCons.Student) {
        setRole({ role: "TC_TRUE", canAccess: true });; // Teacher, Admin
      } else {
        setRole({ role: "TC_FALSE", canAccess: false }); // Student
      }
    } else if (studentType) {
      if (studentType !== TypeUserIDCons.Student) {
        setRole({ role: "HBD_TRUE", canAccess: true }); // Teacher, Admin
      } else {
        setRole({ role: "HBD_FALSE", canAccess: false }); // Student
      }
    }

  }, [userInfo, TypeUserIDCons.Student])

  const toggleMenu = (menu) => {
    setExpandedMenu(prev => prev === menu ? null : menu);
  };

  const systemItems = [
    { label: 'Trang chủ', path: '/dashboard' },
    role.canAccess ? { label: 'Đổi mật khẩu học viên', path: '/change-pass-student' } : null,
    { label: 'Đổi mật khẩu tài khoản', path: '/change-pass-tc' },
    { label: 'Thông tin tài khoản', path: '/account' },
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Nhập thông báo', path: '/manager-notification' }
      : null,
  ].filter(Boolean)

  const surveyItems = [
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Ngân hàng câu hỏi', path: '/manager-question' }
      : null,
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Mẫu phiếu khảo sát giảng viên', path: '/manager-survey-teacher' }
      : null,
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Mẫu phiếu khảo sát khác', path: '/manager-survey-other' }
      : null,
    userInfo?.TypeUserID === TypeUserIDCons.Student
      ? { label: 'Khảo sát giảng viên giảng dạy', path: '/danh-sach-khao-sat' }
      : null,
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Lịch sử khảo sát người dùng', path: '/survey-user' }
      : null,
    { label: 'Lịch sử khảo sát của bạn', path: '/report-survey-other' },
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Báo cáo khảo sát', path: '/report-survey' }
      : null,
    userInfo?.TypeUserID === TypeUserIDCons.Administrator
      ? { label: 'Báo cáo khảo sát khác', path: '/tracking-order' }
      : null,
  ].filter(Boolean)

  const scheduleItems = [
    role.canAccess ? { label: 'Lịch dạy tháng', path: '/schedule-teach-month' } : { label: 'Lịch học tháng', path: '/schedule-month' },
    { label: 'Tra cứu lịch học - môn học', path: '/lookup' },
    role.canAccess ? { label: 'Lịch thi tháng', path: '/schedule-exam-month' } : null,
    { label: 'Thời khóa biểu lớp', path: '/timetable-class' },
    { label: 'Thời khóa biểu của tôi', path: '/timetable' },
    { label: 'Bài giảng của môn', path: '/lesson' },
    { label: 'Lịch Học trong ngày', path: '/schedule-day' }
  ].filter(Boolean);

  const gradesItems = [
    { label: 'Danh sách dự thi cuối môn L1', path: '/final-exam' },
    { label: 'Danh sách dự thi cuối môn L2', path: '/final-exam-2' },
    { label: 'Danh sách dự thi tốt nghiệp L1', path: '/graduation-exam' },
    { label: 'Danh sách dự thi tốt nghiệp L2', path: '/graduation-exam-2' },
    { label: 'Tra cứu điểm thi cuối môn', path: '/look-up-final-exam' },
    { label: 'Tra cứu điểm thi tốt nghiệp', path: '/look-up-graduation-exam' },
    { label: 'Tra cứu điểm học viên ngoài', path: '/look-up-external-student' },
    { label: 'In bảng điểm tổng', path: '/print-transcript' },
  ];

  const notificationItems = [
    { label: 'Danh sách thông báo', path: '/notification' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col text-white transition-all duration-300 z-10 shadow-xl
        ${isSidebarOpen ? 'w-[288px]' : 'w-0 lg:w-[80px]'} 
        bg-gradient-to-b from-[#0081cd] to-[#026aa8]`}
    >
      {/* Sidebar Content */}
      <div className={`h-full flex flex-col overflow-hidden ${!isSidebarOpen && 'lg:flex hidden'}`}>

        {/* Header - Always visible when open */}
        <div className="flex-shrink-0">
          {isSidebarOpen ? (
            <>
              {/* Desktop/Mobile Header with Logo */}
              <div className="bg-[#026aa8] p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain rounded-lg cursor-pointer" onClick={() => navigate("/dashboard")} />
                  <span className="font-bold text-base lg:text-lg whitespace-nowrap">
                    HỌC VIỆN CÁN BỘ
                  </span>
                </div>
                {/* Close button - only on mobile */}
                <button
                  onClick={onToggleSidebar}
                  className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close sidebar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Profile */}
              <div className="p-4 flex items-center gap-3 border-b border-white/20 bg-[#026aa8]/50">
                <div className="bg-white rounded-full p-1 flex-shrink-0 shadow-md">
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-full w-12 h-12 flex items-center justify-center">
                    <User className="w-7 h-7 text-gray-600" />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs text-white/80">Xin chào,</div>
                  <div className="font-semibold text-sm truncate">
                    {userInfo?.Code || userInfo?.StudentName || 'User'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Collapsed logo only (desktop)
            <div className="hidden lg:flex p-4 items-center justify-center h-20 border-b border-white/20">
              <img src="/logo.png" alt="logo" className="w-10 h-10 object-contain rounded-lg shadow-md" />
            </div>
          )}
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {isSidebarOpen ? (
            <div className="px-2 space-y-1">
              {/* Hệ thống */}
              <div>
                <button
                  onClick={() => toggleMenu('system')}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/10 transition-all ${expandedMenu === 'system' ? 'bg-white/15 shadow-sm' : ''
                    }`}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium">Hệ thống</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'system' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'system' && (
                  <div className="mt-1 ml-2 space-y-0.5">
                    {systemItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        onClick={() => window.innerWidth < 1024 && onToggleSidebar?.()}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 pl-10 rounded-lg transition-all text-sm no-underline text-white ${isActive
                            ? 'bg-white/20 font-semibold shadow-sm'
                            : 'hover:bg-white/10'
                          }`
                        }
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Khảo sát */}
              <div>
                <button
                  onClick={() => toggleMenu('survey')}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/10 transition-all ${expandedMenu === 'grades' ? 'bg-white/15 shadow-sm' : ''
                    }`}
                >
                  <ClipboardList className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium">Khảo sát</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'grades' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'survey' && (
                  <div className="mt-1 ml-2 space-y-0.5">
                    {surveyItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        onClick={() => window.innerWidth < 1024 && onToggleSidebar?.()}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 pl-10 rounded-lg transition-all text-sm no-underline text-white ${isActive
                            ? 'bg-white/20 font-semibold shadow-sm'
                            : 'hover:bg-white/10'
                          }`
                        }
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {(role.role === "TC_TRUE" || role.role === "TC_FALSE") &&
                <>


                  {/* Lịch học */}
                  <div>
                    <button
                      onClick={() => toggleMenu('schedule')}
                      className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/10 transition-all ${expandedMenu === 'schedule' ? 'bg-white/15 shadow-sm' : ''
                        }`}
                    >
                      <FileEdit className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm font-medium">Lịch học</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'schedule' ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedMenu === 'schedule' && (
                      <div className="mt-1 ml-2 space-y-0.5">
                        {scheduleItems.map((item, index) => (
                          <NavLink
                            key={index}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && onToggleSidebar?.()}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 pl-10 rounded-lg transition-all text-sm no-underline text-white ${isActive
                                ? 'bg-white/20 font-semibold shadow-sm'
                                : 'hover:bg-white/10'
                              }`
                            }
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                            <span className="truncate">{item.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tra cứu điểm */}
                  {role.canAccess && <div>
                    <button
                      onClick={() => toggleMenu('grades')}
                      className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/10 transition-all ${expandedMenu === 'grades' ? 'bg-white/15 shadow-sm' : ''
                        }`}
                    >
                      <BarChart3 className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left text-sm font-medium">Tra cứu điểm</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'grades' ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedMenu === 'grades' && (
                      <div className="mt-1 ml-2 space-y-0.5">
                        {gradesItems.map((item, index) => (
                          <NavLink
                            key={index}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && onToggleSidebar?.()}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 pl-10 rounded-lg transition-all text-sm no-underline text-white ${isActive
                                ? 'bg-white/20 font-semibold shadow-sm'
                                : 'hover:bg-white/10'
                              }`
                            }
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                            <span className="truncate">{item.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>}

                  {/* Kết quả học tập */}
                  <div>
                    <NavLink
                      to="/learning-results"
                      onClick={() => window.innerWidth < 1024 && onToggleSidebar?.()}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm no-underline text-white ${isActive
                          ? 'bg-white/20 font-semibold shadow-sm'
                          : 'hover:bg-white/10'
                        }`
                      }
                    >
                      <TrendingUp className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left font-medium">Kết quả học tập</span>
                    </NavLink>
                  </div>
                </>
              }

              {/* Thông báo */}
              <div>
                <button
                  onClick={() => toggleMenu('notifications')}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg hover:bg-white/10 transition-all ${expandedMenu === 'notifications' ? 'bg-white/15 shadow-sm' : ''
                    }`}
                >
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left text-sm font-medium">Thông báo</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'notifications' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'notifications' && (
                  <div className="mt-1 ml-2 space-y-0.5">
                    {notificationItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        onClick={() => window.innerWidth < 1024 && onToggleSidebar?.()}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 pl-10 rounded-lg transition-all text-sm no-underline text-white ${isActive
                            ? 'bg-white/20 font-semibold shadow-sm'
                            : 'hover:bg-white/10'
                          }`
                        }
                      >
                        <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Collapsed view - Icon only (desktop)
            <div className="hidden lg:flex flex-col items-center gap-2 px-2">
              <button
                onClick={() => toggleMenu('system')}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
                title="Hệ thống"
              >
                <Home className="w-6 h-6" />
              </button>
              {(role.role === "TC_TRUE" || role.role === "TC_FALSE") && <>
                <button
                  onClick={() => toggleMenu('survey')}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
                  title="Khảo sát"
                >
                  <ClipboardList className="w-6 h-6" />
                </button>
                <button
                  onClick={() => toggleMenu('schedule')}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
                  title="Lịch học"
                >
                  <FileEdit className="w-6 h-6" />
                </button>
                <button
                  onClick={() => toggleMenu('grades')}
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
                  title="Tra cứu điểm"
                >
                  <BarChart3 className="w-6 h-6" />
                </button>
                <NavLink
                  to="/learning-results"
                  className="p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center no-underline text-white"
                  title="Kết quả học tập"
                >
                  <TrendingUp className="w-6 h-6" />
                </NavLink>
              </>}
              <button
                onClick={() => toggleMenu('notifications')}
                className="p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
                title="Thông báo"
              >
                <Calendar className="w-6 h-6" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}