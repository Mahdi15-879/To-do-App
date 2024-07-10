import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  TodoItemProps,
  SortableItemProps,
  SortableListContainerProps,
  IOnSortEndParams,
} from "../../utils/index.type";
import * as Yup from "yup";
import Icon from "./Icon";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { onSortEnd } from "../../utils/helpers";

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const SortableItem = SortableElement<SortableItemProps>(
  ({
    addChild,
    editTodo,
    removeTodo,
    level,
    id,
    text,
    children,
    todos,
    setTodos,
  }: SortableItemProps) => (
    <TodoItem
      id={id ? id : ""}
      text={text ? text : ""}
      children={children ? children : []}
      onAddChild={addChild}
      onEdit={editTodo}
      onRemove={removeTodo}
      level={level}
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

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  children = [],
  onAddChild,
  onEdit,
  onRemove,
  level = 1,
  todos,
  setTodos,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-2 border rounded-lg overflow-hidden bg-white">
      {isEditing ? (
        <Formik
          initialValues={{ text }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onEdit(id, values.text);
            setIsEditing(false);
          }}
        >
          {({ isValid }) => (
            <Form className="w-full p-2 flex items-center justify-between border rounded-md overflow-hidden">
              <Field
                name="text"
                className="w-full text-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={!isValid}
                className={`text-green-500 ${
                  !isValid && "opacity-50 cursor-not-allowed"
                }`}
              >
                <Icon icon="TickSquare" className="pointer-events-none" />
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex justify-between items-center border rounded-md overflow-hidden p-2 bg-[#e4e4ed57]">
          <span className="text-black">{text}</span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-500"
            >
              <Icon icon="Edit" className="pointer-events-none" />
            </button>
            <button onClick={() => onRemove(id)} className="text-red-500">
              <Icon icon="Trash" className="pointer-events-none" />
            </button>
          </div>
        </div>
      )}

      {level < 3 && (
        <Formik
          initialValues={{ text: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onAddChild(id, values.text);
            resetForm();
          }}
        >
          {({ isValid }) => (
            <Form className="w-full p-2 flex items-center justify-between border rounded-md overflow-hidden mt-2">
              <Field
                name="text"
                placeholder="Add child"
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
      )}

      <SortableListContainer
        onSortEnd={({ oldIndex, newIndex }) =>
          onSortEnd({
            todos,
            setTodos,
            oldIndex,
            newIndex,
            parentId: id,
          } as IOnSortEndParams)
        }
        className="mt-2 flex flex-col gap-2"
      >
        {children.map((todo, index) => (
          <SortableItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            children={todo.children}
            index={index}
            level={level + 1}
            addChild={onAddChild}
            editTodo={onEdit}
            removeTodo={onRemove}
            todos={todos}
            setTodos={setTodos}
          />
        ))}
      </SortableListContainer>
    </div>
  );
};

export default TodoItem;
