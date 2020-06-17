import React, { Fragment } from 'react';
import {Button} from 'react-bootstrap';
import { connect } from 'react-redux';
class SideNavBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeNav: 'dashboard'
    }
  }
    pageRedirect = (path, activeBtn) =>{
      this.setState({ activeNav: activeBtn });
        this.props.history.push(path);
        if( window.innerWidth < 992) {
          document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
        }
    }

    render(){
        return(
          <Fragment>
            {this.props.userDetails && this.props.userDetails.user_id ? <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                  <div className="sb-sidenav-menu">
                    <div className="nav">
                      <div className="sb-sidenav-menu-heading">Core</div>
                      <Button className={`${this.state.activeNav === "dashboard"} nav-link`} onClick={() => this.pageRedirect('/home', 'dashboard')}>
                        <div className={`sb-nav-link-icon ${this.state.activeNav === "dashboard"}`}><i className="fas fa-tachometer-alt"></i></div>
                        Dashboard
                      </Button>
                      <Button className={`${this.state.activeNav === "candidateUpload"} nav-link`} onClick={() => this.pageRedirect('/candidateUpload', 'candidateUpload')}>
                        <div className={`sb-nav-link-icon ${this.state.activeNav === "candidateUpload"}`}><i className="fas fa-table"></i></div>
                        Candidate Upload
                      </Button>
                      <Button className={`${this.state.activeNav === "eventReport"} nav-link`} onClick={() => this.pageRedirect('/eventReport', 'eventReport')}>
                        <div className={`sb-nav-link-icon ${this.state.activeNav === "eventReport"}`}><i className="fas fa-chart-area"></i></div>
                        Event Report
                      </Button>
                      <Button className={`${this.state.activeNav === "squadReport"} nav-link`} onClick={() => this.pageRedirect('/squadReport', 'squadReport')}>
                        <div className={`sb-nav-link-icon ${this.state.activeNav === "squadReport"}`}><i className="fas fa-chart-area"></i></div>
                        Squad Report
                      </Button>
                    </div>
                  </div>
                  <div className="sb-sidenav-footer">
                    <div className="small">Logged in as:</div>
                    {this.props.userDetails.first_name.toUpperCase()}
                    </div>
                </nav>
              </div> : null}
              </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SideNavBar);

