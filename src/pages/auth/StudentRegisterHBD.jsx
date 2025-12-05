import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
// Import ApiAuth để sử dụng cho chức năng đăng ký
import ApiAuth from '../../apis/ApiAuth';
import '../../components/FormFields/Captcha/captcha.css';
import { useNavigate } from 'react-router-dom';
import ApiUpload from '../../apis/ApiUpload';

export default function StudentRegisterHBD() {
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

    const [selectedFile, setSelectedFile] = useState(null);
    const [captchaCode, setCaptchaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Sửa lỗi: Thêm trạng thái loading

    // 2. LOGIC TẠO VÀ VẼ CAPTCHA
    const generateCaptcha = useCallback(() => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(code);
        setFormData(prev => ({ ...prev, captcha: '' })); // Xóa input captcha của người dùng
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
        const { name, value, files } = e.target;
        if (name === 'FileAttach' && files && files.length > 0) {
            setSelectedFile(files[0]);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleClearForm = () => {
        setFormData({
            StudentName: '', Birthday: '', PlaceBirthday: '', Nation: '', Phone: '',
            CCCD: '', CompanyName: '', CompanyTaxCode: '', GenderID: 'Nam', ClassName: '',
            Position: '', Email: '', Password: '', CompanyAddress: '', captcha: ''
        });
        setSelectedFile(null);
        generateCaptcha();
        navigate('/loginTC');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // A. XÁC THỰC CAPTCHA TRÊN CLIENT
        if (formData.captcha.toUpperCase() !== captchaCode.toUpperCase()) {
            toast.error('Mã Captcha không đúng. Vui lòng thử lại.');
            generateCaptcha(); // Làm mới CAPTCHA
            setIsLoading(false);
            return;
        }

        let uploadedFilePath = "";
        let fileName = "";

        if (selectedFile) {
            try {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                uploadedFilePath = await ApiUpload.UploadFileApi(uploadFormData);

                if (!uploadedFilePath) {
                    toast.error('Lỗi upload file đính kèm. Vui lòng thử lại.');
                    setIsLoading(false);
                    return;
                }
                fileName = selectedFile.name;
            } catch (error) {
                console.error('File Upload Error:', error);
                toast.error('Lỗi kết nối khi tải file.');
                setIsLoading(false);
                generateCaptcha();
                return;
            }
        }

        // Chuẩn bị Payload Đăng ký
        const genderIDValue = formData.GenderID === 'Nam' ? 1 : 0; // 1 = Nam, 0 = Nữ
        const formattedBirthday = formData.Birthday
            ? formData.Birthday.replace(/-/g, '/')
            : '';

        const payload = {
            ...formData,
            Birthday: formattedBirthday,
            GenderID: genderIDValue,
            captcha: undefined,
            TypeStudentID: 1,
            PositionPlan: "",
            Academy: "",
            TimeWork: "",
            OfficalManager: "",
            Address: "",
            Description: "",
            FilePath: uploadedFilePath || fileName,
            StudentCode: "",
            OfficalWork: ""
        };

        try {
            let res = await ApiAuth.StudentRegisterApi(payload);
            if (!res.data) {
                toast.error(res.message);
                generateCaptcha();
            } else {
                toast.success('Đăng ký thành công! Vui lòng thanh toán để đối soát');
                handleClearForm();
            }
        } catch (error) {
            console.error('API Registration Error:', error);
            toast.error('Lỗi kết nối hoặc xử lý. Vui lòng thử lại.');
            generateCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-0xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-8 pt-10">
                    <div className="mx-auto w-32 h-32 mb-4">
                        <img
                            src="/logo.png"
                            alt="HCA Logo"
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={() => navigate('/home')}
                        />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-700">
                        Đăng ký học viên hệ bồi dưỡng
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Left Column */}
                        <div className="space-y-6">

                            {/* Tên Học viên */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Tên Học viên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="StudentName"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.StudentName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Ngày sinh */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="Birthday"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Birthday}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Dân tộc */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Dân tộc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="Nation"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Nation}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Di động */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Di động <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="Phone"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* CCCD */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
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

                            {/* Tên đơn vị */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Tên đơn vị <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyName"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Đơn vị công tác"
                                    value={formData.CompanyName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Mã số thuế */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Mã số thuế <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyTaxCode"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CompanyTaxCode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">

                            {/* Giới tính & Mã Lớp */}
                            <div className="flex gap-4">
                                {/* Giới tính */}
                                <div className="flex-1 flex items-center">
                                    <label className="w-1/3 text-sm font-medium text-gray-700 pr-2">
                                        Giới tính
                                    </label>
                                    <select
                                        name="GenderID"
                                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.GenderID}
                                        onChange={handleChange}
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>

                                {/* Mã Lớp */}
                                <div className="flex-1 flex items-center">
                                    <label className="w-1/3 text-sm font-medium text-gray-700 pr-2">
                                        Lớp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ClassName"
                                        required
                                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.ClassName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Nơi sinh */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Nơi sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="PlaceBirthday"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.PlaceBirthday}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Chức danh/ Chức vụ */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
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

                            {/* Email */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="Email"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.Email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Mật khẩu */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="Password"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mật khẩu đăng nhập"
                                    value={formData.Password}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Địa chỉ đơn vị */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    Địa chỉ đơn vị <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CompanyAddress"
                                    required
                                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.CompanyAddress}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* File đính kèm */}
                            <div className="flex items-center">
                                <label className="w-1/4 text-sm font-medium text-gray-700 pr-2">
                                    File đính kèm (.rar.zip)
                                </label>
                                <input
                                    type="file"
                                    name="FileAttach"
                                    accept=".zip,.rar"
                                    onChange={handleChange}
                                    className="w-3/4 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:border-gray-400 file:text-sm file:font-medium file:bg-gray-200 hover:file:bg-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Captcha Section */}
                    <div className="mt-8 flex flex-col items-center space-y-4">
                        <input
                            id="UserCaptchaCode"
                            name="captcha"
                            type="text"
                            placeholder="Nhập đúng mã Captcha dưới đây"
                            required
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
                                className={`btnSubmit ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                            </button>
                            <button
                                type="button"
                                className="btnBack"
                                onClick={handleClearForm}
                                disabled={isLoading}
                            >
                                Trở về
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-8 pb-10">
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