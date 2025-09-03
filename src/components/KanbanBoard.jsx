import KanbanColumn from "./KanbanColumns"

function KanbanBoard() {
  const items = ['Chased', 'Backlog', 'In Progress', 'Done'];

  return (
    <div className="board">
      {items.map((item, index) => (
        <KanbanColumn key={index} title={item}/>
      ))}
    </div>
  )
}

export default KanbanBoard