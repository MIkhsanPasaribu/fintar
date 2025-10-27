"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

interface Props {
  startDate: Date;
  endDate: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
  ];

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    onChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
          <div className="p-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.days)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
