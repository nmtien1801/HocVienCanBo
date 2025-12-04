import React, { useEffect, useRef, useState } from "react";
import {
    Outlet,
} from "react-router-dom";
import SlideBar from "./Sidebar";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";

const MOBILE_BREAKPOINT = 1024;

function AuthenticatedLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
    const { type } = useSelector((state) => state.auth);

    // Xử lý sự kiện thay đổi kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(currentIsMobile);
            if (currentIsMobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarRef = useRef(null);

    // Xử lý Toggle Sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    }

    const contentMargin = isMobile 
        ? '0px' // Trên mobile, sidebar đè lên nội dung, nên không cần margin
        : (isSidebarOpen ? '288px' : '80px'); // Trên desktop, đẩy nội dung

    return (
        <div className="h-screen w-full bg-gray-50 text-gray-800 font-sans">
            
            {/* Overlay cho mobile khi sidebar mở */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-10 z-10 lg:hidden" 
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar (cố định bên trái) */}
            <div ref={sidebarRef}>
                 <SlideBar 
                    isSidebarOpen={isSidebarOpen} 
                    onToggleSidebar={toggleSidebar}
                 />
            </div>
            

            {/* Cột phải: Header + Main content */}
            <div
                className="flex flex-col h-full transition-all duration-300 relative"
                style={{ marginLeft: contentMargin }}
            >
                {/* Header */}
                <Header
                    toggleSidebar={toggleSidebar}
                />

                {/* Main Content */}
                <main className="flex-grow overflow-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default AuthenticatedLayout;