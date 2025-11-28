import React, { useState, useEffect } from 'react';
import { Search, FileDown } from 'lucide-react';
import { getScheduleClass } from '../../redux/scheduleSlice.js';
import { getClassLearnByUserID } from '../../redux/learningClassSlice.js';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

export default function TimetableClass() {
  const dispatch = useDispatch();
  const { scheduleClass, totalScheduleClass } = useSelector((state) => state.schedule);
  const { ClassLearn } = useSelector((state) => state.learningClass);
  const [selectedClass, setSelectedClass] = useState('');

  const fetchScheduleClass = async () => {
    let res = await dispatch(getScheduleClass({ classLearnID: selectedClass, page: 1, limit: 10 }));

    if (!res.payload || !res.payload.data) {
      toast.error(res.payload?.message);
    }
  };

  useEffect(() => {
    const fetchClassLearn = async () => {
      let res = await dispatch(getClassLearnByUserID());

      if (!res.payload || !res.payload.data) {
        toast.error(res.payload?.message);
      }
    };

    fetchClassLearn();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <h1 className="text-2xl text-gray-600 mb-6">Thời khóa biểu lớp</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-gray-600 text-sm whitespace-nowrap">Lớp</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm w-80 text-gray-500"
              >
                <option value="">------ chọn lớp ------</option>
                {ClassLearn?.map((item) => (
                  <option key={item.ClassID} value={item.ClassCode}>
                    {item.ClassName}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 text-sm" onClick={() => fetchScheduleClass()}>
              <Search size={16} />
              Tìm kiếm
            </button>

            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 text-sm">
              <FileDown size={16} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg text-red-700 font-semibold text-center">Danh sách Thời khóa biểu lớp</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">STT</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Mã môn</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Tên môn</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Thứ học</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Số buổi học</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold border-r border-gray-300 whitespace-nowrap">Ngày kết thúc</th>
                  <th className="px-4 py-3 text-center text-gray-700 font-semibold whitespace-nowrap">Ngày thi</th>
                </tr>
              </thead>
              <tbody>
                {scheduleClass.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No records to display.
                    </td>
                  </tr>
                ) : (
                  scheduleClass.map((row, index) => (
                    <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.stt}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.maMon}</td>
                      <td className="px-4 py-3 border-r border-gray-200">{row.tenMon}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.thuHoc}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.soBuoiHoc}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngayBatDau}</td>
                      <td className="px-4 py-3 border-r border-gray-200 text-center">{row.ngayKetThuc}</td>
                      <td className="px-4 py-3 text-center">{row.ngayThi}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-right text-xs text-gray-500">
          Copyright © 2023 by G&BSoft
        </div>
      </div>
    </div>
  );
}