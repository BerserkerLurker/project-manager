// Credit -- https://codesandbox.io/s/drag-and-drop-trello-e2zqv

import _ from "lodash";
import React, { useEffect, useState } from "react";
import Board from "../../components/boards/Board";
import useApi from "../../hooks/useApi";

const initialLists = [
  {
    title: "To Do",
    status: "todo",
  },
  {
    title: "In progress",
    status: "doing",
  },
  {
    title: "Done",
    status: "done",
  },
];

// const initialData = {
//   todo: [
//     {
//       id: "qwe1",
//       title: "Card 1",
//       status: "todo",
//       order: 1,
//       label: "UI Dev",
//     },
//     {
//       id: "qwe3",
//       title: "Card 3",
//       status: "todo",
//       order: 2,
//       label: "UI Dev",
//     },
//     {
//       id: "qwe5",
//       title: "Card 5",
//       status: "todo",
//       order: 3,
//       label: "Testing",
//     },
//   ],
//   doing: [
//     {
//       id: "qwe2",
//       title: "Card 2",
//       status: "doing",
//       order: 1,
//       label: "API Integration",
//     },
//   ],
//   done: [
//     {
//       id: "qwe4",
//       title: "Card 4",
//       status: "done",
//       order: 1,
//       label: "Bug Fix",
//     },
//   ],
// };

export default function Boards() {
  // @ts-ignore
  const { tasksList, projectsList, updateTask } = useApi();
  const [lists, setLists] = useState(initialLists);
  const [initialData, setInitialData] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const done = [];
    const doing = [];
    const todo = [];
    tasksList.forEach((task) => {
      if (task.isDone) {
        done.push(task);
      } else if (!task.isDone) {
        if (task.started) {
          doing.push(task);
        } else {
          todo.push(task);
        }
      }
    });
    const dataList = { todo: [...todo], doing: [...doing], done: [...done] };
    setInitialData(dataList);
  }, [tasksList]);

  const handleProjectSelect = (projectId) => {
    // @ts-ignore
    let { todo, doing, done } = initialData;
    if (projectId !== "none") {
      todo = todo.filter((task) => task.projectId === projectId);
      doing = doing.filter((task) => task.projectId === projectId);
      done = done.filter((task) => task.projectId === projectId);
      setData({ todo: [...todo], doing: [...doing], done: [...done] });
    } else {
      setData({});
    }
  };

  // Handle Lists
  // Handle Lists ends here

  // Handle Data
  const cardChangeHandler = (cardInfo, newStatus, targetCardId) => {
    const { id, status: oldStatus } = cardInfo;

    let dropCard = data[oldStatus].find((el) => el.taskId === id);
    let targetCard =
      targetCardId !== ""
        ? data[newStatus].find((el) => el.taskId === targetCardId)
        : null;

    let newListOrderValueMax = data[newStatus]
      .map((item) => item.order)
      .reduce((maxValue, a) => Math.max(maxValue, a), 0);

    // CASE 1: If same list, work only this if block then return;
    if (oldStatus === newStatus) {
      let temp = data[oldStatus]
        .map((item) => {
          if (item.taskId === dropCard.taskId)
            return {
              ...dropCard,
              order: targetCard
                ? targetCard.order - 1
                : newListOrderValueMax + 1,
            };
          return item;
        })
        .sort((a, b) => a.order - b.order)
        .map((item, i) => {
          return { ...item, order: i + 1 };
        });
      setData((d) => {
        return { ...d, [oldStatus]: temp };
      });

      return;
    }
    // CASE 1 ENDS HERE

    // CASE 2: Drag across multiple lists
    const updatedTask = _.pick(
      tasksList.find((task) => task.taskId === id),
      ["taskId", "isDone", "started"]
    );
    if (oldStatus === "todo") {
      if (newStatus === "doing") {
        // set started to true
        updatedTask.started = true;
      } else if (newStatus === "done") {
        // set isDone to true
        updatedTask.isDone = true;
      }
    } else if (oldStatus === "doing") {
      if (newStatus === "todo") {
        // set started to false and isDone to false
        updatedTask.started = false;
        updatedTask.isDone = false;
      } else if (newStatus === "done") {
        // set isDone to true
        updatedTask.isDone = true;
      }
    } else if (oldStatus === "done") {
      if (newStatus === "doing") {
        // set started to true and isDone to false
        updatedTask.started = true;
        updatedTask.isDone = false;
      } else if (newStatus === "todo") {
        // set started to false and isDone to false
        updatedTask.started = false;
        updatedTask.isDone = false;
      }
    }
    console.log(oldStatus, newStatus, updatedTask);
    updateTask({
      id: updatedTask.taskId,
      isDone: updatedTask.isDone,
      started: updatedTask.started,
    })
      .then((task) => {
        console.log(task);
      })
      .catch((error) => console.log(error));

    let tempGaveList = data[oldStatus]
      .filter((item) => item.taskId !== id)
      .sort((a, b) => a.order - b.order)
      .map((item, i) => {
        return { ...item, order: i + 1 };
      });

    let tempRecievedList = [
      ...data[newStatus],
      {
        ...dropCard,
        order: targetCard ? targetCard.order - 1 : newListOrderValueMax + 1,
      },
    ]
      .sort((a, b) => a.order - b.order)
      .map((item, i) => {
        return { ...item, order: i + 1 };
      });

    // At last, set state
    setData((d) => {
      return { ...d, [oldStatus]: tempGaveList, [newStatus]: tempRecievedList };
    });

    // CASE 2 ENDS HERE
  };
  // Handle Data ends here

  return (
    <div>
      <div className="app-content-area">
        {/* Main Header */}
        <div className="pt-2 pb-4 px-3">
          <h4>My projects:</h4>
          <select
            className="form-select"
            onChange={(e) => {
              handleProjectSelect(e.target.value);
            }}
          >
            <option key={"project-none"} value="none">
              Select a Project
            </option>
            {projectsList.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
        {/* App Board */}
        {Object.keys(data).length === 0 ? (
          <div className="ms-3"></div>
        ) : (
          <main className="app-board">
            {/* Board */}
            <section className="board-body">
              <div className="wrap-lists">
                {lists.map((l) => (
                  <Board
                    data={data[l.status]}
                    key={l.status}
                    title={l.title}
                    status={l.status}
                    onChange={cardChangeHandler}
                  />
                ))}
                <div className="board-col">
                  <div className="list">
                    <a className="btn-list" href="#">
                      + Add another list
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
