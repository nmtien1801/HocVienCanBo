import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getCriteriaEvaluationActive } from '../../redux/CriteriaEvaluationSlice.js';
import { toast } from 'react-toastify';

export default function QuestionPicker({ onSelect, onClose }) {
  const dispatch = useDispatch();
  const { CriteriaEvaluationActive } = useSelector((state) => state.criteriaEvaluation);

  const [query, setQuery] = useState('');

  // ----------------------------- fetch list câu hỏi ---------------------------------------
  useEffect(() => {
    const fetchList = async () => {
      let res = await dispatch(getCriteriaEvaluationActive());
      if (res.message) {
        toast.error('lấy câu hỏi thất bại')
      }
    };

    fetchList();
  }, [dispatch]);

  // ------------------------------------- action modal ------------------------------
  const filtered = useMemo(() => {
    if (!query) return CriteriaEvaluationActive;

    return CriteriaEvaluationActive.filter(q =>
      (q.TitleCriteriaEvaluation || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [CriteriaEvaluationActive, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Chọn câu hỏi từ ngân hàng</h3>
        </div>

        <div className="mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500 py-6">Không tìm thấy câu hỏi phù hợp</div>
          ) : (
            <ul className="space-y-2">
              {filtered.map(q => (
                <li key={q.CriteriaEvaluationID} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div>
                    <div className="text-sm text-gray-800">{q.TitleCriteriaEvaluation}</div>
                    <div className="text-xs text-gray-500">{q.TypeCriteria}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => onSelect(q)}
                      className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                    >
                      Chọn
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-2 bg-red-400 rounded hover:bg-red-500">Hủy</button>
        </div>
      </div>
    </div>
  );
}
