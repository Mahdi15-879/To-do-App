export interface Todo {
  id: string;
  text: string;
  children?: Todo[];
}

export interface TodoItemProps extends Todo {
  onAddChild: (parentId: string, text: string) => void;
  onEdit: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  level?: number;
}
