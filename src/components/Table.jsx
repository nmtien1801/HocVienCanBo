/**
 * @param {Object} subject - Đối tượng môn học hiện tại
 * @param {string} field - Tên trường dữ liệu (ví dụ: 'code', 'score1', 'studentName')
 * @param {Object} client - Đối tượng học viên/lớp (chứa id và name)
 * @param {number} index - Index của môn học (dùng cho cột STT)
 * @returns {string | number} Giá trị hiển thị trong ô
 * @param {string} key - key của cột (cot1, cot2,...)
 * @param {string} dataField - dataField của cột ('collapseControl', 'studentId', 'studentName',...)
 */
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Pagination } from './Pagination';

const StudentGrades = ({
  data,
  COLUMN_MAPPING,
  defaultPageSize = 10,
  showPagination = true,
  // Thêm props cho external pagination
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
  externalPagination = false // Flag để biết có dùng phân trang từ bên ngoài không
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  // Internal pagination state (chỉ dùng khi không có externalPagination)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCellValue = (subject, field, client, index) => {
    switch (field) {
      case 'subjectIndex':
        return index + 1;
      default:
        return subject ? subject[field] : null;
    }
  };

  const getHeaderCellContent = (key, dataField, client) => {
    const isExpanded = expandedRows[client.id];

    if (dataField === 'collapseControl') {
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
    } else if (key === 'cot2') {
      return client.id;
    } else if (key === 'cot3') {
      return <span className="font-medium">{client.name}</span>;
    } else {
      return '';
    }
  };

  // Xác định state và handlers dựa trên externalPagination
  const actualCurrentPage = externalPagination ? currentPage : internalCurrentPage;
  const actualSetCurrentPage = externalPagination ? setCurrentPage : setInternalCurrentPage;
  const actualPageSize = externalPagination ? pageSize : internalPageSize;
  const actualSetPageSize = externalPagination ? setPageSize : setInternalPageSize;
  const actualTotalItems = externalPagination ? totalItems : (data ? data.length : 0);

  // Chỉ phân trang nội bộ khi KHÔNG dùng externalPagination
  const displayData = externalPagination ? data : (() => {
    if (!showPagination || !data) return data;
    const startIndex = (actualCurrentPage - 1) * actualPageSize;
    return data.slice(startIndex, startIndex + actualPageSize);
  })();

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              {COLUMN_MAPPING.map(col => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-2 text-left text-sm font-medium text-gray-700 border
                    ${col.dataField === 'collapseControl' ? 'w-10' : ''}
                  `}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData && displayData.map((client) => (
              <React.Fragment key={client.id}>
                {/* Header row for client */}
                <tr
                  className="bg-gray-50 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => toggleRow(client.id)}
                >
                  {COLUMN_MAPPING.map(col => (
                    <td
                      key={col.key}
                      className={`
                        ${col.styleClass || ''} 
                        ${col.dataField === 'studentName' ? 'text-gray-900 font-medium' : 'text-gray-700'}
                        ${col.dataField === 'collapseControl' ? 'text-center' : ''}
                      `}
                    >
                      {getHeaderCellContent(col.key, col.dataField, client)}
                    </td>
                  ))}
                </tr>

                {/* Subject rows */}
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
      {showPagination && actualTotalItems > actualPageSize && (
        <Pagination
          currentPage={actualCurrentPage}
          setCurrentPage={actualSetCurrentPage}
          pageSize={actualPageSize}
          setPageSize={actualSetPageSize}
          totalItems={actualTotalItems}
          showPageSizeSelector={true}
        />
      )}
    </div>
  );
};

export default StudentGrades;