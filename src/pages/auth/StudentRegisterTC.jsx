import React, { useState, useEffect, useCallback } from 'react';
import ApiAuth from '../../apis/ApiAuth';
import { toast } from 'react-toastify';
import '../../components/FormFields/Captcha/captcha.css'

export default function HCARegistrationForm() {
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

    // 2. STATE CHO CAPTCHA
    const [captchaCode, setCaptchaCode] = useState(''); // Mã CAPTCHA thực tế cần hiển thị
    const [captchaError, setCaptchaError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Hàm tạo CAPTCHA mới (nên được đặt ở ngoài hoặc sử dụng useCallback)
    const generateCaptcha = useCallback(() => {
        // *** LƯU Ý QUAN TRỌNG: Đây là logic tạo CAPTCHA MẪU đơn giản. 
        // Trong ứng dụng thực tế, bạn cần logic phức tạp hơn (sử dụng thư viện hoặc API backend).
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        setFormData(prev => ({ ...prev, captcha: '' })); // Xóa input cũ
        setCaptchaError(''); // Xóa lỗi cũ
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

                // Cài đặt phong cách giống như CSS cũ
                ctx.font = 'italic 100 46px "Roboto Slab", serif';
                ctx.fillStyle = '#ccc';
                ctx.textAlign = 'center';
                // Đặt text ở giữa canvas
                ctx.fillText(captchaCode, canvas.width / 2, canvas.height / 2 + 15);
            }
        }
    }, [captchaCode]); // Chạy lại khi captchaCode thay đổi

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
        setCaptchaError('');
        setSuccessMessage('');
        generateCaptcha(); // Làm mới CAPTCHA khi xóa form
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setCaptchaError('');

        // 3. XÁC THỰC CAPTCHA TRÊN CLIENT
        if (formData.captcha.toUpperCase() !== captchaCode.toUpperCase()) {
            setCaptchaError('Mã Captcha không đúng. Vui lòng thử lại.');
            generateCaptcha(); // Làm mới CAPTCHA
            return;
        }

        const genderIDValue = formData.GenderID === 'Nam' ? 1 : 0; // Giả định: 1 = Nam, 0 = Nữ

        const payload = {
            StudentName: formData.StudentName,
            Birthday: formData.Birthday,
            PlaceBirthday: formData.PlaceBirthday,
            Nation: formData.Nation,
            Phone: formData.Phone,
            CCCD: formData.CCCD,
            CompanyName: formData.CompanyName,
            CompanyTaxCode: formData.CompanyTaxCode,
            GenderID: genderIDValue,
            ClassName: formData.ClassName,
            Position: formData.Position,
            Email: formData.Email,
            Password: formData.Password,
            CompanyAddress: formData.CompanyAddress,
            TypeStudentID: 1,
            // Đảm bảo không gửi trường captcha lên BE
        };

        console.log('Form data submitted (Payload to BE):', payload);

        // 4. GỌI API
        try {
            let res = await ApiAuth.StudentRegisterApi(payload);
            if (!res.data) {
                toast.error(res.message);
                // Nếu BE báo lỗi (kể cả lỗi xác thực dữ liệu), làm mới CAPTCHA
                generateCaptcha();
            } else {
                setSuccessMessage('Đăng ký thành công!');
                toast.success('Đăng ký TC thành công!');
                // Bạn có thể chọn clear form hoặc chuyển hướng ở đây
                // handleClearForm(); 
            }
        } catch (error) {
            toast.error('Lỗi kết nối hoặc xử lý. Vui lòng thử lại.');
            generateCaptcha();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                {/* ... (Giữ nguyên) */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Input fields */}
                            {/* Chỉ thay đổi onChange thành handleChange chung */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên Học viên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="StudentName" // Thêm thuộc tính name
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.StudentName}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* ... Các trường khác cũng cần thêm thuộc tính name và dùng handleChange */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="Birthday"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Birthday}
                                    onChange={handleChange}
                                    placeholder="DD/MM/YYYY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dân tộc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="Nation"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Nation}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Di động <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="Phone"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CCCD
                                </label>
                                <input
                                    type="text"
                                    name="CCCD"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CCCD}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên đơn vị <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Đơn vị công tác"
                                    value={formData.CompanyName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã số thuế <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyTaxCode"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CompanyTaxCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giới tính
                                    </label>
                                    <select
                                        name="GenderID"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.GenderID}
                                        onChange={handleChange}
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mã Lớp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ClassName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.ClassName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nơi sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="PlaceBirthday"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.PlaceBirthday}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Chức danh/ Chức vụ
                                </label>
                                <input
                                    type="text"
                                    name="Position"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Position}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="Email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="Password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mật khẩu đăng nhập"
                                    value={formData.Password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ đơn vị <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyAddress"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CompanyAddress}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Captcha Section */}
                    <div className="mt-6 flex flex-col items-center space-y-4">
                        {/* Hiển thị thông báo thành công nếu có */}
                        {successMessage && <span className="text-green-600 text-lg">{successMessage}</span>}

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
                        {/* Hiển thị lỗi Captcha nếu có */}
                        {captchaError && <span className="text-red-500 text-sm">{captchaError}</span>}

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
                                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Đăng ký
                            </button>
                            <button
                                type="button"
                                className="px-8 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                        HỌC VIỆN CẢN BỘ
                    </h2>
                    <p className="text-sm text-gray-500">
                        ©2024 All Rights Reserved. Privacy and Terms
                    </p>
                </div>
            </div>
        </div>
    );
}