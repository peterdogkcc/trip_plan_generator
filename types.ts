// FIX: Added type definitions for Itinerary, DayPlan, and Activity to make this a valid module.
export interface Activity {
  time: string;
  title: string;
  description: string;
}

export interface DayPlan {
  date: string;
  day: string;
  activities: Activity[];
}

export interface Itinerary {
  tripTitle: string;
  dailyPlans: DayPlan[];
}
