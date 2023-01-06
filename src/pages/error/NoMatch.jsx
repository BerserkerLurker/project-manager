import React from "react";
import { Link } from "react-router-dom";

function NoMatch() {
  return (
    <div>
      There is nothing here. Go back{" "}
      <Link to={"/"} replace={true}>
        Home
      </Link>
      ?
    </div>
  );
}

export default NoMatch;
