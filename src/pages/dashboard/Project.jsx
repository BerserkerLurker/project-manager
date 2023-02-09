import { useEffect, useRef, useState } from "react";
import { Container, Image, Nav, Row, Tab, Table } from "react-bootstrap";
import { CheckCircle, PencilSquare, Plus, Trash } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import EditModal from "../../components/EditModal";
import useApi from "../../hooks/useApi";
// name, desc, isDone, status, dueDate, createdAt, owner, participants, tasks and actions edit, delete ...
function Project() {
  const ref = useRef(null);
  const toastId = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  // const pIndex = location.state?.project?.projectId;
  const {
    // @ts-ignore
    projectsList: p,
    // @ts-ignore
    tasksList: t,
    // @ts-ignore
    rolesList,
    // @ts-ignore
    loadingInitial,
    // @ts-ignore
    updateProject,
    // @ts-ignore
    deleteProject,
    // @ts-ignore
    updateTask,
    // @ts-ignore
    projectsMembersObj,
    // @ts-ignore
    handleAddProjectMember,
  } = useApi();

  // for (let [key, value] of Object.entries(projectsMembersObj)) {
  //   console.log(`${key}: ${value}`);
  // }

  const pathId = location.pathname.split("/").at(-1);
  const pId = p.findIndex((o) => o.projectId === pathId);

  const [prjTasks, setPrjTasks] = useState([]);
  const [prjMembers, setPrjMembers] = useState([]);

  useEffect(() => {
    setPrjTasks(t.filter((task) => task.projectId === pathId));
  }, [pathId, t]);

  useEffect(() => {
    setPrjMembers(projectsMembersObj[pathId]);
  }, [pathId, projectsMembersObj]);

  const projectOwner = prjMembers?.find((m) => m.isOwner);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const handleNewProjectMember = () => {
    //TODO - show modal to enter email address (later select from existing list say friends teammates...)
  };

  const deleteProjectHandler = () => {
    deleteProject(p[pId].projectId)
      .then(() => {
        navigate("/", { replace: true });
        toast.success(`Project ${p[pId].projectName} deleted successfully!!`);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status >= 500) {
          toast.error("Something went wrong. Try again later.");
        } else {
          toast.error(error.response.data.msg);
        }
      });
  };

  const handleTaskCheck = (isdone, taskId, taskName) => {
    updateTask({ id: taskId, isDone: !isdone }).then(() => {
      const noti = () =>
        (toastId.current = toast.info(
          `${taskName} ${!isdone ? "done ✔" : "updated"}`,
          { toastId: taskId, autoClose: 2000 }
        ));
      if (toastId.current === taskId && toast.isActive(toastId.current)) {
        toast.update(toastId.current, {
          render: `${taskName} ${!isdone ? "done ✔" : "updated"}`,
        });
      } else {
        noti();
      }
    });
  };

  return (
    <Container>
      {!loadingInitial && (
        <>
          <ConfirmDeleteModal
            show={showConfirmDeleteModal}
            onHide={() => setShowConfirmDeleteModal(false)}
            data={{
              projectName: p[pId].projectName,
              handler: deleteProjectHandler,
            }}
          />
          <EditModal
            ref={ref}
            title={`Edit ${p[pId].projectName}`}
            data={p[pId]}
          />
          <div className="d-flex justify-content-between align-items-baseline">
            <div>
              <h1 className="display-4 d-inline-block">
                {p[pId].projectName}&nbsp;
              </h1>
              <small className="text-muted">
                {new Date(p[pId].createdAt).toLocaleDateString()}
              </small>
            </div>
            <div>
              <PencilSquare
                size={24}
                color={"green"}
                className="me-4"
                style={{ cursor: "pointer" }}
                onClick={() => ref.current.handleShow()}
              />
              <Trash
                size={24}
                color={"tomato"}
                className="me-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  console.log("delete");
                  setShowConfirmDeleteModal(true);
                }}
              />
            </div>
          </div>
          <Tab.Container defaultActiveKey="overview">
            <Row>
              <Nav fill variant="tabs" defaultActiveKey="overview">
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tasks">Tasks</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="members">Members</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="more">More...</Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
            <Row>
              <Tab.Content>
                <Tab.Pane className="ms-3 mt-3" eventKey="overview">
                  <div className="row">
                    <div className="col-lg-9">
                      <div className="mb-3">
                        <h3>Summary:</h3>
                        <p className="lead">{p[pId].description}</p>
                      </div>

                      <div className="mb-3">
                        <h3>Project members:</h3>

                        <div className="d-flex align-content-center">
                          {prjMembers?.map((member) => (
                            <div className="team" key={member.userId}>
                              <Image
                                className="rounded-circle profile-img border border-secondary"
                                src={member.avatar}
                                alt="user pic"
                              />
                            </div>
                          ))}

                          <div
                            id="add-member"
                            className="team"
                            onClick={handleNewProjectMember}
                          >
                            <Plus
                              className="border border-secondary rounded-circle"
                              size={60}
                              color={"tomato"}
                              onClick={() => {
                                console.log(
                                  "assign teammate or invite user by email"
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="mb-3">
                        <h3>Status:</h3>
                        <div className="border border-2 rounded-2 overflow-hidden ">
                          <div className="border-bottom text-center bg-light">
                            <h5 className="mb-0 p-2">{p[pId].status}</h5>
                          </div>
                          <p className="m-2">
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Quo odit voluptates vitae nihil eius itaque
                            incidunt sequi. Est odit excepturi libero incidunt
                            voluptate?
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3>Due Date:</h3>
                        <p className="small">
                          {new Date(p[pId].dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mb-3">
                        <h5>Project Owner:</h5>
                        <div>
                          <Image
                            className=" rounded-circle profile-img border border-secondary"
                            src={projectOwner?.avatar}
                            alt="user pic"
                          />
                          <p className="d-inline-block fw-bold small">
                            &nbsp;&nbsp;
                            {projectOwner?.name}
                            {/* // TODO - need to query userProjects */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>

                <Tab.Pane className="ms-3 mt-3" eventKey="tasks">
                  {!prjTasks.length && (
                    <span>
                      You have no pending tasks for project {p[pId].projectName}
                      .
                    </span>
                  )}
                  <Table
                    responsive
                    className={prjTasks.length ? "table-hover" : "d-none"}
                  >
                    <thead className="table-light">
                      <tr>
                        <th></th>
                        <th>Task Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Created At</th>
                        <th>Assignee(s)</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {prjTasks.map((task) => {
                        return (
                          <tr key={task.taskId}>
                            <th>
                              <CheckCircle
                                style={{ cursor: "pointer" }}
                                size={24}
                                color={task.isDone ? "green" : "gray"}
                                onClick={() => {
                                  handleTaskCheck(
                                    task.isDone,
                                    task.taskId,
                                    task.taskName
                                  );
                                }}
                              />{" "}
                            </th>
                            <td>{task.taskName}</td>
                            <td
                              className="text-truncate"
                              style={{ maxWidth: "15ch" }}
                            >
                              {task.description}
                            </td>
                            <td>{task.status}</td>
                            <td>{task.priority}</td>
                            <td>{new Date(task.dueDate).toLocaleString()}</td>
                            <td>{new Date(task.createdAt).toLocaleString()}</td>
                            <td className="d-flex">
                              <div className="teamstatic">
                                <Image
                                  className="rounded-circle profile-img border border-secondary"
                                  src="https://picsum.photos/60"
                                  alt="user pic"
                                />
                              </div>
                              <div className="teamstatic">
                                <Image
                                  className="rounded-circle profile-img border border-secondary"
                                  src="https://picsum.photos/60"
                                  alt="user pic"
                                />
                              </div>
                              <div className="teamstatic">
                                <Image
                                  className="rounded-circle profile-img border border-secondary"
                                  src="https://picsum.photos/60"
                                  alt="user pic"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Tab.Pane>

                <Tab.Pane eventKey="members">
                  <div className="row mt-2">
                    <h4>Project Owner</h4>
                    <div
                      className="w-50 mt-2 d-flex"
                      key={projectOwner?.userId}
                    >
                      <div>
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src={projectOwner?.avatar}
                          alt="user pic"
                        />
                      </div>
                      &nbsp;
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "35ch" }}
                      >
                        <h5>{projectOwner?.name}</h5>
                        {/* <span>{projectOwner?.role}</span> */}
                        {rolesList
                          .filter((elem) => elem._id === projectOwner?.role)
                          .map((e) => (
                            <>{e.name}</>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <h4>Project Members</h4>
                    {prjMembers?.map((member) => {
                      if (!member.isOwner)
                        return (
                          <div className="w-50 mt-2 d-flex" key={member.userId}>
                            <div>
                              <Image
                                className="rounded-circle profile-img border border-secondary"
                                src={member.avatar}
                                alt="user pic"
                              />
                            </div>
                            &nbsp;
                            <div
                              className="text-truncate"
                              style={{ maxWidth: "35ch" }}
                            >
                              <h5>{member.name}</h5>
                              {/* <span>{member.role}</span> */}
                              {rolesList
                                .filter((elem) => elem._id === member?.role)
                                .map((e) => (
                                  <>{e.name}</>
                                ))}
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="more">
                  <p className="">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                    nesciunt voluptatibus fuga dolores nostrum minima officiis,
                    cupiditate rem fugiat et consequatur ad, molestias corrupti
                    quae voluptatem voluptas. Quod, necessitatibus nostrum.
                    lorem100
                  </p>
                </Tab.Pane>
              </Tab.Content>
            </Row>
          </Tab.Container>
        </>
      )}
    </Container>
  );
}

export default Project;
