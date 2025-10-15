// src/components/Board.tsx
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
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore } from '../store/useBoardStore';
import GroupColumn from './GroupColumn';
import AddGroupButton from './AddGroupButton';
import ActivityCard from './ActivityCard';
import type { ActivityType } from '../types/activityType';

export default function Board() {
  const { groups, fetchGroups, moveActivity } = useBoardStore();
  const [activeActivity, setActiveActivity] = useState<ActivityType | null>(
    null
  );

  // 3. Configurar os sensores para uma melhor experiência
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Requer que o mouse se mova 10px antes de ativar o drag
      activationConstraint: {
        distance: 10,
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

  // 4. Mover a lógica principal para o handleDragOver
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceGroupId = active.data.current?.groupId;
    // O 'over' pode ser um card ou a própria coluna
    const targetGroupId = over.data.current?.groupId || over.id;

    // Apenas executa a lógica se o card mudou de grupo
    if (sourceGroupId && targetGroupId && sourceGroupId !== targetGroupId) {
      // Encontra o índice do item sobre o qual estamos passando
      const targetIndex =
        over.data.current?.index !== undefined ? over.data.current.index : 0;

      // Chama a função do store para mover a atividade no estado
      moveActivity(
        Number(active.id),
        sourceGroupId,
        Number(targetGroupId),
        targetIndex
      );

      // Atualiza o groupId no 'data' do item ativo para refletir a mudança
      // Isso é crucial para que os próximos eventos 'onDragOver' funcionem corretamente
      if (active.data.current) {
        active.data.current.groupId = targetGroupId;
      }
    }
  };

  // 5. O handleDragEnd fica muito mais simples
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveActivity(null);
    // Aqui seria o lugar para a chamada final da API para persistir
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Se você quiser persistir a posição final dentro da mesma coluna,
    // a lógica final pode vir aqui. Mas a troca de colunas já foi feita.
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveActivity(null)}
    >
      <div className="flex gap-4 overflow-x-auto p-4">
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
