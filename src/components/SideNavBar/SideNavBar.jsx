import React, { Fragment } from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
class SideNavBar extends React.Component {
  constructor(props) {
    super(props);
    const navBars = [{
      pathname: '/home',
      value: 'dashboard',
      id: ''
    }, {
      pathname: '/candidateUpload',
      value: 'candidateUpload',
      id: '0'
    }, {
      pathname: '/eventReport',
      value: 'eventReport',
      id: '2'
    }, {
      pathname: '/squadReport',
      value: 'squadReport',
      id: '2'
    }, {
      pathname: '/eventDetails',
      value: 'eventDetails',
      id: '0'
    }, {
      pathname: '/manageEvents',
      value: 'manageEvents',
      id: '1'
    }, {
      pathname: '/reports',
      value: 'reports',
      id: '2'
    }, {
      pathname: '/eventRegister',
      value: 'eventRegister',
      id: '0'
    }, {
      pathname: '/eventCoordinator',
      value: 'eventCoordinator',
      id: '1'
    }, {
      pathname: '/candidateSelection',
      value: 'candidateSelection',
      id: '0'
    }, {
      pathname: '/squadFormation',
      value: 'squadFormation',
      id: '1'
    }, {
      pathname: '/candidateFeedback',
      value: 'candidateFeedback',
      id: '1'
    }, {
      pathname: '/eventFeedback',
      value: 'eventFeedback',
      id: '1'
    }, {
      pathname: '/eventStatus',
      value: 'eventStatus',
      id: '2'
    }, {
      pathname: '/more',
      value: 'more',
      id: ''
    }];
    const eventDetailLinks = [
      "eventRegister", "eventCoordinator", "candidateSelection", "squadFormation", "candidateFeedback", "eventFeedback", "eventStatus"
    ];
    const activeNav = navBars.find(nav => nav.pathname === props.history.location.pathname);
    const isEventDetailLink = activeNav && eventDetailLinks.find(item => item === activeNav.value);
    this.state = {
      activeNav: activeNav ? activeNav.value : '',
      selectedAccordion: activeNav ? activeNav.id : ''
    }
  }


  pageRedirect = (path, activeBtn) => {
    console.log('----path---', path);
    console.log('----activeBtn---', activeBtn);
    const { selectedAccordion } = this.state;
    let selectedAcc = selectedAccordion;
    if(activeBtn === "dashboard" || activeBtn === "more") {
      selectedAcc = null;
    }
    this.setState({ activeNav: activeBtn, selectedAccordion: selectedAcc });
    this.props.history.push(path);
    if (window.innerWidth < 992) {
      document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.userDetails.user_id === undefined) {
      this.setState({ activeNav: 'dashboard' });
    }
  }
  eventDetailsOpen = (activeNav) => {
    this.setState({ activeNav });
  }

  accordionSelect = (e) => {
    this.setState({ selectedAccordion: e })

  }
  render() {
    const { selectedAccordion, activeNav } = this.state;
    console.log('---selectedAccordion---', selectedAccordion);
    return (
      <Fragment>
        {this.props.userDetails && this.props.userDetails.user_id ? <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Core</div>
                <Button className={`${activeNav === "dashboard"} nav-link`} onClick={() => this.pageRedirect('/home', 'dashboard')}>
                  <div className={`sb-nav-link-icon ${activeNav === "dashboard"}`}><i className="fa fa-tachometer"></i></div>
                  Dashboard
                </Button>
                <Accordion defaultActiveKey={selectedAccordion ? selectedAccordion : ''} onSelect={this.accordionSelect}>
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('eventDetails')} className={`${selectedAccordion === "0"} nav-link`} eventKey="0">
                      Register Event
                      <div className={`sb-nav-link-icon ${activeNav === "eventDetails"}`}><i className={`fa ${selectedAccordion === "0" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Fragment>
                        <Button className={`${activeNav === "eventRegister"} nav-link`} onClick={() => this.pageRedirect('/eventRegister', 'eventRegister')}>
                          <div className={`sb-nav-link-icon ${activeNav === "eventRegister"}`}><i className="fa fa-registered"></i></div>
                          Event Registration
                        </Button>
                        <Button className={`${activeNav === "candidateUpload"} nav-link`} onClick={() => this.pageRedirect('/candidateUpload', 'candidateUpload')}>
                          <div className={`sb-nav-link-icon ${activeNav === "candidateUpload"}`}><i className="fa fa-table"></i></div>
                        Candidate Upload
                      </Button>
                        <Button className={`${activeNav === "candidateSelection"} nav-link`} onClick={() => this.pageRedirect('/candidateSelection', 'candidateSelection')}>
                          <div className={`sb-nav-link-icon ${activeNav === "candidateSelection"}`}><i className="fa fa-code-fork"></i></div>
                        Candidate Selection
                      </Button>
                      </Fragment>
                    </Accordion.Collapse>
                  </Fragment>
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('manageEvents')} className={`${selectedAccordion === "1"} nav-link`} eventKey="1">
                      Manage Event
                      <div className={`sb-nav-link-icon ${activeNav === "manageEvents"}`}><i className={`fa ${selectedAccordion === "1" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                      <Fragment>
                        <Button className={`${activeNav === "eventCoordinator"} nav-link`} onClick={() => this.pageRedirect('/eventCoordinator', 'eventCoordinator')}>
                          <div className={`sb-nav-link-icon ${activeNav === "eventCoordinator"}`}><i className="fa fa-code-fork"></i></div>
                          Event Coordinators
                        </Button>
                        <Button className={`${activeNav === "squadFormation"} nav-link`} onClick={() => this.pageRedirect('/squadFormation', 'squadFormation')}>
                          <div className={`sb-nav-link-icon ${activeNav === "squadFormation"}`}><i className="fa fa-users"></i></div>
                          Squad Formation
                        </Button>
                        <Button className={`${activeNav === "candidateFeedback"} nav-link`} onClick={() => this.pageRedirect('/candidateFeedback', 'candidateFeedback')}>
                          <div className={`sb-nav-link-icon ${activeNav === "candidateFeedback"}`}><i className="fa fa-comments-o"></i></div>
                          Candidate Feedback
                        </Button>
                        <Button className={`${activeNav === "eventFeedback"} nav-link`} onClick={() => this.pageRedirect('/eventFeedback', 'eventFeedback')}>
                          <div className={`sb-nav-link-icon ${activeNav === "eventFeedback"}`}><i className="fa fa-code-fork"></i></div>
                        Event Feedback
                      </Button>
                      </Fragment>
                    </Accordion.Collapse>
                  </Fragment>
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} className={`${selectedAccordion === "2"} nav-link`} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('reports')}  eventKey="2">
                      Reports
                      <div className={`sb-nav-link-icon ${activeNav === "reports"}`}><i className={`fa ${selectedAccordion === "2" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                      <Fragment>
                        <Button className={`${activeNav === "eventStatus"} nav-link`} onClick={() => this.pageRedirect('/eventStatus', 'eventStatus')}>
                          <div className={`sb-nav-link-icon ${activeNav === "eventStatus"}`}><i className="fa fa-bar-chart"></i></div>
                        Event Status
                      </Button>
                        <Button className={`${activeNav === "squadReport"} nav-link`} onClick={() => this.pageRedirect('/squadReport', 'squadReport')}>
                          <div className={`sb-nav-link-icon ${activeNav === "squadReport"}`}><i className="fa fa-area-chart"></i></div>
                      Squad Report
                    </Button>
                        <Button className={`${activeNav === "eventReport"} nav-link`} onClick={() => this.pageRedirect('/eventReport', 'eventReport')}>
                          <div className={`sb-nav-link-icon ${activeNav === "eventReport"}`}><i className="fa fa-area-chart"></i></div>
                        Event Report
                      </Button>
                      </Fragment>
                    </Accordion.Collapse>
                  </Fragment>
                </Accordion>
                <Button className={`${activeNav === "more"} nav-link`} onClick={() => this.pageRedirect('/more', 'more')}>
                  <div className={`sb-nav-link-icon ${activeNav === "more"}`}><i className="fa fa-ellipsis-v"></i></div>
                  More
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

