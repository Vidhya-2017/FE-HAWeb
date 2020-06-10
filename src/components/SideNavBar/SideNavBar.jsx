import React, { Fragment } from 'react';
import {Button} from 'react-bootstrap';
import { connect } from 'react-redux';
class SideNavBar extends React.Component{

    pageRedirect = (path) =>{
        this.props.history.push(path);
        // if( window.innerWidth < 992) {
        //   document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
        // }
    }

    render(){
        return(
          <Fragment>
            {this.props.userDetails && this.props.userDetails.user_id ? <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                  <div className="sb-sidenav-menu">
                    <div className="nav">
                      <div className="sb-sidenav-menu-heading">Core</div>
                      <Button className="nav-link" onClick={() => this.pageRedirect('/home')}>
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        Dashboard
                      </Button>
                      <Button className="nav-link" onClick={() => this.pageRedirect('/candidateUpload')}>
                        <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                        Candidate Upload
                      </Button>
                      <Button className="nav-link" onClick={() => this.pageRedirect('/eventReport')}>
                        <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                        Event Report
                      </Button>
                      <Button className="nav-link" onClick={() => this.pageRedirect('/squadReport')}>
                        <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
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

