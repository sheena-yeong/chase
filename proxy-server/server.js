const express = require("express");
const cors = require("cors");
require("dotenv").config();

const SLACK_BASE_URL = "https://slack.com/api";
const AIRTABLE_BASE_URL = "https://api.airtable.com/v0";
const PORT = process.env.PORT;

const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://outstanding-abundance-production.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(express.json()); //automatically parse JSON request bodies into JavaScript objects

/************************  Slack Routes ************************/
app.get("/", (req, res) => {
  res.send("Proxy server is running! Hello Railway!");
});

app.post("/slack/send", async (req, res) => {
  try {
    const { channel, text } = req.body;

    if (!channel || !text) {
      return res.status(400).json({ error: "Channel and text are required" });
    }

    if (channel.startsWith("U")) {
      const dmRes = await fetch(SLACK_BASE_URL + "/conversations.open", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ users: channel }),
      });

      const dmData = await dmRes.json();

      if (!dmData.ok) {
        throw new Error("Failed to open conversation", dmData.error);
      }
    }

    const response = await fetch(SLACK_BASE_URL + "/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ channel, text }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/slack/users", async (req, res) => {
  try {
    const response = await fetch(SLACK_BASE_URL + "/users.list?limit=200", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    });
    const data = await response.json();

    if (!data.ok) {
      throw new Error("Error fetching users");
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/************************  Air Table Routes ************************/
app.get("/airtable/tasks", async (req, res) => {
  try {
    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${
        process.env.AIRTABLE_BASE_ID
      }/${encodeURIComponent("Tasks")}?maxRecords=100&view=Grid%20view`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Get the error body from Airtable
      const errorBody = await response.text();
      console.error("Airtable Error Body:", errorBody);

      throw new Error(
        `HTTP error, status: ${response.status}, body: ${errorBody}`
      );
    }

    const data = await response.json();
    const records = data.records.map((r) => ({ id: r.id, fields: r.fields }));
    res.json(records);
  } catch (error) {
    console.error("Error fetching code", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/airtable/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${
        process.env.AIRTABLE_BASE_ID
      }/${encodeURIComponent("Tasks")}/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error ${response.status}`);
    }

    const updatedRecord = await response.json();
    res.json(updatedRecord);
  } catch (error) {
    console.log("Proxy server error", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.post("/airtable/tasks", async (req, res) => {
  try {
    const { Column, Task, Description, Deadline, Assignee } = req.body;

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${process.env.AIRTABLE_BASE_ID}/Tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Column: Column,
            Task: Task,
            Description: Description,
            Deadline: Deadline,
            Assignee: Assignee,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error ${response.status}`);
    }

    const updatedRecord = await response.json();
    res.json(updatedRecord);
  } catch (error) {
    console.log("Proxy server error", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.delete("/airtable/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${
        process.env.AIRTABLE_BASE_ID
      }/Tasks/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Airtable API error ${response.status}`);
    }
    res.status(200).json({ id });
  } catch (error) {
    console.log("Proxy server error", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

/************************  Gemini Routes ************************/
app.post("/gemini", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") return;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful assistant that refines Slack messages that are drafted to be sent to someone who needs to complete the task that will be appended below this message. Please refine the following message: "${message}". Respond back with nothing but the message, with no quotation marks and in a format that is ready to be sent. Use a little bit of sarcasm and light-hearted humour but avoid swear words or NSFW. Cap the character limit at 200.`,
    });

    const refinedText = response.text;

    console.log("✨ Refined text:", refinedText);
    res.json({ refinedMessage: refinedText });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    console.error("❌ Error message:", error.message);
    res.status(500).json({
      error: "Failed to refine message with Gemini",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server running on https://chase-production-b8db.up.railway.app/`
  );
});
