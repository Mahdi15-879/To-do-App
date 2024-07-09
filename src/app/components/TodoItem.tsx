import React, { useState } from "react";
import { Formik, Form, Field } from "../../../node_modules/formik/dist";
import { TodoItemProps } from "./index.type";
import * as Yup from "yup";
import Icon from "./Icon";

const validationSchema = Yup.object().shape({
  text: Yup.string().required("Text is required"),
});

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  children = [],
  onAddChild,
  onEdit,
  onRemove,
  level = 1,
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

      <div className="mt-2 flex flex-col gap-2">
        {children.map((child) => (
          <TodoItem
            key={child.id}
            id={child.id}
            text={child.text}
            children={child.children}
            onAddChild={onAddChild}
            onEdit={onEdit}
            onRemove={onRemove}
            level={level + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoItem;
