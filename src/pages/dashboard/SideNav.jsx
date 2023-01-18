import React from "react";
import { Container, Dropdown, Nav, NavItem } from "react-bootstrap";
import {
  BarChartSteps,
  CalendarEventFill,
  EnvelopeFill,
  ListTask,
  Stack,
} from "react-bootstrap-icons";
import { NavLink, useLocation } from "react-router-dom";
import NavSubMenu from "../../components/NavSubMenu";
import useApi from "../../hooks/useApi";

function SideNav() {
  // @ts-ignore
  let { projectsList } = useApi();
  const location = useLocation();

  const SidebarData = [
    {
      title: "Projects",
      path: "",
      icon: <Stack />,
      subNav: projectsList.map((subItem) => ({
        title: subItem.projectName,
        path: subItem.projectId,
        icon: "",
      })),
    },
  ];

  return (
    <Container>
      <Nav
        activeKey={location.pathname}
        className="d-flex flex-column gap-2 nav-pills"
      >
        <Nav.Item>
          {SidebarData.map((item, index) => {
            return <NavSubMenu item={item} key="sn-0" />;
          })}
        </Nav.Item>

        <Nav.Item>
          <Nav.Link className="border" as={NavLink} to="/boards" key="sn-1">
            <BarChartSteps />
            <span>&nbsp;Board</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link className="border" as={NavLink} to="/calendar" key="sn-2">
            <CalendarEventFill />
            <span>&nbsp;Calendar</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link className="border" as={NavLink} to="/tasks" key="sn-3">
            <ListTask />
            <span>&nbsp;Tasks</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link className="border" as={NavLink} to="/messages" key="sn-4">
            <EnvelopeFill />
            <span>&nbsp;Messages</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}

export default SideNav;
