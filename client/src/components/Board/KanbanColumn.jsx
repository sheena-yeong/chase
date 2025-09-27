import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import { addTask } from "../../services/services";
import { FaExclamationCircle } from "react-icons/fa";
import * as Toast from "@radix-ui/react-toast";

function KanbanColumn({ title, tasks, setTasks, onMoveTask, users }) {
  const [showAddNewTask, setshowAddNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    Task: "",
    Description: "",
    Deadline: "",
    Assignee: "",
  });

  const [cardMessage, setCardMessage] = useState("");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "TASK", // Must match the type from TaskCard's useDrag
    drop: (draggedItem) => {
      // draggedItem contains { id: task.id, task: taskObject }

      if (draggedItem.task.fields.Column !== title) {
        onMoveTask(tasks, setTasks, draggedItem.id, title);
      }

      if (title === "Waiting on others") {
        setIsDialogOpen(true);
        setCardMessage("Please select an assignee.");
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
    if (
      !newTask.Task ||
      !newTask.Description ||
      !newTask.Deadline
    ) {
      setToastMessage("All fields are required!");
      setToastOpen(true);
      setToastColor("bg-red-200");
      return;
    }
    setToastMessage("Adding Task...");
    setToastOpen(true);
    setToastColor("bg-orange-100");

    const newTaskToSend = { ...newTask, Column: columnTitle };
    console.log("Submitting to Airtable:", newTaskToSend);
    const createdTask = await addTask(newTaskToSend);
    setTasks((prev) => [...prev, createdTask]);
    setshowAddNewTask(false);
    setNewTask({ Task: "", Description: "", Deadline: "", Assignee: "" });
    setToastMessage("Task added successfully!");
    setToastOpen(true);
    setToastColor("bg-green-100");
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
            className="flex flex-col gap-2 w-full"
          >
            <input
              placeholder="Task"
              name="Task"
              value={newTask.Task}
              className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              onChange={handleInputChange}
              maxLength={100}
            />
            <textarea
              placeholder="Description"
              name="Description"
              value={newTask.Description}
              className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              onChange={handleInputChange}
              maxLength={1000}
            />
            <input
              placeholder="Deadline"
              type="date"
              name="Deadline"
              value={newTask.Deadline}
              className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              max="2050-12-31"
            />
            {title === "Waiting on others" && (
              <select
                name="Assignee"
                value={newTask.Assignee}
                onChange={handleInputChange}
                className="border border-[#e1e8ed] rounded-md p-2 text-[0.95rem]"
              >
                <option value="" disabled>
                  Select Assignee
                </option>
                {users
                  .filter(
                    (user) =>
                      !user.is_bot && !user.deleted && user.id !== "USLACKBOT"
                  )
                  .map((user) => (
                    <option key={user.id} value={user.real_name}>
                      {user.real_name}
                    </option>
                  ))}
              </select>
            )}
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
          users={users}
          setToastOpen={setToastOpen}
          setToastMessage={setToastMessage}
          setToastColor={setToastColor}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          cardMessage={cardMessage}
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
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`${toastColor} text-black rounded-lg p-1 flex items-center space-x-2 shadow-lg w-72 pointer-events-auto animate-slide-in`}
          duration={4000}
        >
          <FaExclamationCircle className="text-black w-5 h-5 ml-2" />
          <Toast.Description>{toastMessage}</Toast.Description>
          <Toast.Close className="ml-auto font-bold text-black">×</Toast.Close>
        </Toast.Root>

        <Toast.Viewport className="fixed top-6 right-4 flex flex-col gap-2 z-50" />
      </Toast.Provider>
    </div>
  );
}

export default KanbanColumn;
