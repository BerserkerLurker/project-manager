import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { CheckCircleFill, Plus } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ProfileAvatarsModal(props) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const diceUrl = "https://api.dicebear.com/5.x/bottts/svg?seed=";
  const { show, onHide } = props;
  const n = 10;

  const handleClick = (i) => {
    const checks = document.getElementsByName("check-mark");
    checks.forEach((element) => {
      element.classList.add("visually-hidden");
    });
    document.getElementById("check-" + i).classList.toggle("visually-hidden");
    setAvatarUrl(diceUrl + i);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Choose your Avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-3">
          {[...Array(n)].map((e, i) => (
            <div
              className="position-relative"
              key={i}
              onClick={() => handleClick(i)}
            >
              <Image
                style={{ height: "80px" }}
                className="d-block mt-1 rounded profile-img border border-2 border-secondary"
                src={diceUrl + i}
                alt="user pic"
              />
              <CheckCircleFill
                id={"check-" + i}
                name="check-mark"
                color="green"
                size={15}
                className="position-absolute visually-hidden"
                style={{ top: "5px", left: "65px" }}
              />
            </div>
          ))}

          <Plus
            className="d-block mt-1 rounded-circle profile-img border border-2 border-secondary"
            style={{ height: "80px" }}
            color={"tomato"}
            onClick={() => console.log("Upload Img")}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.handleimgclick(avatarUrl);
            props.onHide();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
