import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../redux/authSlice';

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        let body = {
            username,
            password,
        };
        if (username && password) {
            let res = await dispatch(Login(body));

            if (!res.payload) {
                navigate('/dashboard');
            }
        } else {
            alert('Vui lòng nhập đầy đủ Username và Password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-xs sm:max-w-[360px] bg-white p-4 sm:p-0 text-center">

                {/* Phần Logo và Tiêu đề */}
                <div className="mb-6">
                    <div className="mx-auto w-32 h-32 mb-4">
                        <img src="/logo.png" alt="HCA Logo" className="w-full h-full object-contain" />
                    </div>

                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <div className="flex-grow border-t border-gray-300 max-w-[40px]"></div>
                        <h1 className="text-xl text-gray-700 font-light tracking-wide">Login Form</h1>
                        <div className="flex-grow border-t border-gray-300 max-w-[40px]"></div>
                    </div>
                </div>

                {/* --- Form Đăng nhập --- */}
                <form onSubmit={handleSubmit}>

                    {/* Trường Username */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-500 text-sm"
                            required
                            // 3. Kết nối trạng thái và sự kiện onChange
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Trường Password */}
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-500 placeholder-gray-500 text-sm"
                            required
                            // 3. Kết nối trạng thái và sự kiện onChange
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Nhóm Nút bấm */}
                    <div className="flex justify-center space-x-2">
                        <button
                            type="submit" // Nút này sẽ kích hoạt handleSubmit
                            className="w-[90px] py-2 text-sm text-black border border-gray-300 bg-white hover:bg-gray-50 transition duration-150 rounded-sm"
                        >
                            Đăng nhập
                        </button>
                        <button
                            type="button"
                            className="w-[160px] py-2 text-sm text-black border border-gray-300 bg-white hover:bg-gray-50 transition duration-150 rounded-sm"
                            // Tùy chọn: Thêm sự kiện onClick để điều hướng hoặc mở modal
                            onClick={() => console.log('Chuyển đến trang Đăng ký đóng học phí')}
                        >
                            Đăng ký đóng học phí
                        </button>
                        <button
                            type="button"
                            className="w-[70px] py-2 text-sm text-black border border-gray-300 bg-white hover:bg-gray-50 transition duration-150 rounded-sm"
                            // Tùy chọn: Thêm sự kiện onClick để điều hướng quay lại
                            onClick={() => console.log('Quay lại trang trước')}
                        >
                            Quay lại
                        </button>
                    </div>

                    {/* Quên mật khẩu */}
                    <div className="text-right text-sm mt-3 mb-6 pr-1">
                        <a href="#" className="text-blue-500 hover:text-blue-700">
                            Lost your password?
                        </a>
                    </div>
                </form>

                {/* Đường kẻ phân cách footer */}
                <div className="w-full border-t border-gray-300 mt-8 mb-4"></div>

                {/* Phần Footer */}
                <div className="text-center">
                    <h2 className="text-lg text-gray-600 font-light tracking-widest mb-1">HOC VIEN CAN BO</h2>
                    <p className="text-xs text-gray-500">
                        &copy;{new Date().getFullYear()} All Rights Reserved. Privacy and Terms
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;