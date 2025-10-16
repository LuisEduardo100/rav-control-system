import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ActivityType } from '../types/activityType';

interface ActivityCardProps {
  activity: ActivityType;
  groupId: number;
}

export default function ActivityCard({ activity, groupId }: ActivityCardProps) {
  console.log(`Renderizando ActivityCard ID: ${activity.id}`, { groupId });
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
      className={`
        mb-3 rounded-lg bg-[#101828] p-3 shadow
        ${
          isDragging
            ? 'cursor-grabbing opacity-50'
            : 'cursor-grab active:cursor-grabbing '
        }
      `}
    >
      {activity.name}
    </div>
  );
}
