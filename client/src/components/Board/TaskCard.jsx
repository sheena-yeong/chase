// import Draggable from "react-draggable"; // react-draggable uses findDOMNode, which has been deprecated in React 18's StrictMode
import { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { handleSendMessage, handleUpdateTask } from "../../services/services";
import { deleteTask } from "../../services/services";
import { FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// Individual draggable card component
function TaskCard({
  tasks,
  task,
  setTasks,
  users,
  setToastOpen,
  setToastMessage,
  setToastColor,
  isDialogOpen,
  setIsDialogOpen,
  cardMessage,
}) {
  const [{ isDragging }, drag] = useDrag({
    // returns a "drag ref" functino that you attach to the element you want draggable
    type: "TASK", // A category that i define. useDrop must accept 'TASK' for the drop to work
    item: { id: task.id, task }, // the payload - the data carried with the draggable item
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [title, setTitle] = useState(task.fields.Task);
  const [deadline, setDeadline] = useState(task.fields.Deadline);
  const [description, setDescription] = useState(task.fields.Description);
  const [assignee, setAssignee] = useState(task.fields.Assignee || "");
  const [assigneeId, setAssigneeId] = useState("");

  const findUserIdByName = (realName) => {
    const user = users.find((user) => user.real_name === realName);
    return user ? user.id : null;
  };

  async function handleDelete(e, taskId) {
    e.preventDefault();
    console.log(taskId);
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
    setToastMessage("Task deleted successfully!");
    setToastOpen(true);
    setToastColor("bg-green-100");
  }

  function handleUpdate() {
    if (!title || !description || !deadline) {
      return;
    }
    handleUpdateTask(
      tasks,
      setTasks,
      task.id,
      title,
      deadline,
      description,
      assignee
    );
    setIsDialogOpen(false);
    setToastMessage("Task updated");
    setToastOpen(true);
    setToastColor("bg-green-100");
  }

  const resetFormData = () => {
    setTitle(task.fields.Task);
    setDeadline(task.fields.Deadline);
    setDescription(task.fields.Description);
    setAssignee(task.fields.Assignee || "");
  };

  useEffect(() => {
    setTitle(task.fields.Task);
    setDeadline(task.fields.Deadline);
    setDescription(task.fields.Description);
    setAssignee(task.fields.Assignee);
    if (task.fields.Assignee) {
      const userId = findUserIdByName(task.fields.Assignee);
      setAssigneeId(userId);
    }
  }, [task, users]);

  return (
    <div
      ref={drag}
      className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-[#e1e8ed] flex justify-between items-start transition duration-200 ease-in-out hover:shadow-md hover:-translate-y-[1px] cursor-pointer"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      onClick={() => setIsDialogOpen(true)}
    >
      <div className="flex flex-col">
        <p className="font-semibold m-0">{task.fields.Task}</p>
        <p className="text-sm text-gray-600 mt-1 mb-0">
          Due: {new Date(task.fields.Deadline).toLocaleDateString("en-GB")}
        </p>
        {task.fields.Column === "Waiting on others" && (
          <p className="text-sm text-gray-600 mt-1 mb-0">
            Waiting on: {task.fields.Assignee}
          </p>
        )}
      </div>

      {task.fields.Column === "Waiting on others" && (
        <button
          className="bg-[#e7edff] rounded px-3 py-1 text-xs cursor-pointer transition-colors duration-200 ml-2 active:translate-y-[1px]"
          aria-label="Send message"
          onClick={(e) => {
            e.stopPropagation();
            const currentAssigneeId = findUserIdByName(task.fields.Assignee);
            handleSendMessage(
              task.fields.Task,
              task.fields.Description,
              currentAssigneeId
            );
          }}
        >
          🪿
        </button>
      )}

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          if (task.fields.Column === "Waiting on others" && !assignee) return;
          resetFormData();
          setIsDialogOpen(false);
        }}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-white p-12 rounded-xl min-w-100">
            <div className="relative">
              <label>
                Task:
                <input
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded border p-2"
                />
              </label>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-xl absolute left-101 bottom-10 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <label>
              Deadline
              <input
                type="date"
                value={deadline?.slice(0, 10)} // Airtable returns ISO string
                min={new Date().toISOString().split("T")[0]}
                max="2050-12-31"
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded border p-2 mb-4"
              />
            </label>
            <label>
              Description:{" "}
              <textarea
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border p-2"
              />
            </label>
            <label>
              {task.fields.Column === "Waiting on others" && (
                <>
                  Assignee:{" "}
                  <select
                    value={assignee || ""}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      setAssignee(selectedName);
                      const userID = findUserIdByName(selectedName);
                      setAssigneeId(userID);
                    }}
                    className="w-full rounded border p-2 mb-1"
                  >
                    <option value="" disabled>Select Assignee</option>
                    {users
                      .filter(
                        (user) =>
                          !user.is_bot &&
                          !user.deleted &&
                          user.id !== "USLACKBOT"
                      )
                      .map((user) => (
                        <option key={user.id} value={user.real_name}>
                          {user.real_name}
                        </option>
                      ))}
                  </select>
                  <div className="text-red-500 m-0">{cardMessage || ""}</div>
                </>
              )}
            </label>
            <div className="flex gap-4 justify-end">
              <button onClick={handleUpdate} className="bg-green-200">
                <FaCheckCircle />
              </button>
              <button
                onClick={(e) => handleDelete(e, task.id)}
                className="bg-red-200"
              >
                <FaTrashAlt />
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default TaskCard;
