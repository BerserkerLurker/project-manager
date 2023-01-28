import React, { forwardRef, useImperativeHandle, useState } from "react";
import useApi from "../hooks/useApi";
import * as Yup from "yup";
import { checkEmail } from "../api/auth";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Formik } from "formik";

function AddNewTeamModal(props, ref) {
  const [show, setShow] = useState(false);
  const [spin, setSpin] = useState(false);

  // @ts-ignore
  const { createTeam } = useApi();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(100, "*Team name must be less than 100 characters")
      .required("*Name is required"),
  });

  useImperativeHandle(ref, () => {
    return { handleShow };
  });

  return (
    <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create a new team</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          createTeam({
            name: values.name,
          })
            .then((res) => {
              console.log(res);
              setSubmitting(false);
              handleClose();
            })
            .catch((error) => {
              setSubmitting(false);
              console.log(error);
            });
          // TODO - show popup onsuccess or failure and reset form maybe navigate to created project
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
                  <Form.Label>Team name:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="New Team Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    className={touched.name && errors.name ? "has-error" : ""}
                  ></Form.Control>
                  <div className="error-message">
                    <>&nbsp;{errors.name && errors.name}</>
                  </div>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Create Team
                </Button>
              </Modal.Footer>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
}

export default forwardRef(AddNewTeamModal);
