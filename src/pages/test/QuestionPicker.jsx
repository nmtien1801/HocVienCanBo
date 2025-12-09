import React, { useState, useMemo } from 'react';

export default function QuestionPicker({ questions = [], onSelect, onClose }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return questions;
    return questions.filter(q => q.text.toLowerCase().includes(query.toLowerCase()));
  }, [questions, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Chọn câu hỏi từ ngân hàng</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
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
                <li key={q.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div>
                    <div className="text-sm text-gray-800">{q.text}</div>
                    <div className="text-xs text-gray-500">{q.type}</div>
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
          <button onClick={onClose} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Hủy</button>
        </div>
      </div>
    </div>
  );
}
