import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Save, X, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from "react-toastify";
import { getCriteriaEvaluation } from '../../redux/CriteriaEvaluationSlice.js';
import ApiCriteriaEvaluation from '../../apis/ApiCriteriaEvaluation.js';
import { useSelector, useDispatch } from "react-redux";

const initialBank = [
    { CriteriaEvaluationID: 1, TypeCriteria: 'likert6', TitleCriteriaEvaluation: 'Giảng viên truyền đạt rõ ràng', StatusID: 1 },
    { CriteriaEvaluationID: 2, TypeCriteria: 'likert6', TitleCriteriaEvaluation: 'Phòng học sạch sẽ', StatusID: 1 },
    { CriteriaEvaluationID: 3, TypeCriteria: 'textarea', TitleCriteriaEvaluation: 'Ý kiến cải tiến khóa học', StatusID: 1 },
];

const ManagerQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const target = location.state?.pickerTarget || null;

    const [bank, setBank] = useState(initialBank);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
    const [isAdding, setIsAdding] = useState(false);

    // Thêm các state mới
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchKey, setSearchKey] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);

    // ----------------------------- fetch list câu hỏi ---------------------------------------
    const fetchList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let res = await dispatch(getCriteriaEvaluation({
                key: searchKey,
                typeTemplate: filterType,
                statusID: filterStatus || 1,
                page: currentPage,
                limit: pageSize
            }));

            if (!res.payload || !res.payload.data) {
                const errorMsg = res.payload?.message || 'Không thể tải dữ liệu';
                setError(errorMsg);
            } else {
                setBank(res.payload.data);
                setTotalItems(res.payload.total || res.payload.data.length);
            }
        } catch (err) {
            const errorMsg = 'Đã có lỗi xảy ra khi tải dữ liệu';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, [currentPage, pageSize]);

    // action 
    useEffect(() => {
        if (editing) {
            const item = bank.find(b => Number(b.CriteriaEvaluationID) === Number(editing));
            if (item) setForm({ ...item });
        } else if (!isAdding) {
            setForm({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
        }
    }, [editing, bank, isAdding]);

    // -------------------------------- action button + action row -------------------------------------------
    const clearForm = () => {
        setForm({ CriteriaEvaluationID: '', TypeCriteria: 'likert6', TitleCriteriaEvaluation: '', StatusID: 1 });
        setEditing(null);
        setIsAdding(false);
    };

    const handleSave = async () => {
        if (!form.TitleCriteriaEvaluation.trim()) {
            toast.warning('Vui lòng nhập nội dung câu hỏi');
            return;
        }
        if (editing) {
            setBank(bank.map(b => (Number(b.CriteriaEvaluationID) === Number(editing) ? { ...form } : b)));
            toast.success('Cập nhật câu hỏi thành công');
        } else {
            // const newId = bank.length ? Math.max(...bank.map(b => Number(b.CriteriaEvaluationID))) + 1 : 1;
            // setBank([...bank, { ...form, CriteriaEvaluationID: newId }]);
            // toast.success('Thêm câu hỏi thành công');
            let res = await ApiCriteriaEvaluation()
            console.log('ssss ', res);
            
        }
        clearForm();
    };

    const handleEdit = (id) => {
        setEditing(id);
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
        setBank(bank.filter(b => Number(b.CriteriaEvaluationID) !== Number(id)));
        if (Number(editing) === Number(id)) clearForm();
        toast.success('Xóa câu hỏi thành công');
    };

    const handleDeleteCurrent = () => {
        const idToDelete = editing || form.CriteriaEvaluationID;
        if (!idToDelete) return;
        handleDelete(idToDelete);
    };

    const handleUseAndBack = (item) => {
        navigate(-1, { state: { pickedQuestion: item, pickerTarget: target } });
    };

    const handleRowClick = (item) => {
        setEditing(item.CriteriaEvaluationID);
        setForm({ ...item });
        setIsAdding(true);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchList();
    };

    // --------------------------------------------- phân trang ----------------------------------
    const totalPages = Math.ceil(totalItems / pageSize);

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

    // ---------------------------------------------- render table body ---------------------------------------------------
    const renderTableBody = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 size={32} className="animate-spin text-blue-500" />
                            <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!isLoading && error) {
            return (
                <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <AlertCircle size={32} className="text-red-500" />
                            <p className="text-gray-500 text-sm">{error}</p>
                            <button
                                onClick={fetchList}
                                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                            >
                                Thử lại
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        if (!bank || bank.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-medium">Không tìm thấy dữ liệu</p>
                            <p className="text-gray-500 text-sm">Không có câu hỏi nào trong hệ thống</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return bank.map(item => (
            <tr
                key={item.CriteriaEvaluationID}
                onClick={() => handleRowClick(item)}
                className={`cursor-pointer transition border-b border-gray-200 ${Number(editing) === Number(item.CriteriaEvaluationID) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
                <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap border-r border-gray-200">{item.CriteriaEvaluationID}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap border-r border-gray-200">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.TypeCriteria === 'likert6' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.TypeCriteria === 'likert6' ? 'Thang đo' : 'Ý kiến'}
                    </span>
                </td>
                <td className="px-4 py-3 text-gray-800 max-w-xl truncate border-r border-gray-200">{item.TitleCriteriaEvaluation}</td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.StatusID === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.StatusID === 1 ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                    <div className="inline-flex gap-2 items-center justify-end">
                        {target && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleUseAndBack(item); }}
                                className="px-3 py-1 bg-teal-500 text-white rounded-lg text-xs font-semibold hover:bg-teal-600 transition"
                            >
                                Sử dụng
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(item.CriteriaEvaluationID); }}
                            className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            title="Sửa"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.CriteriaEvaluationID); }}
                            className="p-2 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Xóa"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    // ---------------------------------------------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Quản lý Ngân hàng Câu hỏi</h1>
                    </div>
                </div>

                {/* Form Thêm/Sửa/Xóa */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8 border-2 border-blue-300">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">{editing ? `Chỉnh sửa Câu hỏi ID: ${editing}` : 'Thêm Câu hỏi mới'}</h2>
                    <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-12 sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại Câu hỏi</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={form.TypeCriteria}
                                onChange={(e) => setForm({ ...form, TypeCriteria: e.target.value })}
                            >
                                <option value="likert6">Thang 6 mức (A-F)</option>
                                <option value="textarea">Ý kiến mở (Text Area)</option>
                            </select>
                        </div>
                        <div className="col-span-12 sm:col-span-7">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung Câu hỏi</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={form.TitleCriteriaEvaluation}
                                onChange={(e) => setForm({ ...form, TitleCriteriaEvaluation: e.target.value })}
                                placeholder="Nhập nội dung câu hỏi..."
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={form.StatusID}
                                onChange={(e) => setForm({ ...form, StatusID: Number(e.target.value) })}
                            >
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Không hoạt động</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-span-12 text-right mt-5 flex flex-wrap justify-end items-center gap-3">
                        <button
                            onClick={clearForm}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            <X className="w-4 h-4" /> Xóa trắng
                        </button>

                        <button
                            onClick={handleDeleteCurrent}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-150 disabled:opacity-50"
                            disabled={!editing}
                        >
                            <Trash2 className="w-4 h-4" /> Xóa
                        </button>

                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                        >
                            <Save className="w-4 h-4" /> {editing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Tìm kiếm</label>
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                placeholder="Nhập từ khóa..."
                                value={searchKey}
                                onChange={(e) => setSearchKey(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-[150px]">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Loại</label>
                            <select
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                <option value="likert6">Thang đo</option>
                                <option value="textarea">Ý kiến</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-[150px]">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Trạng thái</label>
                            <select
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                <option value="1">Hoạt động</option>
                                <option value="0">Tạm dừng</option>
                            </select>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSearch}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Bảng Câu hỏi */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 border-b-2 border-gray-300">
                                <tr>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Loại</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Nội dung</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Trạng thái</th>
                                    <th className="px-4 py-3 text-right text-gray-700 font-semibold whitespace-nowrap">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody()}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && !error && bank && bank.length > 0 && (
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
                                    Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} / {totalItems} kết quả
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
};

export default ManagerQuestion;