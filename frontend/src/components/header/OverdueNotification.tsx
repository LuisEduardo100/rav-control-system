import { useBoardStore } from '../../store/useBoardStore';
import { isPast, parseISO } from 'date-fns';
import { Bell } from 'lucide-react';
import { useRef, useState } from 'react';
interface TooltipProps {
  message: string;
}

function Tooltip({ message }: TooltipProps) {
  return (
    <div className="absolute right-0 top-full mb-2 w-max rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}

export default function OverdueNotification() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

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

  const handleMouseEnter = () => {
    timerRef.current = window.setTimeout(() => {
      setIsTooltipVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsTooltipVisible(false);
  };

  const tooltipMessage = `Você tem ${overdueCount} ${
    overdueCount > 1 ? 'atividades atrasadas' : 'atividade atrasada'
  }`;

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Bell size={32} fill="#101828" color="#101828" />
        {overdueCount > 0 && (
          <span
            className="absolute bottom-6 left-6         
            flex items-center justify-center 
            h-6 w-6             
            rounded-full        
          bg-red-500/80        
            text-xs text-white font-bold 
            "
          >
            {overdueCount}
          </span>
        )}
        {isTooltipVisible && <Tooltip message={tooltipMessage} />}
      </div>
    </div>
  );
}
