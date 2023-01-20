import React from "react";
import {
  Container,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
} from "react-bootstrap";
import {
  DoorOpenFill,
  GearFill,
  Intersect,
  LayoutTextSidebar,
  PersonFill,
} from "react-bootstrap-icons";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Header() {
  // @ts-ignore
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky-lg-top bg-light h-auto" style={{ height: "100px" }}>
      <Navbar  bg="light" expand="lg">
        <Container fluid className="mx-5">
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center mb-2"
          >
            <Intersect color="tomato" size={32} />
            <span>
              {" "}
              &nbsp;
              {/* TODO - title */}
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              className="ms-auto align-items-baseline"
              activeKey={location.pathname}
            >
              {!user ? (
                <>
                  <NavItem>
                    <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  </NavItem>
                  <NavItem>
                    <Nav.Link as={NavLink} to="/signup">
                    Signup
                  </Nav.Link>
                  </NavItem>
                </>
              ) : (
                <NavDropdown
                  title={
                    <>
                      <Image
                        className="rounded-circle profile-img border border-secondary"
                        src="https://avatars.dicebear.com/api/adventurer/1235469874212.svg"
                        alt="user pic"
                      />
                      &nbsp;{user?.name}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  {!(location.pathname === "/") && (
                    <NavDropdown.Item as={NavLink} to="/">
                      <LayoutTextSidebar />
                      <span>&nbsp;Dashboard</span>
                    </NavDropdown.Item>
                  )}

                  {!(location.pathname === "/profile") && (
                    <NavDropdown.Item as={NavLink} to="/profile">
                      <PersonFill />
                      <span>&nbsp;Profile</span>
                    </NavDropdown.Item>
                  )}
                  {!(location.pathname === "/settings") && (
                    <NavDropdown.Item as={NavLink} to="/settings">
                      <GearFill />
                      <span>&nbsp;Settings</span>
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => logout()}>
                    <DoorOpenFill />
                    <span>&nbsp;Logout</span>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
