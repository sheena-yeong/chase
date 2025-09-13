import KanbanColumn from "./KanbanColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function KanbanBoard({ tasks, setTasks }) {
  const columns = ["Chased", "Backlog", "In Progress", "Done"];

  const handleMoveTask = async (taskId, newColumn) => {
    const originalTasks = [...tasks];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, fields: { ...task.fields, Column: newColumn } }
          : task
      )
    );
    try {
      const res = await fetch(
        `http://localhost:3001/airtable/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Column: newColumn,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to update task: ${res.status} ${res.statusText}`
        );
      }
      const updatedRecord = await res.json();
      console.log("Task updated successfully", updatedRecord);

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedRecord : task))
      );
    } catch (error) {
      console.error("Failed to update task:", error);

      setTasks(originaltasks);
    }
  };
}

return (
  <div className="board">
    <DndProvider backend={HTML5Backend}>
      {columns.map((column, index) => (
        <KanbanColumn
          setTasks={setTasks}
          key={index}
          title={column}
          tasks={tasks.filter((task) => task.fields.Column === column)}
          onMoveTask={handleMoveTask}
        />
      ))}
    </DndProvider>
  </div>
);

export default KanbanBoard;
