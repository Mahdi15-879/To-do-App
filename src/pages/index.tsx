import TodoList from "@/app/components/TodoList";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <TodoList />
    </div>
  );
};

export default Home;
