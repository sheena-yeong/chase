import KanbanColumn from "./KanbanColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import { handleMoveTask } from "../../services/tasks";

function KanbanBoard({ tasks, setTasks }) {
  const columns = ["Waiting on others", "Not Started", "In Progress", "Done"];
  const [channel, setChannel] = useState("C09CQ4J6NLF");
  const [message, setMessage] = useState("");

  return (
    <div className="kanban-board">
      <DndProvider backend={HTML5Backend}>
        {columns.map((column, index) => (
          <KanbanColumn
            setTasks={setTasks}
            key={index}
            title={column}
            tasks={tasks.filter((task) => task.fields.Column === column)}
            onMoveTask={handleMoveTask}
            channel={channel}
            message={message}
            setChannel={setChannel}
            setMessage={setMessage}
          />
        ))}
      </DndProvider>
    </div>
  );
}

export default KanbanBoard;
