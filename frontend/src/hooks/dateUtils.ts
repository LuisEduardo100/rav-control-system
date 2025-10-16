import { format, parseISO, isValid } from 'date-fns';

export const formatDueDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) {
    return '';
  }

  try {
    const dateObject = parseISO(dateString);

    if (!isValid(dateObject)) {
      console.warn(`Tentativa de formatar uma data inválida: "${dateString}"`);
      return '';
    }

    return format(dateObject, 'dd/MM/yyyy');
  } catch (error) {
    console.error(`Erro ao formatar a data: "${dateString}"`, error);
    return '';
  }
};
