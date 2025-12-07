import React, { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Pagination } from './Pagination';


const StudentGrades = ({ data, COLUMN_MAPPING, defaultPageSize = 10, showPagination = true }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

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
        // Cần kiểm tra subject tồn tại trước khi truy cập field
        return subject ? subject[field] : null;
    }
  };

  /**
   * Hàm lấy nội dung cho ô trong HÀNG CHÍNH (client row)
   */
  const getHeaderCellContent = (key, client) => {
    const isExpanded = expandedRows[client.id];

    switch (key) {
      case 'cot1': 
        return (
          <div className="
            w-6 h-6 flex items-center justify-center 
            bg-white 
            rounded-sm 
            border border-gray-400 
            shadow-sm 
            hover:bg-gray-100 
            transition duration-150 ease-in-out
            transform active:scale-95
            cursor-pointer
          ">
            {isExpanded ? (
              <Minus className="w-4 h-4 text-gray-700" />
            ) : (
              <Plus className="w-4 h-4 text-gray-700" />
            )}
          </div>
        );
      case 'cot2': 
        return client.id;
      case 'cot3':
        return <span className="font-medium">{client.name}</span>;
      default: // Các cột khác chỉ để trống
        return '';
    }
  };

  // Lấy key của các cột quan trọng để áp dụng style phù hợp cho Header Row
  const studentIdColKey = COLUMN_MAPPING.find(col => col.key === 'cot1')?.key;
  const studentNameColKey = COLUMN_MAPPING.find(col => col.key === 'cot2')?.key;

  // Tính phân trang
  const totalItems = data ? data.length : 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Phân trang dữ liệu
  const paginatedData = useMemo(() => {
    if (!showPagination || !data) return data;
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize, showPagination]);


  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm">
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
            {paginatedData && paginatedData.map((client) => (
              <React.Fragment key={client.id}>
                {/* Header row for client (Hàng chính) */}
                <tr
                  className="bg-gray-50 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => toggleRow(client.id)}
                >
                  {/* SỬA LỖI: Duyệt qua COLUMN_MAPPING để render các cột của Hàng chính */}
                  {COLUMN_MAPPING.map(col => (
                    <td
                      key={col.key}
                      // Áp dụng style class của cột chi tiết, nhưng đảm bảo màu text cho thông tin chính
                      className={`px-4 py-2 text-sm border 
                             ${col.key === studentIdColKey || col.key === studentNameColKey ? 'text-gray-900' : 'text-gray-600'} 
                             ${col.styleClass || ''}`}
                    >
                      {getHeaderCellContent(col.key, client)}
                    </td>
                  ))}
                </tr>

                {/* Subject rows (Hàng chi tiết) */}
                {expandedRows[client.id] && client.subjects && client.subjects.map((subject, subjectIndex) => (
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

      {/* Pagination Controls */}
      {showPagination && totalItems > pageSize && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalItems={totalItems}
          showPageSizeSelector={true}
        />
      )}
    </div>
  );
};

export default StudentGrades;