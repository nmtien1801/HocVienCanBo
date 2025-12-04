import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleNavigateToLogin = (type) => {
        if(type === 'chinh-tri'){
            navigate('/loginTC');
        }else{
            navigate('/loginHBD');
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/bg-main.jpg')",
                }}
            >
                {/* Overlay trắng đậm dần từ trên xuống dưới */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-gray-800/60"></div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
                {/* Logo and Title */}
                <div className="text-center mb-12">
                    <div className="mb-6">
                        <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                            <img
                                src="/logo.png"
                                alt="logo"
                                className="w-full h-full object-contain "
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-red-600 mb-2 drop-shadow-lg">
                        HỌC VIỆN CÁN BỘ
                    </h1>
                    <h2 className="text-3xl font-bold text-red-600 drop-shadow-lg">
                        THÀNH PHỐ HỒ CHÍ MINH
                    </h2>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 mb-16">
                    <button
                        onClick={() => handleNavigateToLogin('chinh-tri')}
                        className="group relative px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-white cursor-pointer"
                    >
                        {/* Sửa: Thêm class z-10 vào thẻ span */}
                        <span className="relative z-10">TRUNG CẤP LÝ LUẬN CHÍNH TRỊ</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    <button
                        onClick={() => handleNavigateToLogin('ngan-han')}
                        className="group relative px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-white cursor-pointer"
                    >
                        {/* Sửa: Thêm class z-10 vào thẻ span */}
                        <span className="relative z-10">HỆ BỒI DƯỠNG NGẮN HẠN</span>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>

                {/* Contact Information */}
                <div className="text-white text-sm space-y-6 max-w-4xl bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
                    <div className="space-y-2">
                        <p className="font-semibold text-base">
                            Cơ sở 1: <span className="font-normal">324 Chu Văn An, Phường 12, Quận Bình Thạnh, TP.HCM</span>
                        </p>
                        <p>
                            Điện thoại: <span className="font-semibold">(028) 38412405</span> - Fax: <span className="font-semibold">(028) 38412495</span>
                        </p>
                        <p>
                            Email: <span className="font-semibold">hocviencanbo@tphcm.gov.vn</span>
                        </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/30">
                        <p className="font-semibold text-base">
                            Cơ sở 2: <span className="font-normal">146 Võ Thị Sáu, Phường 3, Quận 3, TP.HCM</span>
                        </p>
                        <p>
                            Điện thoại: <span className="font-semibold">(028) 38412405</span> - Fax: <span className="font-semibold">(028) 38412495</span>
                        </p>
                        <p>
                            Email: <span className="font-semibold">hocviencanbo@tphcm.gov.vn</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}