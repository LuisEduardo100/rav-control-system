import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBoardStore } from '../store/useBoardStore';
import { useActivityStore } from '../store/useActivityStore';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect } from 'react';
import { Newspaper, Pencil } from 'lucide-react';

const activitySchema = z.object({
  name: z.string().min(1, { message: 'O nome da atividade é obrigatório.' }),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

export default function ActivityFormModal() {
  const {
    isActivityModalOpen,
    editingActivity,
    targetGroupIdForNewActivity,
    closeActivityModal,
  } = useActivityStore();

  const { createActivity, updateActivity } = useBoardStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
  });

  useEffect(() => {
    if (isActivityModalOpen && editingActivity) {
      reset({
        name: editingActivity.name,
        description: editingActivity.description ?? '',
        dueDate: editingActivity.dueDate ?? '',
        completed: editingActivity.completed,
      });
    } else {
      reset({ name: '', description: '', dueDate: '', completed: false });
    }
  }, [isActivityModalOpen, editingActivity, reset]);

  const onSubmit = (data: ActivityFormData) => {
    const payload = {
      ...data,
      dueDate: data.dueDate || null,
    };

    if (editingActivity) {
      updateActivity(editingActivity.id, payload);
    } else if (targetGroupIdForNewActivity) {
      createActivity({
        name: payload.name,
        groupId: targetGroupIdForNewActivity,
        description: payload.description,
      });
    }
  };

  if (!isActivityModalOpen) return null;

  return (
    <Dialog
      open={isActivityModalOpen}
      onClose={closeActivityModal}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {editingActivity ? (
              <div className="flex items-center gap-2">
                <Pencil size={16} />
                Editar Atividade
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Newspaper size={16} />
                Nova Atividade
              </div>
            )}
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome da Atividade
              </label>
              <input
                {...register('name')}
                id="name"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descrição
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label
                  htmlFor="dueDate"
                  className="flex items-center ap-2 text-sm font-medium text-gray-700"
                >
                  <span>Data de Entrega</span>
                </label>
                <input
                  type="date"
                  {...register('dueDate')}
                  id="dueDate"
                  className="cursor-text mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              {editingActivity && (
                <div className="pt-6">
                  <label
                    htmlFor="completed"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <input
                      type="checkbox"
                      {...register('completed')}
                      id="completed"
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Concluída</span>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-4 border-t pt-4">
              <button
                type="button"
                onClick={closeActivityModal}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
