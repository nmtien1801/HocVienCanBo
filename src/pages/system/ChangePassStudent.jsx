import React, { useState } from 'react';
import { toast } from "react-toastify";
import ApiAuth from '../../apis/ApiAuth';

const DEFAULT_NEW_PASSWORD = "123456";

export default function ChangePassStudent() {
  const [formData, setFormData] = useState({
    maHocVien: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.maHocVien) {
      toast.error('Vui lòng nhập Mã học viên.');
      return;
    }

    // ❗ ALERT XÁC NHẬN
    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn đặt lại mật khẩu của học viên ${formData.maHocVien} thành ${DEFAULT_NEW_PASSWORD}?`
    );

    if (!isConfirm) return;

    const payload = {
      UserNameReset: formData.maHocVien,
    };

    let response = await ApiAuth.RestPassWordApi(payload);
    if (response) {
        toast.success(response.message);
    } else {
        toast.error(response.message);
    }

    setFormData({ maHocVien: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 lg:py-8 lg:px-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">
          Đặt lại mật khẩu học viên
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 md:p-8">

            <div className="mb-8 flex flex-col md:flex-row md:items-center">
              <label className="text-gray-600 text-sm mb-1 md:mb-0 md:w-64 md:text-right md:pr-6">
                Mã học viên
              </label>
              <input
                type="text"
                name="maHocVien"
                value={formData.maHocVien}
                placeholder='Nhập mã học viên cần đặt lại'
                onChange={handleInputChange}
                className="flex-1 w-full md:max-w-md border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center border-t border-gray-200 pt-6 mt-6">
              <div className="w-full md:w-64 mb-4 md:mb-0"></div>
              <button
                onClick={handleSubmit}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
              >
                Xác nhận Đặt lại mật khẩu
              </button>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center md:text-right text-xs text-gray-500">
          Copyright © 2023 by G&BSoft
        </div>

      </div>
    </div>
  );
}
