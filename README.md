# Chase - Kanban Task Manager

A web-based Kanban board built with **React (Vite)** and deployed on **Railway**. It provides a simple drag-and-drop interface for managing tasks across customizable columns.<br>
Visit the live application: https://outstanding-abundance-production.up.railway.app/

<p align="center">
  <img src="client/src/assets/chase_logo.png" alt="Chase Logo" width="200" />
</p>

## Features

**Task Management**

- Create, Edit, and Delete Tasks - Easily manage your tasks with a clean, intuitive interface
- Drag and Drop - Move tasks between columns (To Do, In Progress, Done) with smooth drag-and-drop functionality
- Assign to Users - Link tasks to team members pulled directly from your Slack workspace
- Chase Users - Click a button to send formatted task details to the assignee via Chase bot DM
- Refine Chase Message with AI - Hover on the Chase button to access options to customise your message, or use the help of AI to refine it
- Task Summary - Generate and send a comprehensive summary of all tasks assigned to a specific user with one click

**Data & Integration**

- Persistent Storage - All tasks are saved via backend API connected to Airtable
- Slack Integration - Send task updates directly to users with one tap
  - Send individual task notifications
  - Share daily/weekly task summaries
  - Direct messaging to assigned team members

## Screenshots
**Kanban Board**: Drag and drop tasks between columns

<img src="client/src/assets/Screenshots/Drag_and_Drop.png" alt="Task being dragged and dropped to another column" width="1024" />

**Slack Directory**: View all team members and send task summaries via Slack

<img src="client/src/assets/Screenshots/Slack_Directory.png" alt="A table of active Slack users" width="1024" />

**Task Details**: Create and edit tasks with assignee selection

<img src="client/src/assets/Screenshots/Task_Details.png" alt="A pop-up modal with task details" width="1024" />

**Slack Integration**: Chase bot sends formatted task messages and summaries to assignees with one tap

<img src="client/src/assets/Screenshots/Click_Chase_Btn.png" alt="Clicking on Chase button in App" width="1024" />

<img src="client/src/assets/Screenshots/Slack_Message.png" alt="Messages in Slack featuring the message from Chase bot" width="1024" />

**AI Integration**: Draft chaser messages with one click
<img width="514" height="631" alt="Screenshot 2025-11-23 at 10 01 15" src="https://github.com/user-attachments/assets/7b8c5445-3261-4d8b-a182-2aa7c4d9f70e" />

## Attributions

- [React Icons](https://react-icons.github.io/react-icons/) (`react-icons/fa`)
- [Radix UI Toast](https://www.radix-ui.com/primitives/docs/components/toast)
- [Headless UI](https://headlessui.com/)
- [React DnD](https://react-dnd.github.io/react-dnd/about)

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS + ReactDnD
- **Backend:** Node.js + Express.js
- **Database:** Airtable
- **APIs:** Slack API, Gemini API
- **Deployment**: Railway

## Next Steps
- TypeScript: Run program in TypeScript instead
- OAuth: Add OAuth and have individual boards for each user
- Redis caching: Cache frequently accessed data (tasks, users) to reduce Airtable API calls
- Database migration: Move from Airtable to PostgreSQL/MongoDB for more control and scalability
