import { Formik } from "formik";
import React from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import * as Yup from "yup";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";

//TODO - Use https://dicebear.com/ for profile customization
function Profile() {
  // @ts-ignore
  const { error, loading, user, updateUser } = useAuth();
  console.log(user);
  
  // @ts-ignore
  const { rolesList, teamsList } = useApi();
  // console.log([...rolesList.map((e) => e.name)]);
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
    newPassword: Yup.string()
      .matches(passwordRegExp, "*Password is not valid")
      .required("*Password is required"),
    role: Yup.string()
      .required("*Role is required")
      .oneOf(
        [...rolesList.map((e) => e._id)],
        "*Role must be one of the provided values"
      ),
    team: Yup.string()
      .required("*Team is required")
      .oneOf(
        [...teamsList.map((e) => e._id)],
        "*Team must be one of the provided values"
      ),
  });

  const handleImageClick = (e) => {
    //TODO - https://cloudinary.com/documentation/image_upload_api_reference for image upload
    const avatarUrl =
      "https://api.dicebear.com/5.x/bottts/svg?seed=" +
      (Math.random() * 10).toFixed(0);
    e.target.src = avatarUrl;
  };

  return (
    <Container>
      {loading ? (
        "loading"
      ) : (
        <>
          <Formik
            initialValues={{
              name: user.name,
              email: user.email,
              newPassword: "",
              avatar: "",
              role: user.role,
              team: user.team,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const { newPassword, ...params } = {
                userId: user.userId,
                password: values.newPassword,
                ...values,
              };
              updateUser(params);
              setSubmitting(false);
              // TODO - show popup onsuccess or failure and reset form maybe navigate to created project
              // console.log(params);
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
              setFieldValue,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="row mt-4">
                  <div className="col">
                    {/* <PersonFill
                  className="d-block mt-3 mx-auto border border-2 rounded-circle  border-secondary"
                  style={{ height: "200px", width: "auto" }}
                /> */}
                    <Image
                      onClick={(e) => {
                        handleImageClick(e);
                        setFieldValue("avatar", e.currentTarget.src);
                      }}
                      style={{ height: "200px" }}
                      className="d-block mt-3 mx-auto rounded-circle profile-img border border-2 border-secondary"
                      src="https://avatars.dicebear.com/api/adventurer/1235469874212.svg"
                      alt="user pic"
                    />
                  </div>
                  <div className="col">
                    <Form.Group controlId="formName">
                      <Form.Label>Name:</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="New project name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        className={
                          touched.name && errors.name ? "has-error" : null
                        }
                      ></Form.Control>

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
                        className={
                          touched.email && errors.email ? "has-error" : null
                        }
                      />
                      <div className="error-message">
                        &nbsp;{touched.email && errors.email && errors.email}
                      </div>
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                      <Form.Label>New Password:</Form.Label>
                      <Form.Control
                        type="text"
                        name="newPassword"
                        placeholder="Your new password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.newPassword}
                        className={
                          touched.newPassword && errors.newPassword
                            ? "has-error"
                            : null
                        }
                      />
                      <div className="error-message">
                        &nbsp;
                        {touched.newPassword &&
                          errors.newPassword &&
                          errors.newPassword}
                      </div>
                    </Form.Group>

                    <Form.Group controlId="formRole">
                      <Form.Label>Role:</Form.Label>
                      <Form.Select
                        name="role"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.role}
                      >
                        <option>Open this select menu</option>
                        {rolesList.map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.name}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="error-message">
                        &nbsp;
                        {touched.role && errors.role && errors.role}
                      </div>
                    </Form.Group>

                    <Form.Group controlId="formTeam">
                      <Form.Label>Team:</Form.Label>
                      <Form.Select
                        name="team"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.team}
                      >
                        <option>Open this select menu</option>
                        {teamsList.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.name}
                          </option>
                        ))}
                      </Form.Select>
                      <div className="error-message">
                        &nbsp;
                        {touched.team && errors.team && errors.team}
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 mx-auto">
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={isSubmitting}
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Container>
  );
}

export default Profile;
