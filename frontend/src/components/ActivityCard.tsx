import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ActivityType } from '../types/activityType';
import { isPast, parseISO } from 'date-fns';
import { useBoardStore } from '../store/useBoardStore';
import { Calendar, Trash2 } from 'lucide-react';
import { useActivityStore } from '../store/useActivityStore';
import { formatDueDate } from '../utils/dateUtils';

interface ActivityCardProps {
  activity: ActivityType;
  groupId: number;
}

export default function ActivityCard({ activity, groupId }: ActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
    data: {
      type: 'ACTIVITY',
      activity,
      groupId,
    },
  });

  const { deleteActivity, updateActivity } = useBoardStore();
  const { openEditActivityModal } = useActivityStore();

  const isOverdue =
    activity.dueDate &&
    isPast(parseISO(activity.dueDate)) &&
    !activity.completed;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Tem certeza que deseja excluir a atividade "${activity.name}"?`
      )
    ) {
      deleteActivity(activity.id, activity.groupId);
    }
  };

  const handleToggleCompletion = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    updateActivity(activity.id, { completed: e.target.checked });
  };

  const borderColor = activity.completed
    ? 'border-l-green-500'
    : isOverdue
    ? 'border-l-red-500'
    : 'border-l-transparent';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={() => openEditActivityModal(activity)}
      className={`
        mb-3 rounded-lg bg-[#101828] p-3 shadow
        ${borderColor}
        ${
          isDragging
            ? 'cursor-grabbing opacity-50'
            : 'cursor-grab active:cursor-grabbing '
        }
      `}
    >
      <div className="flex justify-between items-center">
        <p className="flex-grow pr-2">{activity.name}</p>
        <button
          onClick={handleDelete}
          className="flex-shrink-0 text-gray-400 hover:text-red-600 cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {activity.dueDate && (
        <div
          className={`mt-2 flex items-center gap-2 text-sm ${
            isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
          }`}
        >
          <Calendar size={14} />
          <span>{formatDueDate(activity.dueDate)}</span>
          <input
            type="checkbox"
            checked={activity.completed}
            onChange={handleToggleCompletion}
            onClick={(e) => e.stopPropagation()}
            className="ml-auto"
          />
        </div>
      )}
    </div>
  );
}
