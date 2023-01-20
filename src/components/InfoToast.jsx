import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { CheckCircle, PencilSquare, Trash } from "react-bootstrap-icons";

function InfoToast(props) {
  return (
    <Toast {...props}>
      <Toast.Header
        className={
          props.data.type === "delete" ? "text-danger" : "text-success"
        }
      >
        {props.data.type === "delete" && <Trash />}
        {props.data.type === "edit" && <PencilSquare />}
        {props.data.type === "done" && <CheckCircle />}
        <strong className={`me-auto text-${props.bg}`}>
          &nbsp;{props.data.title}
        </strong>
      </Toast.Header>
      <Toast.Body className="text-white">
        {props.data.type === "done"
          ? `${props.data.title} ${props.data.msg}`
          : `${props.data.msg} ${props.data.title}.`}
      </Toast.Body>
    </Toast>
  );
}

export default InfoToast;
  
