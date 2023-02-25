import React, { useEffect, useState } from "react";
import { Container, ListGroup, Tab, Tabs } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import TaskDetailsModal from "../../components/TaskDetailsModal";
import useApi from "../../hooks/useApi";
import SideNav from "./SideNav";

function Dashboard() {
  const pathname = useLocation().pathname;
  // @ts-ignore
  const { projectsList, tasksList } = useApi();

  const [doneTasks, setDoneTasks] = useState([]);
  const [overDueTasks, setOverDueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState({});

  useEffect(() => {
    const done = [];
    const overdue = [];
    const upcoming = [];
    tasksList.forEach((task) => {
      if (task.isDone) {
        done.push(task);
        return;
      } else if (new Date(task.dueDate) < new Date()) {
        overdue.push(task);
        return;
      } else {
        upcoming.push(task);
        return;
      }
    });
    setDoneTasks(done);
    setOverDueTasks(overdue);
    setUpcomingTasks(upcoming);
  }, [tasksList]);

  return (
    <Container fluid>
      <div className="row row-cols-3 row-cols-lg-4 h-100">
        <div
          className="col bg-light"
          style={{
            boxShadow: "0px 0px 10px 0px rgba(51, 51, 51, 0.2 )",
          }}
        >
          <SideNav />
        </div>

        <div
          className="col-2 col-lg-3 flex-grow-1"
          style={{
            boxShadow: "inset rgb(51 51 51 / 20%) -10px 15px 10px -15px",
          }}
        >
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb  text-capitalize">
              <li
                className={
                  pathname !== "/"
                    ? "breadcrumb-item"
                    : "breadcrumb-item active"
                }
              >
                {pathname === "/" ? (
                  <span>Dashboard</span>
                ) : (
                  <Link to={"/"}>Dashboard</Link>
                )}
              </li>

              {pathname
                .slice(1)
                .split("/")
                .map((item, index, array) => {
                  return index == array.length - 1 ? (
                    <li
                      key={index}
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      {item}
                    </li>
                  ) : (
                    <li
                      key={index}
                      className="breadcrumb-item"
                      aria-current="page"
                    >
                      <Link to={array.slice(0, index + 1).join("/")}>
                        {item}
                      </Link>
                    </li>
                  );
                })}
            </ol>
          </nav>

          {location.pathname === "/" && (
            <div className="row gap-xl-3 mx-xl-1 pe-2">
              <div className="col mb-4 py-2 px-0 border rounded">
                <h4 className="ms-3">My Tasks:</h4>

                <TaskDetailsModal
                  size={"lg"}
                  centered
                  show={showTaskDetailsModal}
                  onHide={() => setShowTaskDetailsModal(false)}
                  data={taskModalData}
                />

                <Tabs
                  defaultActiveKey="upcoming"
                  id="tasks-overview"
                  className=""
                  fill
                >
                  <Tab
                    eventKey="upcoming"
                    title={`Upcoming(${upcomingTasks.length})`}
                    style={{
                      height: "250px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <ListGroup as="ol" variant="flush">
                      {upcomingTasks.map((task, index) => {
                        return (
                          <ListGroup.Item
                            as="li"
                            key={`task-${index}`}
                            onClick={() => {
                              setShowTaskDetailsModal(true);
                              setTaskModalData(task);
                            }}
                          >
                            <Link to="" className="ms-2">
                              {task.taskName}
                            </Link>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </Tab>
                  <Tab
                    eventKey="done"
                    title={`Completed(${doneTasks.length})`}
                    style={{
                      height: "250px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <ListGroup as="ol" variant="flush">
                      {doneTasks.map((task, index) => {
                        return (
                          <ListGroup.Item
                            as="li"
                            key={`task-${index}`}
                            onClick={() => {
                              setShowTaskDetailsModal(true);
                              setTaskModalData(task);
                            }}
                          >
                            <Link to="" className="ms-2">
                              {task.taskName}
                            </Link>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </Tab>
                  <Tab
                    eventKey="overdue"
                    title={`Overdue(${overDueTasks.length})`}
                    style={{
                      height: "250px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <ListGroup as="ol" variant="flush">
                      {overDueTasks.map((task, index) => {
                        return (
                          <ListGroup.Item
                            as="li"
                            key={`task-${index}`}
                            onClick={() => {
                              setShowTaskDetailsModal(true);
                              setTaskModalData(task);
                            }}
                          >
                            <Link to="" className="ms-2">
                              {task.taskName}
                            </Link>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </Tab>
                </Tabs>
              </div>
              <div className="col-xl-6 mb-4 py-2 px-0 border rounded">
                <h4 className="ms-3">My Projects:</h4>
                <ListGroup
                  as="ol"
                  variant="flush"
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <ListGroup.Item as="li" key={`new-project-0`}>
                    <Link to={`/newproject`} className="ms-2">
                      Create project
                    </Link>
                  </ListGroup.Item>
                  {projectsList.map((project, index) => {
                    return (
                      <ListGroup.Item as="li" key={`project-${index}`}>
                        <Link
                          to={`/project/${project.projectId}`}
                          className="ms-2"
                        >
                          {project.projectName}
                        </Link>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </div>
          )}

          <Outlet />
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
