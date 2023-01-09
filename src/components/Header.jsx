import React from "react";
import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Intersect } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Header() {
  // @ts-ignore
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header>
      <Navbar bg="light" expand="lg" className="sticky-top">
        <Container>
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
            <Nav className="ms-auto align-items-baseline">
              {!user ? (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
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
                    <NavDropdown.Item as={Link} to="/">
                      Dashboard
                    </NavDropdown.Item>
                  )}

                  {!(location.pathname === "/profile") && (
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                  )}
                  {!(location.pathname === "/settings") && (
                    <NavDropdown.Item as={Link} to="/settings">
                      Settings
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
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
