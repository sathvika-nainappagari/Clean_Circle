import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { UserProfile, UserActionItem } from '../types';
import { fireEcoConfetti } from '../utils/confetti';

interface DailyHabitChecklistProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

interface DailyHabit {
  id: string;
  title: string;
  category: string;
  points: number;
  description: string;
  completed: boolean;
}

export const DailyHabitChecklist: React.FC<DailyHabitChecklistProps> = ({
  user,
  onUpdateUser,
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({
    'h-segregation': true,
    'h-carry': true,
  });

  const habits: DailyHabit[] = [
    {
      id: 'h-segregation',
      title: 'Household 2-Bin Source Segregation',
      category: 'Home Habit',
      points: 15,
      description: 'Kept green (wet organic) and blue (dry plastic/paper) bins separate for doorstep collector.',
      completed: !!completedHabits['h-segregation'],
    },
    {
      id: 'h-carry',
      title: 'Pocket Your Wrapper / Zero Public Littering',
      category: 'Everyday Habit',
      points: 10,
      description: 'Did not discard any tea cup, snack packet or bottle on the road during commute today.',
      completed: !!completedHabits['h-carry'],
    },
    {
      id: 'h-draincheck',
      title: 'Local Storm Drain / Street Eye Check',
      category: 'Neighborhood Care',
      points: 15,
      description: 'Inspected local street corner or roadside drain grate for plastic clog danger.',
      completed: !!completedHabits['h-draincheck'],
    },
    {
      id: 'h-noburn',
      title: 'Zero Curb Burning Commitment',
      category: 'Clean Air',
      points: 10,
      description: 'Prevented burning of dry leaves or plastic sweepings; gathered for composting/dry collection.',
      completed: !!completedHabits['h-noburn'],
    },
  ];

  const handleToggleHabit = (habit: DailyHabit) => {
    const isNowDone = !completedHabits[habit.id];
    setCompletedHabits(prev => ({ ...prev, [habit.id]: isNowDone }));

    if (isNowDone) {
      fireEcoConfetti();

      const newAction: UserActionItem = {
        id: `act-habit-${Date.now()}`,
        title: habit.title,
        category: 'Daily Habit',
        points: habit.points,
        timestamp: 'Just now',
        details: habit.description,
        iconName: 'Sparkles',
      };

      const updatedPoints = user.ecoPoints + habit.points;
      
      onUpdateUser({
        ...user,
        ecoPoints: updatedPoints,
        lastActiveDate: todayKey,
        actionsHistory: [newAction, ...user.actionsHistory],
      });
    }
  };

  const completedCount = Object.values(completedHabits).filter(Boolean).length;
  const allDone = completedCount === habits.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Today's Civic Clean Habits</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Log your everyday responsible actions to maintain your Clean Streak & earn Eco Points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            {completedCount}/{habits.length} Complete
          </span>
          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              style={{ width: `${(completedCount / habits.length) * 100}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Habit Items */}
      <div className="mt-4 space-y-2.5">
        {habits.map((habit) => {
          const isDone = !!completedHabits[habit.id];
          return (
            <div
              key={habit.id}
              onClick={() => handleToggleHabit(habit)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                isDone 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <button 
                type="button"
                className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                aria-label={habit.title}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold ${isDone ? 'line-through text-emerald-800/80' : 'text-slate-900'}`}>
                    {habit.title}
                  </span>
                  <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800">
                    +{habit.points} Pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {habit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Completion Encouragement */}
      <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {allDone 
              ? 'Awesome! You have completed all daily clean habits for today.'
              : 'Completing 3+ daily actions keeps your Chittoor Clean Streak burning!'}
          </span>
        </div>
        <span className="font-bold text-amber-700 whitespace-nowrap">Day {user.streakDays} Active</span>
      </div>
    </div>
  );
};
