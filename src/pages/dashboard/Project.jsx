import {
  Container,
  Image,
  Nav,
  Row,
  Tab,
  Table,
} from "react-bootstrap";
import {
  CheckCircle,
  Plus,

} from "react-bootstrap-icons";
// name, desc, isDone, status, dueDate, createdAt, owner, participants, tasks and actions edit, delete ...
function Project() {
  return (
    <Container>
      <h1 className="display-4 d-inline-block">Project Title&nbsp;</h1>
      <small className="text-muted">{new Date().toLocaleDateString()}</small>

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
                    <p className="lead">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Non nesciunt voluptatibus fuga dolores nostrum minima
                      officiis, cupiditate rem fugiat et consequatur ad,
                      molestias corrupti quae voluptatem voluptas. Quod,
                      necessitatibus nostrum.
                    </p>
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
                        <h5 className="mb-0 p-2">On Track</h5>
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
                    <p className="small">23 december 2025</p>
                  </div>

                  <div className="mb-3">
                    <h5>Project Owner:</h5>
                    <div>
                      <Image
                        className=" rounded-circle profile-img border border-secondary"
                        src="https://picsum.photos/100"
                        alt="user pic"
                      />
                      <p className="d-inline-block fw-bold small">&nbsp;&nbsp;John doe</p>
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
                        onClick={() => console.log("clicked check mark")}
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
                        onClick={() => console.log("clicked check mark")}
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
                        onClick={() => console.log("clicked check mark")}
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
