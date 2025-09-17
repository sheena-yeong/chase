// import Draggable from "react-draggable"; // react-draggable uses findDOMNode, which has been deprecated in React 18's StrictMode
import { useState } from "react";
import { useDrag } from "react-dnd";
import { handleSendMessage } from "../../services/tasks";
import { deleteTask } from "../../services/tasks";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// Individual draggable card component
function TaskCard({ task, setTasks, message, channel, setMessage, setChannel }) {
  const [{ isDragging }, drag] = useDrag({
    // returns a "drag ref" functino that you attach to the element you want draggable
    type: "TASK", // A category that i define. useDrop must accept 'TASK' for the drop to work
    item: { id: task.id, task }, // the payload - the data carried with the draggable item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete(e, taskId) {
    e.preventDefault();
    console.log(taskId);

    try {
      // call your delete API
      await deleteTask(taskId);

      // remove it from state
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      // close modal
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  return (
    <div
      ref={drag}
      className="task-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      onClick={() => setIsOpen(true)}
    >
      <div className="task-content">
        <p className="task-title">{task.fields.Task}</p>
        <p className="task-deadline">
          {new Date(task.fields.Deadline).toLocaleDateString("en-GB")}
        </p>
      </div>

      {task.fields.Column === "Waiting on others" && (
        <button
          className="action-btn"
          aria-label="Send message"
          onClick={(e) => {
            e.stopPropagation();
            handleSendMessage(task.fields.Task, task.fields.Description);
          }}
        >
          🪿
        </button>
      )}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-white p-12 rounded-xl min-w-100">
            <DialogTitle className="font-bold">{task.fields.Task}</DialogTitle>
            <Description>
              Due by:{" "}
              {new Date(task.fields.Deadline).toLocaleDateString("en-GB")}
            </Description>
            <Description>Description: {task.fields.Description}</Description>
            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={(e) => handleDelete(e, task.id)}>
                Delete
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default TaskCard;
