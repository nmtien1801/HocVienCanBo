import React, { useState } from 'react';
import { Search, FileDown } from 'lucide-react';

export default function PrintTranscript() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isRetake, setIsRetake] = useState(false);

  const examData = [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <h1 className="text-2xl text-gray-600 mb-6">In bảng điểm tổng</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm whitespace-nowrap">Lớp</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-80 text-gray-500"
              >
                <option value="">------ chọn lớp ------</option>
                <option value="TC240">TC.240 (CS1)</option>
                <option value="H946">H.946 (NB)</option>
                <option value="H949">H.949 (Q1)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm whitespace-nowrap">Học viên</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-80 text-gray-500"
              >
                <option value="">------ chọn Học viên ------</option>
                <option value="237">Thực tiễn và kinh nghiệm xây dựng, phát triển địa phương</option>
                <option value="196">Kỹ năng lãnh đạo, quản lý</option>
                <option value="300">Nghiên cứu thực tế</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="thiLan2"
                checked={isRetake}
                onChange={(e) => setIsRetake(e.target.checked)}
                className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="thiLan2" className="text-gray-600 text-sm whitespace-nowrap">
                Thi lần 2
              </label>
            </div>

            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 text-sm">
              <Search size={16} />
              Tìm kiếm
            </button>

            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 text-sm">
              <FileDown size={16} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg text-red-700 font-semibold text-center">Danh sách Dự thi cuối môn</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-16">STT</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã học viên</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Họ và Tên</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã môn</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Tên môn</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Điểm lần 1</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Điểm lần 2</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Ngày vắng</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {examData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-left text-gray-500 border-b border-gray-200">
                      No records to display.
                    </td>
                  </tr>
                ) : (
                  examData.map((row, index) => (
                    <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.stt}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.maHocVien}</td>
                      <td className="px-4 py-3 border-r border-gray-200">{row.hoTen}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.mamon}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.diem1}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.diem2}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngayVang}</td>
                      <td className="px-4 py-3 text-center">{row.ghiChu}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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