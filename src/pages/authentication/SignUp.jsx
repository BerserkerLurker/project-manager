import { Formik } from "formik";
import React from "react";
import { Button, Container, Form } from "react-bootstrap";
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
  const { error, loading, signUp } = useAuth();
  return (
    <div>
      SignUp
      <Container fluid>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={validationSchema}
          // validator={() => ({})} // Validate all for testing
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // setSubmitting(true);
            signUp(values.email, values.name, values.password);
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
                {touched.name && errors.name ? (
                  <div className="error-message">{errors.name}</div>
                ) : null}
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
                Signup
              </Button>
              {error && !loading ? (
                <span className="error-message">
                  &nbsp; Something went wrong try again.
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

export default SignUp;
