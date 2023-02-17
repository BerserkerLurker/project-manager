import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Image, Nav, Row, Tab } from "react-bootstrap";
import {
  CheckCircle,
  PencilSquare,
  PersonFillAdd,
  Plus,
  Trash,
  XCircleFill,
} from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../components/table/Table";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import EditModal from "../../components/EditModal";
import useApi from "../../hooks/useApi";
import moment from "moment";
import TaskDetailsModal from "../../components/TaskDetailsModal";
import useAuth from "../../hooks/useAuth";
import InviteUserToProjectModal from "../../components/InviteUserToProjectModal";
import { v4 as uuid } from "uuid";

function Project() {
  const location = useLocation();
  // const pathId = location.pathname.split("/").at(-1);
  const [pathId, setPathId] = useState(location.pathname.split("/").at(-1));
  useEffect(() => {
    setPathId(location.pathname.split("/").at(-1));
  }, [location]);

  const ref = useRef(null);
  const refMember = useRef(null);
  const toastId = useRef(null);
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
    userTeams,
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
    unassignUserFromProject,
  } = useApi();

  // @ts-ignore
  const { user } = useAuth();

  const pId = p.findIndex((o) => o.projectId === pathId);

  const [prjTasks, setPrjTasks] = useState([]);
  const [prjMembers, setPrjMembers] = useState([]);
  const [ownerFeature, setOwnerFeature] = useState(false);

  useEffect(() => {
    if (p[pId]?.isOwner) {
      setOwnerFeature(true);
    } else {
      setOwnerFeature(false);
    }
  }, [pathId, pId]);

  useEffect(() => {
    setPrjTasks(t.filter((task) => task.projectId === pathId));
  }, [pathId, t]);

  useEffect(() => {
    setPrjMembers(projectsMembersObj[pathId]);
  }, [pathId, JSON.stringify(projectsMembersObj)]);

  const projectOwner = prjMembers?.find((m) => m.isOwner);

  const [userTeammates, setUserTeammates] = useState([]);
  useEffect(() => {
    const uList = [];
    userTeams
      .map((team) => team.members)
      .map((membersArray) => {
        membersArray.map((member) => {
          if (
            member.status === "accepted" &&
            member.memberId._id !== user.userId
          ) {
            uList.push(member.memberId);
          }
        });
      });
    setUserTeammates(uList);
  }, [userTeams, pathId]);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const CheckBoxCell = ({
    value,
    column: { id },
    row: {
      index,
      original: { taskId, taskName },
    },
    updateMyData,
  }) => {
    const handleOnClick = () => {
      updateMyData(index, id, taskId, taskName, !value);
    };

    return (
      <CheckCircle
        style={{ cursor: "pointer" }}
        size={24}
        color={value ? "green" : "gray"}
        onClick={(e) => {
          e.stopPropagation();
          handleOnClick();
        }}
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "isDone",
        Cell: CheckBoxCell,
      },
      {
        Header: "Task name",
        accessor: "taskName",
        Cell: (props) => <span>{props.value}</span>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (props) => {
          return (
            <span
              className={
                props.value === "onTrack"
                  ? "text-success"
                  : props.value === "atRisk"
                  ? "text-warning"
                  : "text-danger"
              }
            >
              {props.value === "onTrack"
                ? "On track"
                : props.value === "atRisk"
                ? "At risk"
                : "Off track"}
            </span>
          );
        },
      },
      {
        Header: "Priority",
        accessor: "priority",
        Cell: (props) => {
          return (
            <span
              className={
                props.value === "high"
                  ? "text-bg-success rounded p-1 text-capitalize"
                  : props.value === "medium"
                  ? "text-bg-warning rounded p-1 text-capitalize"
                  : "text-bg-danger rounded p-1 text-capitalize"
              }
            >
              {props.value}
            </span>
          );
        },
      },
      {
        Header: "Due date",
        accessor: "dueDate",
        Cell: (props) => (
          <span
            style={{
              color:
                moment(props.value) < moment()
                  ? "red"
                  : moment(props.value).diff(moment(), "days") > 0
                  ? "gray"
                  : "green",
            }}
          >
            {Math.abs(moment(props.value).diff(moment(), "days")) < 15
              ? moment(props.value).fromNow().toString()
              : moment(props.value).format("LL").toString()}
          </span>
        ),
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: (props) => (
          <span>
            {Math.abs(moment(props.value).diff(moment(), "days")) < 15
              ? moment(props.value).fromNow().toString()
              : moment(props.value).format("LL").toString()}
          </span>
        ),
      },
      {
        Header: "Assignees",
        accessor: "assignees",
        Cell: (props) => (
          <div className="d-flex">
            {props.value?.map((elem) => (
              <div className="teamstatic" key={uuid()}>
                <Image
                  className="rounded-circle profile-img border border-secondary"
                  src={elem.avatar}
                  alt="user pic"
                />
              </div>
            ))}
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => prjTasks, [prjTasks]);

  const updateMyData = (rowIndex, columnId, taskId, taskName, value) => {
    if (columnId === "isDone") {
      handleTaskCheck(value, taskId, taskName);
    }
  };

  const displayTaskModal = (show, data) => {
    setShowTaskDetailsModal(show);
    setTaskModalData(data);
  };

  const deleteProjectHandler = () => {
    deleteProject(p[pId].projectId)
      .then(() => {
        navigate("/", { replace: true });
        toast.success(`Project ${p[pId].projectName} deleted successfully!!`);
      })
      .catch((error) => {
        if (error.response.status >= 500) {
          toast.error("Something went wrong. Try again later.");
        } else {
          toast.error(error.response.data.msg);
        }
      });
  };

  const handleTaskCheck = (isdone, taskId, taskName) => {
    updateTask({ id: taskId, isDone: isdone }).then(() => {
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

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState({});

  return (
    <Container>
      {!loadingInitial && (
        <>
          <ConfirmDeleteModal
            show={showConfirmDeleteModal}
            onHide={() => setShowConfirmDeleteModal(false)}
            data={{
              projectName: p[pId]?.projectName,
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
                color={ownerFeature ? "green" : "gray"}
                className="me-4"
                style={{
                  cursor: "pointer",
                  pointerEvents: ownerFeature ? "auto" : "none",
                }}
                onClick={() => ref.current?.handleShow()}
              />
              <Trash
                size={24}
                color={ownerFeature ? "tomato" : "gray"}
                className="me-2"
                style={{
                  cursor: "pointer",
                  pointerEvents: ownerFeature ? "auto" : "none",
                }}
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
                            <div className="team" key={uuid()}>
                              <Image
                                className="rounded-circle profile-img border border-secondary"
                                src={member.avatar}
                                alt="user pic"
                              />
                            </div>
                          ))}

                          <div id="add-member" className="team" key={uuid()}>
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

                <Tab.Pane className="mt-3" eventKey="tasks">
                  {!prjTasks.length && (
                    <span>
                      You have no pending tasks for project {p[pId].projectName}
                      .
                    </span>
                  )}

                  <TaskDetailsModal
                    show={showTaskDetailsModal}
                    onHide={() => setShowTaskDetailsModal(false)}
                    data={taskModalData}
                    dialogClassName="modal-right"
                    backdropClassName="modal-right-backdrop"
                    contentClassName="modal-right-content"
                    animation={false}
                  />

                  <Table
                    columns={columns}
                    data={data}
                    updateMyData={updateMyData}
                    displayTaskModal={displayTaskModal}
                  />
                </Tab.Pane>

                <Tab.Pane className="ms-3 mt-3" eventKey="members">
                  <div className="row mt-2">
                    <h4>Project Owner</h4>
                    <div className="w-50 mt-2 d-flex" key={uuid()}>
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
                        {rolesList
                          .filter((elem) => elem._id === projectOwner?.role)
                          .map((e) => (
                            <span key={uuid()}>{e.name}</span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <InviteUserToProjectModal
                    ref={refMember}
                    userTeammates={userTeammates}
                    prjMembers={prjMembers}
                  />
                  <div className="row mt-4">
                    <div className="d-flex justify-content-between">
                      <h4>Project Members</h4>
                      <PersonFillAdd
                        size={36}
                        data-projectid={pathId}
                        color={ownerFeature ? "" : "gray"}
                        onClick={(e) => refMember.current?.handleShow(e)}
                        onMouseEnter={(e) =>
                          e.currentTarget.classList.add("text-primary")
                        }
                        onMouseLeave={(e) =>
                          e.currentTarget.classList.remove("text-primary")
                        }
                        style={{
                          cursor: "pointer",
                          pointerEvents: ownerFeature ? "auto" : "none",
                        }}
                      />
                    </div>
                    {prjMembers?.map((member) => {
                      if (!member.isOwner)
                        return (
                          <div className="w-50 mt-2 d-flex" key={uuid()}>
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
                              {rolesList
                                .filter((elem) => elem._id === member?.role)
                                .map((e) => (
                                  <span key={uuid()}>{e.name}</span>
                                ))}
                            </div>
                            <div className="flex-grow-1 d-flex flex-row-reverse me-2 my-auto">
                              <XCircleFill
                                className="text-danger"
                                size={24}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  unassignUserFromProject({
                                    projectId: pathId,
                                    memberEmail: member.email,
                                  });
                                }}
                              />
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
