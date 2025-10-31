import React, { useEffect, useRef, useState } from "react";
import {
    Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SlideBar from "./Sidebar";
import Header from "./Header";

function AuthenticatedLayout() {
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
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
