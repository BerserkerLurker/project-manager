import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";

const passwordRegExp =
  /^((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])|(?=.*[\d])(?=.*[A-Z])).{6,30}$/;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "*Name must be atleast 3 characters")
    .max(100, "*Name must be less than 100 characters")
    .required("*Name is required"),
  email: Yup.string()
    .email("*Must be a valid email address")
    .max(100, "*Email must be less than 100 characters")
    .required("*Email is required"),
  password: Yup.string()
    .matches(passwordRegExp, "*Password is not valid")
    .required("*Password is required"),
});

function SignUp() {
  // @ts-ignore
  const { error, loading, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  });

  const [errMsg, setErrMsg] = useState("Something went wrong try again.");

  return (
    <div className="mx-auto mt-5 col-5">
      <Container fluid>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={validationSchema}
          // validator={() => ({})} // Validate all for testing
          onSubmit={(values, { setSubmitting, resetForm }) => {
            signUp(values.email, values.name, values.password)
              .then((res) => {
                console.log(res.msg);
                setMsg(res.msg);
              })
              .catch((err) => {
                if (err?.response?.status === 400) {
                  if (err.response.data.msg.includes("Duplicate")) {
                    setErrMsg("This email is already used.");
                  } else {
                    setErrMsg(err.response.data.msg);
                  }
                }
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
            <Form onSubmit={handleSubmit} className="mx-auto">
              <Form.Group controlId="formName">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Your name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className={touched.name && errors.name ? "has-error" : null}
                />
                <div className="error-message">
                  &nbsp;{touched.name && errors.name && errors.name}
                </div>
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder="Your email address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className={touched.email && errors.email ? "has-error" : null}
                />
                <div className="error-message">
                  &nbsp;{touched.email && errors.email && errors.email}
                </div>
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  placeholder="Your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className={
                    touched.password && errors.password ? "has-error" : null
                  }
                />
                <div className="error-message">
                  &nbsp;{touched.password && errors.password && errors.password}
                </div>
              </Form.Group>
              <Button
                className="w-100 mt-1"
                variant="primary"
                type="submit"
                disabled={loading}
              >
                Signup
              </Button>
              {error && !loading ? (
                <span className="error-message">
                  &nbsp;{" "}
                  {errMsg.includes("used") ? (
                    <>
                      {errMsg}&nbsp;Try to&nbsp;
                      <Link to={"login"} onClick={() => console.log("sent")}>
                        Login
                      </Link>
                      .
                    </>
                  ) : (
                    errMsg + "."
                  )}
                </span>
              ) : (
                ""
              )}
            </Form>
          )}
        </Formik>
        <p className="text-center text-success mt-2">{msg}</p>
      </Container>
    </div>
  );
}

export default SignUp;
