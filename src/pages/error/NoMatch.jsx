import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NoMatch() {
  return (
    <Container>
      There is nothing here. Go back{" "}
      <Link to={"/"} replace={true}>
        Home
      </Link>
      ?
    </Container>
  );
}

export default NoMatch;
