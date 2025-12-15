import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
// Icon
import { X, Save, Trash2, Plus, RefreshCw, Gauge, Edit, CheckSquare, Search, ArrowRight, Database } from 'lucide-react'; 

// ----------------------------------------------------
// GIẢ ĐỊNH CÁC COMPONENT UI CƠ BẢN
// ----------------------------------------------------
const Input = ({ value, readOnly = false, className = "", ...props }) => (
    <input
        type="text"
        value={value}
        readOnly={readOnly}
        className={`w-full p-2 border border-gray-300 rounded bg-white text-sm ${readOnly ? 'bg-gray-100' : 'focus:ring-teal-500 focus:border-teal-500'} ${className}`}
        {...props}
    />
);
const Label = ({ children, className = "" }) => (
    <label className={`block text-xs font-medium text-gray-700 mb-1 ${className}`}>
        {children}
    </label>
);
// ----------------------------------------------------


export default function FormEvaluation({ visible, onClose, form }) {
    
    // ---------------------------------------------- 1. STATE MANAGEMENT
    
    // --- STATES MỚI CHO CONTROL BOARD (ĐÃ CHUYỂN THÀNH FORM TIÊU CHÍ) ---
    const [criteriaFormId, setCriteriaFormId] = useState(null); // Tương đương Evaluation ID
    const [criteriaFormCode, setCriteriaFormCode] = useState(''); // Tương đương Template Survey ID
    const [criteriaFormName, setCriteriaFormName] = useState(''); // Tương đương Evaluation Name
    const [statusValue, setStatusValue] = useState(false); // Trạng thái của Tiêu chí
    
    // States cho Bảng Mapping Tiêu chí
    const [availableCriteria, setAvailableCriteria] = useState([]); // Tiêu chí có sẵn (Cột trái)
    const [selectedCriteria, setSelectedCriteria] = useState([]); // Tiêu chí đã chọn (Cột phải)
    const [criteriaQuery, setCriteriaQuery] = useState('');

    // Xác định mode: Edit (có ID) hay Create (ID = null)
    const isEditingCriteria = !!criteriaFormId; 

    // ---------------------------------------------- 2. INITIALIZATION
    
    // Dữ liệu mock (Giả lập tải dữ liệu ban đầu)
    const mockAllCriteria = useMemo(() => ([
        { CriteriaID: 1, Name: "Mức độ hoàn thành công việc", Code: "CR_A1", StatusID: true },
        { CriteriaID: 2, Name: "Chất lượng chuyên môn", Code: "CR_A2", StatusID: true },
        { CriteriaID: 3, Name: "Tinh thần hợp tác", Code: "CR_B1", StatusID: false },
        { CriteriaID: 4, Name: "Tuân thủ quy định", Code: "CR_B2", StatusID: true },
        { CriteriaID: 5, Name: "Khả năng giải quyết vấn đề", Code: "CR_C1", StatusID: false },
    ]), []);

    // Giả lập dữ liệu đã chọn ban đầu (Ví dụ: chọn Tiêu chí 1 và 3)
    const mockInitialSelected = useMemo(() => ([
        mockAllCriteria.find(c => c.CriteriaID === 1),
        mockAllCriteria.find(c => c.CriteriaID === 3),
    ].filter(Boolean)), [mockAllCriteria]);


    // Khởi tạo Dữ liệu Bảng Tiêu chí
    useEffect(() => {
        setAvailableCriteria(mockAllCriteria);
        // Load data đã chọn (Cột bên phải)
        setSelectedCriteria(mockInitialSelected); 
    }, [mockAllCriteria, mockInitialSelected]);


    // ---------------------------------------------- 3. LOGIC XỬ LÝ
    
    // 3.1. Handler cho Status Select
    const handleStatusChange = (e) => {
        setStatusValue(e.target.value === 'true');
    };
    
    // 3.2. Handler NẠP dữ liệu Tiêu chí lên Control Board
    const handleSelectCriteriaForEdit = (criteria) => {
        setCriteriaFormId(criteria.CriteriaID);
        setCriteriaFormCode(criteria.Code);
        setCriteriaFormName(criteria.Name);
        setStatusValue(criteria.StatusID);
        toast.info(`Đã nạp tiêu chí ID ${criteria.CriteriaID} lên Control Board.`);
    };

    // 3.3. Handler cho các nút CRUD Control Board (Tiêu chí)
    const handleControlAction = (actionType) => {
        
        const currentID = criteriaFormId;
        
        if (actionType === 'clear' || actionType === 'reset') {
            // Reset Form
            setCriteriaFormId(null);
            setCriteriaFormCode('');
            setCriteriaFormName('');
            setStatusValue(false);
            toast.info('Form Tiêu chí đã được xóa trắng.');
            return;
        }

        // Logic CRUD Tiêu chí
        if (!criteriaFormName || !criteriaFormCode) {
            toast.warning("Tên và Mã Tiêu chí không được để trống.");
            return;
        }

        const payload = {
            CriteriaID: currentID || Math.floor(Math.random() * 10000),
            Name: criteriaFormName,
            Code: criteriaFormCode,
            StatusID: statusValue
        };
        
        switch (actionType) {
            case 'add_edit':
                if (isEditingCriteria) {
                    // Sửa tiêu chí
                    const updatedCriteria = availableCriteria.map(c => 
                        c.CriteriaID === currentID ? payload : c
                    );
                    setAvailableCriteria(updatedCriteria);
                    // Cập nhật luôn nếu nó nằm trong danh sách đã chọn
                    setSelectedCriteria(prev => prev.map(c => c.CriteriaID === currentID ? payload : c));
                    toast.success(`Đã cập nhật Tiêu chí ID ${currentID}.`);
                } else {
                    // Thêm mới tiêu chí
                    setAvailableCriteria(prev => [...prev, payload]);
                    toast.success(`Đã thêm Tiêu chí mới: ${payload.Name}.`);
                }
                handleControlAction('clear');
                break;
                
            case 'delete':
                if (!currentID) {
                    toast.warning('Không có tiêu chí nào để xóa.');
                    return;
                }
                // Xóa khỏi cả hai danh sách
                setAvailableCriteria(prev => prev.filter(c => c.CriteriaID !== currentID));
                setSelectedCriteria(prev => prev.filter(c => c.CriteriaID !== currentID));
                toast.error(`Đã xóa Tiêu chí ID ${currentID}.`);
                handleControlAction('clear'); 
                break;
            default:
                break;
        }
    };
    
    // 3.4. Logic Filter Tiêu chí Khả dụng (Chỉ lọc theo tên/mã)
    const filteredAvailableCriteria = useMemo(() => {
        const sourceData = availableCriteria || [];

        return sourceData.filter(item => {
            const name = item.Name || "";
            const code = item.Code || "";

            const matchQuery = name.toLowerCase().includes(criteriaQuery.toLowerCase()) ||
                code.toLowerCase().includes(criteriaQuery.toLowerCase());
            
            return matchQuery;
        });
    }, [availableCriteria, criteriaQuery]);

    // 3.5. Handler THÊM Tiêu chí (Mapping: Mũi tên ping qua cột phải)
    const handleAddCriteria = (criteria) => {
        if (selectedCriteria.some(c => c.CriteriaID === criteria.CriteriaID)) {
            toast.warning(`Tiêu chí "${criteria.Name}" đã được chọn.`);
            return;
        }
        
        setSelectedCriteria(prev => [...prev, criteria]);
        toast.success(`Đã thêm tiêu chí: ${criteria.Name}`);
    };

    // 3.6. Handler XÓA Tiêu chí (Mapping: Thùng rác)
    const handleRemoveCriteria = (criteria) => {
        setSelectedCriteria(prev => prev.filter(c => c.CriteriaID !== criteria.CriteriaID));
        toast.info(`Đã xóa tiêu chí: ${criteria.Name}`);
    };
    
    if (!visible) return null;

    // Class CSS cho thanh cuộn
    const scrollbarClass = "overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl flex flex-col h-[85vh]"> 

                {/* HEADER */}
                <div className="flex-none flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <Edit className="w-5 h-5 text-teal-600" />
                        Quản lý Tiêu chí Khảo sát (CRUD Tiêu chí)
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                {/* CONTROL BOARD (ĐÃ CHUYỂN THÀNH FORM CHỈNH SỬA TIÊU CHÍ) */}
                <div className="flex-none p-4 border-b border-blue-200 bg-blue-50">
                    <h4 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Gauge size={18} className="text-blue-500"/> Bảng điều khiển Khảo sát (Chỉnh sửa Tiêu chí)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* MAPPING TRƯỜNG: Evaluation ID -> Criteria ID */}
                        <div className="md:col-span-1"><Label>Criteria ID</Label><Input value={criteriaFormId || 'N/A'} readOnly /></div>
                        {/* MAPPING TRƯỜNG: Template Survey ID -> Criteria Code */}
                        <div className="md:col-span-1"><Label>Criteria Code</Label><Input value={criteriaFormCode} onChange={(e) => setCriteriaFormCode(e.target.value)} /></div>
                        {/* MAPPING TRƯỜNG: Tên Đánh giá -> Tên Tiêu chí */}
                        <div className="md:col-span-1"><Label htmlFor="criteria-name">Tên Tiêu chí</Label><Input id="criteria-name" value={criteriaFormName} onChange={(e) => setCriteriaFormName(e.target.value)} /></div>
                        {/* TRẠNG THÁI */}
                        <div className="md:col-span-1">
                            <Label htmlFor="status-select">Trạng thái (Status ID)</Label>
                            <select id="status-select" value={statusValue} onChange={handleStatusChange} className={`w-full p-2 border border-gray-300 rounded text-sm outline-none ${statusValue ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'} focus:ring-2 focus:ring-teal-500 cursor-pointer`}>
                                <option value={true} className="text-green-800">Đang hoạt động</option>
                                <option value={false} className="text-red-800">Tạm dừng</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* BODY CONTAINER (KHU VỰC 2 LƯỚI CON CHO TIÊU CHÍ) */}
                <div className="flex-1 p-4 bg-gray-100 min-h-0 flex flex-col">
                    <h4 className="flex-none text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <CheckSquare size={18} className="text-green-600"/> Quản lý Mapping Tiêu chí
                    </h4>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                        
                        {/* --- CỘT TRÁI: LIST TIÊU CHÍ KHẢ DỤ (Click để Ping lên Control) --- */}
                        <div className="bg-white rounded border border-gray-200 shadow-lg flex flex-col h-full overflow-hidden">
                            <div className="flex-none p-3 border-b bg-gray-50">
                                <input value={criteriaQuery} onChange={(e) => setCriteriaQuery(e.target.value)} placeholder="Tìm kiếm Tiêu chí..." className="w-full pl-2 pr-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 outline-none"/>
                                <span className='text-xs text-gray-500 block mt-1'>Tất cả Tiêu chí có sẵn: {availableCriteria.length}</span>
                            </div>

                            <div className={`flex-1 ${scrollbarClass} p-2 space-y-1 min-h-0`}>
                                {filteredAvailableCriteria.length === 0 ? (
                                    <div className="text-center text-gray-400 py-5 text-sm">Không tìm thấy tiêu chí phù hợp</div>
                                ) : (
                                    filteredAvailableCriteria.map(item => (
                                        <div 
                                            key={item.CriteriaID} 
                                            className="flex items-center justify-between p-3 rounded hover:bg-teal-50 transition group bg-white border border-transparent hover:border-teal-100"
                                        >
                                            {/* CLICK VÀO HÀNG ĐỂ PING LÊN CONTROL BOARD */}
                                            <div 
                                                className="flex-1 pr-1 min-w-0 cursor-pointer" 
                                                onClick={() => handleSelectCriteriaForEdit(item)} 
                                                title='Click để chỉnh sửa chi tiết tiêu chí này'
                                            >
                                                <div className="text-sm font-medium text-gray-800 truncate">{item.Name}</div>
                                                <div className="text-xs text-gray-500">{item.Code}</div>
                                            </div>
                                            
                                            {/* BẤM MŨI TÊN ĐỂ PING QUA CỘT PHẢI */}
                                            <button
                                                onClick={() => handleAddCriteria(item)}
                                                className="flex-none p-1 bg-white border border-teal-200 text-teal-600 rounded-full hover:bg-teal-500 hover:text-white transition"
                                            >
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>


                        {/* --- CỘT PHẢI: LIST TIÊU CHÍ ĐÃ CHỌN (Mapping) --- */}
                        <div className="bg-white rounded border border-green-300 shadow-lg flex flex-col h-full overflow-hidden">
                            <div className="flex-none p-3 border-b border-green-100 bg-green-50 flex justify-between items-center">
                                <span className="text-sm font-bold text-green-800 flex items-center gap-2">
                                    <Database size={14} /> Tiêu chí Đã chọn
                                </span>
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">
                                    {selectedCriteria.length}
                                </span>
                            </div>
                            
                            <div className={`flex-1 ${scrollbarClass} p-2 space-y-1 min-h-0`}>
                                {selectedCriteria.length === 0 ? (
                                    <div className="text-center text-gray-400 py-5 text-sm">Chưa có tiêu chí nào được chọn</div>
                                ) : (
                                    selectedCriteria.map(item => (
                                        <div key={item.CriteriaID} className="flex items-center justify-between p-3 bg-white border-l-4 border-l-green-500 border border-gray-100 rounded-r shadow-sm">
                                            <div className="flex-1 pr-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-800 truncate">{item.Name}</div>
                                                <div className="text-xs text-gray-500">{item.Code}</div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveCriteria(item)}
                                                className="flex-none p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER: Các nút thao tác CRUD của Control Board (Tiêu chí) */}
                <div className="flex-none p-4 border-t flex justify-between bg-white">
                    {/* Cột trái: Nút Đóng và Xóa trắng */}
                    <div className='flex gap-2'>
                        <button onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium">
                            Đóng cửa sổ
                        </button>
                        <button onClick={() => handleControlAction('clear')} className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 font-medium flex items-center gap-1 transition">
                            <RefreshCw size={16} /> Xóa trắng (Form)
                        </button>
                    </div>
                    
                    {/* Cột phải: Thêm/Sửa và Xóa */}
                    <div className='flex gap-2'>
                        {/* Nút XÓA (Xóa Tiêu chí vĩnh viễn) */}
                        {isEditingCriteria && (
                            <button onClick={() => handleControlAction('delete')} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium flex items-center gap-1 transition">
                                <Trash2 size={16} /> Xóa Tiêu chí
                            </button>
                        )}
                        {/* Nút THÊM/SỬA (Lưu Tiêu chí) */}
                        <button onClick={() => handleControlAction('add_edit')} className="px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-medium flex items-center gap-1 transition">
                            {isEditingCriteria ? (<> <Save size={16} /> Sửa (Cập nhật)</>) : (<> <Plus size={16} /> Thêm Tiêu chí</>)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}