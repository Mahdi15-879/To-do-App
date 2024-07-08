"use client";
import React from "react";
import TodoItem from "./TodoItem";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./index.type";
import { Formik, Form, Field } from "../../../node_modules/formik/dist";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocalStorage } from "../hooks/useLocalStorage";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

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

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="mt-4"
            >
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4"
                    >
                      <TodoItem
                        id={todo.id}
                        text={todo.text}
                        children={todo.children}
                        onAddChild={addChild}
                        onEdit={editTodo}
                        onRemove={removeTodo}
                        level={1}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
