import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { verify } from "../../api/auth";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sub = location.pathname.split("/");
  const [, , userId, token] = [...sub];
  // console.log(userId, token);
  const [tk, setTk] = useState(token);
  const [disabled, setDisabled] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    setDisabled(true);
    try {
      const result = await verify({ userId, token: tk });
      // console.log(result);
      setSuccess(true);
      localStorage.removeItem("userProfile");
      setTimeout(() => {
        navigate("/", {
          replace: true,
          state: {
            data: result,
          },
        });
      }, 3000);
    } catch (error) {
      setErrorMsg(`\xA0*${error.response.data.msg}\xA0`);
      setDisabled(false);
      throw error;
    }
  };
  return (
    <div
      style={{ background: "tomato" }}
      className="vh-100 d-flex flex-column align-items-center justify-content-center"
    >
      <h1 className="mb-3 text-white">Verify Email Address</h1>
      <div className="p-3 w-50 rounded bg-secondary bg-opacity-50">
        <Form
          className="mx-2 mt-2 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {!success ? (
            <>
              <Form.Group className="mb-2">
                <Form.Label className="fs-4 text-white">
                  Verification Code
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="token"
                  type="text"
                  placeholder="token"
                  value={tk}
                  onChange={(e) => setTk(e.target.value)}
                />
                <div className="error-message">
                  <span className="bg-light rounded-1">{errorMsg}</span>
                </div>
              </Form.Group>
              <Button
                disabled={disabled}
                style={{ background: "tomato", border: "solid 2px white" }}
                className="w-100 fs-5"
                type="submit"
              >
                Verify Email
              </Button>
            </>
          ) : (
            <div className="w-100 mt-4 fs-5 text-success bg-light">
              Email successfully verified. Redirecting in 3s...
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default VerifyEmail;
