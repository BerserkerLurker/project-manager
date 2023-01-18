import { Formik } from "formik";
import React from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";

function NewProject() {
  // @ts-ignore
  const { createProject } = useApi();
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
  });
  return (
    <div>
      <Formik
        initialValues={{ name: "", description: "", status: "", dueDate: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          createProject({
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
            <Form.Group controlId="formName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="New project name"
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
              Create Project
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default NewProject;
