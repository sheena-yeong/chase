# Chase - Kanban Task Manager

A web-based Kanban board built with **React (Vite)** and deployed on **Railway**. It provides a simple drag-and-drop interface for managing tasks across customizable columns.

<p align="center">
  <img src="client/src/assets/chase_logo.png" alt="Chase Logo" width="200" />
</p>
Visit the live application: https://outstanding-abundance-production.up.railway.app/

## Screenshots
Kanban Board
Drag and drop tasks between columns with individual Slack messaging
<img src="client/src/assets/Screenshots/Drag_and_Drop.png" alt="Task being dragged and dropped to another column" width="1024" />

Slack Directory
View all team members and send task summaries via Slack
<img src="client/src/assets/Screenshots/Slack_Directory.png" alt="A table of active Slack users" width="1024" />

Task Details
Create and edit tasks with assignee selection
<img src="client/src/assets/Screenshots/Task_Details.png" alt="A pop-up modal with task details" width="1024" />

Slack Integration
Chase bot sends formatted task messages and summaries to assignees with one tap
<img src="client/src/assets/Screenshots/Slack_Message.png" alt="Messages in Slack featuring the message from Chase bot" width="1024" />



## Attributions

- [React Icons](https://react-icons.github.io/react-icons/) (`react-icons/fa`)
- [Radix UI Toast](https://www.radix-ui.com/primitives/docs/components/toast)
- [Headless UI](https://headlessui.com/)
- [React DnD](https://react-dnd.github.io/react-dnd/about)

## Features

**Task Management**

- Create, Edit, and Delete Tasks - Easily manage your tasks with a clean, intuitive interface
- Drag and Drop - Move tasks between columns (To Do, In Progress, Done) with smooth drag-and-drop functionality
- Assign to Users - Link tasks to team members pulled directly from your Slack workspace
- Chase Users - Click a button to send formatted task details to the assignee via Chase bot DM
- Task Summary - Generate and send a comprehensive summary of all tasks assigned to a specific user with one click

**Data & Integration**

- Persistent Storage - All tasks are saved via backend API connected to Airtable
- Slack Integration - Send task updates directly to users with one tap
  - Send individual task notifications
  - Share daily/weekly task summaries
  - Direct messaging to assigned team members

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS + ReactDnD
- **Backend:** Node.js + Express.js
- **Database:** Airtable
- **APIs:** Slack API
- **Deployment**: Railway

## Next Steps

-
