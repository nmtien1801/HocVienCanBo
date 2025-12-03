import React, { useState, useEffect } from 'react';
import { Search, FileDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle } from 'lucide-react';
import { getSubjectLearnAll } from '../../redux/scheduleSlice.js';
import { getSearchPointGraduation } from '../../redux/pointSlice.js';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from '../../utils/constants.js';

export default function LookupGraduationExam() {
    const dispatch = useDispatch();
    const { SearchGraduationList, SearchGraduationTotal } = useSelector((state) => state.point);
    const { subjectLearnAll } = useSelector((state) => state.schedule);
    const [selectedSubject, setSelectedSubject] = useState(0);
    const [studentCode, setStudentCode] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubjectLearnAll = async () => {
            setIsLoadingSubjects(true);
            try {
                let res = await dispatch(getSubjectLearnAll());
                if (!res.payload || !res.payload.data) {
                    toast.error(res.payload?.message || 'Không thể tải danh sách môn học');
                }
            } catch (err) {
                toast.error('Đã có lỗi xảy ra khi tải danh sách môn học');
            } finally {
                setIsLoadingSubjects(false);
            }
        };

        fetchSubjectLearnAll();
    }, [dispatch]);

    const fetchListSearchPoint = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let res = await dispatch(getSearchPointGraduation({ studentCode: studentCode, subjectID: selectedSubject, page: currentPage, limit: pageSize }));
            console.log('ssss ', res.payload.data);

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
        fetchListSearchPoint();
    };

    const handleExportExcel = () => {
        // TODO: Implement Excel export functionality
        toast.info('Chức năng xuất Excel đang được phát triển');
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronUp size={14} className="text-gray-400" />;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUp size={14} className="text-gray-600" /> :
            <ChevronDown size={14} className="text-gray-600" />;
    };

    const totalPages = Math.ceil(SearchGraduationTotal / pageSize);

    // Smart pagination - only show a range of pages
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

        // Loại bỏ các trường hợp lặp 1...totalPages
        if (totalPages <= 1) return [1];

        // Loại bỏ số trang trùng lặp (nếu có 1...2...totalPages)
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

    const renderTableBody = () => {
        // Loading State
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="12" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 size={32} className="animate-spin text-teal-500" />
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        // Error State
        if (!isLoading && error) {
            return (
                <tr>
                    <td colSpan="12" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <AlertCircle size={32} className="text-red-500" />
                            <p className="text-gray-500 text-sm">{error}</p>
                            <button
                                onClick={fetchListSearchPoint}
                                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
                            >
                                Thử lại
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        // Empty State - No Data Found
        if (!SearchGraduationList || SearchGraduationList.length === 0) {
            return (
                <tr>
                    <td colSpan="12" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-medium">Không tìm thấy dữ liệu</p>
                            <p className="text-gray-500 text-sm">Vui lòng nhập thông tin và nhấn "Tìm kiếm"</p>
                        </div>
                    </td>
                </tr>
            );
        }

        // Data Rows
        return SearchGraduationList.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 border-r border-gray-200">{row.stt}</td>
                <td className="px-4 py-3 border-r border-gray-200">{row.maHocVien}</td>
                <td className="px-4 py-3 border-r border-gray-200">{row.hoTen}</td>
                <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngaySinh}</td>
                <td className="px-4 py-3 border-r border-gray-200 text-center">{row.lanThi1}</td>
                <td className="px-4 py-3 border-r border-gray-200 text-center">{row.lanThi2}</td>
                <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ketQua}</td>
                <td className="px-4 py-3">{row.ghiChu}</td>
            </tr>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <h1 className="text-xl md:text-2xl text-gray-600 mb-6">Tra cứu điểm thi tốt nghiệp</h1>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-3 flex-1 min-w-[200px] md:min-w-0">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Tìm kiếm</label>
                            <input
                                type="text"
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                                placeholder="Mã học viên"
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-80 placeholder-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-[200px] md:min-w-0">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Môn học</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-80 text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={isLoading || isLoadingSubjects}
                            >
                                <option value={0}>
                                    {isLoadingSubjects ? 'Đang tải...' : '------ chọn môn học ------'}
                                </option>
                                {subjectLearnAll?.map((item) => (
                                    <option key={item.SubjectID} value={item.SubjectID}>
                                        {item.SubjectName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='flex gap-4'>
                            <button
                                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                                onClick={handleSearch}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                Tìm kiếm
                            </button>

                            <button
                                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                                onClick={handleExportExcel}
                                disabled={isLoading || !SearchGraduationList || SearchGraduationList.length === 0}
                            >
                                <FileDown size={16} />
                                <span className='whitespace-nowrap'>Export Excel</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('stt')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>STT</span>
                                            <SortIcon columnKey="stt" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('maHocVien')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Mã số học viên</span>
                                            <SortIcon columnKey="maHocVien" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('hoTen')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Họ và tên</span>
                                            <SortIcon columnKey="hoTen" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ngaySinh')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Ngày sinh</span>
                                            <SortIcon columnKey="ngaySinh" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('lanThi1')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>[LT]Lần thi 1</span>
                                            <SortIcon columnKey="lanThi1" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('lanThi2')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>[LT]Lần thi 2</span>
                                            <SortIcon columnKey="lanThi2" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ketQua')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Kết quả</span>
                                            <SortIcon columnKey="ketQua" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-600 font-medium whitespace-nowrap cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ghiChu')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>Ghi chú</span>
                                            <SortIcon columnKey="ghiChu" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody()}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && !error && SearchGraduationList && SearchGraduationList.length > 0 && (
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

                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                                <span className="text-sm text-gray-600 whitespace-nowrap">
                                    Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, SearchGraduationTotal)} / {SearchGraduationTotal} kết quả
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