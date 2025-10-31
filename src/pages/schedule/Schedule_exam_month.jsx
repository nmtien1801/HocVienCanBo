import React, { useState } from 'react';
import { Search, FileDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ExamScheduleTable() {
  const [startDate, setStartDate] = useState('01/10/2025');
  const [endDate, setEndDate] = useState('31/10/2025');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const examData = [
    {
      stt: 1,
      thu: 'Tư',
      ngayThi: '01/10/2025',
      tenLop: 'TC.239 (Học viên)',
      monThi: 'Thực tiễn và kinh nghiệm xây dựng, phát triển địa phương',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 2,
      thu: 'Tư',
      ngayThi: '01/10/2025',
      tenLop: 'TC.239 (Học viên)',
      monThi: 'Kiến thức bổ trợ',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 3,
      thu: 'Tư',
      ngayThi: '01/10/2025',
      tenLop: 'H.946 (Nhà Bè)',
      monThi: 'Nghiên cứu thực tế',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 4,
      thu: 'Tư',
      ngayThi: '01/10/2025',
      tenLop: 'H.961 (Học viên - Cục thuế TPHCM)',
      monThi: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HP CNXHKH)',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 5,
      thu: 'Tư',
      ngayThi: '01/10/2025',
      tenLop: 'K.136 (Cơ sở 3 - Phường Bà Rịa)',
      monThi: 'Nghiên cứu thực tế',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 6,
      thu: 'Sáu',
      ngayThi: '03/10/2025',
      tenLop: 'TC.257 (Học viên)',
      monThi: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HPTriết học)',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 7,
      thu: 'Bảy',
      ngayThi: '04/10/2025',
      tenLop: 'TC.253 (Học viên)',
      monThi: 'Kiến thức bổ trợ',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 8,
      thu: 'Bảy',
      ngayThi: '04/10/2025',
      tenLop: 'H.970 (Quận 3)',
      monThi: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HP CNXHKH)',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 9,
      thu: 'CN',
      ngayThi: '05/10/2025',
      tenLop: 'H.962 (Phú Nhuận)',
      monThi: 'Xây dựng Đảng',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 10,
      thu: 'CN',
      ngayThi: '05/10/2025',
      tenLop: 'H.964 (Bình Thạnh)',
      monThi: 'Kiến thức bổ trợ',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 11,
      thu: 'CN',
      ngayThi: '05/10/2025',
      tenLop: 'H.965 (Bình Thạnh)',
      monThi: 'Kiến thức bổ trợ',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 12,
      thu: 'CN',
      ngayThi: '05/10/2025',
      tenLop: 'H.966 (Quận 12)',
      monThi: 'Kiến thức bổ trợ',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 13,
      thu: 'Ba',
      ngayThi: '07/10/2025',
      tenLop: 'CV.134 (trực tuyến các tỉnh trong tuần)',
      monThi: 'Nghiên cứu thực tế',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 14,
      thu: 'Tư',
      ngayThi: '08/10/2025',
      tenLop: 'TC.256 (Học viên)',
      monThi: 'Quản lý hành chính nhà nước',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 15,
      thu: 'Bảy',
      ngayThi: '11/10/2025',
      tenLop: 'TC.247 (Học viên)',
      monThi: 'Quản lý hành chính nhà nước',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 16,
      thu: 'Bảy',
      ngayThi: '11/10/2025',
      tenLop: 'CV.136 (trực tuyến các tỉnh trong tuần)',
      monThi: 'Phần I: Kiến thức chung (CV-420)',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    },
    {
      stt: 17,
      thu: 'Bảy',
      ngayThi: '11/10/2025',
      tenLop: 'CV.137 (trực tuyến các tỉnh trong tuần)',
      monThi: 'Phần I: Kiến thức chung (CV-420)',
      thoiGianThi: '180',
      banCoiThi: '',
      ghiChu: ''
    }
  ];

  const totalPages = Math.ceil(examData.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <h1 className="text-2xl text-gray-600 mb-6">Lịch Thi trong Tháng</h1>

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
            <h2 className="text-lg text-red-700 font-semibold text-center">Danh sách Lịch Thi</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-16">STT</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-20">Thứ</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-32">Ngày thi</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-64">Tên lớp</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Môn thi</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-32">Thời gian thi</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-40">Ban coi thi</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap w-40">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {examData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row, index) => (
                  <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.stt}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.thu}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngayThi}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{row.tenLop}</td>
                    <td className="px-4 py-3 border-r border-gray-200">{row.monThi}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.thoiGianThi}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center">{row.banCoiThi}</td>
                    <td className="px-4 py-3 text-center">{row.ghiChu}</td>
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