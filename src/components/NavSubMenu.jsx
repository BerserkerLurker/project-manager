import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { ChevronDown, ChevronUp, PlusCircle } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

function NavSubMenu({ item }) {
  const [subNav, setSubNav] = useState(false);
  const showSubNav = () => setSubNav(!subNav);
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
        <div className="d-flex">
          <span>{item.icon} &nbsp;</span>
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
          const subNavTab = item.subNav.map((item, index) => {
            return (
              <Nav.Item key={"sm-" + index}>
              <Nav.Link
                  className="ms-2 border"
                as={NavLink}
                to={item.path}
                  key={"sm-" + index}
              >
                {item.icon}
                <span>&nbsp;{item.title}</span>
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
