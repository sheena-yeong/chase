import { useState, useEffect } from "react";
import NavBar from "./components/NavBar/NavBar";
import Body from "./components/Body";
import KanbanBoard from "./components/Body/KanbanBoard";
import Chaser from "./components/Chaser";
import SideBar from "./components/SideBar/SideBar";
import NewTask from "./components/NewTask";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log("useEffect is running!");
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3001/airtable/tasks");

        if (!res.ok)
          throw new Error("Failed to fetch records from Airtable Tasks");

        const data = await res.json();
        console.log("Fetched via useEffect from Airtable", data);
        setTasks(data);
      } catch (error) {
        setStatus(`❌ error: ${error.message}`);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="font-[Avenir]">
        <NavBar />
        <div className="app-container">
          <SideBar />
          <div className="kanban-board">
            <KanbanBoard
              setTasks={setTasks}
              tasks={tasks}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
