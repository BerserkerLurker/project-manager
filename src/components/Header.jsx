import React, { useEffect, useState } from "react";
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


  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 992) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    if (window.innerWidth < 992) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  function ToggleMenu() {
    if (isMobile) {
      return (
        <>
          {!(location.pathname === "/") && (
            <NavItem>
              <Nav.Link eventKey="0" as={NavLink} to="/">
                <LayoutTextSidebar />
                <span>&nbsp;Dashboard</span>
              </Nav.Link>
            </NavItem>
          )}

          {!(location.pathname === "/profile") && (
            <NavItem>
              <Nav.Link eventKey="1" as={NavLink} to="/profile">
                <PersonFill />
                <span>&nbsp;Profile</span>
              </Nav.Link>
            </NavItem>
          )}
          {!(location.pathname === "/settings") && (
            <NavItem>
              <Nav.Link eventKey="2" as={NavLink} to="/settings">
                <GearFill />
                <span>&nbsp;Settings</span>
              </Nav.Link>
            </NavItem>
          )}
          <NavItem>
            <Nav.Link eventKey="3" onClick={() => logout()}>
              <DoorOpenFill />
              <span>&nbsp;Logout</span>
            </Nav.Link>
          </NavItem>
        </>
      );
    } else {
      return (
        <>
          <NavDropdown
            title={
              <>
                <Image
                  className="rounded-circle profile-img border border-secondary"
                  src={user?.avatar}
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
        </>
      );
    }
  }

  //TODO - Search bar when logged in
  return (
    <header
      className="sticky-lg-top bg-light h-auto"
      style={{ height: "100px" }}
    >
      <Navbar collapseOnSelect={true} bg="light" expand="lg">
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

          <Navbar.Toggle
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              textDecoration: "none",
              fontSize: "inherit",
            }}
            aria-controls="basic-navbar-nav"
          >
            {user && (
              <>
                <Image
                  className="rounded-circle profile-img border border-secondary"
                  src={user?.avatar}
                  alt="user pic"
                />
                &nbsp;{user?.name}
              </>
            )}
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0">
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
                <ToggleMenu />
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
