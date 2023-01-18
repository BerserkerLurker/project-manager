import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";

function InfoToast(props) {
  return (
    <ToastContainer className="p-3" position={"top-end"}>
      <Toast {...props} delay={3000} autohide>
        <Toast.Header
          className={
            props.data.type === "delete" ? "text-danger" : "text-success"
          }
        >
          {props.data.type === "delete" && <Trash />}
          {props.data.type === "edit" && <PencilSquare />}
          <strong className={`me-auto text-${props.bg}`}>
            &nbsp;{props.data.title}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">
          {props.data.msg} {props.data.title}.
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default InfoToast;
