import React, { useState, useEffect } from 'react';
import QuestionPicker from '../question/QuestionPicker.jsx';
import {
    Plus, Edit, Trash2, ChevronRight, ChevronDown, ChevronLeft,
    FolderOpen, Folder, FileText, Save, X, Search, ListChecks,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';
import FormTemplateSurvey from './FormTemplateSurvey.jsx';
import FormTemplateCategory from './FormTemplateCategory.jsx';
import { getTemplateSurvey } from '../../redux/TemplateSurveysSlice.js';
import ApiTemplateSurveys from '../../apis/ApiTemplateSurveys.js';
import ApiTemplateSurveyCate from '../../apis/ApiTemplateSurveyCate.js';
import ApiTemplateSurveyCriterias from '../../apis/ApiTemplateSurveyCriterias.js';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { StatusID } from '../../utils/constants.js'
import FormEvaluation from './FormEvaluation.jsx'

const QuestionTypeLabels = {
    1: 'Câu hỏi khảo sát',
    2: 'câu hỏi tự luận',
};

const PAGE_SIZE = 5; // Kích thước mặc định của trang

const ManagerSurveyOther = () => {
    const dispatch = useDispatch();
    const { TemplateSurveysList, TemplateSurveysTotal } = useSelector((state) => state.templateSurvey);

    const [showQuestionPicker, setShowQuestionPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState(null);
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(new Set(['cat1']));
    const [expandedGroups, setExpandedGroups] = useState(new Set(['']));

    const [editMode, setEditMode] = useState(null); // Có thể xóa nếu không dùng sửa inline

    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [templateForm, setTemplateForm] = useState({ TemplateSurveyID: '', TypeTemplate: 1, Title: '', ShorDescription: '', Requiments: '', StatusID: true, ImagePath: '', Permission: 0 });
    const [templateSurveyID, setTemplateSurveyID] = useState(null);

    // STATE CHO TemplateSurveyCriteria (bảng quản lý câu hỏi + nhóm)
    const [statusTemplateSurveyCriteria, setStatusTemplateSurveyCriteria] = useState()

    // --- STATE CHO MODAL NHÓM ---
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({
        TemplateSurveyCateID: '',
        ParentID: null,
        TemplateSurveyID: '',
        TitleCate: '',
        StatusID: true
    });

    // --- STATE CHO MODAL CHỌN TIÊU CHÍ (CRITERIA) ---
    const [showEvaluation, setShowEvaluation] = useState(false);

    // Hàm mở modal chọn tiêu chí
    const openEvaluationModal = (catId) => {
        setCategoryForm(prev => ({
            ...prev,
            TemplateSurveyCateID: catId
        }));
        setShowEvaluation(true);
    };

    // ----------------------------------------------------------------------------

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_SIZE);

    // ----------------------------- fetch list câu hỏi ---------------------------------------
    const fetchList = async () => {
        try {
            await dispatch(getTemplateSurvey({
                key: searchTerm,
                typeTemplate: 2, // khảo sát khác
                statusID: filterStatus ? true : false,
                page: currentPage,
                limit: limit
            }));

        } catch (err) {
            const errorMsg = 'Đã có lỗi xảy ra khi tải dữ liệu.';
            toast.error(errorMsg);
        }
    };

    useEffect(() => {
        fetchList();
    }, [dispatch, currentPage, limit, filterStatus]);

    // START: MAPPING DATA TỪ REDUX SANG STATE CỦA COMPONENT
    const mapDataWithDetails = async (TemplateSurveysList) => {
        if (TemplateSurveysList && Array.isArray(TemplateSurveysList)) {
            const mappedData = await Promise.all(
                TemplateSurveysList.map(async (item) => {
                    // 1. Lấy danh sách nhóm câu hỏi
                    let grp = await ApiTemplateSurveyCate.getTemplateSurveyCateByTemplateSurveyIDApi(item.TemplateSurveyID);
                    const listGroups = grp.data || [];

                    // 2. Lặp qua từng nhóm để lấy câu hỏi 
                    const mappedGroups = await Promise.all(listGroups.map(async (groupItem) => {

                        // 3. Lấy danh sách câu hỏi (Questions) dựa trên GroupID hiện tại
                        let q = await ApiTemplateSurveyCriterias.getTemplateSurveyCriteriaByTemlateSurveyCateIDApi(groupItem.TemplateSurveyCateID);
                        const listQuestions = q.data || [];

                        // 4. Map dữ liệu câu hỏi
                        const mappedQuestions = listQuestions.map(questionItem => ({
                            id: questionItem.CriteriaEvaluationID,
                            templateSurveyCriteriaID: questionItem.TemplateSurveyCriteriaID, // xóa câu hỏi khỏi Criteria
                            text: questionItem.TitleCriteriaEvaluation,
                            type: questionItem.TypeCriteria
                        }));

                        // Trả về object của Group
                        return {
                            id: groupItem.TemplateSurveyCateID,
                            name: groupItem.TitleCate,
                            description: '',
                            questions: mappedQuestions // Mảng chứa tất cả câu hỏi của group này
                        };
                    }));

                    // Trả về object của Survey
                    return {
                        id: item.TemplateSurveyID,
                        name: item.Title,
                        description: item.ShorDescription,
                        groups: mappedGroups,
                        templateMeta: { ...item }
                    };
                })
            );

            setCategories(mappedData);
        }
    };

    useEffect(() => {
        mapDataWithDetails(TemplateSurveysList)
    }, [TemplateSurveysList]);

    // -------------------------- Action - HÀM TÌM KIẾM CHỈ ĐƯỢC GỌI KHI BẤM NÚT --------------------------
    const handleSearch = () => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            fetchList();
        }
    };

    // --------------------------------- Toggle expand/collapse
    const toggleCategory = (catId) => {
        const newSet = new Set(expandedCategories);
        if (newSet.has(catId)) {
            newSet.delete(catId);
        } else {
            newSet.add(catId);
        }
        setExpandedCategories(newSet);
    };

    const toggleGroup = (grpId) => {
        const newSet = new Set(expandedGroups);
        if (newSet.has(grpId)) {
            newSet.delete(grpId);
        } else {
            newSet.add(grpId);
        }
        setExpandedGroups(newSet);
    };

    // ------------------- XỬ LÝ NHÓM (CATEGORY/GROUP) -------------------

    // 1. Mở modal Thêm mới nhóm
    const addGroup = (catId) => {
        setCategoryForm({
            TemplateSurveyCateID: '', // ID rỗng => Thêm mới
            ParentID: null,
            TemplateSurveyID: catId,
            TitleCate: '',
            StatusID: true
        });
        setShowCategoryModal(true);
    };

    // 2. Mở modal Sửa nhóm
    const editGroup = (group, catId) => {
        setCategoryForm({
            TemplateSurveyCateID: group.id, // ID của nhóm cần sửa
            ParentID: group.templateMeta?.ParentID || null,
            TemplateSurveyID: group.templateMeta?.TemplateSurveyID || catId,
            TitleCate: group.name,
            StatusID: group.templateMeta?.StatusID ?? true
        });
        setShowCategoryModal(true);
    };

    // 3. Lưu nhóm (Xử lý cả Thêm và Sửa)
    const handleSaveCategory = async () => {
        if (categoryForm.TemplateSurveyCateID) {
            let res = await ApiTemplateSurveyCate.UpdateTemplateSurveyCateApi(categoryForm);
            if (res.message) {
                toast.error(res.message)
            } else {
                toast.success("sửa mục khảo sát thành công")
                setShowTemplateModal(false);
            }
        } else {
            let res = await ApiTemplateSurveyCate.CreateTemplateSurveyCateApi(categoryForm);
            if (res.message) {
                toast.error(res.message)
            } else {
                toast.success("thêm mới mục khảo sát thành công")
                setShowTemplateModal(false);
            }
        }

        setShowCategoryModal(false);
        fetchList();
    };

    // Hàm xử lý chuyển trang
    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(TemplateSurveysTotal / limit)) {
            setCurrentPage(page);
        }
    };

    // ----------------------------- Xử lý phiếu
    // mở modal thêm sửa phiếu
    const openTemplateModal = (category = null) => {
        if (category) {
            setTemplateForm({
                TemplateSurveyID: category.templateMeta?.TemplateSurveyID ?? '',
                TypeTemplate: 2,    // khảo sát khác
                Title: category.templateMeta?.Title ?? category.name ?? '',
                ShorDescription: category.templateMeta?.ShorDescription ?? category.description ?? '',
                Requiments: category.templateMeta?.Requiments ?? '',
                StatusID: category.templateMeta?.StatusID ?? true,
                ImagePath: category.templateMeta?.ImagePath ?? '',
                Permission: category.templateMeta?.Permission ?? 0,
                FromDate: category.templateMeta?.FromDate ?? null,
                ToDate: category.templateMeta?.ToDate ?? null
            });
            setTemplateSurveyID(category.id);
        } else {
            setTemplateForm({ TemplateSurveyID: '', TypeTemplate: 2, Title: '', ShorDescription: '', Requiments: '', StatusID: true, ImagePath: '', Permission: 0 });
            setTemplateSurveyID(null);
        }
        setShowTemplateModal(true);
    };

    // thêm + sửa phiếu đánh giá
    const handleSaveTemplate = async () => {
        if (templateSurveyID) {
            // sửa cập nhật
            let res = await ApiTemplateSurveys.UpdateTemplateSurveyApi(templateForm)
            if (res.message) {
                toast.error(res.message)
            } else {
                toast.success("thêm mới phiếu khảo sát thành công")
                setShowTemplateModal(false);
                setTemplateSurveyID(null);
                fetchList();
            }
        } else {
            // thêm mới
            let res = await ApiTemplateSurveys.CreateTemplateSurveyApi(templateForm)
            if (res.message) {
                toast.error(res.message)
            } else {
                toast.success("thêm mới phiếu khảo sát thành công")
                setShowTemplateModal(false);
                fetchList();
            }
        }
    };

    const addQuestion = (catId, grpId) => {
        setPickerTarget({ catId, grpId });
        setShowQuestionPicker(true);
    };

    // chọn câu hỏi và lưu vào TemplateSurveyCriterias
    const handlePickQuestion = async (question) => {

        if (!pickerTarget) return;
        const { catId, grpId } = pickerTarget;
        const formTemplateSurveyCriterias = {
            TemplateSurveyCateID: grpId,
            CriteriaEvaluationID: question.CriteriaEvaluationID,
            StatusID: true // luôn hoạt động lúc mới thêm
        }

        setExpandedGroups(new Set([...expandedGroups, grpId]));
        setShowQuestionPicker(false);
        setPickerTarget(null);

        let res = await ApiTemplateSurveyCriterias.CreateTemplateSurveyCriteriaApi(formTemplateSurveyCriterias)

        if (res?.message) {
            toast.error(res.message)
        } else {
            toast.success("Thêm câu hỏi thành công")
            fetchList();
        }
    };

    const deleteItem = async (type, id, parentIds = {}) => {
        if (!window.confirm(`Bạn có chắc muốn xóa ${type === 'category' ? 'danh mục' : type === 'group' ? 'nhóm' : 'câu hỏi'} này?`)) {
            return;
        }

        if (type === 'category') {
            let res = await ApiTemplateSurveys.DeleteTemplateSurveyApi({ TemplateSurveyID: id })
            if (res?.message) {
                toast.error(res.message)
            } else {
                toast.success("Xóa phiếu khảo sát thành công")
                fetchList();
            }
        } else if (type === 'group') {
            // Logic xóa nhóm
            let res = await ApiTemplateSurveyCate.DeleteTemplateSurveyCateApi({ TemplateSurveyCateID: id })
            if (res?.message) {
                toast.error(res.message)
            } else {
                toast.success("Xóa tiêu chí khảo sát thành công")
                fetchList();
            }
        } else if (type === 'question') {
            // Logic xóa câu hỏi
            let res = await ApiTemplateSurveyCriterias.DeleteTemplateSurveyCriteriaApi({ templateSurveyCriteriaID: id })
            if (res?.message) {
                toast.error(res.message)
            } else {
                toast.success("Xóa tiêu chí khảo sát thành công")
                fetchList();
            }
        }
    };

    // ---------------------------------------------------------  Render Functions ---
    const renderQuestion = (question, catId, grpId, index) => {
        const isEditing = editMode?.type === 'question' && editMode?.id === question.id;
        return (
            <div key={question.id} className="ml-12 mb-2">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition group">
                    <FileText className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <input type="text" value={question.text} className="block w-full" />
                                <select
                                    value={statusTemplateSurveyCriteria}
                                    onChange={(e) => setStatusTemplateSurveyCriteria(e.target.value === "true")}
                                    className="block w-[200px] flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition" >
                                    {Object.entries(StatusID).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-800 font-medium">
                                    <span className="text-blue-600 font-semibold">Q{index + 1}.</span> {question.text}
                                </p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
                                    {QuestionTypeLabels[question.type]}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => deleteItem('question', question.templateSurveyCriteriaID, { catId, grpId })} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        );
    };

    const renderGroup = (group, catId) => {
        const isExpanded = expandedGroups.has(group.id);

        return (
            <div key={group.id} className="ml-6 mb-3">
                <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg border border-sky-200 hover:border-sky-400 transition group">
                    <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex-shrink-0 p-1 hover:bg-sky-100 rounded transition"
                    >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {isExpanded ? <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" /> : <Folder className="w-5 h-5 text-blue-600 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800">{group.name}</h4>
                        {group.description && (
                            <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        )}
                        <span className="text-xs text-gray-500 mt-1 inline-block">
                            {group.questions.length} câu hỏi
                        </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                            onClick={() => addQuestion(catId, group.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Thêm câu hỏi"
                        >
                            <Plus className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => editGroup(group, catId)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Sửa nhóm"
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => deleteItem('group', group.id, { catId })}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa nhóm câu hỏi"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-2 space-y-2">
                        {group.questions.map((question, index) =>
                            renderQuestion(question, catId, group.id, index)
                        )}
                        {group.questions.length === 0 && (
                            <div className="ml-12 text-sm text-gray-400 italic p-3">
                                Chưa có câu hỏi. Nhấn nút + để thêm câu hỏi.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderCategory = (category) => {
        const isExpanded = expandedCategories.has(category.id);

        return (
            <div key={category.id} className="mb-4">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition group">
                    <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition"
                    >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    {isExpanded ? <FolderOpen className="w-6 h-6 text-blue-700 flex-shrink-0" /> : <Folder className="w-6 h-6 text-blue-700 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                        {category.description && (<p className="text-sm text-gray-600 mt-1">{category.description}</p>)}
                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span>{category.groups.length} nhóm</span>
                            <span>•</span>
                            <span>{category.groups.reduce((sum, grp) => sum + grp.questions.length, 0)} câu hỏi</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {/* --- Nút Chọn Tiêu chí --- */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn việc đóng/mở group
                                openEvaluationModal(category.id); // Gọi hàm mở modal tiêu chí
                            }}
                            className="p-1 text-teal-600 hover:bg-teal-50 rounded" // Dùng màu teal (xanh lá)
                            title="Chọn Tiêu chí"
                        >
                            <ListChecks className="w-4 h-4" />
                        </button>

                        {/* Nút Thêm Nhóm */}
                        <button
                            onClick={() => addGroup(category.id)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Thêm nhóm"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {/* Nút Sửa Template Cha */}
                        <button
                            onClick={() => openTemplateModal(category)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Sửa phiếu khảo sát"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {/* Nút Xóa Template Cha */}
                        <button
                            onClick={() => deleteItem('category', category.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa phiếu khảo sát"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-3 space-y-3">
                        {category.groups.map(group => renderGroup(group, category.id))}
                        {category.groups.length === 0 && (
                            <div className="ml-6 text-sm text-gray-400 italic p-4 bg-gray-50 rounded-lg">
                                Chưa có nhóm câu hỏi. Nhấn nút + để thêm nhóm mới.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // --------------------------------------- Component Phân trang
    const Pagination = ({ total, limit, currentPage, onPageChange }) => {
        const totalPages = Math.ceil(total / limit);
        if (totalPages <= 1) return null;

        const getPageNumbers = () => {
            const maxPagesToShow = 5;
            let startPage, endPage;

            if (totalPages <= maxPagesToShow) {
                startPage = 1;
                endPage = totalPages;
            } else {
                const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
                const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

                if (currentPage <= maxPagesBeforeCurrentPage) {
                    startPage = 1;
                    endPage = maxPagesToShow;
                } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                    startPage = totalPages - maxPagesToShow + 1;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - maxPagesBeforeCurrentPage;
                    endPage = currentPage + maxPagesAfterCurrentPage;
                }
            }

            return Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
        };

        const pageNumbers = getPageNumbers();

        return (
            <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {pageNumbers[0] > 1 && (<><button onClick={() => onPageChange(1)} className="px-3 py-1 border rounded-lg hover:bg-blue-50">1</button>{pageNumbers[0] > 2 && <span className="text-gray-500">...</span>}</>)}

                {pageNumbers.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 border rounded-lg transition ${page === currentPage
                            ? 'bg-blue-500 text-white font-bold'
                            : 'bg-white text-gray-700 hover:bg-blue-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (<>{pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-gray-500">...</span>}<button onClick={() => onPageChange(totalPages)} className="px-3 py-1 border rounded-lg hover:bg-blue-50">{totalPages}</button></>)}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-xl text-gray-700">Quản lý Phiếu khảo sát khác</h1>
                    </div>
                    <button
                        onClick={openTemplateModal}
                        className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm chủ đề
                    </button>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Tìm kiếm</label>
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                placeholder="Tìm kiếm danh mục, nhóm, câu hỏi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        <div className="flex items-center gap-3 flex-1 min-w-[150px]">
                            <label className="text-gray-600 text-sm whitespace-nowrap">Trạng thái</label>
                            <select
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 transition"
                                value={filterStatus ? "true" : "false"}
                                onChange={(e) => setFilterStatus(e.target.value === "true")}
                            >
                                {Object.entries(StatusID).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSearch}
                        >
                            <Search size={16} />
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Question Tree */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                    <div className="space-y-4">
                        {categories.map(category => renderCategory(category))}

                        {/* Thông báo khi không có kết quả */}
                        {(categories.length === 0 || TemplateSurveysList?.length === 0) && (
                            <div className="text-center py-12 text-gray-400">
                                <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">
                                    {searchTerm ? `Không tìm thấy kết quả nào cho: "${searchTerm}"` : 'Chưa có danh mục nào'}
                                </p>
                                {!searchTerm && <p className="text-sm mt-2">Nhấn nút "Thêm chủ đề" để bắt đầu</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Component Phân trang */}
                {TemplateSurveysTotal > limit && (
                    <Pagination
                        total={TemplateSurveysTotal}
                        limit={limit}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}

            </div>
            {showQuestionPicker && (
                <QuestionPicker
                    onSelect={handlePickQuestion}
                    onClose={() => { setShowQuestionPicker(false); setPickerTarget(null); }}
                />
            )}
            <FormTemplateSurvey
                visible={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                form={templateForm}
                setForm={setTemplateForm}
                onSave={handleSaveTemplate}
            />
            <FormTemplateCategory
                visible={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                form={categoryForm}
                setForm={setCategoryForm}
                onSave={handleSaveCategory}
            />

            <FormEvaluation
                visible={showEvaluation}
                onClose={() => { setShowEvaluation(false); fetchList(); }}
                form={categoryForm} // Truyền TemplateSurveyCateID qua categoryForm
            />
        </div>
    );
};

export default ManagerSurveyOther;