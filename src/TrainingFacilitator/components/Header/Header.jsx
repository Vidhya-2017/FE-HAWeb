import React from 'react';
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './scss/Header.scss';
class Header extends React.Component {
 
  logout(){
   localStorage.clear();
  }

  render() {
    return (
      <>
      {localStorage.getItem('token') === "1"  && this.props !== undefined ? 
      <div className="welcomeDiv">Signed in as : <b><i>{localStorage.getItem('user') }</i></b> </div>

: null }
  <Navbar className="header" expand="lg"  variant="dark">
  <Navbar className="navbar-brand"><Link to="/trainingCreation" className="navLinks_logo"> DiEvA</Link></Navbar>
  {localStorage.getItem('token') === "1"  && this.props !== undefined? 
  <>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
    </Nav>
    <Nav className="onCollapse">
    <div className="bottom"></div>
    <Nav><Link to="/trainingCreation"> Training Registration </Link></Nav>
    {/* <Nav><Link to="/candidateRegistration"> Candidate Registration</Link></Nav> */}
    <Nav><Link to="/TFCandidateSelection"> Candidate Selection</Link></Nav>
    <Nav><Link to="/smeTopicsCovered"> SME Topics Covered</Link></Nav>
    <Nav><Link to="/candidateFeedbackList"> Candidate Feedback</Link></Nav>
    {/* <Nav><Link to="/batchFormation"> Batch Formation</Link></Nav> */}
    <NavDropdown title="Master" id="collasible-nav-dropdown" style={{right: "0", left: "none"}}>
    <Nav><Link className="clr_black" to="/user"> User List </Link></Nav>
    <Nav><Link className="clr_black" to="/skill"> Skill List </Link></Nav>
    <Nav><Link className="clr_black" to="/assesmentType"> Assessment Scale</Link></Nav> 
    <Nav><Link className="clr_black" to="/trainingType"> Training Type</Link></Nav>
    <Nav><Link className="clr_black" to="/trainingList"> Training List</Link></Nav>
    <Nav><Link className="clr_black" to="/durationMaster"> duration master </Link></Nav>
    <Nav><Link className="clr_black" to="/lob"> LOB </Link></Nav>
    </NavDropdown> 
      <Nav><Link  to="/login" onClick ={this.logout}>Logout </Link></Nav>
    </Nav>
  </Navbar.Collapse>
  </>
  : null }
</Navbar>

</>
    )
  }
}

export default Header;