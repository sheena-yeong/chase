import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import HeaderBar from "./components/HeaderBar/HeaderBar";
import KanbanBoard from "./components/Board/KanbanBoard";
import NavBar from "./components/NavBar/NavBar";
import Users from "./components/SlackDirectory/users";
import { fetchTasks, fetchSlackUsers } from "./services/services";
import * as Toast from "@radix-ui/react-toast";

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");

  const loadTasks = async () => {
  try {
    setToastOpen(true);
    setToastMessage("Retrieving tasks...");
    setToastColor("bg-orange-100");
    const data = await fetchTasks();
    
    if (data && data.length > 0) {
      setTasks(data);
      setToastOpen(false);
    } else {
      setTasks([]);
      setToastMessage("Unable to load tasks. Using offline mode.");
      setToastColor("bg-red-100");
    }
  } catch (error) {
    console.error("Error:", error.message);
    setTasks([]);
    setToastMessage("Error loading tasks");
    setToastColor("bg-red-100");
  }
};

  const loadUsers = async () => {
    try {
      const data = await fetchSlackUsers();
      setUsers(data.members);
    } catch (error) {
      console.error("Failed to load Slack users:", error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  return (
    <>
      <HeaderBar />
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="font-[Avenir]">
              <div className="flex h-[calc(100vh-70px)]">
                <div className="flex flex-1 gap-[15px] p-[15px] overflow-x-auto">
                  <KanbanBoard
                    setTasks={setTasks}
                    tasks={tasks}
                    users={users}
                    setToastOpen={setToastOpen}
                    setToastMessage={setToastMessage}
                    setToastColor={setToastColor}
                  />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/users"
          element={
            <Users
              users={users}
              tasks={tasks}
              setToastOpen={setToastOpen}
              setToastMessage={setToastMessage}
              setToastColor={setToastColor}
            />
          }
        ></Route>
      </Routes>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`${toastColor} text-black rounded-lg p-1 flex items-center space-x-2 shadow-lg w-72 pointer-events-auto animate-slide-in`}
          duration={4000}
        >
          <Toast.Description className="ml-2">{toastMessage}</Toast.Description>
          <Toast.Close className="ml-auto font-bold text-black">×</Toast.Close>
        </Toast.Root>

        <Toast.Viewport className="fixed top-6 right-4 flex flex-col gap-2 z-50" />
      </Toast.Provider>
    </>
  );
}

export default App;
