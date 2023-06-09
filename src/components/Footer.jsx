import { Container } from "react-bootstrap";
import { Intersect } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Container className="mt-auto border-top bg-light" fluid>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-2 py-lg-3 mx-5 my-1 my-lg-2">
        <p className="col-md-4 mb-0 text-muted">Project Manager</p>

        <Link
          to="/"
          className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        >
          <Intersect size={32} color="tomato" title="Logo" className="" />
        </Link>

        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <Link to="/" className="nav-link px-2 text-muted">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link px-2 text-muted">
              About
            </Link>
          </li>
        </ul>
      </footer>
    </Container>
  );
}

export default Footer;
