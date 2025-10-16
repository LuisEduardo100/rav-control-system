import { format, parseISO, isValid, startOfDay } from 'date-fns';

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

export const isStringAValidDate = (
  dateString: string | null | undefined
): boolean => {
  if (!dateString) {
    return true;
  }
  return isValid(parseISO(dateString));
};

export const isDateInTheFutureOrToday = (
  dateString: string | null | undefined
): boolean => {
  if (!dateString) {
    return true;
  }

  const date = parseISO(dateString);
  if (!isValid(date)) {
    return false;
  }
  return startOfDay(date) >= startOfDay(new Date());
};
