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

const Table = ({
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
              w-7 h-7 flex items-center justify-center 
              bg-gradient-to-br from-gray-300 to-gray-400
              rounded-md 
              shadow-md 
              hover:shadow-lg hover:from-gray-400 hover:to-gray-500
              transition-all duration-200 ease-in-out
              transform hover:scale-105 active:scale-95
              cursor-pointer
            ">
          {isExpanded ? (
            <Minus className="w-4 h-4 text-white" strokeWidth={2.5} />
          ) : (
            <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
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
      <div className="w-full overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
              {COLUMN_MAPPING.map(col => (
                <th
                  key={col.key}
                  className={`
                    px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider
                    ${col.dataField === 'collapseControl' ? 'w-12' : ''}
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
                  className="bg-white border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                  onClick={() => toggleRow(client.id)}
                >
                  {COLUMN_MAPPING.map(col => (
                    <td
                      key={col.key}
                      className={`
                        px-6 py-4 text-sm border-r border-gray-200 last:border-r-0
                        ${col.dataField === 'studentName' ? 'text-gray-900 font-semibold' : 'text-gray-700 text-center'}
                        ${col.dataField === 'collapseControl' ? 'text-center' : ''}
                      `}
                    >
                      {getHeaderCellContent(col.key, col.dataField, client)}
                    </td>
                  ))}
                </tr>

                {/* Subject rows */}
                {expandedRows[client.id] && client.subjects && client.subjects.map((subject, subjectIndex) => (
                  <tr key={`${client.id}-${subjectIndex}`} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100">
                    {COLUMN_MAPPING.map(col => (
                      <td key={col.key} className="px-6 py-3 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0">
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

export default Table;