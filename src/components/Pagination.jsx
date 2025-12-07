import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Component Pagination tái sử dụng
 * ... (JSDoc giữ nguyên)
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

    // Helper để lấy số trang (giữ nguyên logic gốc, đã xử lý khá tốt)
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        if (totalPages <= 1) return [1];

        // Thêm trang 1
        rangeWithDots.push(1);

        // Tính toán các trang xung quanh trang hiện tại
        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        // Thêm dấu ... nếu cần sau trang 1
        if (currentPage - delta > 2) {
            rangeWithDots.push('...');
        }

        // Thêm các trang trong khoảng
        rangeWithDots.push(...range);

        // Thêm dấu ... nếu cần trước trang cuối
        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...');
        }

        // Thêm trang cuối (nếu chưa có và tổng số trang lớn hơn 1)
        if (totalPages > 1 && rangeWithDots[rangeWithDots.length - 1] !== totalPages) {
            if (rangeWithDots[rangeWithDots.length - 1] !== '...' || rangeWithDots.length > 1) {
                // Đảm bảo không thêm '...' nếu đã có, và không thêm trang cuối nếu nó đã nằm trong range
                rangeWithDots.push(totalPages);
            }
        }

        // Loại bỏ các trường hợp lặp 1...totalPages và loại bỏ số trang trùng lặp (nếu có 1...2...totalPages)
        const uniqueRange = [];
        rangeWithDots.forEach((item) => {
            const lastItem = uniqueRange[uniqueRange.length - 1];
            if (uniqueRange.length === 0) {
                uniqueRange.push(item);
            } else if (item === '...' && lastItem === '...') {
                // Không làm gì nếu liên tiếp là '...'
            } else if (typeof item === 'number' && typeof lastItem === 'number' && item <= lastItem) {
                // Bỏ qua nếu trang hiện tại đã có hoặc nhỏ hơn trang trước (đã được xử lý bởi logic bên trên)
            } else if (item === totalPages && lastItem === totalPages) {
                // Bỏ qua trang cuối trùng lặp
            } else if (item === 1 && lastItem === 1) {
                // Bỏ qua trang đầu trùng lặp
            }
            else {
                uniqueRange.push(item);
            }
        });

        // Lọc lại lần cuối để đảm bảo unique và loại bỏ '...' ở vị trí không hợp lệ
        return uniqueRange.filter((value, index, self) =>
            (value !== '...' || self[index - 1] !== 1) && (value !== '...' || self[index + 1] !== totalPages)
        ).filter((value, index, self) =>
            self.indexOf(value) === index || value === '...'
        );
    };

    // Tính toán lại số trang hiển thị
    const startIndex = Math.min(totalItems, ((currentPage - 1) * pageSize) + 1);
    const endIndex = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="p-4 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                    title="Trang đầu"
                >
                    <ChevronsLeft size={16} />
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
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
                                disabled={pageNum === currentPage}
                                className={`px-3 py-1 border rounded text-sm transition duration-150 ${currentPage === pageNum
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
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                    title="Trang sau"
                >
                    <ChevronRight size={16} />
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                    title="Trang cuối"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                    Hiển thị {startIndex} - {endIndex} / {totalItems} kết quả
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