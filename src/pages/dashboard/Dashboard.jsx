import React from "react";
import { Container } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import SideNav from "./SideNav";

function Dashboard() {
  const pathname = useLocation().pathname;
  return (
    <Container fluid>
      <div className="row row-cols-3 row-cols-lg-4 h-100">
        <div className="col bg-light">
          <SideNav />
        </div>

        <div className="col-2 col-lg-3 flex-grow-1">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb  text-capitalize">
              <li
                className={
                  pathname !== "/"
                    ? "breadcrumb-item"
                    : "breadcrumb-item active"
                }
              >
                {pathname === "/" ? (
                  <span>Dashboard</span>
                ) : (
                  <Link to={"/"}>Dashboard</Link>
                )}
              </li>

              {pathname
                .slice(1)
                .split("/")
                .map((item, index, array) => {
                  return index == array.length - 1 ? (
                    <li
                      key={index}
                      className="breadcrumb-item active"
                      aria-current="page"
                    >
                      {item}
                    </li>
                  ) : (
                    <li
                      key={index}
                      className="breadcrumb-item"
                      aria-current="page"
                    >
                      <Link to={array.slice(0, index + 1).join("/")}>
                        {item}
                      </Link>
                    </li>
                  );
                })}
            </ol>
          </nav>

          <Outlet />
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
