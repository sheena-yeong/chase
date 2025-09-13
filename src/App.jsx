import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import KanbanBoard from "./components/KanbanBoard";
import Chaser from "./components/Chaser";

function App() {
  const [channel, setChannel] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSendMessage = async () => {
    try {
      const res = await fetch("http://localhost:3001/slack/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel,
          text: message,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("✅ Message sent successfully!");
      } else {
        setStatus(`❌ Slack error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ error: ${error.message}`);
    }
  };

  const handleViewTasks = async () => {
    try {
      const res = await fetch("http://localhost:3001/airtable/tasks");

      if (!res.ok)
        throw new Error("Failed to fetch records from Airtable Tasks");

      const data = await res.json();
      console.log("This was fetched from airtable", data);
    } catch (error) {
      setStatus(`❌ error: ${error.message}`);
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
      <Body
        channel={channel}
        message={message}
        setChannel={setChannel}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        status={status}
      />
      <Chaser />
      <KanbanBoard 
      setTasks={setTasks}
      tasks={tasks}
      />
    </>
  );
}

export default App;
