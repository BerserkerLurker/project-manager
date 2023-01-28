import React, { forwardRef, useImperativeHandle, useState } from "react";
import useApi from "../hooks/useApi";
import * as Yup from "yup";
import { checkEmail } from "../api/auth";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Formik } from "formik";

function AddByEmailModal(props, ref) {
  const [show, setShow] = useState(false);
  const [spin, setSpin] = useState(false);
  const [teamId, setTeamId] = useState();

  // @ts-ignore
  const { addTeamMember } = useApi();

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setTeamId(e.target.dataset.teamid);
  };
  const { myteams } = props;
  const targetTeamMembers = myteams.find((e) => e._id === teamId)?.members;
  console.log(targetTeamMembers);

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // const { teamId, teamNewName, inviteeEmail } = props.data;
  // TODO - add updateTeam
  //   const { updateTeam } = useApi();

  //   const validationSchema = Yup.object().shape({
  //     name: Yup.string()
  //       .max(100, "*Team name must be less than 100 characters")
  //       .required("*Name is required"),
  //   });
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(emailRegex, "*Must be a valid email address")
      .max(100, "*Email must be less than 100 characters")
      .required("*Email is required"),
  });

  useImperativeHandle(ref, () => {
    return { handleShow };
  });

  return (
    <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add team member</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={validationSchema}
        validate={(values) => {
          if (values.email.match(emailRegex)) {
            const errors = {};
            let mate = targetTeamMembers.find(
              (member) => member.memberId.email === values.email
            );
            console.log(mate);
            if (mate) {
              if (mate.status === "accepted") {
                errors.email = "*User is already a team member";
                return errors;
              } else if (mate.status === "pending") {
                errors.email =
                  "*User already has an invitation to join this team";
                return errors;
              }
            } else {
              setSpin(true);
              return checkEmail({ email: values.email })
                .then((res) => {
                  if (!res.exists) {
                    errors.email = "*No user corresponds to this email address";
                    return errors;
                  }
                })
                .catch((error) => {
                  console.log(error);
                })
                .finally(() => setSpin(false));
            }
          }
        }}
        onSubmit={(values, { setSubmitting }) => {
          addTeamMember({
            teamId,
            inviteeEmail: values.email,
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
                <Form.Group controlId="formEmail">
                  <Form.Label>
                    Email:
                    {spin && (
                      <Spinner size="sm" animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="User Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={
                      touched.email && errors.email
                        ? "has-error"
                        : touched.email && !errors.email
                        ? "has-no-error"
                        : ""
                    }
                  ></Form.Control>
                  <div className="error-message">
                    <>&nbsp;{errors.email && errors.email}</>
                  </div>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Discard
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || errors.email !== undefined}
                >
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

export default forwardRef(AddByEmailModal);
