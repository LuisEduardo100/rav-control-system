// src/components/ActivityCard.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ActivityType } from '../types/activityType';

interface ActivityCardProps {
  activity: ActivityType;
  groupId: number;
  index: number;
}

export default function ActivityCard({
  activity,
  groupId,
  index,
}: ActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
    data: { groupId, index },
  });

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
      className={`p-3 bg-gray-700 rounded-md mb-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-2xl' : 'shadow-sm'
      }`}
    >
      {activity.name}
    </div>
  );
}
