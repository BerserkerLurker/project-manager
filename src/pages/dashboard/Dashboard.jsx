import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

function Dashboard() {
  return (
    <Container fluid>
      <div className="row row-cols-3 row-cols-lg-4">
        <div className="col">
          <SideNav />
        </div>
        <div className="col-2 col-lg-3 flex-grow-1">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
