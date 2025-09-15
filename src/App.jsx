import { useState, useEffect } from "react";
import NavBar from "./components/NavBar/NavBar";
import Body from "./components/Body";
import KanbanBoard from "./components/Body/KanbanBoard";
import Chaser from "./components/Chaser";
import SideBar from "./components/SideBar/SideBar";
import NewTask from "./components/NewTask";

function App() {
  const [tasks, setTasks] = useState([]);

  const handleSendMessage = async (task, description) => {
    const messageFormats = [
      "HONK! This task isn't doing itself:",
      "Waddle over and finish this:",
      "Goose on patrol: finish this ASAP:",
      "Friendly goose reminder: this task is still waddling behind schedule:",
    ];

    const randomMessageFormat =
      messageFormats[Math.floor(Math.random() * messageFormats.length)];

    try {
      const res = await fetch("http://localhost:3001/slack/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: "C09CQ4J6NLF",
          text: `🪿 *${randomMessageFormat}*\n• ${task} | ${description}`,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        console.log("✅ Message sent successfully!");
      } else {
        console.log(`❌ Sending error: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ Sending error: ${error.message}`);
    }
  };

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
  <NavBar />
  <div className="app-container">
    <SideBar />
    <div className="kanban-board">
      <KanbanBoard
        setTasks={setTasks}
        tasks={tasks}
        handleSendMessage={handleSendMessage}
      />
    </div>
  </div>
</>
  );
}

export default App;
