import { useEffect, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
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

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActivity(null);
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const sourceGroupId = active.data.current?.groupId;
    const targetGroupId = over.data.current?.groupId || over.id;

    const sourceGroup = groups.find((g) => g.id === Number(sourceGroupId));
    const targetGroup = groups.find((g) => g.id === Number(targetGroupId));
    if (!sourceGroup || !targetGroup) return;

    const sourceIndex = sourceGroup.activities.findIndex(
      (a) => a.id === active.id
    );
    let targetIndex = targetGroup.activities.findIndex((a) => a.id === over.id);

    if (targetIndex === -1) {
      targetIndex = targetGroup.activities.length;
    }

    moveActivity(
      Number(active.id),
      Number(sourceGroupId),
      Number(targetGroupId),
      sourceIndex,
      targetIndex
    );

    persistActivityMove(Number(active.id), {
      targetGroupId: Number(targetGroupId),
      newPosition: targetIndex,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveActivity(null)}
    >
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto p-4">
        {groups.map((group) => (
          <SortableContext
            key={group.id}
            items={group.activities.map((a) => a.id)}
            strategy={rectSortingStrategy}
          >
            <GroupColumn group={group} />
          </SortableContext>
        ))}
        <AddGroupButton />
      </div>

      <DragOverlay>
        {activeActivity ? (
          <ActivityCard activity={activeActivity} groupId={0} index={0} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
