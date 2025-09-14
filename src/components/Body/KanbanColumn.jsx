import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

function KanbanColumn({
  title,
  tasks,
  onMoveTask,
  handleSendMessage,
  channel,
  message,
  setChannel,
  setMessage,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "TASK", // Must match the type from TaskCard's useDrag
    drop: (draggedItem) => {
      // draggedItem contains { id: task.id, task: taskObject }

      if (draggedItem.task.fields.Column !== title) {
        onMoveTask(draggedItem.id, title);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Is something hovering over this column?
      canDrop: monitor.canDrop(), // Can this column accept what's being dragged?
    }),
  });

  return (
    <div
      ref={drop} // This makes the column a drop zone
      className="column"
    >
      {title}
      {/* FIXED: Map over tasks array and render individual TaskCard components */}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          handleSendMessage={handleSendMessage}
          channel={channel}
          message={message}
          setChannel={setChannel}
          setMessage={setMessage}
        />
      ))}

      {/* Show drop hint when empty */}
      {tasks.length === 0 && isOver && (
        <div
          style={{
            textAlign: "center",
            color: "#666",
            marginTop: "20px",
            fontStyle: "italic",
          }}
        >
          Drop task here
        </div>
      )}
    </div>
  );
}

export default KanbanColumn;
