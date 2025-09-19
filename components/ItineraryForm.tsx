import React, { useState } from 'react';
import { validateCity } from '../services/geminiService.js';

const ItineraryForm = ({ onSubmit, isLoading, minDate }) => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(minDate);
  const [preferences, setPreferences] = useState('');
  const [tripPurpose, setTripPurpose] = useState('');
  const [pace, setPace] = useState('');
  const [companions, setCompanions] = useState('');
  const [budget, setBudget] = useState('');
  const [arrivalTime, setArrivalTime] = useState('09:00');
  const [departureTime, setDepartureTime] = useState('21:00');
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === 'start-date') {
      setStartDate(value);
      if (new Date(value) > new Date(endDate)) {
        setEndDate(value);
      }
    } else if (id === 'end-date') {
      setEndDate(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const missingFields = [];
    if (!city) missingFields.push('目的地城市');
    if (!tripPurpose) missingFields.push('旅行目的');
    if (!pace) missingFields.push('旅行節奏');
    if (!companions) missingFields.push('同行人數/組成');
    if (!budget) missingFields.push('預算範圍');

    if (missingFields.length > 0) {
      setError(`請填寫以下必填欄位：${missingFields.join('、')}`);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('結束日期不能早於開始日期。');
      return;
    }

    setIsValidating(true);
    try {
      const isCityValid = await validateCity(city);
      if (!isCityValid) {
        setError(`您輸入的地點「${city}」部分或全部無法辨識，請檢查拼寫或分隔符號。`);
        setIsValidating(false);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '城市驗證時發生未知錯誤。');
      setIsValidating(false);
      return;
    }
    setIsValidating(false);

    onSubmit(city, startDate, endDate, preferences, tripPurpose, pace, companions, budget, arrivalTime, departureTime);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
            目的地城市 (可輸入多個，請用逗號分隔)
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="例如：東京, 大阪, 京都"
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
            required
          />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">
              開始日期
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleDateChange}
              min={minDate}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
              required
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">
              結束日期
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleDateChange}
              min={startDate}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
              required
            />
          </div>
          <div>
              <label htmlFor="arrival-time" className="block text-sm font-medium text-slate-700 mb-1">航班抵達時間 (選填)</label>
              <input type="time" id="arrival-time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900" />
          </div>
          <div>
              <label htmlFor="departure-time" className="block text-sm font-medium text-slate-700 mb-1">航班離開時間 (選填)</label>
              <input type="time" id="departure-time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900" />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="trip-purpose" className="block text-sm font-medium text-slate-700 mb-1">旅行目的</label>
            <select id="trip-purpose" value={tripPurpose} onChange={(e) => setTripPurpose(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900" required>
              <option value="">請選擇</option>
              <option value="度假放鬆">度假放鬆</option>
              <option value="商務出差">商務出差</option>
              <option value="文化探索">文化探索</option>
              <option value="美食之旅">美食之旅</option>
              <option value="家庭旅遊">家庭旅遊</option>
            </select>
          </div>
          <div>
            <label htmlFor="pace" className="block text-sm font-medium text-slate-700 mb-1">旅行節奏</label>
            <select id="pace" value={pace} onChange={(e) => setPace(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900" required>
              <option value="">請選擇</option>
              <option value="悠閒">悠閒</option>
              <option value="普通">普通</option>
              <option value="緊湊">緊湊</option>
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">預算範圍</label>
            <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900" required>
              <option value="">請選擇</option>
              <option value="經濟">經濟</option>
              <option value="舒適">舒適</option>
              <option value="豪華">豪華</option>
            </select>
          </div>
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-slate-700 mb-1">同行人數/組成</label>
            <input type="text" id="companions" value={companions} onChange={(e) => setCompanions(e.target.value)} placeholder="例如：情侶、2位大人1位小孩" className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900" required/>
          </div>
      </div>

      <div>
        <label htmlFor="preferences" className="block text-sm font-medium text-slate-700 mb-1">
          其他旅遊偏好 (選填)
        </label>
        <textarea
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="例如：喜歡博物館、親子友善、想吃當地小吃..."
          rows={3}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-slate-900"
        />
      </div>
      
      {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">{error}</div>}

      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading || isValidating}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading || isValidating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isLoading ? '規劃中...' : '驗證城市中...'}
            </>
          ) : (
            '生成我的專屬行程'
          )}
        </button>
      </div>
    </form>
  );
};

export default ItineraryForm;