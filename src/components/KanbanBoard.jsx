import KanbanColumn from "./KanbanColumn";

function KanbanBoard({ tasks }) {
  const items = ["Chased", "Backlog", "In Progress", "Done"];

  return (
    <div className="board">
      {items.map((item, index) => (
        <KanbanColumn key={index} title={item} tasks={tasks} />
      ))}
    </div>
  );
}

export default KanbanBoard;
