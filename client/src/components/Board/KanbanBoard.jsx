import KanbanColumn from "./KanbanColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { handleMoveTask } from "../../services/services";

function KanbanBoard({
  tasks,
  setTasks,
  users,
  setToastOpen,
  setToastMessage,
  setToastColor,
}) {
  const columns = ["Waiting on others", "Not Started", "In Progress", "Done"];

  return (
    <>
      <div className="flex flex-1 gap-[15px] p-[10px] overflow-x-auto bg-white text-black">
        <DndProvider backend={HTML5Backend}>
          {columns.map((column, index) => (
            <KanbanColumn
              setTasks={setTasks}
              key={index}
              title={column}
              tasks={tasks.filter((task) => task.fields.Column === column)}
              onMoveTask={handleMoveTask}
              users={users}
              setToastOpen={setToastOpen}
              setToastMessage={setToastMessage}
              setToastColor={setToastColor}
            />
          ))}
        </DndProvider>
      </div>
    </>
  );
}

export default KanbanBoard;
