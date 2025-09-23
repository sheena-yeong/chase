import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { addTask } from "../../services/services";

function KanbanColumn({
  title,
  tasks,
  setTasks,
  onMoveTask,
  loadTasks,
  channel,
  message,
  setChannel,
  setMessage,
}) {
  const [showAddNewTask, setshowAddNewTask] = useState(false);
  const [newTask, setNewTask] = useState([]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "TASK", // Must match the type from TaskCard's useDrag
    drop: (draggedItem) => {
      // draggedItem contains { id: task.id, task: taskObject }

      if (draggedItem.task.fields.Column !== title) {
        onMoveTask(tasks, setTasks, draggedItem.id, title);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // Is something hovering over this column?
      canDrop: monitor.canDrop(), // Can this column accept what's being dragged?
    }),
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e, columnTitle) {
    e.preventDefault();
    if (!newTask.Task || !newTask.Description || !newTask.Deadline) return;
    const newTaskToSend = { ...newTask, Column: columnTitle };
    const createdTask = await addTask(newTaskToSend);
    setTasks((prev) => [...prev, createdTask]);
    setshowAddNewTask(false);
    setNewTask({ Task: "", Description: "", Deadline: "" });
  }

  return (
    <div
      ref={drop}
      className="bg-[#e8f2ff] text-[#333] rounded-[10px] h-[95%] flex-1 min-w-[280px] p-[15px] border border-[#d0d7de] flex flex-col gap-[10px] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <p className="text-[#ff9c0b] m-0 font-semibold text-[20px]">{title}</p>
        <button
          className="bg-transparent border border-dashed px-2"
          onClick={() => setshowAddNewTask((s) => !s)}
        >
          +
        </button>
      </div>

      {showAddNewTask && (
        <div className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-[#e1e8ed] flex justify-between items-start transition duration-200 ease-in-out hover:shadow-md hover:-translate-y-[1px] cursor-pointer add-task-card">
          <form
            onSubmit={(e) => handleSubmit(e, title)}
            className="flex flex-col gap-2 "
          >
            <input
              placeholder="Task"
              name="Task"
              value={newTask.Task}
              className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              onChange={handleInputChange}
            />
            <textarea
              placeholder="Description"
              name="Description"
              value={newTask.Description}
              className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              onChange={handleInputChange}
            />
            <input
              placeholder="Deadline"
              type="date"
              name="Deadline"
              value={newTask.Deadline}
              className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              onChange={handleInputChange}
            />
            <div className="flex gap-2 justify-end">
              <button className="bg-orange-300">Add</button>
              <button
                className="bg-orange-300"
                onClick={(e) => {
                  e.preventDefault();
                  setshowAddNewTask(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard
          tasks={tasks}
          key={task.id}
          task={task}
          setTasks={setTasks}
          channel={channel}
          message={message}
          setChannel={setChannel}
          setMessage={setMessage}
          loadTasks={loadTasks}
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
