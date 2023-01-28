import React, { useEffect, useState } from "react";
import { useRef } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import {
  ArrowUpRightCircle,
  CheckCircle,
  CheckCircleFill,
  PeopleFill,
  PersonFillAdd,
  XCircle,
  XCircleFill,
  XOctagonFill,
} from "react-bootstrap-icons";
import AddByEmailModal from "../../components/AddByEmailModal";
import AddNewTeamModal from "../../components/AddNewTeamModal";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";

function Teams() {
  const ref = useRef(null);
  const refNew = useRef(null);
  // @ts-ignore
  const { teamsList, updateTeamMember, removeTeamMember } = useApi();
  // @ts-ignore
  const { user } = useAuth();

  const [myTeams, setMyTeams] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    data: {},
  });
  //   console.log(teamsList);

  useEffect(() => {
    let teams = [];
    if (teamsList) {
      teams = teamsList
        .map((team) => {
          if (
            team.members.filter((member) => member.memberId._id === user.userId)
              .length > 0
          ) {
            return team;
          }
        })
        .filter((team) => team !== undefined);
    }
    setMyTeams(teams);
  }, [teamsList]);

  const ConfirmModal = () => {
    let color = "danger";
    if (confirmationModal.data?.title?.includes("Join")) {
      color = "success";
    }
    return (
      <Modal
        show={confirmationModal.show}
        onHide={() =>
          setConfirmationModal({ ...confirmationModal, show: false })
        }
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            className={`text-${color}`}
            id="contained-modal-title-vcenter"
          >
            {confirmationModal.data.title}
            {confirmationModal.data.teamName}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{confirmationModal.data.body}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setConfirmationModal({ ...confirmationModal, show: false })
            }
          >
            Cancel
          </Button>
          <Button
            variant={color}
            onClick={() => {
              updateTeamMember({
                teamId: confirmationModal.data.teamId,
                updatedUserId: confirmationModal.data.updatedUserId,
                newStatus: confirmationModal.data.newStatus,
              });
              setConfirmationModal({ ...confirmationModal, show: false });
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container>
      <AddByEmailModal ref={ref} myteams={myTeams} />
      <AddNewTeamModal ref={refNew} />
      <ConfirmModal />
      <Row>
        <Col>
          <Button onClick={refNew.current?.handleShow}>New Team</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>My Teams:</h4>
          <Accordion alwaysOpen defaultActiveKey="">
            {myTeams.map((team, index) => (
              <Accordion.Item eventKey={index.toString()} key={team._id}>
                <Accordion.Header>
                  {team.name}&nbsp;&nbsp;
                  <PeopleFill className="text-secondary" />
                  &nbsp;
                  <small className="text-secondary">
                    {team.members.length}
                  </small>
                </Accordion.Header>
                <Accordion.Body className="d-flex flex-wrap gap-1">
                  {team.members.map((member) => (
                    <div
                      className="d-flex align-items-center border rounded"
                      key={member.memberId._id}
                      style={{
                        flexBasis: "calc(50% - 10px)",
                        minHeight: "60px",
                      }}
                    >
                      {member.memberId._id !== user.userId ? (
                        <>
                          {/* // TODO - avatar circle */}
                          <Image
                            className="profile-img border-end border-dark border-opacity-50"
                            src={
                              member.memberId.avatar ||
                              "https://avatars.dicebear.com/api/adventurer/1235469874212.svg"
                            }
                          />
                          &nbsp;
                          <div>
                            <span className="fw-semibold">
                              {member.memberId.name}
                            </span>
                            &nbsp;
                            {member.status === "accepted" && (
                              <CheckCircle color={"green"} />
                            )}
                            {member.status === "pending" && (
                              <ArrowUpRightCircle color={"blue"} />
                            )}
                            {member.status === "rejected" && (
                              <XCircle color={"red"} />
                            )}
                            <span className="small opacity-50 d-block">
                              {member.memberId.email}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* // TODO - avatar circle */}
                          <Image
                            className="profile-img border-end border-dark border-opacity-50"
                            src={
                              member.memberId.avatar ||
                              "https://avatars.dicebear.com/api/adventurer/1235469874212.svg"
                            }
                          />
                          &nbsp;
                          <span className="fw-semibold">Me</span>
                          &nbsp;
                          {member.status === "accepted" && (
                            <XOctagonFill
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                setConfirmationModal({
                                  data: {
                                    teamId: team._id,
                                    teamName: team.name,
                                    updatedUserId: member.memberId._id,
                                    newStatus: "notMember",
                                    title: "Leave ",
                                    body: "Are you sure you want to leave this team?",
                                  },
                                  show: true,
                                })
                              }
                            />
                          )}
                          {member.status === "pending" && (
                            <>
                              <XCircleFill
                                className="text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  setConfirmationModal({
                                    data: {
                                      teamId: team._id,
                                      teamName: team.name,
                                      updatedUserId: member.memberId._id,
                                      newStatus: "rejected",
                                      title: "Reject invite to ",
                                      body: "Reject invitation to join this team?",
                                    },
                                    show: true,
                                  })
                                }
                              />
                              &nbsp;
                              <CheckCircleFill
                                color={"green"}
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  setConfirmationModal({
                                    data: {
                                      teamId: team._id,
                                      teamName: team.name,
                                      updatedUserId: member.memberId._id,
                                      newStatus: "accepted",
                                      title: "Join ",
                                      body: "Accept invitation to join this team?",
                                    },
                                    show: true,
                                  })
                                }
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div
                    className="d-flex align-items-center"
                    style={{ flexBasis: "calc(50% - 10px)" }}
                    key={"new-99"}
                  >
                    <Button
                      data-teamid={team._id}
                      variant="outline-primary"
                      className="d-flex align-items-center p-0 px-1 w-100 h-100"
                      style={{ minHeight: "60px" }}
                      onClick={(e) => ref.current?.handleShow(e)}
                    >
                      Add new teammate
                      <PersonFillAdd />
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default Teams;
