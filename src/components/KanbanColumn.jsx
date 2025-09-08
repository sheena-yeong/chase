import TaskCard from "./TaskCard"

function KanbanColumn({ title, tasks }) {
  return (
    <>
    <div className="column">{title}
      <TaskCard tasks={tasks}/>
    </div>
    </>
  )
}

export default KanbanColumn