import { Formik } from "formik";
import React, { useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";

const passwordRegExp =
  /^((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])|(?=.*[\d])(?=.*[A-Z])).{6,30}$/;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("*Must be a valid email address")
    .max(100, "*Email must be less than 100 characters")
    .required("*Email is required"),
  password: Yup.string()
    .matches(passwordRegExp, "*Password is not valid")
    .required("*Password is required"),
});

function Login() {
  // @ts-ignore
  const { error, loading, login, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div>
      Login
      <Container fluid>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          // validator={() => ({})} // Validate all for testing
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // setSubmitting(true);
            login(values.email, values.password);
            // resetForm();
            // setSubmitting(false);
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
                {touched.email && errors.email ? (
                  <div className="error-message">{errors.email}</div>
                ) : null}
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
                {touched.password && errors.password ? (
                  <div className="error-message">{errors.password}</div>
                ) : null}
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading}>
                Login
              </Button>
              {error && !loading ? (
                <span className="error-message">
                  &nbsp; Incorrect email or password
                </span>
              ) : (
                ""
              )}
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
}

export default Login;
