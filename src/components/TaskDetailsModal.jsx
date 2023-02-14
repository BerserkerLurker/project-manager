import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import {
  Check2Square,
  Circle,
  PencilFill,
  PlusLg,
  Trash,
  XCircleFill,
} from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import useApi from "../hooks/useApi";
import moment from "moment";
import { v4 as uuid } from "uuid";
import _ from "lodash";

function TaskDetailsModal(props) {
  const {
    // @ts-ignore
    updateTask,
    // @ts-ignore
    deleteTask,
    // @ts-ignore
    projectsMembersObj: pMembers,
    // @ts-ignore
    assignUserToTask,
    // @ts-ignore
    unassignUserFromTask,
  } = useApi();

  const [showForm, setShowForm] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [parentProjectOwner, setParentProjectOwner] = useState();

  const task = props.data;

  useEffect(() => {
    let allMembers = _.at(pMembers, [task.projectId])[0];
    setParentProjectOwner(allMembers?.filter((member) => member.isOwner)[0]);
  });

  useEffect(() => {
    let allMembers = _.at(pMembers, [task.projectId])[0];

    const availableToAssign = _.filter(allMembers, (member) => {
      const stringAssignees = JSON.stringify(task.assignees);
      return !stringAssignees.includes(member.userId);
    });
    setAvailableMembers(availableToAssign);
  }, [JSON.stringify(task)]);

  function handleOnKeyDown(keyEvent) {
    if (keyEvent.key === "Enter") {
      keyEvent.preventDefault();
    }
  }

  const handleAssignUser = async (clickEvent, memberEmail, memberId) => {
    const plus = document.getElementById(`plus-${memberId}`);
    plus.classList.add("visually-hidden");
    const loader = document.getElementById(`loader-${memberId}`);
    loader.classList.remove("visually-hidden");

    // TODO - Loader not done
    try {
      const assignee = await assignUserToTask({
        taskId: task.taskId,
        assigneeEmail: memberEmail,
      });
      console.log(assignee);
      plus.classList.remove("visually-hidden");
      loader.classList.add("visually-hidden");
    } catch (error) {
      console.log(error);
      plus.classList.remove("visually-hidden");
      loader.classList.add("visually-hidden");
    }

  };

  const handleUnassignUser = (userEmail, userId) => {
    console.log(userEmail, userId);
    unassignUserFromTask({ taskId: task.taskId, assigneeEmail: userEmail });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(100, "*Project name must be less than 100 characters")
      .required("*Name is required"),
    description: Yup.string(),
    status: Yup.string()
      .required("*Status is required")
      .oneOf(
        ["onTrack", "atRisk", "offTrack"],
        "*Status must be one of the following values: On Track, At Risk or Off Track"
      ),
    priority: Yup.string()
      .required("*Priority is required")
      .oneOf(
        ["low", "medium", "high"],
        "*Priority must be one of the following values: low, medium or high"
      ),
    dueDate: Yup.date().required("*Due Date is required"),
  });
  return (
    <>
      {parentProjectOwner && (
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          onHide={() => {
            props.onHide();
            setShowForm(false);
          }}
        >
          <Formik
            initialValues={{
              name: task.taskName,
              description: task.description,
              status: task.status,
              priority: task.priority,
              dueDate: moment(task.dueDate).format("YYYY-MM-DDThh:mm:ss"),
              isDone: task.isDone,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              updateTask({
                id: task.taskId,
                ...values,
                dueDate: new Date(values.dueDate).toISOString(),
              }).then(() => {
                setSubmitting(false);
                setShowForm(false);
                props.onHide();
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <>
                <Form onSubmit={handleSubmit}>
                  <Modal.Header
                    className="d-flex justify-content-between"
                    closeButton
                  >
                    <div>
                      <Modal.Title
                        id="contained-modal-title-vcenter"
                        className="d-flex align-items-baseline"
                      >
                        <span
                          className={
                            task.isDone ? "text-decoration-line-through" : ""
                          }
                        >
                          {task.taskName}
                        </span>
                        &nbsp;&nbsp;
                        <PencilFill
                          size={24}
                          className={
                            showForm ? "text-secondary" : "text-primary"
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setShowForm(!showForm);
                          }}
                        />
                        &nbsp;&nbsp;
                        {showForm && (
                          <Check2Square
                            disabled={isSubmitting}
                            style={
                              isSubmitting
                                ? { pointerEvents: "none", color: "gray" }
                                : { cursor: "pointer", color: "green" }
                            }
                            // @ts-ignore
                            onClick={handleSubmit}
                          />
                        )}
                        {task.isOwner && (
                          <Trash
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              props.onHide();
                              deleteTask(task.taskId);
                            }}
                          />
                          // Maybe confirmation before delete
                        )}
                      </Modal.Title>
                      <span className="text-secondary small">
                        {new Date(task.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </Modal.Header>

                  <Modal.Body className="row">
                    <div className="col-7">
                      {showForm && (
                        <Form.Group controlId="formName">
                          <Form.Label className="fw-bold">Name:</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Task name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            onKeyDown={handleOnKeyDown}
                          ></Form.Control>
                          <div className="error-message">
                            <>
                              &nbsp;{touched.name && errors.name && errors.name}
                            </>
                          </div>
                        </Form.Group>
                      )}

                      <Form.Group controlId="formDescription">
                        <Form.Label className="fw-bold">
                          Description:
                        </Form.Label>
                        {!showForm ? (
                          <p>{task.description}</p>
                        ) : (
                          <>
                            <Form.Control
                              type="text"
                              as="textarea"
                              rows={3}
                              name="description"
                              placeholder="Descripe your task"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.description}
                            ></Form.Control>
                            <div className="error-message">&nbsp;</div>
                          </>
                        )}
                      </Form.Group>

                      <Form.Group controlId="formStatus">
                        <Form.Label className="fw-bold">Status:</Form.Label>
                        {!showForm ? (
                          <p>{task.status}</p>
                        ) : (
                          <>
                            <Form.Select
                              name="status"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.status}
                            >
                              <option>Open this select menu</option>
                              <option value="onTrack">On Track</option>
                              <option value="atRisk">At Risk</option>
                              <option value="offTrack">Off Track</option>
                            </Form.Select>
                            <div className="error-message">
                              <>
                                &nbsp;
                                {touched.status &&
                                  errors.status &&
                                  errors.status}
                              </>
                            </div>
                          </>
                        )}
                      </Form.Group>

                      <Form.Group controlId="formPriority">
                        <Form.Label className="fw-bold">Priority:</Form.Label>
                        {!showForm ? (
                          <p>{task.priority}</p>
                        ) : (
                          <>
                            <Form.Select
                              name="priority"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.priority}
                            >
                              <option>Open this select menu</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </Form.Select>
                            <div className="error-message">
                              <>
                                &nbsp;
                                {touched.priority &&
                                  errors.priority &&
                                  errors.priority}
                              </>
                            </div>
                          </>
                        )}
                      </Form.Group>

                      <Form.Group controlId="formDate">
                        <Form.Label className="fw-bold">Due Date:</Form.Label>
                        {!showForm ? (
                          <p>{new Date(task.dueDate).toLocaleString()}</p>
                        ) : (
                          <>
                            <Form.Control
                              type="datetime-local"
                              name="dueDate"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.dueDate}
                            ></Form.Control>
                            <div className="error-message">
                              &nbsp;
                              {touched.dueDate &&
                                errors.dueDate &&
                                errors.dueDate}
                            </div>
                          </>
                        )}
                      </Form.Group>

                      {showForm && (
                        <Form.Group controlId="formIsDone">
                          <Form.Label className="fw-bold">Progress:</Form.Label>
                          <Form.Check
                            checked={values.isDone}
                            label="Finished"
                            type="checkbox"
                            name="isDone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.isDone}
                          ></Form.Check>
                        </Form.Group>
                      )}
                    </div>
                    <div className="col-5">
                      <span className="fw-bold">Assignees:</span>
                      <div className="d-flex flex-wrap">
                        {task.assignees.map((user) => (
                          <div
                            className=" mt-2 me-2 d-flex align-items-baseline"
                            key={uuid()}
                          >
                            <div>
                              <Image
                                className="rounded-circle profile-img border border-secondary"
                                src={user.avatar}
                                alt="user pic"
                              />
                            </div>
                            &nbsp;
                            <div
                              className="text-truncate"
                              style={{ maxWidth: "35ch" }}
                            >
                              <h5>{user.name}</h5>
                            </div>
                            &nbsp;
                            {showForm &&
                              // @ts-ignore
                              parentProjectOwner.isOwner &&
                              !user.isOwner && (
                                <XCircleFill
                                  className="text-danger"
                                  onClick={() =>
                                    handleUnassignUser(user.email, user._id)
                                  }
                                />
                              )}
                          </div>
                        ))}
                      </div>
                      {showForm &&
                        // @ts-ignore
                        parentProjectOwner.isOwner && (
                          <div className="mt-2 mb-1">
                            <span className="fw-bold">
                              Assign project member to task:
                            </span>
                            {availableMembers.map((member) => (
                              <div
                                key={uuid()}
                                className="d-flex align-items-center mb-1 border-bottom border-2"
                              >
                                <PlusLg
                                  id={`plus-${member.userId}`}
                                  size={24}
                                  className="text-primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={(clickEvent) => {
                                    handleAssignUser(
                                      clickEvent,
                                      member.email,
                                      member.userId
                                    );
                                  }}
                                />
                                <Circle
                                  id={`loader-${member.userId}`}
                                  className="visually-hidden"
                                />
                                &nbsp;
                                <div>
                                  <span className="fs-5 d-block">
                                    {member.name}
                                  </span>
                                  <span className="d-block text-secondary">
                                    {member.email}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </Modal.Body>
                </Form>
              </>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
}
export default TaskDetailsModal;
