import React, { useState, useEffect, useRef } from 'react';
import { Menu, Mail, User, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ toggleSidebar }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        // Chuyển hướng về trang đăng nhập
        navigate('/home');
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Menu Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>

                {/* Right Side - Notifications & User Menu */}
                <div className="flex items-center gap-4">
                    {/* Mail Notification */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Mail className="w-6 h-6 text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            6
                        </span>
                    </button>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={toggleUserMenu}
                            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                        >
                            <div className="bg-gray-300 rounded-full w-9 h-9 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Đinh Thị Thu Hà</span>
                            <ChevronDown
                                className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                    onClick={() => navigate('account')}
                                >
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Thông tin Tài khoản</span>
                                </button>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3" onClick={() => handleLogout()}>
                                    <LogOut className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
