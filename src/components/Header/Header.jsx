import React from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import * as actionTypes from "../../common/actionTypes/login.actiontype";
import './scss/Header.scss';
class Header extends React.Component {

  showSidebar = () => {
    document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
    const sidebarClassList = document.getElementsByClassName('sb-nav-fixed')[0].className.split(' ').indexOf("sb-sidenav-toggled");
    document.dispatchEvent(new CustomEvent("sideBarToggled", {
      detail: { sideBarToggled: sidebarClassList }
    }))
  }

  LogOut = () => {
    this.props.logout();
    this.props.history.push('/');
  }
  goHome = () => {
    if(this.props.userDetails && this.props.userDetails.user_id) {
      this.props.history.push('/home')
    }
  }
  render() {
    return (
      <Navbar className="sb-topnav header bg-dark" variant="dark">
        {this.props.userDetails && this.props.userDetails.user_id && <button className="btn btn-link" id="sidebarToggle" onClick={this.showSidebar}>
          <i className="fa fa-bars"></i>
        </button>}
        <Navbar.Brand onClick={this.goHome}>DiEvA <span className="brand-name" >  by DNA Capability  </span>
        </Navbar.Brand>
        {/* <Nav className="mr-auto">
        <Nav.Link href="#">Home</Nav.Link>
      </Nav> */}
        {this.props.userDetails && this.props.userDetails.user_id && <Nav className="ml-auto">
          <NavDropdown className='userDropdown' title={<i className="fa fa-user-circle fa-fw"></i>} id="userDropdown">
            <NavDropdown.Item aria-labelledby="userDropdown" onClick={this.LogOut}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>}
      </Navbar>

    )
  }
}


const logout = () => {
    return async (dispatch) => dispatch({
        type : actionTypes.LOGIN_RES,
        payload : {}
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
      logout: () => dispatch(logout())
    };
  };

const mapStateToProps = state => (
    {
      userDetails: state.loginReducer.userDetails
    }
  );
  
  export default connect(mapStateToProps, mapDispatchToProps)(Header);
  