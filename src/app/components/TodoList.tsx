"use client";
import React from "react";
import TodoItem from "./TodoItem";
import { v4 as uuidv4 } from "uuid";
import {
  Todo,
  SortableItemProps,
  SortableListContainerProps,
} from "./index.type";
import { Formik, Form, Field } from "../../../node_modules/formik/dist";
import { useLocalStorage } from "../hooks/useLocalStorage";
import * as Yup from "yup";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const SortableItem = SortableElement<SortableItemProps>(
  ({ todo, addChild, editTodo, removeTodo }: SortableItemProps) => (
    <TodoItem
      id={todo.id}
      text={todo.text}
      children={todo.children}
      onAddChild={addChild}
      onEdit={editTodo}
      onRemove={removeTodo}
      level={1}
    />
  )
);

const SortableListContainer = SortableContainer<SortableListContainerProps>(
  ({ children }: SortableListContainerProps) => {
    return <div>{children}</div>;
  }
);

const TodoList: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: uuidv4(), text, children: [] }]);
  };

  const editTodo = (id: string, newText: string) => {
    const editHelper = (items: Todo[]): Todo[] =>
      items.map((item) =>
        item.id === id
          ? { ...item, text: newText }
          : { ...item, children: editHelper(item.children || []) }
      );
    setTodos(editHelper(todos));
  };

  const removeTodo = (id: string) => {
    const removeHelper = (items: Todo[]): Todo[] =>
      items
        .map((item) => ({
          ...item,
          children: removeHelper(item.children || []),
        }))
        .filter((item) => item.id !== id);
    setTodos(removeHelper(todos));
  };

  const addChild = (parentId: string, text: string) => {
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

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const newTodos = arrayMove(todos, oldIndex, newIndex);
    setTodos(newTodos);
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={{ text: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          addTodo(values.text);
          resetForm();
        }}
      >
        {({ isValid }) => (
          <Form>
            <Field name="text" placeholder="Add todo" className="border p-2" />
            <button
              type="submit"
              disabled={!isValid}
              className={`ml-2 bg-green-500 text-white p-2 rounded ${
                !isValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              Add
            </button>
          </Form>
        )}
      </Formik>
      <SortableListContainer onSortEnd={onSortEnd}>
        {todos.map((todo, index) => (
          <SortableItem
            key={todo.id}
            index={index}
            todo={todo}
            addChild={addChild}
            editTodo={editTodo}
            removeTodo={removeTodo}
          />
        ))}
      </SortableListContainer>
    </div>
  );
};

export default TodoList;
