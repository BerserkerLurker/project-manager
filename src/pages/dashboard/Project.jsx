import { useState } from "react";
import { Container, Image, Nav, Row, Tab, Table } from "react-bootstrap";
import { CheckCircle, PencilSquare, Plus, Trash } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import InfoToast from "../../components/InfoToast";
import useApi from "../../hooks/useApi";
// name, desc, isDone, status, dueDate, createdAt, owner, participants, tasks and actions edit, delete ...
function Project() {
  const location = useLocation();
  const navigate = useNavigate();
  // @ts-ignore
  const { projectsList: p, updateProject, deleteProject } = useApi();
  const pId = p.findIndex(
    (o) => o.projectId === location.pathname.split("/").at(-1)
  );

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, settoastData] = useState({
    bgColor: "",
    type: "",
    title: "",
    msg: "",
  });

  const infoToast = () => {
    return (
      <InfoToast
        onClose={() => setShowToast(false)}
        show={showToast}
        bg={toastData.bgColor}
        data={{
          title: toastData.title,
          type: toastData.type,
          msg: toastData.msg,
        }}
      />
    );
  };

  const deleteProjectHandler = () => {
    deleteProject(p[pId].projectId)
      .then(() => {
        settoastData({
          bgColor: "success",
          type: "delete",
          title: p[pId].projectName,
          msg: "Successfully deleted",
        });
        setShowToast(!showToast);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        settoastData({
          bgColor: "danger",
          type: "delete",
          title: p[pId].projectName,
          msg: "Failed to delete",
        });
        setShowToast(!showToast);
      });
  };
  const editProjectHandler = () => {
    const x = (Math.random() * 10).toFixed(3);
    updateProject({
      id: p[pId].projectId,
      name: x,
    })
      .then(() => {
        settoastData({
          bgColor: "success",
          type: "edit",
          title: p[pId].projectName,
          msg: "Successfully updated",
        });
        setShowToast(!showToast);
      })
      .catch((error) => {
        console.log(error);
        settoastData({
          bgColor: "danger",
          type: "edit",
          title: p[pId].projectName,
          msg: "Failed to update",
        });
        setShowToast(!showToast);
      });
  };

  return (
    <Container>
      {/* // TODO - figure out how to show delete toast in dashboard after navigate
      on successful delete */}
      {infoToast()}
      <ConfirmDeleteModal
        show={showConfirmDeleteModal}
        onHide={() => setShowConfirmDeleteModal(false)}
        data={{
          projectName: p[pId].projectName,
          handler: deleteProjectHandler,
        }}
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
            onClick={() => {
              console.log("edit");
              editProjectHandler();
            }}
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
                    <h3>Team:</h3>

                    {/* TODO - List project members */}
                    <div className="d-flex align-content-center">
                      <div className="team">
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src="https://picsum.photos/80"
                          alt="user pic"
                        />
                      </div>
                      <div className="team">
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src="https://picsum.photos/100"
                          alt="user pic"
                        />
                      </div>
                      <div className="team">
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src="https://avatars.dicebear.com/api/adventurer/1235469874212.svg"
                          alt="user pic"
                        />
                      </div>
                      <div
                        id="add-member"
                        className="team"
                        onClick={() => console.log("Handle add teammate")}
                      >
                        <Plus
                          className="border border-secondary rounded-circle"
                          size={60}
                          color={"tomato"}
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
                        src="https://picsum.photos/100"
                        alt="user pic"
                      />
                      <p className="d-inline-block fw-bold small">
                        &nbsp;&nbsp;John doe
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane className="ms-3 mt-3" eventKey="tasks">
              <Table responsive className="table-hover">
                <thead className="table-light">
                  <tr>
                    <th></th>
                    <th>Task Name</th>
                    <th>Assignee(s)</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  <tr>
                    <th>
                      <CheckCircle
                        style={{ cursor: "pointer" }}
                        size={24}
                        color={"gray"}
                        onClick={() => {
                          console.log("clicked check mark");
                        }}
                      />{" "}
                    </th>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <td key={index}>Table cell {index}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>
                      <CheckCircle
                        style={{ cursor: "pointer" }}
                        size={24}
                        color={"gray"}
                        onClick={() => {
                          console.log("clicked check mark");
                        }}
                      />{" "}
                    </th>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <td key={index}>Table cell {index}</td>
                    ))}
                  </tr>
                  <tr>
                    <th>
                      <CheckCircle
                        style={{ cursor: "pointer" }}
                        size={24}
                        color={"gray"}
                        onClick={() => {
                          console.log("clicked check mark");
                        }}
                      />
                    </th>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <td key={index}>Table cell {index}</td>
                    ))}
                    <td>
                      <div className="team">
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src="https://picsum.photos/60"
                          alt="user pic"
                        />
                      </div>
                      <div className="team">
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src="https://picsum.photos/60"
                          alt="user pic"
                        />
                      </div>
                      <div className="team">
                        <Image
                          className="rounded-circle profile-img border border-secondary"
                          src="https://picsum.photos/60"
                          alt="user pic"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Tab.Pane>

            <Tab.Pane eventKey="members">
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                nesciunt voluptatibus fuga dolores nostrum minima officiis,
                cupiditate rem fugiat et consequatur ad, molestias corrupti quae
                voluptatem voluptas. Quod, necessitatibus nostrum. lorem100
              </p>
            </Tab.Pane>

            <Tab.Pane eventKey="more">
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                nesciunt voluptatibus fuga dolores nostrum minima officiis,
                cupiditate rem fugiat et consequatur ad, molestias corrupti quae
                voluptatem voluptas. Quod, necessitatibus nostrum. lorem100
              </p>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default Project;
