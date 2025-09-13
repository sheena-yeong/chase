import KanbanColumn from "./KanbanColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function KanbanBoard({ tasks, setTasks }) {
  const items = ["Chased", "Backlog", "In Progress", "Done"];

  const handleMoveTask = (taskId, newColumn) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, fields: { ...task.fields, Column: newColumn } }
          : task
      )
    );
  };

  return (
    <div className="board">
      <DndProvider backend={HTML5Backend}>
        {items.map((item, index) => (
          <KanbanColumn
            setTasks={setTasks}
            key={index}
            title={item}
            tasks={tasks.filter((task) => task.fields.Column === item)}
            onMoveTask={handleMoveTask}
          />
        ))}
      </DndProvider>
    </div>
  );
}

export default KanbanBoard;
