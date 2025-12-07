// Ví dụ: file MyPage.jsx
import React from 'react';
import StudentGroupedTable from '../components/Table'; // ⬅️ Dùng tên file là 'Table'

function MyPage() {

    // --- 1. ĐỊNH NGHĨA LỚP CSS TÁI SỬ DỤNG ---
    // Định nghĩa lớp CSS cho các cột (giữ nguyên từ yêu cầu trước)
    const STYLE_CLASSES = {
        STT: "px-4 py-2 text-sm text-gray-600 border text-center", // Cột 1: STT
        DATA_SECONDARY: "px-4 py-2 text-sm text-gray-600 border", // Cột 2, 3: Mã HV, Tên HV
        DATA_PRIMARY_CENTERED: "px-4 py-2 text-sm text-gray-900 border text-center", // Cột 4, 6, 7, 8: Mã môn, Điểm 1, 2, Ngày vắng
        DATA_PRIMARY: "px-4 py-2 text-sm text-gray-900 border", // Cột 5, 9: Tên môn, Ghi chú
    };

    // --- 2. ĐỊNH NGHĨA ÁNH XẠ CỘT (COLUMN MAPPING) ---
    // Ánh xạ giữa tên biến ngắn (cot1, cot2,...) và thuộc tính dữ liệu (subject property) và lớp CSS tương ứng.
    const COLUMN_MAPPING = [
        { key: 'cot1', header: 'STT', dataField: 'subjectIndex', styleClass: STYLE_CLASSES.STT },
        { key: 'cot2', header: 'Mã HV', dataField: 'studentId', styleClass: STYLE_CLASSES.DATA_SECONDARY },
        { key: 'cot3', header: 'Tên HV', dataField: 'studentName', styleClass: STYLE_CLASSES.DATA_SECONDARY },
        { key: 'cot4', header: 'Mã môn', dataField: 'code', styleClass: STYLE_CLASSES.DATA_PRIMARY_CENTERED },
        { key: 'cot5', header: 'Tên môn', dataField: 'name', styleClass: STYLE_CLASSES.DATA_PRIMARY },
        { key: 'cot6', header: 'Điểm lần 1', dataField: 'score1', styleClass: STYLE_CLASSES.DATA_PRIMARY_CENTERED },
        { key: 'cot7', header: 'Điểm lần 2', dataField: 'score2', styleClass: STYLE_CLASSES.DATA_PRIMARY_CENTERED },
        { key: 'cot8', header: 'Ngày vắng', dataField: 'date', styleClass: STYLE_CLASSES.DATA_PRIMARY_CENTERED },
        { key: 'cot9', header: 'Ghi chú', dataField: 'note', styleClass: STYLE_CLASSES.DATA_PRIMARY },
    ];

    const data = [
        {
            id: '2321233001',
            name: 'Mai Thị Ngọc An',
            subjects: [
                { code: '239', name: 'Lịch sử Đảng Cộng sản Việt Nam', score1: '6.00', score2: '', date: '', note: '' },
                { code: '245', name: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HPTriết học)', score1: '7.00', score2: '', date: '', note: '' },
                { code: '246', name: 'Nội dung cơ bản của Chủ nghĩa Mác-Lênin (HP KTCT)', score1: '6.00', score2: '', date: '', note: '' },
            ]
        },
        // ... dữ liệu còn lại
        {
            id: '2321233005',
            name: 'Phạm Thị Hương',
            subjects: [
                { code: '240', name: 'Đường lối, chính sách của Đảng, Nhà nước Việt Nam', score1: '8.00', score2: '', date: '', note: '' },
                { code: '242', name: 'Mặt trận Tổ quốc Việt Nam và các tổ chức chính trị - xã hội', score1: '7.50', score2: '', date: '', note: '' },
            ]
        }
    ];

    return (
        <div className="p-8">
            <StudentGroupedTable data={data} COLUMN_MAPPING={COLUMN_MAPPING}/>
        </div>
    );
}
export default MyPage; // ⬅️ Phải export để Router sử dụng được