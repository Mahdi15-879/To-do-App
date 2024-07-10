"use client";
import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import {
  Todo,
  SortableItemProps,
  SortableListContainerProps,
  IAddTodoParams,
  IEditTodoParams,
  IRemoveTodoParams,
  IAddChildParams,
  IOnSortEndParams,
} from "./index.type";
import { Formik, Form, Field } from "formik";
import { useLocalStorage } from "../hooks/useLocalStorage";
import * as Yup from "yup";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import Icon from "./Icon";
import { addTodo, editTodo, removeTodo, addChild, onSortEnd } from "./helpers";

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const SortableItem = SortableElement<SortableItemProps>(
  ({
    todo,
    addChild,
    editTodo,
    removeTodo,
    todos,
    setTodos,
  }: SortableItemProps) => (
    <TodoItem
      id={todo ? todo.id : ""}
      text={todo ? todo.text : ""}
      children={todo ? todo.children : []}
      onAddChild={addChild}
      onEdit={editTodo}
      onRemove={removeTodo}
      level={1}
      todos={todos}
      setTodos={setTodos}
    />
  )
);

const SortableListContainer = SortableContainer<SortableListContainerProps>(
  ({ children, className }: SortableListContainerProps) => {
    return <div className={className}>{children}</div>;
  }
);

const TodoList: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = () => {
      setTimeout(() => {
        const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
        setTodos(storedTodos);
        setLoading(false);
      }, 1000);
    };

    fetchTodos();
  }, []);

  return (
    <div className="w-full mt-4 flex flex-col gap-3">
      <Formik
        initialValues={{ text: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          addTodo({
            todos,
            setTodos,
            text: values.text,
          } as IAddTodoParams);
          resetForm();
        }}
      >
        {({ isValid }) => (
          <Form className="w-full p-2 flex items-center justify-between border rounded-lg overflow-hidden bg-white">
            <Field
              name="text"
              placeholder="Add to-do"
              className="w-full text-black focus:outline-none"
            />
            <button
              type="submit"
              disabled={!isValid}
              className={`text-blue-500 ${
                !isValid && "opacity-50 cursor-not-allowed"
              }`}
            >
              <Icon icon="AddSquare" className="pointer-events-none" />
            </button>
          </Form>
        )}
      </Formik>

      {loading ? (
        <div className="w-full flex items-center justify-center mt-10 mb-4">
          <div className="loader"></div>
        </div>
      ) : (
        <SortableListContainer
          onSortEnd={({ oldIndex, newIndex }) =>
            onSortEnd({
              todos,
              setTodos,
              oldIndex,
              newIndex,
            } as IOnSortEndParams)
          }
          className="flex flex-col gap-3 w-full"
        >
          {todos.map((todo, index) => (
            <SortableItem
              key={todo.id}
              index={index}
              todo={todo}
              todos={todos}
              setTodos={setTodos}
              addChild={(parentId: string, text: string) =>
                addChild({
                  todos,
                  setTodos,
                  parentId,
                  text,
                } as IAddChildParams)
              }
              editTodo={(id: string, newText: string) =>
                editTodo({
                  todos,
                  setTodos,
                  id,
                  newText,
                } as IEditTodoParams)
              }
              removeTodo={(id: string) =>
                removeTodo({
                  todos,
                  setTodos,
                  id,
                } as IRemoveTodoParams)
              }
            />
          ))}
        </SortableListContainer>
      )}
    </div>
  );
};

export default TodoList;
