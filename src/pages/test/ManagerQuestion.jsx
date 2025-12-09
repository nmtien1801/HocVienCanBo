import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Save, X, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from "react-toastify";
import { getCriteriaEvaluation } from '../../redux/CriteriaEvaluationSlice.js';
import ApiCriteriaEvaluation from '../../apis/ApiCriteriaEvaluation.js';
import { useSelector, useDispatch } from "react-redux";

const TypeCriteriaMapping = {
    1: 'Thang 6 mức (A-F)',
    2: 'Ý kiến mở (Text Area)',
};
const TypeCriteriaInt = {
    LIKERT: 1,
    TEXTAREA: 2,
}

// const initialBank = [
//     { CriteriaEvaluationID: 1, TypeCriteria: TypeCriteriaInt.LIKERT, TitleCriteriaEvaluation: 'Giảng viên truyền đạt rõ ràng', StatusID: 1 },
//     { CriteriaEvaluationID: 2, TypeCriteria: TypeCriteriaInt.LIKERT, TitleCriteriaEvaluation: 'Phòng học sạch sẽ', StatusID: 0 },
//     { CriteriaEvaluationID: 3, TypeCriteria: TypeCriteriaInt.TEXTAREA, TitleCriteriaEvaluation: 'Ý kiến cải tiến khóa học', StatusID: 1 },
// ];

const initialFormState = { CriteriaEvaluationID: '', TypeCriteria: TypeCriteriaInt.LIKERT, TitleCriteriaEvaluation: '', StatusID: true };


const ManagerQuestion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const target = location.state?.pickerTarget || null;

    const { CriteriaEvaluationList, CriteriaEvaluationTotal } = useSelector((state) => state.criteriaEvaluation);

    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(initialFormState);
    const [isAdding, setIsAdding] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State lưu giá trị đang được nhập/chọn trong filter
    const [searchKey, setSearchKey] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState(true);

    // State dùng để kích hoạt API call, chỉ thay đổi khi nhấn nút Tìm kiếm
    const [activeSearchKey, setActiveSearchKey] = useState("");
    const [activeFilterType, setActiveFilterType] = useState(1);
    const [activeFilterStatus, setActiveFilterStatus] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // ----------------------------- fetch list câu hỏi ---------------------------------------
    const fetchList = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let res = await dispatch(getCriteriaEvaluation({
                key: activeSearchKey,
                TypeCriteria: activeFilterType,
                statusID: activeFilterStatus ? true : false,
                page: currentPage,
                limit: pageSize
            }));

        } catch (err) {
            const errorMsg = 'Đã có lỗi xảy ra khi tải dữ liệu.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // -------------------------- useEffect để gọi API khi Active Filters hoặc Pagination thay đổi --------------------------
    useEffect(() => {
        fetchList();
    }, [currentPage, pageSize, activeSearchKey, activeFilterType, activeFilterStatus, dispatch]);

    // -------------------------- Logic Đồng bộ Form --------------------------
    useEffect(() => {
        if (editing && CriteriaEvaluationList) {
            const item = CriteriaEvaluationList.find(b => Number(b.CriteriaEvaluationID) === Number(editing));
            if (item) setForm({ ...item, TypeCriteria: Number(item.TypeCriteria) });
        } else if (!isAdding) {
            setForm(initialFormState);
        }
    }, [editing, CriteriaEvaluationList, isAdding]);


    // -------------------------------- action button + action row -------------------------------------------
    const clearForm = () => {
        setForm(initialFormState);
        setEditing(null);
        setIsAdding(false);
    };

    const handleSave = async () => {
        if (!form.TitleCriteriaEvaluation.trim()) {
            toast.warning('Vui lòng nhập nội dung câu hỏi');
            return;
        }

        const itemToSave = {
            ...form,
            TypeCriteria: Number(form.TypeCriteria),
            StatusID: Number(form.StatusID)
        };

        if (editing) {
            toast.success('Cập nhật câu hỏi thành công');
        } else {
            // toast.success('Thêm câu hỏi thành công');
            let res = await ApiCriteriaEvaluation.CreateTemplateSurveyApi(form)            
            fetchList();
        }
        clearForm();
    };

    const handleEdit = (id) => {
        setEditing(id);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
        try {
            let res = await ApiCriteriaEvaluation.DeleteTemplateSurveyApi(form);
            console.log('sssss ', res);
            if (res) {
                fetchList();
                // 2. Xóa trắng Form
                if (Number(editing) === Number(id)) clearForm();

                // 3. Thông báo thành công
                toast.success('Xóa câu hỏi thành công');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa câu hỏi.');
        }
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
        setForm({ ...item, TypeCriteria: Number(item.TypeCriteria) });
        setIsAdding(true);
    };

    // -------------------------- HÀM TÌM KIẾM CHỈ ĐƯỢC GỌI KHI BẤM NÚT --------------------------
    const handleSearch = () => {
        setActiveSearchKey(searchKey);
        setActiveFilterType(filterType ? Number(filterType) : 1);
        setActiveFilterStatus(filterStatus);
        setCurrentPage(1);
    };

    // --------------------------------------------- phân trang ----------------------------------
    const totalPages = Math.ceil(CriteriaEvaluationTotal / pageSize);

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

        if (!CriteriaEvaluationList || CriteriaEvaluationList.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-medium">Không tìm thấy dữ liệu</p>
                            <p className="text-gray-500 text-sm">Vui lòng thay đổi tiêu chí tìm kiếm hoặc thêm câu hỏi mới.</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return CriteriaEvaluationList.map(item => (
            <tr
                key={item.CriteriaEvaluationID}
                onClick={() => handleRowClick(item)}
                className={`cursor-pointer transition border-b border-gray-200 ${Number(editing) === Number(item.CriteriaEvaluationID) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
                <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap border-r border-gray-200">{item.CriteriaEvaluationID}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap border-r border-gray-200">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.TypeCriteria === TypeCriteriaInt.LIKERT ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {TypeCriteriaMapping[item.TypeCriteria] || 'Không xác định'}
                    </span>
                </td>
                <td className="px-4 py-3 text-gray-800 max-w-xl truncate border-r border-gray-200">{item.TitleCriteriaEvaluation}</td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.StatusID === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.StatusName}
                    </span>
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
                                value={form.TypeCriteria.toString()}
                                onChange={(e) => setForm({ ...form, TypeCriteria: Number(e.target.value) })}
                            >
                                <option value={TypeCriteriaInt.LIKERT}>Thang 6 mức (A-F)</option>
                                <option value={TypeCriteriaInt.TEXTAREA}>Ý kiến mở (Text Area)</option>
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
                                value={form.StatusID.toString()}
                                onChange={(e) => setForm({ ...form, StatusID: form.StatusID })}
                            >
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Tạm dừng</option>
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
                                <option value={TypeCriteriaInt.LIKERT.toString()}>Thang đo</option>
                                <option value={TypeCriteriaInt.TEXTAREA.toString()}>Ý kiến</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-[150px]">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Trạng thái</label>
                            <select
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={filterStatus ? true : false}
                                onChange={(e) => setFilterStatus(e.target.value === true)}
                            >
                                <option value="true">Hoạt động</option>
                                <option value="false">Tạm dừng</option>
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
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">STT</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Loại</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Nội dung câu hỏi</th>
                                    <th className="px-4 py-3 text-left text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableBody()}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && !error && CriteriaEvaluationList && CriteriaEvaluationList.length > 0 && (
                        <div className="p-4 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" title="Trang đầu"><ChevronsLeft size={16} /></button>
                                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" title="Trang trước"><ChevronLeft size={16} /></button>
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
                                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" title="Trang sau"><ChevronRight size={16} /></button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" title="Trang cuối"><ChevronsRight size={16} /></button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                                <span className="text-sm text-gray-600 whitespace-nowrap">
                                    Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, CriteriaEvaluationTotal)} / {CriteriaEvaluationTotal} kết quả
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