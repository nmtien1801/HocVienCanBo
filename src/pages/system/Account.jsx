import React, { useState } from 'react';

export default function UserInfoForm() {
  const [formData, setFormData] = useState({
    maNguoiDung: 'd.ttha',
    hoVaTen: 'Đinh Thị Thu Hà',
    nhom: '',
    dangHoatDong: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    console.log('Lưu dữ liệu:', formData);
    // Xử lý lưu dữ liệu
  };

  const handleCancel = () => {
    console.log('Hủy bỏ');
    // Xử lý hủy
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl text-red-600 mb-8 font-medium">Thông cá nhân người dùng</h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Mã người dùng */}
            <div className="mb-6 flex items-center">
              <label className="text-gray-600 text-sm w-48 text-right pr-6">
                Mã người dùng
              </label>
              <input
                type="text"
                name="maNguoiDung"
                value={formData.maNguoiDung}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Họ và tên */}
            <div className="mb-6 flex items-center">
              <label className="text-gray-600 text-sm w-48 text-right pr-6">
                Họ và tên
              </label>
              <input
                type="text"
                name="hoVaTen"
                value={formData.hoVaTen}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Nhóm */}
            <div className="mb-6 flex items-center">
              <label className="text-gray-600 text-sm w-48 text-right pr-6">
                Nhóm
              </label>
              <input
                type="text"
                name="nhom"
                value={formData.nhom}
                onChange={handleInputChange}
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Trạng thái */}
            <div className="mb-8 flex items-center">
              <label className="text-gray-600 text-sm w-48 text-right pr-6">
                Trạng thái
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="dangHoatDong"
                  checked={formData.dangHoatDong}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  id="dangHoatDong"
                />
                <label htmlFor="dangHoatDong" className="ml-2 text-sm text-gray-600">
                  Đang hoạt động
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center">
              <div className="w-48"></div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium transition-colors"
                >
                  Lưu lại
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium transition-colors"
                >
                  Bỏ qua
                </button>
              </div>
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