import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Component Pagination tái sử dụng
 * @param {number} currentPage - Trang hiện tại
 * @param {function} setCurrentPage - Hàm set trang
 * @param {number} pageSize - Số items trên một trang
 * @param {function} setPageSize - Hàm set số items trên một trang
 * @param {number} totalItems - Tổng số items
 * @param {boolean} showPageSizeSelector - Có hiển thị selector số dòng không (mặc định true)
 */
export const Pagination = ({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
  showPageSizeSelector = true,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Helper để lấy số trang
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else if (totalPages > 0) {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1 && currentPage + delta >= totalPages - 1 && range.indexOf(totalPages) === -1) {
      rangeWithDots.push(totalPages);
    } else if (totalPages === 1 && rangeWithDots.indexOf(1) === -1) {
      rangeWithDots.push(1);
    }

    if (totalPages <= 1) return [1];

    const uniqueRange = [];
    rangeWithDots.forEach((item) => {
      if (uniqueRange.length === 0 || item !== uniqueRange[uniqueRange.length - 1] || item === '...') {
        uniqueRange.push(item);
      } else if (typeof item === 'number' && uniqueRange[uniqueRange.length - 1] === '...') {
        uniqueRange.push(item);
      }
    });

    return uniqueRange.filter((value, index, self) =>
      self.indexOf(value) === index || value === '...'
    );
  };

  return (
    <div className="p-4 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Trang đầu"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                className={`px-3 py-1 border rounded text-sm transition ${
                  currentPage === pageNum
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
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Trang sau"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Trang cuối"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} / {totalItems} kết quả
        </span>
        
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Số dòng:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm hover:border-gray-400 focus:outline-none focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
