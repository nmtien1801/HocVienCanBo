import React, { useState } from 'react';
import { Home, FileEdit, BarChart3, TrendingUp, Calendar, ChevronDown, Menu, X, Mail, User, LogOut } from 'lucide-react';

export default function SlideBar({ isSidebarOpen }) {
  const [expandedMenus, setExpandedMenus] = useState({
    schedule: true,
    grades: false,
    notifications: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const scheduleItems = [
    'Lịch dạy tháng',
    'Tra cứu lịch học - môn học',
    'Lịch thi tháng',
    'Thời khóa biểu lớp',
    'Thời khóa biểu của tôi',
    'Bài giảng của môn',
    'Lịch Học trong ngày'
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen flex flex-col text-white transition-all duration-300 overflow-y-auto flex-shrink-0 
      ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'} bg-[#0081cd]`}
    >
      <div className="font-semibold whitespace-nowrap overflow-hidden">
        {isSidebarOpen ? (
          <div>
            {/* Header */}
            <div className="bg-[#0081cd] p-4 flex items-center justify-between">
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
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors"
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Hệ thống</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.system ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Lịch học */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('schedule')}
                  className="w-full px-4 py-3 flex items-center gap-3 bg-[#026aa8] hover:hover:bg-[#026aa8] transition-colors"
                >
                  <FileEdit className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Lịch học</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.schedule ? 'rotate-180' : ''}`} />
                </button>

                {expandedMenus.schedule && (
                  <div className="bg-[#026aa8]">
                    {scheduleItems.map((item, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2.5 pl-12 flex items-center gap-3 hover:bg-[#026aa8] transition-colors text-left text-sm"
                      >
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tra cứu điểm */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('grades')}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors"
                >
                  <BarChart3 className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Tra cứu điểm</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.grades ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Kết quả học tập */}
              <div className="mb-2">
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors">
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Kết quả học tập</span>
                </button>
              </div>

              {/* Thông báo */}
              <div className="mb-2">
                <button
                  onClick={() => toggleMenu('notifications')}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#026aa8] transition-colors"
                >
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">Thông báo</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.notifications ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </nav>
          </div>
        ) : 'S.Bar'}
      </div>
    </div>
  );
}