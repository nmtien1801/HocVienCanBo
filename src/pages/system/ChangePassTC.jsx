import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ApiAuth from '../../apis/ApiAuth';
import { toast } from "react-toastify";
import { useSelector } from "react-redux"; 

const PasswordInput = ({ label, name, value, isShown, onChange, onToggle }) => (
  <div className="mb-6 flex flex-col md:flex-row md:items-center">
    <label
      className="text-gray-600 text-sm mb-1 md:mb-0 md:w-64 md:text-right md:pr-6"
    >
      {label}
    </label>
    <div className="flex-1 w-full max-w-full md:max-w-md relative">
      <input
        type={isShown ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="Mật khẩu"
        className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {isShown ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default function ChangePassTC() {
  const { userInfo } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    tenDangNhap: userInfo ? userInfo.StudentName || userInfo.Name : '',
    PassWordOld: '',
    PassWordNew: '',
    nhapLaiMatKhauMoi: ''
  });

  const [showPassword, setShowPassword] = useState({
    PassWordOld: false,
    PassWordNew: false,
    nhapLaiMatKhauMoi: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async () => {
    const { PassWordOld, PassWordNew, nhapLaiMatKhauMoi } = formData;

    // 1. Kiểm tra các trường bắt buộc
    if (!PassWordOld || !PassWordNew || !nhapLaiMatKhauMoi) {
      toast.error('Vui lòng nhập đầy đủ Mật khẩu cũ, Mật khẩu mới và Nhập lại Mật khẩu mới.');
      return;
    }

    // 2. Kiểm tra Mật khẩu mới và Nhập lại Mật khẩu mới có khớp nhau không
    if (PassWordNew !== nhapLaiMatKhauMoi) {
      toast.error('Mật khẩu mới và Nhập lại Mật khẩu mới không khớp nhau.');
      return;
    }

    // 3. (Tùy chọn) Kiểm tra Mật khẩu mới không được giống Mật khẩu cũ
    if (PassWordNew === PassWordOld) {
      toast.error('Mật khẩu mới không được trùng với Mật khẩu cũ.');
      return;
    }

    try {
      let response = await ApiAuth.ChangePasswordApi(formData);
      if (response && response.data) {
        toast.success('Đổi mật khẩu thành công!');
        setFormData(prev => ({
          ...prev,
          PassWordOld: '',
          PassWordNew: '',
          nhapLaiMatKhauMoi: ''
        }));
      } else {
        toast.error(response.message || 'Đổi mật khẩu thất bại.');
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Lỗi hệ thống khi đổi mật khẩu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">Đổi mật khẩu</h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 md:p-8">

            {/* Tên đăng nhập */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center">
              <label
                className="text-gray-600 text-sm mb-1 md:mb-0 md:w-64 md:text-right md:pr-6"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="tenDangNhap"
                value={formData.tenDangNhap}
                onChange={handleInputChange}
                disabled
                className="flex-1 w-full max-w-full md:max-w-md border border-gray-300 rounded px-4 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            {/* Mật khẩu cũ */}
            <PasswordInput
              label="Mật khẩu cũ"
              name="PassWordOld"
              value={formData.PassWordOld}
              isShown={showPassword.PassWordOld}
              onChange={handleInputChange}
              onToggle={() => toggleShowPassword('PassWordOld')}
            />

            {/* Mật khẩu mới */}
            <PasswordInput
              label="Mật khẩu mới"
              name="PassWordNew"
              value={formData.PassWordNew}
              isShown={showPassword.PassWordNew}
              onChange={handleInputChange}
              onToggle={() => toggleShowPassword('PassWordNew')}
            />

            {/* Nhập lại Mật khẩu mới */}
            <PasswordInput
              label="Nhập lại Mật khẩu mới"
              name="nhapLaiMatKhauMoi"
              value={formData.nhapLaiMatKhauMoi}
              isShown={showPassword.nhapLaiMatKhauMoi}
              onChange={handleInputChange}
              onToggle={() => toggleShowPassword('nhapLaiMatKhauMoi')}
            />

            {/* Button */}
            <div className="flex flex-col md:flex-row md:items-center border-t border-gray-200 pt-6 mt-6">
              <div className="w-full md:w-64 mb-4 md:mb-0"></div>
              <button
                onClick={handleSubmit}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center md:text-right text-xs text-gray-500">
          Copyright © 2023 by G&BSoft
        </div>
      </div>
    </div>
  );
}