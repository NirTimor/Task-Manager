import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

const NavBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      if (onLogout) {
        onLogout();
      }

      navigate("/login");
    }
  };

  return (
    <Navbar fixed="top" expand="lg" className="custom-navbar bg-primary text-light">
      <Container>
        <Navbar.Brand 
          className="navbar-brand" 
          onClick={() => navigate("/home")} 
          style={{ cursor: "pointer" }}
        >
          Welcome to Task-Manager!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate("/home")} className="text-light">Home</Nav.Link>
            <Nav.Link onClick={() => navigate("/completedtasks")} className="text-light">My Completed Tasks</Nav.Link>
            <Nav.Link onClick={handleLogout} className="text-light">Log Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
