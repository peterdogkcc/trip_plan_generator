import React from 'react';

// NOTE: This component is not currently used in the application.
// It is provided to resolve build errors related to the file's existence.
// It can be integrated into ItineraryForm.tsx in the future to encapsulate date selection logic.

interface DatePickerGroupProps {
  startDate: string;
  endDate: string;
  minDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

const DatePickerGroup: React.FC<DatePickerGroupProps> = ({ 
  startDate, 
  endDate, 
  minDate, 
  onStartDateChange, 
  onEndDateChange 
}) => {

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate);
    // If the new start date is after the current end date, update the end date as well.
    if (new Date(newStartDate) > new Date(endDate)) {
      onEndDateChange(newStartDate);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="start-date-group" className="block text-sm font-medium text-slate-700 mb-1">
          開始日期
        </label>
        <input
          type="date"
          id="start-date-group"
          value={startDate}
          onChange={handleStartDateChange}
          min={minDate}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
          required
        />
      </div>
      <div>
        <label htmlFor="end-date-group" className="block text-sm font-medium text-slate-700 mb-1">
          結束日期
        </label>
        <input
          type="date"
          id="end-date-group"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
          required
        />
      </div>
    </div>
  );
};

export default DatePickerGroup;
