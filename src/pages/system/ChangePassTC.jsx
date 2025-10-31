import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassTC() {
  const [formData, setFormData] = useState({
    tenDangNhap: 'Tên truy cập',
    matKhauCu: '',
    matKhauMoi: '',
    nhapLaiMatKhauMoi: ''
  });

  const [showPassword, setShowPassword] = useState({
    matKhauCu: false,
    matKhauMoi: false,
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

  const handleSubmit = () => {
    console.log('Đổi mật khẩu:', formData);
    // Xử lý đổi mật khẩu
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl text-gray-600 mb-8">Đổi mật khẩu</h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Tên đăng nhập */}
            <div className="mb-6 flex items-center">
              <label className="text-gray-600 text-sm w-64 text-right pr-6">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="tenDangNhap"
                value={formData.tenDangNhap}
                onChange={handleInputChange}
                disabled
                className="flex-1 max-w-md border border-gray-300 rounded px-4 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            {/* Mật khẩu cũ */}
            <div className="mb-6 flex items-center">
              <label className="text-gray-600 text-sm w-64 text-right pr-6">
                Mật khẩu cũ
              </label>
              <div className="flex-1 max-w-md relative">
                <input
                  type={showPassword.matKhauCu ? "text" : "password"}
                  name="matKhauCu"
                  value={formData.matKhauCu}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('matKhauCu')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.matKhauCu ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div className="mb-6 flex items-center">
              <label className="text-gray-600 text-sm w-64 text-right pr-6">
                Mật khẩu mới
              </label>
              <div className="flex-1 max-w-md relative">
                <input
                  type={showPassword.matKhauMoi ? "text" : "password"}
                  name="matKhauMoi"
                  value={formData.matKhauMoi}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('matKhauMoi')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.matKhauMoi ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Nhập lại Mật khẩu mới */}
            <div className="mb-8 flex items-center">
              <label className="text-gray-600 text-sm w-64 text-right pr-6">
                Nhập lại Mật khẩu mới
              </label>
              <div className="flex-1 max-w-md relative">
                <input
                  type={showPassword.nhapLaiMatKhauMoi ? "text" : "password"}
                  name="nhapLaiMatKhauMoi"
                  value={formData.nhapLaiMatKhauMoi}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('nhapLaiMatKhauMoi')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.nhapLaiMatKhauMoi ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="flex items-center border-t border-gray-200 pt-6 mt-6">
              <div className="w-64"></div>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-right text-xs text-gray-500">
          Copyright © 2023 by G&BSoft
        </div>
      </div>
    </div>
  );
}