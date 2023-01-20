import React, { useEffect, useState } from "react";
import { Badge, Button, Form, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import * as Yup from "yup";
import { Formik } from "formik";
import TaskDetailsModal from "../../components/TaskDetailsModal";

// TODO - Change new task to use TaskDetailsModal
function Tasks() {
  // @ts-ignore
  const { projectsList: projects, tasksList: tasks, createTask } = useApi();

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [taskModalData, setTaskModalData] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [badgeProps, setBadgeProps] = useState(
    projects.map((p) => {
      return {
        projectId: p.projectId,
        projectName: p.projectName,
        filterOut: false,
        tasksL: tasks.filter((e) => e.projectId === p.projectId),
      };
    })
  );

  useEffect(() => {
    setBadgeProps(
      badgeProps.map((p) => {
        return {
          ...p,
          tasksL: tasks.filter((e) => e.projectId === p.projectId),
        };
      })
    );
  }, [tasks]);

  const handleTaskFilter = (e) => {
    const index = e.target.getAttribute("data-index");
    const items = [...badgeProps];
    const item = { ...items[index] };
    item.filterOut = !item.filterOut;
    items[index] = item;

    setBadgeProps(items);
  };

  const handleShowForm = () => setShowForm(!showForm);

  function handleOnKeyDown(keyEvent) {
    if (keyEvent.key === "Enter") {
      keyEvent.preventDefault();
    }
  }

  const projectsIds = projects.map((project) => project.projectId);

  const validationSchema = Yup.object().shape({
    projectId: Yup.string()
      .required("*Task must have a parent project")
      .oneOf(projectsIds, "*Not a valid project"),
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
      <Button onClick={handleShowForm}>New Task</Button>
      <div className={!showForm ? "d-none" : ""}>

        <div>
          <Formik
            initialValues={{
              projectId: "",
              name: "",
              description: "",
              status: "",
              priority: "",
              dueDate: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              createTask({
                ...values,
                dueDate: new Date(values.dueDate).toISOString(),
              }).then(() => setSubmitting(false));
      
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
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formParentProject">
                  <Form.Label>Parent Project:</Form.Label>
                  <Form.Select
                    name="projectId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option>Open this select menu</option>
                    {projects.map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </option>
                    ))}
                  </Form.Select>
                  <div className="error-message">
                    &nbsp;
                    {touched.projectId && errors.projectId && errors.projectId}
                  </div>
                </Form.Group>

                <Form.Group controlId="formName">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="New task name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    onKeyDown={handleOnKeyDown}
                  ></Form.Control>

                  <div className="error-message">
                    &nbsp;{touched.name && errors.name && errors.name}
                  </div>
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description:</Form.Label>
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
                </Form.Group>

                <Form.Group controlId="formStatus">
                  <Form.Label>Status:</Form.Label>
                  <Form.Select
                    name="status"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option>Open this select menu</option>
                    <option value="onTrack">On Track</option>
                    <option value="atRisk">At Risk</option>
                    <option value="offTrack">Off Track</option>
                  </Form.Select>
                  <div className="error-message">
                    &nbsp;{touched.status && errors.status && errors.status}
                  </div>
                </Form.Group>

                <Form.Group controlId="formPriority">
                  <Form.Label>Priority:</Form.Label>
                  <Form.Select
                    name="priority"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option>Open this select menu</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                  <div className="error-message">
                    &nbsp;
                    {touched.priority && errors.priority && errors.priority}
                  </div>
                </Form.Group>
           
                <Form.Group controlId="formDate">
                  <Form.Label>Due Date:</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></Form.Control>
                  <div className="error-message">
                    &nbsp;{touched.dueDate && errors.dueDate && errors.dueDate}
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Create Task
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="mt-2">
        {badgeProps.map((project, index) => (
          <Badge
            key={project.projectId}
            data-key={project.projectId}
            data-index={index}
            pill
            bg={project.filterOut ? "secondary" : "primary"}
            className="me-1 fs-6"
            style={{ cursor: "pointer" }}
            onClick={(e) => handleTaskFilter(e)}
          >
            {project.projectName}
          </Badge>
        ))}
      </div>
      <ListGroup as="ol" variant="flush">
        {badgeProps.map((project) => {
          if (!project.filterOut) {
            return project.tasksL.map((task, index) => (
              <ListGroup.Item
                as="li"
                key={index}
                onClick={() => {
                  setShowTaskDetailsModal(true);
                  setTaskModalData(task);
                }}
              >
                <Link to="" className={task.isDone && "text-decoration-line-through"}>{task.taskName}</Link>
              </ListGroup.Item>
            ));
          }
        })}

      </ListGroup>
      <TaskDetailsModal
        show={showTaskDetailsModal}
        onHide={() => setShowTaskDetailsModal(false)}
        data={taskModalData}
      />
    </>
  );
}

export default Tasks;
