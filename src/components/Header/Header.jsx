import React from 'react';
// import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import './scss/Header.scss';
class Header extends React.Component {

  render() {
    return (
      <Navbar className="header" expand="lg" variant="dark">
        <Navbar.Brand href="/home" className="navLinks_logo" >
          <h3>Hacker Anchor</h3>
          {/* <Link to="/home" className="navLinks_logo"> HCL</Link> */}
        </Navbar.Brand>
      </Navbar>
    )
  }
}

export default Header;