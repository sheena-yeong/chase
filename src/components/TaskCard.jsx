// import Draggable from "react-draggable"; // react-draggable uses findDOMNode, which has been deprecated in React 18's StrictMode
import { useDrag } from "react-dnd";

// Individual draggable card component
function TaskCard({ task }) {
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
      className="card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <p>{task.fields.Task}</p>
    </div>
  );
}

export default TaskCard;
