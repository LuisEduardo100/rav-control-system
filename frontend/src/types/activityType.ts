export interface ActivityType {
  id: number;
  name: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  position: number;
  groupId: number;
}

export interface ActivityResponseType {
  id: number;
  name: string;
  description: string | null;
  dueDate: string | null;
  completed: boolean;
  position: number;
}

export interface CreateActivityRequestDTO {
  name: string;
  groupId: number;
  description?: string;
}

export interface UpdateActivityRequestDTO {
  name?: string;
  description?: string;
  dueDate?: string | null;
  completed?: boolean;
}

export interface MoveActivityRequestDTO {
  targetGroupId: number;
  newPosition: number;
}
