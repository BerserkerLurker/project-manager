import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Accordion, Button, Col, Container, Image, Row } from "react-bootstrap";
import {
  ArrowUpRightCircle,
  CheckCircle,
  CheckCircleFill,
  PeopleFill,
  PersonFillAdd,
  XCircle,
  XOctagonFill,
} from "react-bootstrap-icons";
import AddByEmailModal from "../../components/AddByEmailModal";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";

function Teams() {
  const ref = useRef(null);
  // @ts-ignore
  const { teamsList } = useApi();
  // @ts-ignore
  const { user } = useAuth();

  const [myTeams, setMyTeams] = useState([]);
  //   console.log(teamsList);

  useEffect(() => {
    const teams = teamsList
      .map((team) => {
        if (
          team.members.filter((member) => member.memberId._id === user.userId)
            .length > 0
        )
          return team;
      })
      .filter((team) => team !== undefined);

    setMyTeams(teams);
  }, [teamsList]);

  return (
    <Container>
      <AddByEmailModal ref={ref} myteams={myTeams} />

      <Row>
        <Col>
          <Button>New Team</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>My Teams:</h4>
          <Accordion defaultActiveKey="0">
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
                <Accordion.Body className="d-flex flex-wrap">
                  {team.members.map((member) => (
                    <div
                      className="d-flex align-items-center w-50"
                      key={member.memberId._id}
                    >
                      {member.memberId._id !== user.userId ? (
                        <>
                          {/* // TODO - avatar circle */}
                          <Image src={member.memberId.avatar} />
                          &nbsp;
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
                        </>
                      ) : (
                        <>
                          {/* // TODO - avatar circle */}
                          <Image src={member.memberId.avatar} />
                          &nbsp;
                          <span className="fw-semibold">Me</span>
                          &nbsp;
                          {member.status === "accepted" && (
                            <XOctagonFill className="text-danger" />
                          )}
                          {member.status === "pending" && (
                            <>
                              <XOctagonFill className="text-danger" />
                              &nbsp;
                              <CheckCircleFill color={"green"} />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  <div
                    className="d-flex align-items-center w-50"
                    key={"new-99"}
                  >
                    <Button
                      data-teamid={team._id}
                      variant="outline-primary"
                      className="d-flex align-items-center p-0 px-1"
                      onClick={(e) => ref.current.handleShow(e)}
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
