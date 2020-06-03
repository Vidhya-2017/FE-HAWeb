import React from 'react';
// import { Link } from "react-router-dom";
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import './scss/Header.scss';
class Header extends React.Component {

  showSidebar = () => {
    document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
  }

  render() {
    return (
      <Navbar className="sb-topnav header bg-dark" variant="dark">
      <button className="btn btn-link" id="sidebarToggle" onClick={this.showSidebar}>
                <i className="fas fa-bars"></i>
            </button>
      <Navbar.Brand  onClick={() => this.props.history.push('/')}>DiEvA</Navbar.Brand>
      {/* <Nav className="mr-auto">
        <Nav.Link href="#">Home</Nav.Link>
      </Nav> */}
      <Nav className="ml-auto">
      <NavDropdown className='userDropdown' title={<i className="fas fa-user fa-fw"></i>} id="userDropdown">
          <NavDropdown.Item aria-labelledby="userDropdown">Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>

    )
  }
}

export default Header;