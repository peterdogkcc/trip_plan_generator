import React, { useState } from 'react';
import type { Itinerary, DayPlan, Activity } from '../types';

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onItineraryChange: (updatedItinerary: Itinerary) => void;
}

interface DayPlanCardProps {
  dayPlan: DayPlan;
  dayIndex: number;
  onUpdateActivity: (dayIndex: number, activityIndex: number, updatedActivity: Activity) => void;
  onDeleteActivity: (dayIndex: number, activityIndex: number) => void;
  onAddActivity: (dayIndex: number) => void;
}

interface ActivityCardProps {
    activity: Activity;
    dayIndex: number;
    activityIndex: number;
    onUpdate: (dayIndex: number, activityIndex: number, updatedActivity: Activity) => void;
    onDelete: (dayIndex: number, activityIndex: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, dayIndex, activityIndex, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedActivity, setEditedActivity] = useState<Activity>(activity);

    const handleSave = () => {
        onUpdate(dayIndex, activityIndex, editedActivity);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedActivity(activity);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`確定要刪除活動「${activity.title}」嗎？`)) {
            onDelete(dayIndex, activityIndex);
        }
    };
    
    const icons = [
        'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
        'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
    ];
    const iconPath = icons[activityIndex % icons.length];

    return (
        <div className="relative pl-8 sm:pl-12 py-4 group">
            <div className="flex items-center absolute left-0 top-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-white group-hover:ring-blue-100 transition-all">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                    </svg>
                </div>
            </div>
            <div className="ml-4">
                {isEditing ? (
                    <div className="space-y-2">
                        <div>
                            <label className="text-xs font-medium text-slate-500">時間</label>
                            <input 
                                type="text"
                                value={editedActivity.time}
                                onChange={(e) => setEditedActivity({ ...editedActivity, time: e.target.value })}
                                className="w-full text-sm p-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                           <label className="text-xs font-medium text-slate-500">標題</label>
                            <input 
                                type="text"
                                value={editedActivity.title}
                                onChange={(e) => setEditedActivity({ ...editedActivity, title: e.target.value })}
                                className="w-full font-bold text-lg p-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                           <label className="text-xs font-medium text-slate-500">描述</label>
                           <textarea
                                value={editedActivity.description}
                                onChange={(e) => setEditedActivity({ ...editedActivity, description: e.target.value })}
                                rows={3}
                                className="w-full text-base p-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">儲存</button>
                            <button onClick={handleCancel} className="px-3 py-1 bg-slate-400 text-white text-sm font-semibold rounded-md hover:bg-slate-500">取消</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="absolute top-4 right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => setIsEditing(true)} title="編輯" className="p-1 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                           </button>
                           <button onClick={handleDelete} title="刪除" className="p-1 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                           </button>
                        </div>
                        <p className="text-sm text-slate-600">{activity.time}</p>
                        <h4 className="mt-1 font-bold text-slate-800 text-lg">{activity.title}</h4>
                        <p className="mt-2 text-slate-700">{activity.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DayPlanCard: React.FC<DayPlanCardProps> = ({ dayPlan, dayIndex, onUpdateActivity, onDeleteActivity, onAddActivity }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
        <h3 className="text-2xl font-bold text-white">{dayPlan.day}</h3>
        <p className="text-white opacity-80">{dayPlan.date}</p>
      </div>
      <div className="p-4 sm:p-6 relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          {dayPlan.activities.map((activity, activityIndex) => (
            <ActivityCard 
                key={activityIndex} 
                activity={activity} 
                dayIndex={dayIndex} 
                activityIndex={activityIndex}
                onUpdate={onUpdateActivity}
                onDelete={onDeleteActivity}
            />
          ))}
           <div className="relative pl-8 sm:pl-12 py-2">
                <button
                    onClick={() => onAddActivity(dayIndex)}
                    className="w-full text-left text-blue-600 font-semibold hover:bg-blue-50 p-2 rounded-lg transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    新增活動
                </button>
            </div>
      </div>
    </div>
  );
};

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onItineraryChange }) => {

  const handleUpdateActivity = (dayIndex: number, activityIndex: number, updatedActivity: Activity) => {
    const newItinerary = JSON.parse(JSON.stringify(itinerary));
    newItinerary.dailyPlans[dayIndex].activities[activityIndex] = updatedActivity;
    onItineraryChange(newItinerary);
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    const newItinerary = JSON.parse(JSON.stringify(itinerary));
    newItinerary.dailyPlans[dayIndex].activities.splice(activityIndex, 1);
    onItineraryChange(newItinerary);
  };
  
  const handleAddActivity = (dayIndex: number) => {
    const newItinerary = JSON.parse(JSON.stringify(itinerary));
    const newActivity: Activity = {
        time: "12:00 - 13:00",
        title: "新活動",
        description: "請填寫此處的活動細節。"
    };
    newItinerary.dailyPlans[dayIndex].activities.push(newActivity);
    onItineraryChange(newItinerary);
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          {itinerary.tripTitle}
        </h2>
        <p className="mt-2 text-slate-600">為您精心規劃的專屬行程 (可將滑鼠懸停在活動上進行編輯)</p>
      </div>
      
      <div>
        {itinerary.dailyPlans.map((dayPlan, dayIndex) => (
          <DayPlanCard 
            key={dayIndex} 
            dayPlan={dayPlan} 
            dayIndex={dayIndex}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onAddActivity={handleAddActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;