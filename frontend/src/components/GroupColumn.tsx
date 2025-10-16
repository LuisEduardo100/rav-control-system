import { SortableContext } from '@dnd-kit/sortable';
import ActivityCard from './ActivityCard';
import type { GroupType } from '../types/groupType';
import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBoardStore } from '../store/useBoardStore';
import type { ActivityType } from '../types/activityType';

interface GroupColumnProps {
  group: GroupType;
  activeActivity: ActivityType | null;
  overGroupId: number | null;
}

export default function GroupColumn({
  group,
  activeActivity,
  overGroupId,
}: GroupColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const { updateGroup } = useBoardStore();

  const { setNodeRef } = useDroppable({
    id: `group-${group.id}`,
    data: {
      type: 'GROUP',
      group,
    },
  });

  const activityIds = useMemo(() => {
    const ids = group.activities.map((a) => a.id);

    if (
      overGroupId === group.id &&
      activeActivity &&
      !ids.includes(activeActivity.id)
    ) {
      return [...ids, activeActivity.id];
    }

    return ids;
  }, [group.activities, activeActivity, overGroupId, group.id]);

  const handleUpdate = () => {
    if (!groupName.trim() || groupName === group.name) {
      setIsEditing(false);
      setGroupName(group.name);
      return;
    }
    updateGroup(group.id, groupName.trim());
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-stone-200 shadow-md"
    >
      <div className="rounded-t-lg bg-blue-600 p-3 text-white">
        {isEditing ? (
          <input
            autoFocus
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            className="w-full rounded border-none bg-blue-700 p-0 font-semibold text-white outline-none"
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="font-semibold cursor-pointer"
          >
            {group.name}
          </h3>
        )}
      </div>

      <div className="flex-grow p-3">
        <SortableContext items={activityIds}>
          {group.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              groupId={group.id}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-3">
        <button className="w-full rounded-md p-2 text-left text-sm text-gray-500 hover:bg-gray-300">
          + Novo Card
        </button>
      </div>
    </div>
  );
}
