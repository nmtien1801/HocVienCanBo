import React, { useState, useEffect } from 'react';
import { Search, FileDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertCircle } from 'lucide-react';
import { printPointSum } from '../../redux/scheduleSlice.js';
import { getClassLearnByUserID } from '../../redux/learningClassSlice.js';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import ApiStudent from '../../apis/ApiStudent.js';
import { TypeUserIDCons } from "../../utils/constants";
import DropdownSearch from '../../components/FormFields/DropdownSearch.jsx';

export default function TimetableClass() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const IS_STUDENT = userInfo?.TypeUserID === TypeUserIDCons.Student;
  const { pointSum, totalPointSum } = useSelector((state) => state.schedule);
  const { ClassLearn } = useSelector((state) => state.learningClass);
  const [studentOfClass, setStudentOfClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClassLearn, setIsLoadingClassLearn] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [error, setError] = useState(null);

  // tải danh sách Lớp học
  useEffect(() => {
    const fetchClassLearn = async () => {
      setIsLoadingClassLearn(true);
      try {
        let res = await dispatch(getClassLearnByUserID());

        if (!res.payload || !res.payload.data) {
          toast.error(res.payload?.message);
        }

        // Tự động chọn lớp nếu là Học viên và chỉ có 1 lớp
        if (IS_STUDENT && Array.isArray(res.payload.data) && res.payload.data.length === 1) {
          const singleClass = res.payload.data[0];
          const classID = Number(singleClass.ClassID);

          setSelectedClass(classID);

        } else if (!IS_STUDENT) {
          setSelectedClass(0);
        }

      } catch (err) {
        toast.error('Đã có lỗi xảy ra khi tải danh sách lớp học');
      } finally {
        setIsLoadingClassLearn(false);
      }
    };

    if (ClassLearn.length === 0) {
      fetchClassLearn();
    }
  }, [dispatch]);

  // tải danh sách Học viên khi Lớp thay đổi
  useEffect(() => {
    const fetchStudentsOfClass = async () => {
      // Dừng nếu không có lớp hoặc lớp = 0
      if (!selectedClass || selectedClass === 0) {
        setStudentOfClass([]);
        setSelectedStudent(0);
        return;
      }

      setIsLoadingStudents(true);
      try {
        let res = await ApiStudent.getStudentByClassApi(selectedClass);

        if (res && res.data) {
          setStudentOfClass(res.data);
          setSelectedStudent(0); // Reset học viên về "Tất cả" khi lớp thay đổi
        } else {
          setStudentOfClass([]);
        }
      } catch (err) {
        const errorMsg = 'Đã có lỗi xảy ra khi tải danh sách học viên: ' + err.message;
        toast.error(errorMsg);
        setStudentOfClass([]);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (IS_STUDENT) {
      setStudentOfClass([userInfo]);
      // 3. Tự động chọn học viên đó
      setSelectedStudent(Number(userInfo.StudentID));
    } else if (!IS_STUDENT) {
      fetchStudentsOfClass();

    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass !== 0) {
      fetchPointSum();
    }
  }, [currentPage, pageSize]);


  const fetchPointSum = async () => {
    if (!selectedClass || selectedClass === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let res = await dispatch(printPointSum({ classID: selectedClass, studentID: selectedStudent, page: currentPage, limit: pageSize }));

      if (!res.payload || !res.payload.data) {
        const errorMsg = res.payload?.message || 'Không thể tải dữ liệu';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Đã có lỗi xảy ra khi tải dữ liệu';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // HÀM NÀY CHỊU TRÁCH NHIỆM TẢI DỮ LIỆU KHI NGƯỜI DÙNG NHẤN NÚT
  const handleSearch = async () => {
    if (!selectedClass || selectedClass === 0) {
      toast.warning('Vui lòng chọn lớp học');
      return;
    }
    setCurrentPage(1);
    fetchPointSum();
  };

  const handleExportExcel = () => {
    toast.info('Chức năng xuất Excel đang được phát triển');
  };

  const totalPages = Math.ceil(totalPointSum / pageSize);

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

  const renderTableBody = () => {
    const totalColumns = 9;

    if (isLoading) {
      return (
        <tr>
          <td colSpan={totalColumns} className="px-4 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-teal-500" />
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          </td>
        </tr>
      );
    }

    if (!isLoading && error) {
      return (
        <tr>
          <td colSpan={totalColumns} className="px-4 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <AlertCircle size={32} className="text-red-500" />
              <p className="text-gray-500 text-sm">{error}</p>
              <button
                onClick={fetchPointSum}
                className="mt-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm"
              >
                Thử lại
              </button>
            </div>
          </td>
        </tr>
      );
    }

    if (!selectedClass || selectedClass === 0) {
      return (
        <tr>
          <td colSpan={totalColumns} className="px-4 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">Vui lòng chọn lớp học</p>
              <p className="text-gray-500 text-sm">Chọn lớp học và nhấn **"Tìm kiếm"** để xem Bảng điểm</p>
            </div>
          </td>
        </tr>
      );
    }

    if (!pointSum || pointSum.length === 0) {
      return (
        <tr>
          <td colSpan={totalColumns} className="px-4 py-12 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">Không tìm thấy dữ liệu</p>
              <p className="text-gray-500 text-sm">Không có điểm/lịch học nào cho lựa chọn đã chọn</p>
            </div>
          </td>
        </tr>
      );
    }

    // Data Rows
    return pointSum.filter(row => row && row.StudentID).map((row, index) => (
      <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.STT}</td>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.StudentID}</td>
        <td className="px-4 py-3 border-r border-gray-200">{row.StudentName}</td>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.SubjectCode}</td>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.SubjectName}</td>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.Score11}</td>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.Score22}</td>
        <td className="px-4 py-3 border-r border-gray-200 text-center">{row.DateOff}</td>
        <td className="px-4 py-3 text-center">{row.Description}</td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <h1 className="text-xl md:text-2xl text-gray-600 mb-6">In bảng điểm tổng</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 md:gap-6">
            {/* Chọn Lớp */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px] md:min-w-0">
              <label className="text-gray-600 text-sm whitespace-nowrap">Lớp</label>
              <DropdownSearch
                options={ClassLearn}
                placeholder="------ chọn lớp học ------"
                labelKey="ClassName"
                valueKey="ClassID"
                onChange={(e) => setSelectedClass(e.ClassID)}
              />
            </div>

            {/* Chọn Học viên */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px] md:min-w-0">
              <label className="text-gray-600 text-sm whitespace-nowrap">Học viên</label>
              <DropdownSearch
                options={studentOfClass}
                placeholder="------ chọn học viên (Tất cả) ------"
                labelKey="StudentName"
                valueKey="StudentID"
                onChange={(e) => setSelectedStudent(e.StudentID)}
              />
            </div>

            <div className='flex gap-4'>
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                onClick={handleSearch}
                disabled={isLoading || !selectedClass || selectedClass === 0}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Tìm kiếm
              </button>

              <button
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                onClick={handleExportExcel}
                disabled={isLoading || !pointSum || pointSum.length === 0}
              >
                <FileDown size={16} />
                <span className='whitespace-nowrap'>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap w-16">STT</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã học viên</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Họ và Tên</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã môn</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Tên môn</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Điểm lần 1</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Điểm lần 2</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Ngày vắng</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {renderTableBody()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !error && pointSum && pointSum.length > 0 && (
            <div className="p-4 md:px-6 md:py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang đầu"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>

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

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang sau"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Trang cuối"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalPointSum)} / {totalPointSum} kết quả
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Số dòng:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1); // Quay về trang 1 khi đổi số dòng
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
}