'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
  onChange: (val: number) => void;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 100000,
  unit = 'unit',
  step = 1,
  onChange,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) {
      onChange(min);
    } else {
      const clamped = Math.max(min, Math.min(max, raw));
      onChange(clamped);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="p-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Minus className="w-4 h-4" />
        </button>

        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="w-24 sm:w-28 text-center bg-transparent py-2 font-bold text-gray-900 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase quantity"
          className="p-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <span className="text-sm font-semibold text-gray-600 capitalize">{unit}s</span>
    </div>
  );
}
