import { SortableContext } from '@dnd-kit/sortable';
import ActivityCard from './ActivityCard';
import type { GroupColumnProps } from '../types/groupType';
import { useEffect, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBoardStore } from '../store/useBoardStore';
import { CirclePlus, Trash2 } from 'lucide-react';
import { useActivityStore } from '../store/useActivityStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  requiredNameSchema,
  type RequiredNameFormData,
} from '../validation/commonSchemas';
import { useToastStore } from '../store/useToastStore';

export default function GroupColumn({
  group,
  activeActivity,
  overGroupId,
}: GroupColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateGroup, deleteGroup } = useBoardStore();
  const { openCreateActivityModal } = useActivityStore();
  const showConfirmation = useToastStore((state) => state.showConfirmation);

  const { setNodeRef } = useDroppable({
    id: `group-${group.id}`,
    data: {
      type: 'GROUP',
      group,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<RequiredNameFormData>({
    resolver: zodResolver(requiredNameSchema),
    defaultValues: {
      name: group.name,
    },
  });

  useEffect(() => {
    reset({ name: group.name });
  }, [group.name, reset]);

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

  const onTitleSubmit = (data: RequiredNameFormData) => {
    if (!isDirty || data.name === group.name) {
      setIsEditing(false);
      return;
    }
    updateGroup(group.id, data.name.trim());
    setIsEditing(false);
  };

  const handleDeleteGroup = () => {
    showConfirmation(
      `Excluir o grupo "${group.name}"?`,
      'Todas as atividades contidas nele também serão excluídas. Esta ação não pode ser desfeita.',
      () => deleteGroup(group.id)
    );
  };

  return (
    <div
      ref={setNodeRef}
      className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-stone-200 shadow-md"
    >
      <div className="flex items-center justify-between rounded-t-lg bg-blue-600 p-3 text-white">
        {isEditing ? (
          <form onSubmit={handleSubmit(onTitleSubmit)} className="flex-grow">
            <input
              {...register('name')}
              autoFocus
              className="w-full rounded border-none bg-blue-700 p-0 font-semibold text-white outline-none"
              onBlur={handleSubmit(onTitleSubmit)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  reset({ name: group.name });
                  setIsEditing(false);
                }
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>
            )}
          </form>
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="font-semibold cursor-pointer"
          >
            {group.name}
          </h3>
        )}
        {!isEditing && (
          <button
            onClick={handleDeleteGroup}
            className="ml-2 rounded p-1 opacity-60 hover:text-red-600 hover:opacity-100 cursor-pointer"
            aria-label={`Excluir grupo ${group.name}`}
          >
            <Trash2 size={16} />
          </button>
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
