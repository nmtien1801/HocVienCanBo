import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileEdit, BarChart3, TrendingUp, Calendar, ChevronDown, Menu, X, Mail, User, LogOut } from 'lucide-react';

export default function SlideBar({ isSidebarOpen }) {
  const [expandedMenu, setExpandedMenu] = useState('system');

  const toggleMenu = (menu) => {
    setExpandedMenu(prev => prev === menu ? null : menu);
  };

  const scheduleItems = [
    { label: 'Lịch dạy tháng', path: '/lich-day-thang' },
    { label: 'Tra cứu lịch học - môn học', path: '/tra-cuu-lich-hoc' },
    { label: 'Lịch thi tháng', path: '/lich-thi-thang' },
    { label: 'Thời khóa biểu lớp', path: '/thoi-khoa-bieu-lop' },
    { label: 'Thời khóa biểu của tôi', path: '/thoi-khoa-bieu-cua-toi' },
    { label: 'Bài giảng của môn', path: '/bai-giang-cua-mon' },
    { label: 'Lịch Học trong ngày', path: '/lich-hoc-trong-ngay' }
  ];

  const systemItems = [
    { label: 'Trang chủ', path: '/trang-chu' },
    { label: 'Đổi mật khẩu học viên', path: '/doi-mat-khau-hoc-vien' },
    { label: 'Đổi mật khẩu TC', path: '/doi-mat-khau-tai-chinh' },
    { label: 'Thông tin tài khoản', path: '/thong-tin-tai-khoan' },
    { label: 'Logout', path: '/logout' },
  ];

  const gradesItems = [
    { label: 'Danh sách dự thi cuối môn', path: '/tra-cuu-diem-mon-hoc' },
    { label: 'Danh sách dự thi tốt nghiệp', path: '/tra-cuu-diem-ren-luyen' },
    { label: 'Tra cứu điểm thi cuối môn', path: '/tra-cuu-diem-tong-ket' },
    { label: 'Tra cứu điểm thi tốt nghiệp', path: '/tra-cuu-diem-tong-ket' },
    { label: 'In bảng điểm tổng', path: '/tra-cuu-diem-tong-ket' },
  ];

  const notificationItems = [
    { label: 'Danh sách thông báo', path: '/thong-bao-hoc-vu' },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen flex flex-col text-white transition-all duration-300 overflow-y-auto flex-shrink-0 
      ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'} bg-[#0081cd]`}
    >
      <div className="font-semibold whitespace-nowrap overflow-hidden">
        {isSidebarOpen ? (
          <div>
            {/* Header */}
            <div className="bg-[#026aa8] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold">
                    HCA
                  </div>
                </div>
                <span className="font-semibold text-lg whitespace-nowrap">
                  HOC VIEN CAN BO
                </span>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 flex items-center gap-3 border-b border-blue-500">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                <div className="bg-gray-300 rounded-full w-14 h-14 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <div>
                <div className="text-sm">Welcome,</div>
                <div className="font-semibold italic">d.ttha</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 font-normal text-[13px]">
              {/* Hệ thống */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('system')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors ${expandedMenu === 'system' ? 'bg-[#026aa8]' : ''}`}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Hệ thống</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'system' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'system' && (
                  <div className="bg-[#026aa8]">
                    {systemItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                          `w-full px-4 py-2.5 pl-12 flex items-center gap-3 hover:bg-[#025a8a] transition-colors text-left text-sm no-underline text-white ${isActive ? 'bg-[#025a8a] font-semibold' : ''
                          }`
                        }
                      >
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Lịch học */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('schedule')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors ${expandedMenu === 'schedule' ? 'bg-[#026aa8]' : ''}`}
                >
                  <FileEdit className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Lịch học</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'schedule' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'schedule' && (
                  <div className="bg-[#026aa8]">
                    {scheduleItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                          `w-full px-4 py-2.5 pl-12 flex items-center gap-3 hover:bg-[#025a8a] transition-colors text-left text-sm no-underline text-white ${isActive ? 'bg-[#025a8a] font-semibold' : ''
                          }`
                        }
                      >
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Tra cứu điểm */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('grades')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors ${expandedMenu === 'grades' ? 'bg-[#026aa8]' : ''}`}
                >
                  <BarChart3 className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Tra cứu điểm</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'grades' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'grades' && (
                  <div className="bg-[#026aa8]">
                    {gradesItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                          `w-full px-4 py-2.5 pl-12 flex items-center gap-3 hover:bg-[#025a8a] transition-colors text-left text-sm no-underline text-white ${isActive ? 'bg-[#025a8a] font-semibold' : ''
                          }`
                        }
                      >
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Kết quả học tập */}
              <div className="mb-2">
                <NavLink
                  to="/ket-qua-hoc-tap"
                  className={({ isActive }) =>
                    `w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors no-underline text-white ${isActive ? 'bg-[#026aa8]' : ''
                    }`
                  }
                >
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Kết quả học tập</span>
                </NavLink>
              </div>

              {/* Thông báo */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('notifications')}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors ${expandedMenu === 'notifications' ? 'bg-[#026aa8]' : ''}`}
                >
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Thông báo</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenu === 'notifications' ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenu === 'notifications' && (
                  <div className="bg-[#026aa8]">
                    {notificationItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                          `w-full px-4 py-2.5 pl-12 flex items-center gap-3 hover:bg-[#025a8a] transition-colors text-left text-sm no-underline text-white ${isActive ? 'bg-[#025a8a] font-semibold' : ''
                          }`
                        }
                      >
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        ) : 'S.Bar'}
      </div>
    </div>
  );
}