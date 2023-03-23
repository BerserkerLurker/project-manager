import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/auth";

const ResetPassword = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const userId = path.split("/").at(-1);
  const [msg, setMsg] = useState("Resetting password...");
  useEffect(() => {
    // console.log(path,userId);
    const call = async () => {
      try {
        await resetPassword({ userId });
        setMsg(
          "Password successfully reset. Check your inbox. \n Redirecting in 3s..."
        );
        setTimeout(() => {
          navigate("/", {
            replace: true,
          });
        }, 3000);
      } catch (error) {}
    };
    call();
  }, []);
  return <div>{msg}</div>;
};

export default ResetPassword;
