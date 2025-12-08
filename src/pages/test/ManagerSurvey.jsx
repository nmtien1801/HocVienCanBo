import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, ArrowLeft, ChevronRight, ChevronDown, 
  FolderOpen, Folder, FileText, Save, X, Search, Move
} from 'lucide-react';

// Cấu trúc dữ liệu mẫu
const initialCategories = [
  {
    id: 'cat1',
    name: 'Hoạt động Giảng dạy',
    description: 'Đánh giá về giảng viên và phương pháp giảng dạy',
    groups: [
      {
        id: 'grp1',
        name: 'Giảng viên Lý thuyết',
        description: 'Đánh giá giảng viên giảng dạy phần lý thuyết',
        questions: [
          { id: 'q1', text: 'Giảng viên truyền đạt kiến thức rõ ràng, dễ hiểu', type: 'likert6' },
          { id: 'q2', text: 'Giảng viên nhiệt tình, tận tâm trong giảng dạy', type: 'likert6' },
          { id: 'q3', text: 'Giảng viên sử dụng phương pháp giảng dạy phù hợp', type: 'likert6' }
        ]
      },
      {
        id: 'grp2',
        name: 'Giảng viên Thực hành',
        description: 'Đánh giá giảng viên hướng dẫn thực hành',
        questions: [
          { id: 'q4', text: 'Giảng viên hướng dẫn thực hành chi tiết', type: 'likert6' },
          { id: 'q5', text: 'Giảng viên giải đáp thắc mắc kịp thời', type: 'likert6' }
        ]
      }
    ]
  },
  {
    id: 'cat2',
    name: 'Cơ sở Vật chất',
    description: 'Đánh giá về phòng học, trang thiết bị',
    groups: [
      {
        id: 'grp3',
        name: 'Phòng học',
        description: 'Đánh giá điều kiện phòng học',
        questions: [
          { id: 'q6', text: 'Phòng học sạch sẽ, thoáng mát', type: 'likert6' },
          { id: 'q7', text: 'Trang thiết bị phòng học đầy đủ', type: 'likert6' }
        ]
      }
    ]
  },
  {
    id: 'cat3',
    name: 'Ý kiến Khác',
    description: 'Góp ý và đề xuất',
    groups: [
      {
        id: 'grp4',
        name: 'Ý kiến mở',
        description: 'Câu hỏi mở cho sinh viên góp ý',
        questions: [
          { id: 'q8', text: 'Ý kiến đóng góp khác của bạn', type: 'textarea' }
        ]
      }
    ]
  }
];

const QuestionTypeLabels = {
  likert6: 'Thang đo 6 mức (A-F)',
  textarea: 'Ý kiến mở',
  matrix: 'Nhóm phát biểu'
};

const QuestionManager = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [expandedCategories, setExpandedCategories] = useState(new Set(['cat1']));
  const [expandedGroups, setExpandedGroups] = useState(new Set(['grp1']));
  const [editMode, setEditMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    const newQuestion = {
      id: `q${Date.now()}`,
      text: 'Câu hỏi mới',
      type: 'likert6'
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
        
        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition group">
          <Move className="w-4 h-4 text-gray-400 mt-1 cursor-move opacity-0 group-hover:opacity-100" />
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
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nội dung câu hỏi..."
                />
                <select
                  value={question.type}
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
                                      q.id === question.id ? { ...q, type: e.target.value } : q
                                    )
                                  }
                                : grp
                            )
                          }
                        : cat
                    ));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(QuestionTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-800 font-medium">
                  <span className="text-indigo-600 font-semibold">Q{index + 1}.</span> {question.text}
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
                <button
                  onClick={() => setEditMode({ type: 'question', id: question.id, catId, grpId })}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                  title="Sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
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
        
        <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-400 transition group">
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex-shrink-0 p-1 hover:bg-indigo-100 rounded transition"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {isExpanded ? <FolderOpen className="w-5 h-5 text-indigo-600 flex-shrink-0" /> : <Folder className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
          
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
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-semibold"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
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
                <button
                  onClick={() => addQuestion(catId, group.id)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Thêm câu hỏi"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditMode({ type: 'group', id: group.id, catId })}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                  title="Sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
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
        
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 transition group">
          <button
            onClick={() => toggleCategory(category.id)}
            className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          
          {isExpanded ? <FolderOpen className="w-6 h-6 text-indigo-700 flex-shrink-0" /> : <Folder className="w-6 h-6 text-indigo-700 flex-shrink-0" />}
          
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
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                  placeholder="Tên danh mục..."
                />
                <textarea
                  value={category.description}
                  onChange={(e) => {
                    setCategories(categories.map(cat =>
                      cat.id === category.id ? { ...cat, description: e.target.value } : cat
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                <button
                  onClick={() => addGroup(category.id)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Thêm nhóm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditMode({ type: 'category', id: category.id })}
                  className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                  title="Sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
        

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý Ngân hàng Câu hỏi</h1>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={addCategory}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Thêm Danh mục
          </button>
        </div>

        {/* Question Tree */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="space-y-4">
            {categories.map(category => renderCategory(category))}
            
            {categories.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Chưa có danh mục nào</p>
                <p className="text-sm mt-2">Nhấn nút "Thêm Danh mục" để bắt đầu</p>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default QuestionManager;