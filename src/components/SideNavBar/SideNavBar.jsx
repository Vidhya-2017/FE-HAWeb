import React, { Fragment } from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
class SideNavBar extends React.Component {
  constructor(props) {
    super(props);
    const navBars = [{
      pathname: '/home',
      value: 'dashboard',
      id: '0'
    }, {
      pathname: '/candidateUpload',
      value: 'candidateUpload',
      id: '1'
    }, {
      pathname: '/eventReport',
      value: 'eventReport',
      id: '0'
    }, {
      pathname: '/squadReport',
      value: 'squadReport',
      id: '0'
    }, {
      pathname: '/eventDetails',
      value: 'eventDetails',
      id: '1'
    }, {
      pathname: '/manageEvents',
      value: 'manageEvents',
      id: '2'
    }, {
      pathname: '/reports',
      value: 'reports',
      id: '0'
    }, {
      pathname: '/eventRegister',
      value: 'eventRegister',
      id: '1'
    }, {
      pathname: '/eventCoordinator',
      value: 'eventCoordinator',
      id: '2'
    }, {
      pathname: '/candidateSelection',
      value: 'candidateSelection',
      id: '1'
    }, {
      pathname: '/squadFormation',
      value: 'squadFormation',
      id: '2'
    }, {
      pathname: '/candidateFeedback',
      value: 'candidateFeedback',
      id: '2'
    }, {
      pathname: '/eventFeedback',
      value: 'eventFeedback',
      id: '2'
    }, {
      pathname: '/eventStatus',
      value: 'eventStatus',
      id: '0'
    }, {
      pathname: '/more',
      value: 'more',
      id: ''
    }, {
      pathname: '/demand',
      value: 'demand',
      id: ''
    }, {
      pathname: '/addSPOC',
      value: 'SPOC Creation',
      id: ''
    },
    {
      pathname: '/addRecruiter',
      value: 'ADD Recruiters',
      id: ''
    },
    {
      pathname: '/previousEmpolyer',
      value: 'Master Company',
      id: ''
    },
    {
      pathname: '/panel',
      value: 'Panel',
      id: ''
    }, {
      pathname: '/createCandidate',
      value: 'createCandidate',
      id: ''
    },
    {
      pathname: '/eventList',
      value: 'eventList',
      id: '2'
    },
    {
      pathname: '/trainingDashboard',
      value: 'trainingDashboard',
      id: '3'
    },
    {
      pathname: '/trainingCreation',
      value: 'trainingCreation',
      id: '3'
    },{
      pathname: '/TFCandidateSelection',
      value: 'TFCandidateSelection',
      id: '3'
    },{
      pathname: '/smeTopicsCovered',
      value: 'smeTopicsCovered',
      id: '3'
    },{
      pathname: '/candidateFeedbackList',
      value: 'candidateFeedbackList',
      id: '3'
    },{
      pathname: '/user',
      value: 'user',
      id: '3'
    },{
      pathname: '/skill',
      value: 'skill',
      id: '3'
    },{
      pathname: '/assesmentType',
      value: 'assesmentType',
      id: '3'
    },{
      pathname: '/trainingType',
      value: 'trainingType',
      id: '3'
    },{
      pathname: '/trainingList',
      value: 'trainingList',
      id: '3'
    },{
      pathname: '/durationMaster',
      value: 'durationMaster',
      id: '3'
    },{
      pathname: '/lob',
      value: 'lob',
      id: '3'
    }];
    const activeNav = navBars.find(nav => nav.pathname === props.history.location.pathname);
    this.state = {
      activeNav: activeNav ? activeNav.value : '',
      selectedAccordion: activeNav ? activeNav.id : ''
    }
  }


  pageRedirect = (path, activeBtn) => {
    const { selectedAccordion } = this.state;
    let selectedAcc = selectedAccordion;
    if (activeBtn === "more") {
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
    // this.setState({ activeNav });
  }

  accordionSelect = (e) => {
    this.setState({ selectedAccordion: e })

  }
  render() {
    const { selectedAccordion, activeNav } = this.state;
    return (
      <Fragment>
        {this.props.userDetails && this.props.userDetails.user_id ? <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <Accordion defaultActiveKey={selectedAccordion} onSelect={this.accordionSelect}>
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} className={`${selectedAccordion === "0"} nav-link`} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('reports')} eventKey="0">
                      Dashboard
                      <div className={`sb-nav-link-icon ${activeNav === "reports"}`}><i className={`fa ${selectedAccordion === "0" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Fragment>
                        <Button className={`${activeNav === "dashboard"} nav-link`} onClick={() => this.pageRedirect('/home', 'dashboard')}>
                          <div className={`sb-nav-link-icon ${activeNav === "dashboard"}`}><i className="fa fa-tachometer"></i></div>
                          Event Details
                        </Button>
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
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('eventDetails')} className={`${selectedAccordion === "1"} nav-link`} eventKey="1">
                      Register Event
                      <div className={`sb-nav-link-icon ${activeNav === "eventDetails"}`}><i className={`fa ${selectedAccordion === "1" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
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
                    <Accordion.Toggle as={Card.Header} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('manageEvents')} className={`${selectedAccordion === "2"} nav-link`} eventKey="2">
                      Manage Event
                      <div className={`sb-nav-link-icon ${activeNav === "manageEvents"}`}><i className={`fa ${selectedAccordion === "2" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
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
                        <Button className={`${activeNav === "eventList"} nav-link`} onClick={() => this.pageRedirect('/eventList', 'eventList')}>
                          <div className={`sb-nav-link-icon ${activeNav === "eventList"}`}><i className="fa fa-list-alt"></i></div>
                        Event List
                      </Button>
                      </Fragment>
                    </Accordion.Collapse>
                  </Fragment>
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('eventDetails')} className={`${selectedAccordion === "3"} nav-link`} eventKey="3">
                      Demand Supply
                      <div className={`sb-nav-link-icon ${activeNav === "eventDetails"}`}><i className={`fa ${selectedAccordion === "3" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="3">
                      <Fragment>
                        <Button className={`${activeNav === "demand"} nav-link`} onClick={() => this.pageRedirect('/demand', 'demand')}>
                          <div className={`sb-nav-link-icon ${activeNav === "demand"}`}><i className="fa fa-tachometer"></i></div>
                          Dashboard
                        </Button>
                        <Button className={`${activeNav === "addSPOC"} nav-link`} onClick={() => this.pageRedirect('/addSPOC', 'addSPOC')}>
                          <div className={`sb-nav-link-icon ${activeNav === "addSPOC"}`}><i className="fa fa-table"></i></div>
                          ADD SPOC
                        </Button>
                        <Button className={`${activeNav === "addRecruiter"} nav-link`} onClick={() => this.pageRedirect('/addRecruiter', 'addRecruiter')}>
                          <div className={`sb-nav-link-icon ${activeNav === "addRecruiter"}`}><i className="fa fa-list-alt"></i></div>
                          Add Recruiter
                        </Button>
                        <Button className={`${activeNav === "previousEmpolyer"} nav-link`} onClick={() => this.pageRedirect('/previousEmpolyer', 'previousEmpolyer')}>
                          <div className={`sb-nav-link-icon ${activeNav === "previousEmpolyer"}`}><i className="fa fa-list-alt"></i></div>
                          Company List
                        </Button>
                        <Button className={`${activeNav === "panel"} nav-link`} onClick={() => this.pageRedirect('/panel', 'panel')}>
                          <div className={`sb-nav-link-icon ${activeNav === "panel"}`}><i className="fa fa-list-alt"></i></div>
                          Panel
                        </Button>
                      </Fragment>
                    </Accordion.Collapse>
                  </Fragment>
                  <Fragment>
                    <Accordion.Toggle as={Card.Header} style={{ justifyContent: 'space-between', cursor: 'pointer', paddingRight: 10 }} onClick={() => this.eventDetailsOpen('eventDetails')} className={`${selectedAccordion === "4"} nav-link`} eventKey="4">
                      Training Facilitator
                      <div className={`sb-nav-link-icon ${activeNav === "eventDetails"}`}><i className={`fa ${selectedAccordion === "4" ? 'fa-angle-down' : 'fa-angle-right'} fa-lg`}></i></div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="4">
                      <Fragment>
                        <Button className={`${activeNav === "trainingCreation"} nav-link`} onClick={() => this.pageRedirect('/trainingDashboard', 'trainingDashboard')}>
                          <div className={`sb-nav-link-icon ${activeNav === "trainingDashboard"}`}><i className="fa fa-tachometer"></i></div>
                          Training Dashboard
                        </Button>
                        <Button className={`${activeNav === "trainingCreation"} nav-link`} onClick={() => this.pageRedirect('/trainingCreation', 'trainingCreation')}>
                          <div className={`sb-nav-link-icon ${activeNav === "trainingCreation"}`}><i className="fa fa-tachometer"></i></div>
                          Training Registration
                        </Button>
                        <Button className={`${activeNav === "TFCandidateSelection"} nav-link`} onClick={() => this.pageRedirect('/TFCandidateSelection', 'TFCandidateSelection')}>
                          <div className={`sb-nav-link-icon ${activeNav === "TFCandidateSelection"}`}><i className="fa fa-table"></i></div>
                          Candidate Selection
                        </Button>

                        <Button className={`${activeNav === "smeTopicsCovered"} nav-link`} onClick={() => this.pageRedirect('/smeTopicsCovered', 'smeTopicsCovered')}>
                          <div className={`sb-nav-link-icon ${activeNav === "smeTopicsCovered"}`}><i className="fa fa-table"></i></div>
                          SME Topics Covered
                        </Button>
                        <Button className={`${activeNav === "candidateFeedbackList"} nav-link`} onClick={() => this.pageRedirect('/candidateFeedbackList', 'candidateFeedbackList')}>
                          <div className={`sb-nav-link-icon ${activeNav === "candidateFeedbackList"}`}><i className="fa fa-table"></i></div>
                          Candidate Feedback
                        </Button>
                        <Button className={`${activeNav === "user"} nav-link`} onClick={() => this.pageRedirect('/user', 'user')}>
                          <div className={`sb-nav-link-icon ${activeNav === "user"}`}><i className="fa fa-table"></i></div>
                          User List
                        </Button>
                        <Button className={`${activeNav === "skill"} nav-link`} onClick={() => this.pageRedirect('/skill', 'skill')}>
                          <div className={`sb-nav-link-icon ${activeNav === "skill"}`}><i className="fa fa-table"></i></div>
                          Skill List
                        </Button>
                        <Button className={`${activeNav === "assesmentType"} nav-link`} onClick={() => this.pageRedirect('/assesmentType', 'assesmentType')}>
                          <div className={`sb-nav-link-icon ${activeNav === "assesmentType"}`}><i className="fa fa-table"></i></div>
                          Assessment Scale
                        </Button>
                        <Button className={`${activeNav === "trainingType"} nav-link`} onClick={() => this.pageRedirect('/trainingType', 'trainingType')}>
                          <div className={`sb-nav-link-icon ${activeNav === "trainingType"}`}><i className="fa fa-table"></i></div>
                          Training Type
                        </Button>
                        <Button className={`${activeNav === "trainingList"} nav-link`} onClick={() => this.pageRedirect('/trainingList', 'trainingList')}>
                          <div className={`sb-nav-link-icon ${activeNav === "trainingList"}`}><i className="fa fa-table"></i></div>
                          Training List
                        </Button>
                        <Button className={`${activeNav === "durationMaster"} nav-link`} onClick={() => this.pageRedirect('/durationMaster', 'durationMaster')}>
                          <div className={`sb-nav-link-icon ${activeNav === "durationMaster"}`}><i className="fa fa-table"></i></div>
                          Duration List
                        </Button>
                        <Button className={`${activeNav === "lob"} nav-link`} onClick={() => this.pageRedirect('/lob', 'lob')}>
                          <div className={`sb-nav-link-icon ${activeNav === "lob"}`}><i className="fa fa-table"></i></div>
                          LOB
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
