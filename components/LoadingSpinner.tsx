import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-md border border-slate-200">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold text-lg">AI 正在為您規劃最棒的行程...</p>
        <p className="mt-1 text-slate-600 text-sm">請稍候片刻</p>
    </div>
  );
};

export default LoadingSpinner;
