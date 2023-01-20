import { Formik } from "formik";
import moment from "moment";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import useApi from "../hooks/useApi";

function EditModal(props, ref) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {
    projectId,
    projectName,
    description,
    status: projectStatus,
    isDone,
    dueDate,
  } = props.data;
  console.log(props.data);

  // @ts-ignore
  const { updateProject } = useApi();
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
    dueDate: Yup.date().required("*Due Date is required"),
    isDone: Yup.boolean(),
  });

  useImperativeHandle(ref, () => {
    return { handleShow };
  });
  return (
    <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          name: projectName,
          description: description,
          status: projectStatus,
          dueDate: moment(dueDate).format("YYYY-MM-DDThh:mm:ss"),
          isDone: isDone,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          updateProject({
            id: projectId,
            ...values,
            dueDate: new Date(values.dueDate).toISOString(),
          }).then(() => {
            setSubmitting(false);
            handleClose();
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
              <Modal.Body>
                <Form.Group controlId="formName">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Project name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    onKeyDown={handleOnKeyDown}
                  ></Form.Control>

                  <div className="error-message">
                    <>&nbsp;{touched.name && errors.name && errors.name}</>
                  </div>
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Descripe your project"
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
                    value={values.status}
                  >
                    <option>Open this select menu</option>
                    <option value="onTrack">On Track</option>
                    <option value="atRisk">At Risk</option>
                    <option value="offTrack">Off Track</option>
                  </Form.Select>
                  <div className="error-message">
                    <>
                      &nbsp;{touched.status && errors.status && errors.status}
                    </>
                  </div>
                </Form.Group>
                <Form.Group controlId="formDate">
                  <Form.Label>Due Date:</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.dueDate}
                  ></Form.Control>
                  <div className="error-message">
                    &nbsp;{touched.dueDate && errors.dueDate && errors.dueDate}
                  </div>
                </Form.Group>
                <Form.Group controlId="formIsDone">
                  <Form.Label>Progress:</Form.Label>
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
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Discard
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
}
export default forwardRef(EditModal);
