import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { ChevronDown, ChevronUp, PlusCircle } from "react-bootstrap-icons";
import { NavLink, useLocation } from "react-router-dom";

function NavSubMenu({ item }) {
  const location = useLocation();

  const [subNav, setSubNav] = useState(false);
  const showSubNav = () => setSubNav(!subNav);
  useEffect(() => {
    if (location.pathname.includes("project")) {
      setSubNav(true);
    }
  }, [location.pathname]);
  const handleClick = (e) => {
    if (item.subNav) {
      showSubNav();
    }
    if (item.path === "") {
      e.preventDefault();
    }
  };
  return (
    <Nav.Item className="d-flex flex-column gap-2" key="sm-88">
      <Nav.Link onClick={(e) => handleClick(e)} className="border" key="sm-88">
        <div className="d-flex align-items-center">
          {item.icon} &nbsp;
          <span>{item.title}&nbsp;</span>
          <span className="ms-auto">
            {item.subNav && subNav ? (
              <ChevronUp />
            ) : item.subNav ? (
              <ChevronDown />
            ) : null}
          </span>
        </div>
      </Nav.Link>

      {subNav &&
        (() => {
          const subNavTab = item.subNav.map((subItem, index) => {
            return (
              <Nav.Item key={"sm-" + index}>
                <Nav.Link
                  className="ms-2 border"
                  as={NavLink}
                  to={`project/${subItem.path}`}
                  key={"sm-" + index}
                >
                  {subItem.icon}
                  <span>&nbsp;{subItem.title}</span>
                </Nav.Link>
              </Nav.Item>
            );
          });
          subNavTab.unshift(
            <Nav.Item key="sm-99">
              <Nav.Link
                key="sm-99"
                className="ms-2 border"
                as={NavLink}
                to={"newproject"}
              >
                <PlusCircle />
                <span>&nbsp;Create New Project</span>
              </Nav.Link>
            </Nav.Item>
          );
          return subNavTab;
        })()}
    </Nav.Item>
  );
}

export default NavSubMenu;
