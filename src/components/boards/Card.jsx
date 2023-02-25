import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { v4 as uuid } from "uuid";

const tempColors = { onTrack: 1, atRisk: 2, offTrack: 3 };
const tempColors1 = { high: 1, medium: 2, low: 3 };

export default function Card({
  id,
  status,
  title,
  taskStatus,
  taskPriority,
  assignees,
}) {
  const [onHold, setOnHold] = useState(false);

  const dragStartHandler = (e) => {
    e.dataTransfer.setData("cardInfo", JSON.stringify({ id, status }));
    e.target.className += " ohhold";
    setTimeout(() => {
      setOnHold(true);
    }, 0);
  };
  const dragEndHandler = () => {
    setOnHold(false);
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    if (e.target.className === "card") {
      setTimeout(() => {
        e.target.className = "card anotherCardOnTop";
      }, 0);
    }
  };
  const onDragLeaveHandler = (e) => {
    resetClassName(e);
  };
  const onDropHandler = (e) => {
    resetClassName(e);
    /**  
     TODO: Remove all anotherCardOnTop classnames 
     from DOM after drop complete.
    */
  };

  const resetClassName = (e) => {
    e.preventDefault();
    let isCard =
      e.target.className === "card" ||
      e.target.className === "card anotherCardOnTop";
    if (isCard) {
      setTimeout(() => {
        e.target.className = "card";
      }, 0);
    }
  };

  return (
    <div
      id={id}
      className={`card ${onHold ? "hidden" : ""}`}
      draggable="true"
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
      onDragOver={onDragOverHandler}
      onDragLeave={onDragLeaveHandler}
      onDrop={onDropHandler}
    >
      <div className="cardTitle">{title}</div>
      <div className="cardFooter">
        {taskStatus ? (
          <div className={`label color${tempColors[taskStatus]}`}>
            {taskStatus === "onTrack"
              ? "On track"
              : taskStatus === "atRisk"
              ? "At risk"
              : "Off track"}
          </div>
        ) : (
          <div></div>
        )}
        {/* {taskPriority ? (
          <div className={`label color${tempColors1[taskPriority]}`}>{taskPriority}</div>
        ) : (
          <div></div>
        )} */}

        <div className="collab">
          {assignees.map((elem) => (
            <Image
              draggable="false"
              key={uuid()}
              src={elem.avatar}
              className="collabPerson"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
