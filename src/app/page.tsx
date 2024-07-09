import dynamic from "next/dynamic";

const TodoList = dynamic(() => import("./components/TodoList"), { ssr: false });

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-2 md:p-4 w-full md:w-[650px] border rounded-xl m-4 overflow-hidden">
      <h1 className="text-2xl font-normal text-black">To-do List</h1>
      <TodoList />
    </div>
  );
};

export default Home;
