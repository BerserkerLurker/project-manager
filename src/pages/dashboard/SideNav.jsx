import React from "react";
import { Container, Dropdown, Nav, NavItem } from "react-bootstrap";
import {
  BarChartSteps,
  CalendarEventFill,
  EnvelopeFill,
  ListTask,
  PeopleFill,
  Stack,
} from "react-bootstrap-icons";
import { NavLink, useLocation } from "react-router-dom";
import NavSubMenu from "../../components/NavSubMenu";
import useApi from "../../hooks/useApi";

// TODO - Make it collapseable and an overlay on sm and md https://getbootstrap.com/docs/5.2/components/navbar/#offcanvas
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
    <Container className="sticky-top" style={{ top: "100px" }}>
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
          <Nav.Link
            className="border d-flex align-items-center"
            as={NavLink}
            to="/boards"
            key="sn-1"
          >
            <BarChartSteps />
            <span>&nbsp;Board</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            className="border d-flex align-items-center"
            as={NavLink}
            to="/calendar"
            key="sn-2"
          >
            <CalendarEventFill />
            <span>&nbsp;Calendar</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            className="border d-flex align-items-center"
            as={NavLink}
            to="/tasks"
            key="sn-3"
          >
            <ListTask />
            <span>&nbsp;Tasks</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            className="border d-flex align-items-center"
            as={NavLink}
            to="/teams"
            key="sn-4"
          >
            <PeopleFill />
            <span>&nbsp;Teams</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            className="border d-flex align-items-center"
            as={NavLink}
            to="/messages"
            key="sn-4"
          >
            <EnvelopeFill />
            <span>&nbsp;Messages</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}

export default SideNav;
