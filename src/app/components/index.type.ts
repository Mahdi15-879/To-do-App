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
  className: string;
  onSortEnd: ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => void;
}

// helpers Interface's definitions
export interface IAddTodoParams {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  text: string;
}

export interface IEditTodoParams {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  id: string;
  newText: string;
}

export interface IRemoveTodoParams {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  id: string;
}

export interface IAddChildParams {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  parentId: string;
  text: string;
}

export interface IOnSortEndParams {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  oldIndex: number;
  newIndex: number;
}