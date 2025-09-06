import TaskCard from "./TaskCard"

function KanbanColumn({ title }) {
  return (
    <>
    <div className="column">{title}
      <TaskCard />
    </div>
    </>
  )
}

export default KanbanColumn