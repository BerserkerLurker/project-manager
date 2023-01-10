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
    <Nav.Item>
      <Nav.Link as={NavLink} to={item.path} onClick={(e) => handleClick(e)}>
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
          const x = item.subNav.map((item, index) => {
            return (
              <Nav.Link
                className="ms-2"
                as={NavLink}
                to={item.path}
                key={index}
              >
                {item.icon}
                <span>&nbsp;{item.title}</span>
              </Nav.Link>
            );
          });
          x.unshift(
            <Nav.Link className="ms-2" as={NavLink} to={"newproject"}>
              <PlusCircle />
              <span>&nbsp;Create New Project</span>
            </Nav.Link>
          );
          return x;
        })()}
    </Nav.Item>
  );
}

export default NavSubMenu;
