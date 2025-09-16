// import Draggable from "react-draggable"; // react-draggable uses findDOMNode, which has been deprecated in React 18's StrictMode
import { useDrag } from "react-dnd";
import { handleSendMessage } from "../../services/tasks";

// Individual draggable card component
function TaskCard({
  task,
  message,
  channel,
  setMessage,
  setChannel,
}) {
  const [{ isDragging }, drag] = useDrag({
    // returns a "drag ref" functino that you attach to the element you want draggable
    type: "TASK", // A category that i define. useDrop must accept 'TASK' for the drop to work
    item: { id: task.id, task }, // the payload - the data carried with the draggable item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
  ref={drag}
  className="task-card"
  style={{
    opacity: isDragging ? 0.5 : 1,
    cursor: "move",
  }}
>
  <div className="task-content">
    <p className="task-title">{task.fields.Task}</p>
    <p className="task-deadline">{new Date(task.fields.Deadline).toLocaleDateString("en-GB")}</p>
  </div>

  {task.fields.Column === "Waiting on others" && (
    <button
      className="action-btn"
      aria-label="Send message"
      onClick={() =>
        handleSendMessage(task.fields.Task, task.fields.Description)
      }
    >
      🪿
    </button>
  )}
</div>
  );
}

export default TaskCard;
