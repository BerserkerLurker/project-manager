import React from "react";
import { Container, Dropdown, Nav, NavItem } from "react-bootstrap";
import { ChevronDown, ChevronUp, HeartFill } from "react-bootstrap-icons";
import { NavLink, useLocation } from "react-router-dom";
import NavSubMenu from "../../components/NavSubMenu";

function SideNav() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Container>
      <Nav
        activeKey={location.pathname}
        className="d-flex flex-column gap-2 nav-pills"
      >
        <Nav.Item>
          {SidebarData.map((item, index) => {
            return <NavSubMenu item={item} key={index} />;
          })}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/boards">
            Boards
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/calendar">
            Calendar
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/tasks">
            Tasks
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={NavLink} to="/messages">
            Messages
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}
const SidebarData = [
  {
    title: "Projects",
    path: "",
    icon: <HeartFill />,

    // from api
    subNav: [
      {
        title: "Project1",
        path: "/project/1",
        icon: "",
      },
      {
        title: "Project2",
        path: "/project/2",
        icon: "",
      },
      {
        title: "Project3",
        path: "/project/3",
        icon: "",
      },
    ],
  },
];
export default SideNav;
