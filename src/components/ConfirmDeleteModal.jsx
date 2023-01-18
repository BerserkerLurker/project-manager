import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmDeleteModal(props) {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger" id="contained-modal-title-vcenter">
          Delete {props.data.projectName}?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure? This action is irreversible!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            props.data.handler();
            props.onHide();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ConfirmDeleteModal;
