import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import HeaderBar from "./components/HeaderBar/HeaderBar";
import KanbanBoard from "./components/Body/KanbanBoard";
import NavBar from "./components/NavBar/NavBar";
import { fetchTasks } from "./services/tasks";

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
              <div className="app-container">
                <div className="kanban-board">
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
      </Routes>
    </>
  );
}

export default App;
