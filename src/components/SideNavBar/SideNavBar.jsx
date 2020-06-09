import React from 'react';
import {Button} from 'react-bootstrap';

class SideNavBar extends React.Component{

    pageRedirect = (path) =>{
        this.props.history.push(path);
        if( window.innerWidth < 992) {
          document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
        }
    }

    render(){
        return(
            <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                  <div className="sb-sidenav-menu">
                    <div className="nav">
                      <div className="sb-sidenav-menu-heading">Core</div>
                      <Button className="nav-link" onClick={() => this.pageRedirect('/')}>
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
                    ADMIN
                    </div>
                </nav>
              </div>
        )
    }
}

export default SideNavBar;
