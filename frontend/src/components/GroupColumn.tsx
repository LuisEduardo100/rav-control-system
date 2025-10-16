import { SortableContext } from '@dnd-kit/sortable';
import ActivityCard from './ActivityCard';
import type { GroupType } from '../types/groupType';
import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBoardStore } from '../store/useBoardStore';
import type { ActivityType } from '../types/activityType';
import { CirclePlus, Trash2 } from 'lucide-react';
import { useActivityStore } from '../store/useActivityStore';

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
  const { updateGroup, deleteGroup } = useBoardStore();
  const { openCreateActivityModal } = useActivityStore();

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

  const handleDeleteGroup = () => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o grupo "${group.name}"? Todas as atividades contidas nele também serão excluídas.`
      )
    ) {
      deleteGroup(group.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-stone-200 shadow-md"
    >
      <div className="flex items-center justify-between rounded-t-lg bg-blue-600 p-3 text-white">
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
        <button
          onClick={handleDeleteGroup}
          className="rounded p-1 opacity-60 hover:opacity-100 cursor-pointer"
          aria-label={`Excluir grupo ${group.name}`}
        >
          <Trash2 size={16} />
        </button>
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

      <div className="mx-auto p-3">
        <button
          onClick={() => openCreateActivityModal(group.id)}
          className="rounded-md p-2 text-center text-sm text-gray-500 hover:bg-gray-300 cursor-pointer"
        >
          <CirclePlus size={24} />
        </button>
      </div>
    </div>
  );
}
