import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { addTask } from "../../services/tasks";

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
      ref={drop} // This makes the column a drop zone
      className="kanban-column"
    >
      <p className="column-title">{title}</p>
      <button
        className="add-task-btn"
        onClick={() => setshowAddNewTask((s) => !s)}
      >
        +
      </button>

      {showAddNewTask && (
        <div className="task-card add-task-card">
          <form
            onSubmit={(e) => handleSubmit(e, title)}
            className="add-task-form"
          >
            <input
              placeholder="Task"
              name="Task"
              value={newTask.Task}
              onChange={handleInputChange}
            />
            <textarea
              placeholder="Description"
              name="Description"
              value={newTask.Description}
              onChange={handleInputChange}
            />
            <input
              placeholder="Deadline"
              type="date"
              name="Deadline"
              value={newTask.Deadline}
              onChange={handleInputChange}
            />
            <div className="add-task-actions">
              <button className="bg-orange-300">Add</button>
              <button className="bg-orange-300" onClick={() => setshowAddNewTask(false)}>Cancel</button>
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
