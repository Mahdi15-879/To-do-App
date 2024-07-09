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

export interface SortableItemProps {
  todo: Todo;
  addChild: (parentId: string, text: string) => void;
  editTodo: (id: string, newText: string) => void;
  removeTodo: (id: string) => void;
  index: number;
}

export interface SortableListContainerProps {
  children?: React.ReactNode;
  onSortEnd: ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => void;
}