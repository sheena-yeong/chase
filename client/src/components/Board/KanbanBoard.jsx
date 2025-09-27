import KanbanColumn from "./KanbanColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import { handleMoveTask } from "../../services/services";

function KanbanBoard({ tasks, setTasks, loadTasks, users }) {
  const columns = ["Waiting on others", "Not Started", "In Progress", "Done"];
  const [channel, setChannel] = useState("C09CQ4J6NLF");
  const [message, setMessage] = useState("");

  return (
    <>
    <div className="flex flex-1 gap-[15px] p-[10px] overflow-x-auto">
      <DndProvider backend={HTML5Backend}>
        {columns.map((column, index) => (
          <KanbanColumn
          setTasks={setTasks}
          key={index}
          title={column}
          tasks={tasks.filter((task) => task.fields.Column === column)}
          onMoveTask={handleMoveTask}
          users={users}
          />
        ))}
      </DndProvider>
    </div>
        </>
  );
}

export default KanbanBoard;
