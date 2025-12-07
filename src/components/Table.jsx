import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';


const StudentGrades = ({ data, COLUMN_MAPPING }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /**
   * Hàm lấy giá trị data dựa trên dataField (cot1, cot2,...)
   * @param {Object} subject - Đối tượng môn học hiện tại
   * @param {string} field - Tên trường dữ liệu (ví dụ: 'code', 'score1', 'studentName')
   * @param {Object} client - Đối tượng học viên (chứa id và name)
   * @param {number} index - Index của môn học (dùng cho cột STT)
   * @returns {string | number} Giá trị hiển thị trong ô
   */
  const getCellValue = (subject, field, client, index) => {
    switch (field) {
      case 'subjectIndex':
        return index + 1;
      case 'studentId':
        return client.id;
      case 'studentName':
        return client.name;
      default:
        return subject[field];
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            {/* Dùng ánh xạ để tạo tiêu đề bảng */}
            {COLUMN_MAPPING.map(col => (
              <th key={col.key} className={`px-4 py-2 text-left text-sm font-medium text-gray-700 border ${col.key === 'cot1' ? 'w-10' : ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((client, studentIndex) => (
            <React.Fragment key={client.id}>
              {/* Header row for client (Hàng chính) */}
              <tr
                className="bg-gray-50 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => toggleRow(client.id)}
              >
                {/* Cột icon (Cột 1) */}
                <td className="px-4 py-2 border">
                  <div className="w-4 h-4 flex items-center justify-center bg-white rounded-sm border border-gray-400 shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out transform active:scale-95 cursor-pointer">
                    {expandedRows[client.id] ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border">{client.id}</td>
                <td className="px-4 py-2 text-sm text-gray-900 border font-medium">{client.name}</td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border"></td>
              </tr>

              {/* Subject rows (Hàng chi tiết) */}
              {expandedRows[client.id] && client.subjects.map((subject, subjectIndex) => (
                <tr key={`${client.id}-${subjectIndex}`} className="hover:bg-gray-50 border-b">
                  {COLUMN_MAPPING.map(col => (
                    <td key={col.key} className={col.styleClass}>
                      {getCellValue(subject, col.dataField, client, subjectIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrades;