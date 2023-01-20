import { Formik } from "formik";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Check2Square, PencilFill } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import useApi from "../hooks/useApi";
import moment from "moment";

function TaskDetailsModal(props) {
  // @ts-ignore
  const { updateTask } = useApi();
  const [showForm, setShowForm] = useState(false);

  const task = props.data;
  console.log(props);

  function handleOnKeyDown(keyEvent) {
    if (keyEvent.key === "Enter") {
      keyEvent.preventDefault();
    }
  }

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
    <Modal
      size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
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
                      className={task.isDone && "text-decoration-line-through"}
                    >
                      {task.taskName}
                    </span>
                    &nbsp;&nbsp;
                    <PencilFill
                      size={24}
                      className={showForm ? "text-secondary" : "text-primary"}
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
                  </Modal.Title>
                  <span className="text-secondary small">
                    {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
              </Modal.Header>

              <Modal.Body>
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
                      <>&nbsp;{touched.name && errors.name && errors.name}</>
                    </div>
                  </Form.Group>
                )}

                <Form.Group controlId="formDescription">
                  <Form.Label className="fw-bold">Description:</Form.Label>
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
                          {touched.status && errors.status && errors.status}
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
                        {touched.dueDate && errors.dueDate && errors.dueDate}
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
              </Modal.Body>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
}
export default TaskDetailsModal;
