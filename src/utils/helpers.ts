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
  setTodos &&
    todos &&
    setTodos([...todos, { id: uuidv4(), text, children: [] }]);
};

export const editTodo = ({ todos, setTodos, id, newText }: IEditTodoParams) => {
  const editHelper = (items: Todo[]): Todo[] =>
    items.map((item) =>
      item.id === id
        ? { ...item, text: newText }
        : { ...item, children: editHelper(item.children || []) }
    );
  setTodos && todos && setTodos(editHelper(todos));
};

export const removeTodo = ({ todos, setTodos, id }: IRemoveTodoParams) => {
  const removeHelper = (items: Todo[]): Todo[] =>
    items
      .map((item) => ({
        ...item,
        children: removeHelper(item.children || []),
      }))
      .filter((item) => item.id !== id);
  setTodos && todos && setTodos(removeHelper(todos));
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
  setTodos && todos && setTodos(addHelper(todos));
};

const sortHelper = (
  items: Todo[],
  oldIndex: number,
  newIndex: number
): Todo[] => {
  return arrayMove(items, oldIndex, newIndex);
};

const nestedSortHelper = (
  items: Todo[],
  parentId: string,
  oldIndex: number,
  newIndex: number
): Todo[] => {
  return items.map((item) =>
    item.id === parentId
      ? {
          ...item,
          children: sortHelper(item.children || [], oldIndex, newIndex),
        }
      : {
          ...item,
          children: nestedSortHelper(
            item.children || [],
            parentId,
            oldIndex,
            newIndex
          ),
        }
  );
};

export const onSortEnd = ({
  todos,
  setTodos,
  oldIndex,
  newIndex,
  parentId,
}: IOnSortEndParams) => {
  let newTodos = todos;
  if (parentId) {
    newTodos = nestedSortHelper(todos, parentId, oldIndex, newIndex);
  } else {
    newTodos = sortHelper(todos, oldIndex, newIndex);
  }
  setTodos && newTodos && setTodos(newTodos);
};
