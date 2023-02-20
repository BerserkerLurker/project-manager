import React from "react";
import { Link } from "react-router-dom";

import Card from "./Card";

export default function Board({ data, title, status, onChange }) {
  // Sort data (Might need useMemo)
  let sorted = data.sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
  );
  // let sorted = data.sort((a, b) => a.order - b.order);

  const onDragEnterHandler = (e) => {
    e.preventDefault();
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    if (e.target.className === "boardContentArea") {
      setTimeout(() => {
        e.target.className = "boardContentArea hovered";
      }, 0);
    }
  };
  const onDragLeaveHandler = (e) => {
    e.preventDefault();
    if (e.target.className === "boardContentArea hovered") {
      setTimeout(() => {
        e.target.className = "boardContentArea";
      }, 0);
    }
  };
  const onDropHandler = (e) => {
    let cardInfo = JSON.parse(e.dataTransfer.getData("cardInfo"));
    let targetCardId = e.target.id;
    onChange(cardInfo, status, targetCardId);
    if (e.target.className === "boardContentArea hovered") {
      setTimeout(() => {
        e.target.className = "boardContentArea";
      }, 0);
    }
  };

  // returns JSX - Render cards
  const renderCards = () => {
    return sorted.map((item) => (
      <Card
        key={`status-${item.taskId}`}
        id={item.taskId}
        status={status}
        title={item.taskName}
        taskStatus={item.status}
        taskPriority={item.priority}
        assignees={item.assignees}
      />
    ));
  };

  return (
    <div className="board-col">
      <div className="list">
        <h4 className="list-title">{title}</h4>
        <div
          className="boardContentArea"
          onDragEnter={onDragEnterHandler}
          onDragOver={onDragOverHandler}
          onDragLeave={onDragLeaveHandler}
          onDrop={onDropHandler}
        >
          {renderCards()}
        </div>
        {/* TODO - add card and create task */}
        <Link to={"/tasks"} className="btn-list">
          + Add another task
        </Link>
      </div>
    </div>
  );
}
