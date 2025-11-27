import React, { useState, useEffect } from 'react';
import { Search, FileDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle } from 'lucide-react';
import { getScheduleMonth } from '../../redux/scheduleSlice.js';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getFirstDayOfMonth, getLastDayOfMonth } from '../../utils/constants.js';

export default function ScheduleTeachMonth() {
  const dispatch = useDispatch();
  // Đảm bảo tên biến được sử dụng là scheduleSlice, khớp với data trong useSelector
  const { scheduleSlice, totalSchedule } = useSelector((state) => state.schedule);
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getLastDayOfMonth());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScheduleClassSubject();
  }, [dispatch, startDate, endDate, currentPage, pageSize]);

  const fetchScheduleClassSubject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let res = await dispatch(getScheduleMonth({ startDate, endDate, page: currentPage, limit: pageSize }));
      if (!res.payload || !res.payload.data) {
        const errorMsg = res.payload?.message || 'Không thể tải dữ liệu';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Đã có lỗi xảy ra khi tải dữ liệu';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    // Chỉ gọi hàm fetch nếu không đang loading để tránh trùng lặp
    if (!isLoading) {
      fetchScheduleClassSubject();
    }
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    toast.info('Chức năng xuất Excel đang được phát triển');
  };

  const totalPages = Math.ceil(totalSchedule / pageSize);

  // Smart pagination - only show a range of pages
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    if (totalPages <= 1) return [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // First page
    rangeWithDots.push(1);

    // Left dots
    if (currentPage - delta > 2) {
      rangeWithDots.push('...');
    }

    // Inner range
    rangeWithDots.push(...range);

    // Right dots and last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1 && !range.includes(totalPages)) {
      // Ensure totalPages is added if not already in range and totalPages > 1
      if (rangeWithDots[rangeWithDots.length - 1] !== totalPages) {
        rangeWithDots.push(totalPages);
      }
    }

    // Remove duplicate first/last page if smart logic added it
    if (rangeWithDots.length > 1 && rangeWithDots[rangeWithDots.length - 1] === rangeWithDots[rangeWithDots.length - 2] && typeof rangeWithDots[rangeWithDots.length - 1] === 'number') {
      rangeWithDots.pop();
    }
    if (rangeWithDots.length > 1 && rangeWithDots[0] === rangeWithDots[1] && typeof rangeWithDots[0] === 'number') {
      rangeWithDots.shift();
    }

    return [...new Set(rangeWithDots)];
  };

  return (
    // Responsive: p-4 cho mobile, md:p-8 cho desktop
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <h1 className="text-xl md:text-2xl text-gray-600 mb-6">Lịch Học trong Tháng</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          {/* Responsive: flex-col/flex-wrap trên mobile, md:flex-row trên desktop */}
          <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-6">

            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-gray-600 text-sm whitespace-nowrap">Từ ngày</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                // Responsive: w-full trên mobile, md:w-40 trên desktop
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-40"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-gray-600 text-sm whitespace-nowrap">Đến ngày</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                // Responsive: w-full trên mobile, md:w-40 trên desktop
                className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-40"
                disabled={isLoading}
              />
            </div>

            <div className='flex gap-4 w-full md:w-auto'>
              <button
                // Responsive: flex-1 trên mobile, md:w-auto trên desktop
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Tìm kiếm
              </button>

              <button
                // Responsive: flex-1 trên mobile, md:w-auto trên desktop
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                onClick={handleExportExcel}
                disabled={isLoading || !scheduleSlice || scheduleSlice.length === 0}
              >
                <FileDown size={16} />
                <span className='whitespace-nowrap'>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Bảng - Dùng overflow-x-auto để cuộn ngang trên mobile */}
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
                  <th className="px-4 py-3 text-left text-gray-700 font-semibold whitespace-nowrap">Ngày kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {/* Loading State */}
                {isLoading && (
                  <tr>
                    <td colSpan="12" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 size={32} className="animate-spin text-teal-500" />
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Error State */}
                {!isLoading && error && (
                  <tr>
                    <td colSpan="12" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle size={32} className="text-red-500" />
                        <p className="text-gray-700 font-medium">Không thể tải dữ liệu</p>
                        <p className="text-gray-500 text-sm">{error}</p>
                        <button
                          onClick={fetchScheduleClassSubject}
                          className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Thử lại
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Empty State */}
                {!isLoading && !error && (!scheduleSlice || scheduleSlice.length === 0) && (
                  <tr>
                    <td colSpan="12" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-700 font-medium">Không tìm thấy dữ liệu</p>
                        <p className="text-gray-500 text-sm">Vui lòng thử thay đổi điều kiện tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Data Rows */}
                {!isLoading && !error && scheduleSlice && scheduleSlice.length > 0 && scheduleSlice.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-200 whitespace-nowrap">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-3 border-r border-gray-200 whitespace-nowrap">{row.ClassCode}</td>
                    <td className="px-4 py-3 border-r border-gray-200 whitespace-nowrap">{row.ClassName}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center whitespace-nowrap">{row.NumberStudent}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center whitespace-nowrap">{row.SubjectCode}</td>
                    <td className="px-4 py-3 border-r border-gray-200 whitespace-nowrap">{row.SubjectName}</td>
                    <td className="px-4 py-3 border-r border-gray-200 whitespace-nowrap">{row.FaciltyName}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center whitespace-nowrap">{row.DayOfWeek}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center whitespace-nowrap">{row.NumberDay}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center whitespace-nowrap">{row.DateNumberDayGraduation}</td>
                    <td className="px-4 py-3 border-r border-gray-200 text-center whitespace-nowrap">{row.StartDate}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{row.EndDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !error && scheduleSlice && scheduleSlice.length > 0 && (
            // Responsive: flex-col trên mobile, md:flex-row trên desktop
            <div className="p-4 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang đầu"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-2 mx-2">
                  {getPageNumbers().map((pageNum, i) => (
                    pageNum === '...' ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded text-sm ${currentPage === pageNum
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-100'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang sau"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang cuối"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>

              {/* Page Size and Summary */}
              {/* Responsive: flex-wrap trên mobile, md:flex-row trên desktop */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalSchedule)} / {totalSchedule} kết quả
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Số dòng:</span>
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
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-right text-xs text-gray-500">
          Copyright © 2023 by G&BSoft
        </div>
      </div>
    </div>
  );
}