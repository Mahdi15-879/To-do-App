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
    <div className="p-2 border rounded">
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
            <Form>
              <Field name="text" className="border p-1" />
              <button
                type="submit"
                disabled={!isValid}
                className={`ml-2 bg-green-500 text-white p-1 rounded ${
                  !isValid && "opacity-50 cursor-not-allowed"
                }`}
              >
                <Icon icon="TickSquare" className="pointer-events-none" />
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex justify-between items-center">
          <span>{text}</span>
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white p-1 rounded mr-2"
            >
              <Icon icon="Edit" className="pointer-events-none" />
            </button>
            <button
              onClick={() => onRemove(id)}
              className="bg-red-500 text-white p-1 rounded"
            >
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
            <Form>
              <Field
                name="text"
                placeholder="Add child"
                className="border p-1 mt-2"
              />
              <button
                type="submit"
                disabled={!isValid}
                className={`ml-2 bg-green-500 text-white p-1 rounded ${
                  !isValid && "opacity-50 cursor-not-allowed"
                }`}
              >
                <Icon icon="AddSquare" className="pointer-events-none" />
              </button>
            </Form>
          )}
        </Formik>
      )}

      <div className="ml-4 mt-2">
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
