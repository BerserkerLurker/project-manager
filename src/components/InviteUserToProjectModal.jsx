import React, { forwardRef, useImperativeHandle, useState } from "react";
import useApi from "../hooks/useApi";
import * as Yup from "yup";
import { checkEmail } from "../api/auth";
import { Button, Form, Image, Modal, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import useAuth from "../hooks/useAuth";
import { v4 as uuid } from "uuid";

function AddByEmailModal(props, ref) {
  const [show, setShow] = useState(false);
  const [spin, setSpin] = useState(false);
  const [projectId, setProjectId] = useState();

  // @ts-ignore
  const { assignUserToProject } = useApi();
  // @ts-ignore
  const { user } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setProjectId(e.target.dataset.projectid);
  };
  const { userTeammates, prjMembers } = props;

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
        <Modal.Title>Add project member</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={validationSchema}
        validate={(values) => {
          if (values.email.match(emailRegex)) {
            const errors = {};
            if (values.email === user.email) {
              errors.email = "*You are already a project member";
              return errors;
            }
            const prjMember = prjMembers.find(
              (member) => member.email === values.email
            );

            if (prjMember) {
              errors.email = "*This user is already a project member";
              return errors;
            }

            let mate = userTeammates.find(
              (member) => member.email === values.email
            );

            if (!mate) {
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
          console.log(projectId, values.email);
          assignUserToProject({
            projectId,
            newMemberEmail: values.email,
          })
            .then((res) => {
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
          setFieldValue,
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
                    list="teammates"
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
                  <datalist id="teammates">
                    {userTeammates.map((mate) => (
                      <option value={mate.email} key={uuid()}></option>
                    ))}
                  </datalist>
                  <div className="error-message">
                    <>&nbsp;{errors.email && errors.email}</>
                  </div>
                </Form.Group>
                <h6>Invite a Teammate</h6>
                <div
                  style={{ maxHeight: "130px", overflowY: "scroll" }}
                  className="d-flex flex-wrap gap-1"
                >
                  {userTeammates.map((mate, index) => (
                    <div
                      id={`teammate-card-${index}`}
                      className="d-flex align-items-center border rounded bg-opacity-25"
                      key={`teammate-card-${index}`}
                      style={{
                        flexBasis: "calc(50% - 10px)",
                        minHeight: "60px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        setFieldValue("email", mate.email, true);
                        const cards = document.querySelectorAll(
                          "[id*='teammate-card']"
                        );
                        cards.forEach((element) => {
                          element.classList.remove("bg-primary");
                        });
                        e.currentTarget.classList.add("bg-primary");
                      }}
                    >
                      <Image
                        className="profile-img border-end border-dark border-opacity-50"
                        src={mate.avatar}
                      />
                      &nbsp;
                      <div>
                        <span className="fw-semibold">{mate.name}</span>

                        <span className="small opacity-50 d-block">
                          {mate.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                  Add member
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
