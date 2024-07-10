import { v4 as uuidv4 } from "uuid";
import {
  Todo,
  IAddTodoParams,
  IEditTodoParams,
  IRemoveTodoParams,
  IAddChildParams,
  IOnSortEndParams,
} from "./index.type";
import { arrayMoveImmutable as arrayMove } from "array-move";

export const addTodo = ({ todos, setTodos, text }: IAddTodoParams) => {
  setTodos([...todos, { id: uuidv4(), text, children: [] }]);
};

export const editTodo = ({ todos, setTodos, id, newText }: IEditTodoParams) => {
  const editHelper = (items: Todo[]): Todo[] =>
    items.map((item) =>
      item.id === id
        ? { ...item, text: newText }
        : { ...item, children: editHelper(item.children || []) }
    );
  setTodos(editHelper(todos));
};

export const removeTodo = ({ todos, setTodos, id }: IRemoveTodoParams) => {
  const removeHelper = (items: Todo[]): Todo[] =>
    items
      .map((item) => ({
        ...item,
        children: removeHelper(item.children || []),
      }))
      .filter((item) => item.id !== id);
  setTodos(removeHelper(todos));
};

export const addChild = ({
  todos,
  setTodos,
  parentId,
  text,
}: IAddChildParams) => {
  const addHelper = (items: Todo[]): Todo[] =>
    items.map((item) =>
      item.id === parentId
        ? {
            ...item,
            children: [
              ...(item.children || []),
              { id: uuidv4(), text, children: [] },
            ],
          }
        : { ...item, children: addHelper(item.children || []) }
    );
  setTodos(addHelper(todos));
};

export const onSortEnd = ({
  todos,
  setTodos,
  oldIndex,
  newIndex,
}: IOnSortEndParams) => {
  const newTodos = arrayMove(todos, oldIndex, newIndex);
  setTodos(newTodos);
};
