export const handleSendMessage = async (task, description) => {
  const messageFormats = [
    "HONK! This task isn't doing itself:",
    "Waddle over and finish this:",
    "Goose on patrol: finish this ASAP:",
    "Friendly goose reminder: this task is still waddling behind schedule:",
  ];

  const randomMessageFormat =
    messageFormats[Math.floor(Math.random() * messageFormats.length)];

  try {
    const res = await fetch("http://localhost:3001/slack/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "C09CQ4J6NLF",
        text: `🪿 *${randomMessageFormat}*\n• ${task} | ${description}`,
      }),
    });

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

export const addTask = async (newTask) => {
  try {
    const res = await fetch("http://localhost:3001/airtable/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const data = await res.json();

    if (data.id) {
      //airtable doesnt return ok property
      console.log("✅ Task added succesfully!");
      return data;
    } else {
      console.log(`❌ Task Adding error: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Task Adding: ${error.message}`);
  }
};
