import { useEffect, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { useBoardStore } from '../store/useBoardStore';
import GroupColumn from './GroupColumn';
import AddGroupButton from './AddGroupButton';
import ActivityCard from './ActivityCard';
import type { ActivityType } from '../types/activityType';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export default function Board() {
  const { groups, fetchGroups, moveActivity, persistActivityMove } =
    useBoardStore();
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(
    null
  );
  const [overGroupId, setOverGroupId] = useState<number | null>(null);

  const scrollRef = useHorizontalScroll();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    })
  );

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activity = groups
      .flatMap((g) => g.activities)
      .find((a) => a.id === Number(active.id));
    if (activity) {
      setActiveActivity(activity);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isOverAGroup = over.data.current?.type === 'GROUP';
    const isOverAnActivity = over.data.current?.type === 'ACTIVITY';

    if (isOverAGroup) {
      const groupId = Number(String(over.id).replace('group-', ''));
      setOverGroupId(groupId);
    } else if (isOverAnActivity) {
      const groupId = over.data.current?.groupId;
      setOverGroupId(groupId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActivity(null);
    setOverGroupId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sourceGroupId = active.data.current?.groupId;
    const sourceGroup = groups.find((g) => g.id === sourceGroupId);
    if (!sourceGroup) return;

    const sourceIndex = sourceGroup.activities.findIndex(
      (a) => a.id === active.id
    );

    const isOverAGroup = over.data.current?.type === 'GROUP';
    const isOverAnActivity = over.data.current?.type === 'ACTIVITY';

    let targetGroupId: number;
    let targetIndex: number;

    if (isOverAGroup) {
      targetGroupId = Number(String(over.id).replace('group-', ''));

      const targetGroup = groups.find((g) => g.id === targetGroupId);
      if (!targetGroup) return;
      targetIndex = targetGroup.activities.length;
    } else if (isOverAnActivity) {
      targetGroupId = over.data.current?.groupId;

      const targetGroup = groups.find((g) => g.id === targetGroupId);
      if (!targetGroup) return;
      targetIndex = targetGroup.activities.findIndex((a) => a.id === over.id);
    } else {
      return;
    }

    if (sourceIndex === -1 || targetIndex === -1) {
      console.error(
        'Não foi possível encontrar o índice de origem ou destino.'
      );
      return;
    }

    moveActivity(
      Number(active.id),
      sourceGroupId,
      targetGroupId,
      sourceIndex,
      targetIndex
    );

    persistActivityMove(Number(active.id), {
      targetGroupId,
      newPosition: targetIndex,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={() => {
        setActiveActivity(null);
        setOverGroupId(null);
      }}
    >
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto p-4">
        {groups.map((group) => (
          <GroupColumn
            key={group.id}
            group={group}
            activeActivity={activeActivity}
            overGroupId={overGroupId}
          />
        ))}
        <AddGroupButton />
      </div>

      <DragOverlay>
        {activeActivity ? (
          <ActivityCard activity={activeActivity} groupId={0} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
