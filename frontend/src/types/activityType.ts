export type ActivityType = {
  id: number;
  name: string;
  position: number;
};

export type ActivityResponseType = {
  id: number;
  name: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  position: number;
};
