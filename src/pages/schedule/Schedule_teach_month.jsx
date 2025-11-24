import React, { useState } from 'react';
import { Search, FileDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ScheduleTeachMonth() {
  const [startDate, setStartDate] = useState('01/10/2025');
  const [endDate, setEndDate] = useState('31/10/2025');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const scheduleData = [
    {
      stt: 1,
      maLop: '210240',
      tenLop: 'TC.240 (CS1)',
      siSo: 67,
      maMon: 237,
      tenMon: 'Thực tiễn và kinh nghiệm xây dựng, phát triển địa phương',
      khoa: 'Khoa Lý luận cơ sở',
      thuHoc: 'T2, T4, T6',
      soNgay: 10,
      ngayThi: '21/11/2025',
      ngayBatDau: '10/10/2025',
      ngayKetThuc: '05/11/2025'
    },
    {
      stt: 2,
      maLop: '210240',
      tenLop: 'TC.240 (CS1)',
      siSo: 67,
      maMon: 196,
      tenMon: 'Kỹ năng lãnh đạo, quản lý',
      khoa: 'Khoa Nhà nước và pháp luật',
      thuHoc: 'T2, T4, T6',
      soNgay: 23,
      ngayThi: '24/10/2025',
      ngayBatDau: '13/08/2025',
      ngayKetThuc: '08/10/2025'
    },
    {
      stt: 3,
      maLop: '210946',
      tenLop: 'H.946 (NB)',
      siSo: 40,
      maMon: 300,
      tenMon: 'Nghiên cứu thực tế',
      khoa: '',
      thuHoc: '4',
      soNgay: 2,
      ngayThi: '01/10/2025',
      ngayBatDau: '01/10/2025',
      ngayKetThuc: '01/10/2025'
    },
    {
      stt: 4,
      maLop: '210949',
      tenLop: 'H.949 (Q1)',
      siSo: 52,
      maMon: 244,
      tenMon: 'Kiến thức bổ trợ',
      khoa: 'Khoa Nhà nước và pháp luật',
      thuHoc: '4, 6',
      soNgay: 10,
      ngayThi: '14/11/2025',
      ngayBatDau: '10/10/2025',
      ngayKetThuc: '29/10/2025'
    },
    {
      stt: 5,
      maLop: '210949',
      tenLop: 'H.949 (Q1)',
      siSo: 52,
      maMon: 242,
      tenMon: 'Mặt trận Tổ quốc Việt Nam và các tổ chức chính trị - xã hội',
      khoa: 'Khoa Xây dựng Đảng',
      thuHoc: '4, 6',
      soNgay: 12,
      ngayThi: '24/10/2025',
      ngayBatDau: '12/09/2025',
      ngayKetThuc: '08/10/2025'
    },
    {
      stt: 6,
      maLop: '210949',
      tenLop: 'H.949 (Q1)',
      siSo: 52,
      maMon: 300,
      tenMon: 'Nghiên cứu thực tế',
      khoa: '',
      thuHoc: '6',
      soNgay: 2,
      ngayThi: '31/10/2025',
      ngayBatDau: '31/10/2025',
      ngayKetThuc: '31/10/2025'
    },
    {
      stt: 7,
      maLop: '210242',
      tenLop: 'TC.242 (CS1)',
      siSo: 66,
      maMon: 244,
      tenMon: 'Kiến thức bổ trợ',
      khoa: 'Khoa Nhà nước và pháp luật',
      thuHoc: '3, 7',
      soNgay: 10,
      ngayThi: '04/11/2025',
      ngayBatDau: '04/10/2025',
      ngayKetThuc: '21/10/2025'
    },
    {
      stt: 8,
      maLop: '210242',
      tenLop: 'TC.242 (CS1)',
      siSo: 66,
      maMon: 300,
      tenMon: 'Nghiên cứu thực tế',
      khoa: '',
      thuHoc: '7',
      soNgay: 2,
      ngayThi: '25/10/2025',
      ngayBatDau: '25/10/2025',
      ngayKetThuc: '25/10/2025'
    },
    {
      stt: 9,
      maLop: '210243',
      tenLop: 'TC.243 (CS1)',
      siSo: 77,
      maMon: 196,
      tenMon: 'Kỹ năng lãnh đạo, quản lý',
      khoa: 'Khoa Nhà nước và pháp luật',
      thuHoc: 'T2, T4, T6',
      soNgay: 23,
      ngayThi: '24/12/2025',
      ngayBatDau: '10/10/2025',
      ngayKetThuc: '08/12/2025'
    },
    {
      stt: 10,
      maLop: '210243',
      tenLop: 'TC.243 (CS1)',
      siSo: 77,
      maMon: 242,
      tenMon: 'Mặt trận Tổ quốc Việt Nam và các tổ chức chính trị - xã hội',
      khoa: 'Khoa Xây dựng Đảng',
      thuHoc: 'T2, T4, T6',
      soNgay: 12,
      ngayThi: '24/10/2025',
      ngayBatDau: '10/09/2025',
      ngayKetThuc: '08/10/2025'
    },
    {
      stt: 11,
      maLop: '210953',
      tenLop: 'H.953 (CS PHU)',
      siSo: 58,
      maMon: 240,
      tenMon: 'Đường lối, chính sách của Đảng, Nhà nước Việt Nam',
      khoa: 'Khoa Xây dựng Đảng',
      thuHoc: '6, 7',
      soNgay: 27,
      ngayThi: '21/11/2025',
      ngayBatDau: '12/09/2025',
      ngayKetThuc: '01/11/2025'
    }
  ];

  const totalPages = Math.ceil(scheduleData.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <h1 className="text-2xl text-gray-600 mb-6">Lịch Học trong Tháng</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm whitespace-nowrap">Từ ngày</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm whitespace-nowrap">Đến ngày</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-40"
              />
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
            <h2 className="text-lg text-red-700 font-semibold text-center">Danh sách Lịch Học</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">STT</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã lớp</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Tên lớp</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Sĩ số</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã môn học</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Tên môn học</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Khoa chủ quản</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Thứ học</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Số ngày học</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Ngày thi</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold">Ngày kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-200">{row.stt}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{row.maLop}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{row.tenLop}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.siSo}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.maMon}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{row.tenMon}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{row.khoa}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.thuHoc}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.soNgay}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngayThi}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngayBatDau}</td>
                    <td className="px-4 py-3 text-center">{row.ngayKetThuc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2 mx-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page size:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
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