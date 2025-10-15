// src/components/GroupColumn.tsx
import { SortableContext } from '@dnd-kit/sortable';
import ActivityCard from './ActivityCard';
import type { ActivityType } from '../types/activityType';

type Group = {
  id: number;
  name: string;
  activities: ActivityType[];
};

interface GroupColumnProps {
  group: Group;
}

export default function GroupColumn({ group }: GroupColumnProps) {
  return (
    <div className="w-64 bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
      <SortableContext items={group.activities.map((a) => a.id)}>
        {group.activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            groupId={group.id}
            index={index}
          />
        ))}
      </SortableContext>
    </div>
  );
}
