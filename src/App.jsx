import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import HeaderBar from "./components/HeaderBar/HeaderBar";
import KanbanBoard from "./components/Board/KanbanBoard";
import NavBar from "./components/NavBar/NavBar";
import Users from "./components/SlackDirectory/users";
import { fetchTasks } from "./services/services";

function App() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <HeaderBar />
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="font-[Avenir]">
              <div className="flex h-[calc(100vh-70px)]">
                <div className="flex flex-1 gap-[15px] p-[15px] overflow-x-auto">
                  <KanbanBoard
                    setTasks={setTasks}
                    tasks={tasks}
                    loadTasks={loadTasks}
                  />
                </div>
              </div>
            </div>
          }
        />
        <Route path="/users" element={<Users />}></Route>
      </Routes>
    </>
  );
}

export default App;
