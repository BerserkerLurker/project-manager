import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { forgotpassword, sendVerifyEmail } from "../../api/auth";
import useAuth from "../../hooks/useAuth";

const passwordRegExp =
  /^((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])|(?=.*[\d])(?=.*[A-Z])).{6,40}$/;

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
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div className="mx-auto mt-5 col-5">
      <Container fluid>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          // validator={() => ({})} // Validate all for testing
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setResetMsg('')
            login(values.email, values.password);
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
                Login
              </Button>
              {/* // TODO - handle sendVerifyEmail response */}
              {error && !loading ? (
                <span className="error-message">
                  &nbsp;{" "}
                  {error.response?.data?.msg.includes("verified") ? (
                    <>
                      Please verify your Email to gain access.&nbsp;
                      <Link
                        to={""}
                        onClick={() => sendVerifyEmail({ email: values.email })}
                      >
                        Send me another verification Email.
                      </Link>
                    </>
                  ) : resetMsg === "" ? (
                    <>
                      Incorrect email or password.&nbsp;
                      <Link
                        to={""}
                        onClick={() =>
                          forgotpassword({ email: values.email }).then(
                            (res) => {
                              console.log(res.msg);
                              setResetMsg(res.msg);
                            }
                          )
                        }
                      >
                        I forgot my password, reset it.
                      </Link>
                    </>
                  ) : (
                    <span className="text-success">{resetMsg}</span>
                  )}
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
