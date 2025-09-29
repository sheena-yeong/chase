/* Slack fetches */
export const handleSendMessage = async (
  task,
  description,
  deadline,
  userID
) => {
  const messageFormats = [
    "HONK! This task isn't doing itself:",
    "Waddle over and finish this:",
    "Goose on patrol: finish this ASAP:",
    "(Un)friendly goose reminder: this task is still waddling behind schedule:",
  ];

  const randomMessageFormat =
    messageFormats[Math.floor(Math.random() * messageFormats.length)];

  try {
    const res = await fetch(
      "https://chase-production-b8db.up.railway.app/slack/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: `${userID}`,
          text: `🪿 *${randomMessageFormat}*\nTask: ${task}\nDescription: ${description}\nDue: ${deadline}`,
        }),
      }
    );

    const data = await res.json();

    if (data.ok) {
      console.log("✅ Message sent successfully!");
    } else {
      console.log(`❌ Sending error: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Sending error: ${error.message}`);
  }
};

export const handleSendSummary = async (taskData, userId) => {
  const taskList = taskData
    .map(
      (task) =>
        `• ${task.fields.Task} (Due: ${new Date(
          task.fields.Deadline
        ).toLocaleDateString("en-GB")})`
    )
    .join("\n");

  try {
    const res = await fetch(
      "https://chase-production-b8db.up.railway.app/slack/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: `${userId}`,
          text: `🪿 *HONK! Here is a summary of tasks waiting on you:*\n${taskList}`,
        }),
      }
    );

    const data = await res.json();

    if (data.ok) {
      console.log("✅ Message sent successfully!");
    } else {
      console.log(`❌ Sending error: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Sending error: ${error.message}`);
  }
};

export const fetchSlackUsers = async () => {
  try {
    const res = await fetch(
      "https://chase-production-b8db.up.railway.app/slack/users"
    );
    if (!res.ok) {
      throw new Error("Failed to fetch Slack users");
    }
    return await res.json();
  } catch (error) {
    console.log("Error fetching users from proxy", error.message);
  }
};

/* Airtable fetches */
export const fetchTasks = async () => {
  try {
    const res = await fetch(
      "https://chase-production-b8db.up.railway.app/airtable/tasks"
    );
    if (!res.ok) throw new Error("Failed to fetch records from Airtable Tasks");
    console.log(error.message);
    return res.json();
  } catch (error) {
  }
};

export const addTask = async (newTask) => {
  try {
    const res = await fetch(
      "https://chase-production-b8db.up.railway.app/airtable/tasks",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      }
    );
    const data = await res.json();

    if (data.id) {
      //airtable doesnt return ok property
      console.log("✅ Task added succesfully!", data);
      return data;
    } else {
      console.log(`❌ Task Adding error: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Task Adding: ${error.message}`);
  }
};

export const deleteTask = async (id) => {
  try {
    const res = await fetch(
      `https://chase-production-b8db.up.railway.app/tasks/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      // Backend may not return JSON; just return the deleted ID
      console.log("✅ Task deleted successfully!");
      return { id };
    } else {
      // Attempt to read response as text (fallback if it's HTML)
      const text = await res.text();
      console.log(`❌ Task Deletion error: ${text}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Task Deletion: ${error.message}`);
    return null;
  }
};

export const handleMoveTask = async (tasks, setTasks, taskId, newColumn) => {
  const originalTasks = [...tasks];

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            fields: {
              ...task.fields,
              Column: newColumn,
              Assignee:
                newColumn === "Waiting on others" ? task.fields.Assignee : "",
            },
          }
        : task
    )
  );
  try {
    // Prepare fields to update
    const fieldsToUpdate = { Column: newColumn };

    // Clear assignee in database if moving away from "Waiting on others"
    if (newColumn !== "Waiting on others") {
      fieldsToUpdate.Assignee = "";
    }

    const res = await fetch(
      `https://chase-production-b8db.up.railway.app/airtable/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: fieldsToUpdate,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status} ${res.statusText}`);
    }
    const updatedRecord = await res.json();
    console.log("Task updated successfully", updatedRecord);

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedRecord : task))
    );
  } catch (error) {
    console.error("Failed to update task:", error);
    setTasks(originalTasks);
  }
};

export const handleUpdateTask = async (
  tasks,
  setTasks,
  taskId,
  newTask,
  newDeadline,
  newDescription,
  newAssignee
) => {
  const originalTasks = [...tasks];

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            fields: {
              ...task.fields,
              Task: newTask,
              Deadline: newDeadline,
              Description: newDescription,
              Assignee: newAssignee,
            },
          }
        : task
    )
  );
  try {
    const res = await fetch(
      `https://chase-production-b8db.up.railway.app/airtable/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Task: newTask,
            Deadline: newDeadline,
            Description: newDescription,
            Assignee: newAssignee,
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update task: ${res.status} ${res.statusText}`);
    }
    const updatedRecord = await res.json();
    console.log("Task updated successfully", updatedRecord);

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedRecord : task))
    );
  } catch (error) {
    console.error("Failed to update task:", error);

    setTasks(originalTasks);
  }
};

export const handleOnClose = async (setTasks) => {
  console.log("Closing the task");
  try {
    const res = await fetch(
      "https://chase-production-b8db.up.railway.app/airtable/tasks"
    );

    if (!res.ok) throw new Error("Failed to fetch records from Airtable Tasks");

    const data = await res.json();
    setTasks(data);
  } catch (error) {
    console.log(`❌ error: ${error.message}`);
  }
};
