import React, { useState } from 'react';
import QuestionPicker from '../question/QuestionPicker';
import {
    Plus, Edit, Trash2, ChevronRight, ChevronDown,
    FolderOpen, Folder, FileText, Save, X, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FormTemplateSurvey from './FormTemplateSurvey';

// Cấu trúc dữ liệu mẫu
const initialCategories = [
    {
        id: 'cat1',
        name: 'PHIẾU KHẢO SÁT SINH VIÊN VỀ HỌC PHẦN LÝ THUYẾT',
        description: 'Nhằm nâng cao chất lượng dạy và học, Nhà trường rất mong nhận được ý kiến của các bạn sinh viên về học phần lý thuyết. Ý kiến của các bạn sinh viên sẽ giúp Nhà trường đưa ra được các giải pháp nâng cao chất lượng dạy và học. Thông tin trả lời của các bạn sẽ được giữ kín, vì vậy các bạn vui lòng trả lời thẳng thắn và khách quan các câu hỏi. Nếu các bạn có thắc mắc hoặc trao đổi, vui lòng liên hệ theo địa chỉ ở cuối bảng hỏi này.',
        groups: [
            {
                id: 'grp1',
                name: 'I. Thông tin về học phần',
                description: 'Đánh giá giảng viên giảng dạy phần lý thuyết',
                questions: [
                    { id: 'q1', text: 'Giảng viên cung cấp đầy đủ và giải thích rõ ràng về: Chuẩn đầu ra học phần', type: 1 },
                    { id: 'q2', text: 'Giảng viên nhiệt tình, tận tâm trong giảng dạy', type: 1 },
                    { id: 'q3', text: 'Giảng viên sử dụng phương pháp giảng dạy phù hợp', type: 1 }
                ]
            },
            {
                id: 'grp2',
                name: 'Giảng viên Thực hành',
                description: 'Đánh giá giảng viên hướng dẫn thực hành',
                questions: [
                    { id: 'q4', text: 'Giảng viên hướng dẫn thực hành chi tiết', type: 1 },
                    { id: 'q5', text: 'Giảng viên giải đáp thắc mắc kịp thời', type: 1 }
                ]
            }
        ]
    }
];

const QuestionTypeLabels = {
    1: 'Câu hỏi khảo sát',
    2: 'câu hỏi tự luận',
};

const QuestionManager = () => {
    const navigate = useNavigate();
    const [showQuestionPicker, setShowQuestionPicker] = useState(false);
    const [pickerTarget, setPickerTarget] = useState(null); // { catId, grpId }
    const [categories, setCategories] = useState(initialCategories);
    const [expandedCategories, setExpandedCategories] = useState(new Set(['cat1']));
    const [expandedGroups, setExpandedGroups] = useState(new Set(['']));
    const [editMode, setEditMode] = useState(null);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [templateForm, setTemplateForm] = useState({ TemplateSurveyID: '', TypeTemplate: 1, Title: '', ShorDescription: '', Requiments: '', StatusID: true, ImagePath: '', Permission: 0 });
    const [templateEditingId, setTemplateEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(category => {
        if (!searchTerm) return true;

        const lowerCaseSearch = searchTerm.toLowerCase();

        // 1. Tìm kiếm cấp Danh mục
        if (category.name.toLowerCase().includes(lowerCaseSearch) || category.description.toLowerCase().includes(lowerCaseSearch)) {
            return true;
        }

        // 2. Tìm kiếm cấp Nhóm và Câu hỏi bên trong
        const filteredGroups = category.groups.filter(group => {
            if (group.name.toLowerCase().includes(lowerCaseSearch) || group.description.toLowerCase().includes(lowerCaseSearch)) {
                return true;
            }

            const foundQuestion = group.questions.some(question =>
                question.text.toLowerCase().includes(lowerCaseSearch)
            );
            return foundQuestion;
        });

        // Nếu tìm thấy nhóm nào hợp lệ thì hiển thị danh mục này
        return filteredGroups.length > 0;
    });

    // Toggle expand/collapse
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

    // CRUD Operations
    const addCategory = () => {
        const newCat = {
            id: `cat${Date.now()}`,
            name: 'Danh mục mới',
            description: '',
            groups: []
        };
        setCategories([...categories, newCat]);
        setEditMode({ type: 'category', id: newCat.id });
    };

    const openTemplateModal = (category = null) => {
        if (category) {
            setTemplateForm({
                TemplateSurveyID: category.templateMeta?.TemplateSurveyID ?? '',
                TypeTemplate: category.templateMeta?.TypeTemplate ?? 1,
                Title: category.templateMeta?.Title ?? category.name ?? '',
                ShorDescription: category.templateMeta?.ShorDescription ?? category.description ?? '',
                Requiments: category.templateMeta?.Requiments ?? '',
                StatusID: category.templateMeta?.StatusID ?? true,
                ImagePath: category.templateMeta?.ImagePath ?? '',
                Permission: category.templateMeta?.Permission ?? 0
            });
            setTemplateEditingId(category.id);
        } else {
            setTemplateForm({ TemplateSurveyID: '', TypeTemplate: 1, Title: '', ShorDescription: '', Requiments: '', StatusID: true, ImagePath: '', Permission: 0 });
            setTemplateEditingId(null);
        }
        setShowTemplateModal(true);
    };

    const handleSaveTemplate = () => {
        if (templateEditingId) {
            // Update existing category
            setCategories(categories.map(cat => {
                if (cat.id === templateEditingId) {
                    return {
                        ...cat,
                        name: templateForm.Title || cat.name,
                        description: templateForm.ShorDescription || cat.description,
                        templateMeta: { ...templateForm }
                    };
                }
                return cat;
            }));
            setShowTemplateModal(false);
            setTemplateEditingId(null);
        } else {
            const newCat = {
                id: `cat${Date.now()}`,
                name: templateForm.Title || 'Danh mục mới',
                description: templateForm.ShorDescription || '',
                groups: []
            };
            // Optionally store template meta on the category for later use
            newCat.templateMeta = { ...templateForm };
            setCategories([...categories, newCat]);
            setExpandedCategories(new Set([...expandedCategories, newCat.id]));
            setEditMode({ type: 'category', id: newCat.id });
            setShowTemplateModal(false);
        }
    };

    const addGroup = (catId) => {
        const newGroup = {
            id: `grp${Date.now()}`,
            name: 'Nhóm câu hỏi mới',
            description: '',
            questions: []
        };
        setCategories(categories.map(cat =>
            cat.id === catId
                ? { ...cat, groups: [...cat.groups, newGroup] }
                : cat
        ));
        setExpandedCategories(new Set([...expandedCategories, catId]));
        setEditMode({ type: 'group', id: newGroup.id, catId });
    };

    const addQuestion = (catId, grpId) => {
        setPickerTarget({ catId, grpId });
        setShowQuestionPicker(true);
    };

    const handlePickQuestion = (question) => {
        if (!pickerTarget) return;
        const { catId, grpId } = pickerTarget;
        const newQuestion = {
            id: `q${Date.now()}`,
            text: question.TitleCriteriaEvaluation,
            type: question.TypeCriteria
        };

        setCategories(categories.map(cat =>
            cat.id === catId
                ? {
                    ...cat,
                    groups: cat.groups.map(grp =>
                        grp.id === grpId
                            ? { ...grp, questions: [...grp.questions, newQuestion] }
                            : grp
                    )
                }
                : cat
        ));
        setExpandedGroups(new Set([...expandedGroups, grpId]));
        setEditMode({ type: 'question', id: newQuestion.id, catId, grpId });
        setShowQuestionPicker(false);
        setPickerTarget(null);
    };

    const deleteItem = (type, id, parentIds = {}) => {
        if (!window.confirm(`Bạn có chắc muốn xóa ${type === 'category' ? 'danh mục' : type === 'group' ? 'nhóm' : 'câu hỏi'} này?`)) {
            return;
        }

        if (type === 'category') {
            setCategories(categories.filter(cat => cat.id !== id));
        } else if (type === 'group') {
            setCategories(categories.map(cat =>
                cat.id === parentIds.catId
                    ? { ...cat, groups: cat.groups.filter(grp => grp.id !== id) }
                    : cat
            ));
        } else if (type === 'question') {
            setCategories(categories.map(cat =>
                cat.id === parentIds.catId
                    ? {
                        ...cat,
                        groups: cat.groups.map(grp =>
                            grp.id === parentIds.grpId
                                ? { ...grp, questions: grp.questions.filter(q => q.id !== id) }
                                : grp
                        )
                    }
                    : cat
            ));
        }
    };

    // Render tree structure
    const renderQuestion = (question, catId, grpId, index) => {
        const isEditing = editMode?.type === 'question' && editMode?.id === question.id;

        return (
            <div key={question.id} className="ml-12 mb-2">

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition group">
                    {/* Icon Câu hỏi */}
                    <FileText className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => {
                                        setCategories(categories.map(cat =>
                                            cat.id === catId
                                                ? {
                                                    ...cat,
                                                    groups: cat.groups.map(grp =>
                                                        grp.id === grpId
                                                            ? {
                                                                ...grp,
                                                                questions: grp.questions.map(q =>
                                                                    q.id === question.id ? { ...q, text: e.target.value } : q
                                                                )
                                                            }
                                                            : grp
                                                    )
                                                }
                                                : cat
                                        ));
                                    }}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nội dung câu hỏi..."
                                />
                                <select
                                    value={question.type}
                                    onChange={(e) => {
                                        const newType = parseInt(e.target.value);
                                        setCategories(categories.map(cat =>
                                            cat.id === catId
                                                ? {
                                                    ...cat,
                                                    groups: cat.groups.map(grp =>
                                                        grp.id === grpId
                                                            ? {
                                                                ...grp,
                                                                questions: grp.questions.map(q =>
                                                                    q.id === question.id ? { ...q, type: newType } : q
                                                                )
                                                            }
                                                            : grp
                                                    )
                                                }
                                                : cat
                                        ));
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(QuestionTypeLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-800 font-medium">
                                    {/* Tiêu đề câu hỏi - Màu xanh */}
                                    <span className="text-blue-600 font-semibold">Q{index + 1}.</span> {question.text}
                                </p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
                                    {QuestionTypeLabels[question.type]}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {isEditing ? (
                            <>
                                {/* Nút Lưu/Hủy */}
                                <button
                                    onClick={() => setEditMode(null)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Lưu"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setEditMode(null)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Hủy"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Nút Sửa - Màu xanh */}
                                <button
                                    onClick={() => setEditMode({ type: 'question', id: question.id, catId, grpId })}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {/* Nút Xóa */}
                                <button
                                    onClick={() => deleteItem('question', question.id, { catId, grpId })}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderGroup = (group, catId) => {
        const isExpanded = expandedGroups.has(group.id);
        const isEditing = editMode?.type === 'group' && editMode?.id === group.id;

        return (
            <div key={group.id} className="ml-6 mb-3">

                {/* Nền Nhóm - Màu Sky nhạt */}
                <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg border border-sky-200 hover:border-sky-400 transition group">
                    <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex-shrink-0 p-1 hover:bg-sky-100 rounded transition"
                    >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {/* Icon Nhóm - Màu xanh */}
                    {isExpanded ? <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" /> : <Folder className="w-5 h-5 text-blue-600 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={group.name}
                                    onChange={(e) => {
                                        setCategories(categories.map(cat =>
                                            cat.id === catId
                                                ? {
                                                    ...cat,
                                                    groups: cat.groups.map(grp =>
                                                        grp.id === group.id ? { ...grp, name: e.target.value } : grp
                                                    )
                                                }
                                                : cat
                                        ));
                                    }}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                                    placeholder="Tên nhóm câu hỏi..."
                                />
                                <textarea
                                    value={group.description}
                                    onChange={(e) => {
                                        setCategories(categories.map(cat =>
                                            cat.id === catId
                                                ? {
                                                    ...cat,
                                                    groups: cat.groups.map(grp =>
                                                        grp.id === group.id ? { ...grp, description: e.target.value } : grp
                                                    )
                                                }
                                                : cat
                                        ));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Mô tả nhóm..."
                                    rows="2"
                                />
                            </div>
                        ) : (
                            <>
                                <h4 className="font-semibold text-gray-800">{group.name}</h4>
                                {group.description && (
                                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                                )}
                                <span className="text-xs text-gray-500 mt-1 inline-block">
                                    {group.questions.length} câu hỏi
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {isEditing ? (
                            <>
                                {/* Nút Lưu/Hủy */}
                                <button
                                    onClick={() => setEditMode(null)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Lưu"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setEditMode(null)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Hủy"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Nút Thêm/Sửa - Màu xanh */}
                                <button
                                    onClick={() => addQuestion(catId, group.id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Thêm câu hỏi"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setEditMode({ type: 'group', id: group.id, catId })}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {/* Nút Xóa */}
                                <button
                                    onClick={() => deleteItem('group', group.id, { catId })}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
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
        const isEditing = editMode?.type === 'category' && editMode?.id === category.id;

        return (
            <div key={category.id} className="mb-4">

                {/* Nền Danh mục - Gradient Xanh */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition group">
                    <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition"
                    >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    {/* Icon Danh mục - Màu xanh đậm */}
                    {isExpanded ? <FolderOpen className="w-6 h-6 text-blue-700 flex-shrink-0" /> : <Folder className="w-6 h-6 text-blue-700 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={category.name}
                                    onChange={(e) => {
                                        setCategories(categories.map(cat =>
                                            cat.id === category.id ? { ...cat, name: e.target.value } : cat
                                        ));
                                    }}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                    placeholder="Tên danh mục..."
                                />
                                <textarea
                                    value={category.description}
                                    onChange={(e) => {
                                        setCategories(categories.map(cat =>
                                            cat.id === category.id ? { ...cat, description: e.target.value } : cat
                                        ));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Mô tả danh mục..."
                                    rows="2"
                                />
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                                {category.description && (
                                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                )}
                                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                    <span>{category.groups.length} nhóm</span>
                                    <span>•</span>
                                    <span>{category.groups.reduce((sum, grp) => sum + grp.questions.length, 0)} câu hỏi</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {isEditing ? (
                            <>
                                {/* Nút Lưu/Hủy */}
                                <button
                                    onClick={() => setEditMode(null)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Lưu"
                                >
                                    <Save className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setEditMode(null)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                    title="Hủy"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Nút Thêm/Sửa - Màu xanh */}
                                <button
                                    onClick={() => addGroup(category.id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Thêm nhóm"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => openTemplateModal(category)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Sửa"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                {/* Nút Xóa */}
                                <button
                                    onClick={() => deleteItem('category', category.id)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    title="Xóa"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
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

    return (
        // Nền chung của trang - Gradient Xanh Nhạt
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">


            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-xl text-gray-700">Quản lý Mẫu khảo sát</h1>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục, nhóm, câu hỏi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>

                    {/* Nút Thêm Danh mục - Màu xanh đậm */}
                    <button
                        onClick={openTemplateModal}
                        className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm chủ đề
                    </button>
                    <button
                        onClick={() => navigate('/manager-question')}
                        className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm câu hỏi
                    </button>
                </div>

                {/* Question Tree */}
                <div className="bg-white rounded-xl shadow-xl p-6">
                    <div className="space-y-4">
                        {filteredCategories.map(category => renderCategory(category))}

                        {/* Thông báo khi không có kết quả */}
                        {filteredCategories.length === 0 && searchTerm !== '' && (
                            <div className="text-center py-12 text-gray-400">
                                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Không tìm thấy kết quả nào cho: "{searchTerm}"</p>
                            </div>
                        )}

                        {/* Thông báo khi không có danh mục */}
                        {categories.length === 0 && searchTerm === '' && (
                            <div className="text-center py-12 text-gray-400">
                                <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Chưa có danh mục nào</p>
                                <p className="text-sm mt-2">Nhấn nút "Thêm Danh mục" để bắt đầu</p>
                            </div>
                        )}
                    </div>
                </div>


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
        </div>
    );
};

export default QuestionManager;