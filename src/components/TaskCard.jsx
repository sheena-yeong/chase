// import Draggable from "react-draggable"; // react-draggable uses findDOMNode, which has been deprecated in React 18's StrictMode

import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Individual draggable card component
function DraggableTaskCard({ task }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag}
      className="card"
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      <p>{task.fields.Task}</p>
      <p>Status: {task.fields.Status}</p>
    </div>
  );
}

function TaskCard({ tasks }) {
  console.log("Hi from TaskCard, this is tasks prop-drilled", tasks);
  return (
    <DndProvider backend={HTML5Backend}>
      {tasks.map((task) => (
        <DraggableTaskCard key={task.id} task={task} />
      ))}
    </DndProvider>
  );
}

export default TaskCard;