import { useState } from "react";
import NavBar from "./components/NavBar";
import Body from "./components/Body";
import KanbanBoard from "./components/KanbanBoard";
import Chaser from "./components/Chaser";

function App() {
  const [channel, setChannel] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSendMessage = async () => {
    try {
      const res = await fetch("http://localhost:3001/send", {
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
      <KanbanBoard />
    </>
  );
}

export default App;
