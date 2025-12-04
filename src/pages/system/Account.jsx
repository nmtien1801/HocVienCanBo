import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { TypeUserIDCons, formatDate, formatToISODate, getGenderDisplay } from "../../utils/constants";

const TeacherLayout = ({ userInfo }) => {
  const [formData, setFormData] = useState({
    maNguoiDung: userInfo?.UserID || '',
    hoVaTen: userInfo?.Name || '',
    nhom: '',
    dangHoatDong: userInfo?.Status === 1 || false,
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
  };

  const handleCancel = () => {
    console.log('Hủy bỏ');
  };

  // Component tái sử dụng cho Input Field
  const SimpleInput = ({ label, name, value, type = "text", isCheckbox = false, checked, disabled = false }) => (
    <div className="mb-6 flex flex-col md:flex-row md:items-center">
      <label className="text-gray-600 text-sm mb-1 md:mb-0 md:w-48 md:text-right md:pr-6">
        {label}
      </label>
      <div className="flex-1 w-full relative">
        {isCheckbox ? (
          <div className="flex items-center md:justify-start">
            <input
              type="checkbox"
              name={name}
              checked={checked}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id={name}
            />
            <label htmlFor={name} className="ml-2 text-sm text-gray-600">
              Đang hoạt động
            </label>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'bg-gray-100' : ''}`}
          />
        )}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-xl md:text-2xl text-red-600 mb-6 md:mb-8 font-medium">Thông cá nhân người dùng</h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 md:p-8">

            {/* Mã người dùng */}
            <SimpleInput label="Mã người dùng" name="maNguoiDung" value={formData.maNguoiDung} disabled={true} />

            {/* Họ và tên */}
            <SimpleInput label="Họ và tên" name="hoVaTen" value={formData.hoVaTen} />

            {/* Nhóm */}
            <SimpleInput label="Nhóm" name="nhom" value={formData.nhom} />

            {/* Trạng thái */}
            <SimpleInput
              label="Trạng thái"
              name="dangHoatDong"
              checked={formData.dangHoatDong}
              isCheckbox={true}
            />

            {/* Buttons */}
            <div className="flex flex-col md:flex-row md:items-center border-t border-gray-200 pt-6 mt-6">
              <div className="md:w-48 mb-4 md:mb-0"></div>
              <div className="flex gap-3 w-full md:w-auto md:justify-start">
                <button
                  onClick={handleCancel}
                  className="flex-1 md:flex-none px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium transition-colors"
                >
                  Lưu lại
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 md:flex-none px-6 py-2 bg-[#f0ad4e] hover:bg-[#e69c3b] text-white rounded text-sm font-medium transition-colors"
                >
                  Bỏ qua
                </button>
              </div>
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
};

const StudentLayout = ({ userInfo }) => {
  const [formData, setFormData] = useState({
    maHocVien: userInfo?.StudentCode || '',
    lop: userInfo?.ClassLearn || '',
    cccd: userInfo?.CCCD || '',
    ngaySinh: formatDate(userInfo?.Birthday),
    ngachBac: userInfo?.Academy || '',
    email: userInfo?.Email || '',
    ngayVaoDang: formatDate(userInfo?.DateJoinReserve),
    chucVu: userInfo?.Position || '',
    donViCongTac: userInfo?.OfficalWork || '',
    thoiGianLamViec: userInfo?.TimeWork || '',
    tenDonViXuatHD: userInfo?.CompanyName || '',
    diaChiXuatHD: userInfo?.CompanyAddress || '',
    tenHocVien: userInfo?.StudentName || '',
    congChuc: userInfo?.IsOfficer === 1 || false,
    noiSinh: userInfo?.PlaceBirthday || '',
    gioiTinh: getGenderDisplay(userInfo?.GenderID),
    dienThoai: userInfo?.Phone || '',
    ngayVaoDangChinhThuc: formatDate(userInfo?.DateJoinOfficeal),
    chucVuQuyHoach: userInfo?.PositionPlan || '',
    coQuanChuQuan: userInfo?.OfficalManager || '',
    diaChi: userInfo?.Address || '',
    maSoThueXuatHD: userInfo?.CompanyTaxCode || '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      Birthday: formatToISODate(formData.ngaySinh),
    };
    console.log('Lưu dữ liệu học viên:', dataToSave);
  };

  const handleSkip = () => {
    console.log('Bỏ qua');
  };

  const inputStyle = "w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelStyle = "text-gray-800 text-sm font-semibold mb-1 md:mb-0 md:w-48 md:text-right md:pr-6";
  // Thay đổi fieldContainer để nó xếp chồng trên mobile
  const fieldContainer = "flex flex-col md:flex-row mb-4 md:items-center";

  const leftColumnFields = [
    // ... (data giữ nguyên)
    { label: "Mã Học viên", name: "maHocVien", value: formData.maHocVien, readOnly: true },
    { label: "CCCD", name: "cccd", value: formData.cccd, readOnly: true },
    { label: "Ngày sinh", name: "ngaySinh", value: formData.ngaySinh, type: 'date-text', readOnly: true },
    { label: "Ngạch/bậc", name: "ngachBac", value: formData.ngachBac, readOnly: true },
    { label: "Email", name: "email", value: formData.email, readOnly: true },
    { label: "Ngày vào đảng", name: "ngayVaoDang", value: formData.ngayVaoDang, type: 'date-text', readOnly: true },
    { label: "Chức vụ", name: "chucVu", value: formData.chucVu, readOnly: true },
    { label: "Đơn vị công tác", name: "donViCongTac", value: formData.donViCongTac, readOnly: true },
    { label: "Thời gian làm việc", name: "thoiGianLamViec", value: formData.thoiGianLamViec, readOnly: true },
    { label: "Tên Đơn vị (Xuất HĐ)", name: "tenDonViXuatHD", value: formData.tenDonViXuatHD },
    { label: "Địa chỉ (Xuất HĐ)", name: "diaChiXuatHD", value: formData.diaChiXuatHD },
  ];

  const rightColumnFields = [
    { label: "Lớp", name: "lop", value: formData.lop, readOnly: true },
    { label: "Tên Học viên", name: "tenHocVien", value: formData.tenHocVien, readOnly: true },
    { label: "Công chức", name: "congChuc", value: formData.congChuc, type: 'checkbox', readOnly: true },
    { label: "Nơi sinh", name: "noiSinh", value: formData.noiSinh, readOnly: true },
    { label: "Giới tính", name: "gioiTinh", value: formData.gioiTinh, type: 'select', options: ['Nam', 'Nữ'], readOnly: true },
    { label: "Điện thoại", name: "dienThoai", value: formData.dienThoai, readOnly: true },
    { label: "Ngày vào đảng chính thức", name: "ngayVaoDangChinhThuc", value: formData.ngayVaoDangChinhThuc, type: 'date-text', readOnly: true },
    { label: "Chức vụ quy hoạch", name: "chucVuQuyHoach", value: formData.chucVuQuyHoach, readOnly: true },
    { label: "Cơ quan chủ quản", name: "coQuanChuQuan", value: formData.coQuanChuQuan, readOnly: true },
    { label: "Địa chỉ", name: "diaChi", value: formData.diaChi, readOnly: true },
    { label: "Mã số thuế (Xuất HĐ)", name: "maSoThueXuatHD", value: formData.maSoThueXuatHD },
  ];

  const renderField = (field) => {
    const isReadOnly = field.readOnly;

    if (field.type === 'checkbox') {
      return (
        <div key={field.name} className={fieldContainer}>
          <label className={labelStyle}>
            {field.label}
          </label>
          <div className="flex-1 flex items-center md:justify-start">
            <input
              type="checkbox"
              name={field.name}
              checked={field.value}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isReadOnly}
            />
          </div>
        </div>
      );
    } else if (field.type === 'select') {
      return (
        <div key={field.name} className={fieldContainer}>
          <label className={labelStyle}>
            {field.label}
          </label>
          <select
            name={field.name}
            value={field.value}
            onChange={handleInputChange}
            className={`${inputStyle} appearance-none bg-white`}
            disabled={isReadOnly}
          >
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div key={field.name} className={fieldContainer}>
          <label className={labelStyle}>
            {field.label}
          </label>
          <input
            type="text"
            name={field.name}
            value={field.value}
            onChange={handleInputChange}
            className={`${inputStyle} ${isReadOnly ? 'bg-gray-100' : ''}`}
            readOnly={isReadOnly}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-xl md:text-2xl text-red-600 mb-6 font-medium">Thông tin cá nhân</h1>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12">
            <div>
              {leftColumnFields.map(renderField)}
            </div>
            <div>
              {rightColumnFields.map(renderField)}
            </div>
          </div>

          {/* Buttons Section */}
          <div className="pt-6 border-t border-gray-200 mt-6 flex justify-start">
            <div className="w-full md:w-1/2 flex justify-start">
              <div className="flex gap-3 w-full md:w-auto ml-0 md:ml-48">
                <button
                  onClick={handleSave}
                  className="flex-1 md:flex-none px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                >
                  Lưu lại
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 md:flex-none px-6 py-2 bg-[#f0ad4e] hover:bg-[#e69c3b] text-white rounded text-sm font-medium transition-colors"
                >
                  Bỏ qua
                </button>
              </div>
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
};

export default function UserInfoForm() {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo?.TypeUserID === TypeUserIDCons.Student || userInfo?.TypeStudentID === TypeUserIDCons.Student) {
    return <StudentLayout userInfo={userInfo} />;
  } else {
    return <TeacherLayout userInfo={userInfo} />;
  }
}