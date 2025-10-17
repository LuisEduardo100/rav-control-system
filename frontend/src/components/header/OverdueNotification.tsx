import { useBoardStore } from '../../store/useBoardStore';
import { isPast, parseISO } from 'date-fns';
import { Bell } from 'lucide-react';

export default function OverdueNotification() {
  const overdueCount = useBoardStore(
    (state) =>
      state.groups
        .flatMap((g) => g.activities)
        .filter(
          (activity) =>
            activity.dueDate &&
            !activity.completed &&
            isPast(parseISO(activity.dueDate))
        ).length
  );

  return (
    <div className="relative inline-block">
      <Bell size={32} fill="#101828" color="#101828" />
      {overdueCount > 0 && (
        <span
          className="absolute bottom-5 left-5         
          flex items-center justify-center 
          h-6 w-6             
          rounded-full        
          bg-red-500/80        
          text-xs text-white font-semibold 
          "
        >
          {overdueCount}
        </span>
      )}
    </div>
  );
}
