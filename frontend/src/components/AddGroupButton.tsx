import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  requiredNameSchema,
  type RequiredNameFormData,
} from '../validation/commonSchemas';

export default function AddGroupButton() {
  const [isAdding, setIsAdding] = useState(false);
  const { createGroup } = useBoardStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequiredNameFormData>({
    resolver: zodResolver(requiredNameSchema),
    defaultValues: { name: '' },
  });

  const onAddNewGroup = async (data: RequiredNameFormData) => {
    await createGroup(data.name.trim());
    reset({ name: '' });
    setIsAdding(false);
  };

  const cancelAdding = () => {
    reset({ name: '' });
    setIsAdding(false);
  };

  const baseStyle =
    'flex w-72 h-12 flex-shrink-0 flex-col rounded-lg p-3 cursor-pointer justify-center';

  if (isAdding) {
    return (
      <form
        onSubmit={handleSubmit(onAddNewGroup)}
        className={`${baseStyle} bg-stone-200`}
      >
        <input
          {...register('name')}
          autoFocus
          type="text"
          onBlur={cancelAdding}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              cancelAdding();
            }
          }}
          placeholder="Nome do novo grupo..."
          className="w-full rounded-md border-none bg-white focus:outline-none p-2 text-sm text-black shadow-sm  placeholder:text-black"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className={`${baseStyle} bg-stone-200/80 text-stone-700 hover:bg-stone-200/70`}
    >
      Novo Grupo +
    </button>
  );
}
