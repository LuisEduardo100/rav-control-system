import { useBoardStore } from '../../store/useBoardStore';
import { isPast, parseISO } from 'date-fns';
import { Bell } from 'lucide-react';
import { useRef, useState } from 'react';
import Tooltip from './Tooltip';

export default function OverdueNotification() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const isFilteringOverdue = useBoardStore((state) => state.isFilteringOverdue);
  const toggleOverdueFilter = useBoardStore(
    (state) => state.toggleOverdueFilter
  );

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
    }, 250);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsTooltipVisible(false);
  };

  const tooltipMessage = `Você tem ${overdueCount} ${
    overdueCount > 1
      ? 'atividades atrasadas. Clique para saber quais.'
      : 'atividade atrasada. Clique para saber qual.'
  }`;

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleOverdueFilter}
      >
        <Bell
          size={32}
          fill="#101828"
          color="#101828"
          className={`hover:text-white ${
            isFilteringOverdue
              ? 'text-blue-400 fill-blue-400/20'
              : 'text-gray-300'
          }`}
        />
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
        {isTooltipVisible && !isFilteringOverdue && (
          <Tooltip message={tooltipMessage} />
        )}
      </div>
    </div>
  );
}
