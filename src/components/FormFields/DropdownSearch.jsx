import React, { useState, useEffect } from 'react';

export default function DropdownSearch({ options = [], placeholder = "Select option", labelKey = "label", valueKey = "value", onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = options.filter((item) =>
    item[labelKey].toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    setQuery("");
    if (onChange) onChange(item);
  };

  return (
    <div className="relative w-64">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-white border rounded-xl px-4 py-2 text-left shadow-sm focus:outline-none"
        >
          {selected ? selected.label : placeholder}
        </button>
      ) : (
        <input
          type="text"
          className="w-full border rounded-xl px-4 py-2 shadow-sm focus:outline-none"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      )}

      {open && (
        <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg p-2 z-10">
          <div className="max-h-48 overflow-auto">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item[valueKey]}
                  onClick={() => handleSelect(item)}
                  className="px-3 py-2 cursor-pointer rounded-lg hover:bg-gray-100"
                >
                  {item[labelKey]}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 px-3 py-2 text-center">
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}