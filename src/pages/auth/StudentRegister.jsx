import React, { useState, useEffect, useCallback } from 'react';
import ApiAuth from '../../apis/ApiAuth';
import { toast } from 'react-toastify';
import '../../components/FormFields/Captcha/captcha.css'
import { useNavigate } from 'react-router-dom';

export default function HCARegistrationForm() {
    const navigate = useNavigate();

    // 1. STATE DỮ LIỆU FORM
    const [formData, setFormData] = useState({
        StudentName: '',
        Birthday: '',
        PlaceBirthday: '',
        Nation: '',
        Phone: '',
        CCCD: '',
        CompanyName: '',
        CompanyTaxCode: '',
        GenderID: 'Nam',
        ClassName: '',
        Position: '',
        Email: '',
        Password: '',
        CompanyAddress: '',
        captcha: '' // Giá trị người dùng nhập
    });

    const [captchaCode, setCaptchaCode] = useState('');

    const generateCaptcha = useCallback(() => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        setFormData(prev => ({ ...prev, captcha: '' }));
        return code;
    }, []);

    // Hiển thị CAPTCHA lần đầu khi component mount
    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);

    // Hàm vẽ Captcha lên Canvas
    useEffect(() => {
        if (captchaCode) {
            const canvas = document.getElementById('CapCode');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.font = 'italic 100 46px "Roboto Slab", serif';
                ctx.fillStyle = '#ccc';
                ctx.textAlign = 'center';
                ctx.fillText(captchaCode, canvas.width / 2, canvas.height / 2 + 15);
            }
        }
    }, [captchaCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleClearForm = () => {
        setFormData({
            StudentName: '', Birthday: '', PlaceBirthday: '', Nation: '', Phone: '',
            CCCD: '', CompanyName: '', CompanyTaxCode: '', GenderID: 'Nam', ClassName: '',
            Position: '', Email: '', Password: '', CompanyAddress: '', captcha: ''
        });
        generateCaptcha();
        navigate('/loginTC')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 3. XÁC THỰC CAPTCHA TRÊN CLIENT
        if (formData.captcha.toUpperCase() !== captchaCode.toUpperCase()) {
            toast.error('Mã Captcha không đúng. Vui lòng thử lại.');
            generateCaptcha(); // Làm mới CAPTCHA
            return;
        }

        const genderIDValue = formData.GenderID === 'Nam' ? 1 : 0; // Giả định: 1 = Nam, 0 = Nữ
        const formattedBirthday = formData.Birthday
            ? formData.Birthday.replace(/-/g, '/')
            : '';

        const payload = {
            ...formData,
            Birthday: formattedBirthday,
            GenderID: genderIDValue,
            // Đảm bảo không gửi trường captcha lên BE
            TypeStudentID: 1,
            PositionPlan: "",
            Academy: "",
            TimeWork: "",
            OfficalManager: "",
            Address: "",
            Description: "",
            FilePath: ""
        };

        try {
            let res = await ApiAuth.StudentRegisterApi(payload);
            if (!res.data) {
                toast.error(res.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
                generateCaptcha();
            } else {
                toast.success('Đăng ký thành công!');
                handleClearForm();
            }
        } catch (error) {
            console.error('API Registration Error:', error);
            toast.error('Lỗi kết nối hoặc xử lý. Vui lòng thử lại.');
            generateCaptcha();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-0xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-32 h-32 mb-4">
                        <img src="/logo.png" alt="HCA Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-700">
                        Đăng ký đóng học phí hệ Trung Cấp Chính Trị
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">

                            {/* 1. Tên Học viên */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Tên Học viên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="StudentName"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.StudentName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 2. Ngày sinh */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="Birthday"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Birthday}
                                    onChange={handleChange}
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>

                            {/* 3. Dân tộc */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Dân tộc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="Nation"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Nation}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 4. Di động */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Di động <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="Phone"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 5. CCCD */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    CCCD
                                </label>
                                <input
                                    type="text"
                                    name="CCCD"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CCCD}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 6. Tên đơn vị */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Tên đơn vị <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyName"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Đơn vị công tác"
                                    value={formData.CompanyName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 7. Mã số thuế */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Mã số thuế <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyTaxCode"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CompanyTaxCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">

                            {/* 8. Giới tính & Mã Lớp (Giữ nguyên flex-1 để chúng chia đôi cột) */}
                            <div className="flex gap-4">
                                {/* Giới tính */}
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                            Giới tính
                                        </label>
                                        <select
                                            name="GenderID"
                                            className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.GenderID}
                                            onChange={handleChange}
                                        >
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Mã Lớp */}
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                            Lớp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ClassName"
                                            className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.ClassName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 9. Nơi sinh */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Nơi sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="PlaceBirthday"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.PlaceBirthday}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 10. Chức danh/ Chức vụ */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Chức danh/ Chức vụ
                                </label>
                                <input
                                    type="text"
                                    name="Position"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Position}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 11. Email */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="Email"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 12. Mật khẩu */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="Password"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mật khẩu đăng nhập"
                                    value={formData.Password}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 13. Địa chỉ đơn vị */}
                            <div className="flex items-center">
                                <label className="w-1/5 text-sm font-medium text-gray-700 pr-2">
                                    Địa chỉ đơn vị <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyAddress"
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CompanyAddress}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Captcha Section */}
                    <div className="mt-6 flex flex-col items-center space-y-4">
                        <input
                            id="UserCaptchaCode"
                            name="captcha"
                            type="text"
                            placeholder="Nhập đúng mã Captcha dưới đây"
                            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.captcha}
                            onChange={handleChange}
                            autoComplete="off"
                        />

                        <div className="CaptchaWrap flex items-center justify-center">
                            <div id="CaptchaImageCode" className="CaptchaTxtField">
                                <canvas id="CapCode" className="capcode" width="300" height="80"></canvas>
                            </div>
                            <button
                                type="button"
                                className="ReloadBtn"
                                title="Làm mới mã Captcha"
                                onClick={generateCaptcha}
                            >
                            </button>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                className="btnSubmit"
                            >
                                Đăng ký
                            </button>
                            <button
                                type="button"
                                className="btnBack"
                                onClick={handleClearForm}
                            >
                                Trở về
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        HỌC VIỆN CÁN BỘ
                    </h2>
                    <p className="text-sm text-gray-500">
                        ©2024 All Rights Reserved. Privacy and Terms
                    </p>
                </div>
            </div>
        </div>
    );
}