import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import SideNavBar from './components/SideNavBar/SideNavBar';
import LoginContainer from './pages/Login/container/LoginContainer';
import DashboardContainer from './pages/Dashboard/container/DashboardContainer';
import CandidateUploadContainer from './pages/CandidateUpload/container/CandidateUploadContainer';
import ReportContainer from './pages/Report/container/ReportContainer';
import SquadReportContainer from './pages/SquadReport/container/SquadReportContainer';
import EventFeedbackContainer from './pages/EventFeedback/container/EventFeedbackContainer';
import EventStatusContainer from './pages/EventStatus/container/EventStatusContainer';
import EventRegistrationContainer from './pages/EventRegistration/container/EventRegistrationContainer';
import DemandDashboardContainer from './pages/DemandSupply/container/DashboardContainer';
import SPOCCreationContainer from './pages/SPOC/container/SPOCCreationContainer';
import PanelContainer from './pages/Panel/container/PanelContainer';
import PreviousEmployerContainer from './pages/PreviousEmployer/container/PreviousEmployerContainer';
import AddRecruitersContainer from './pages/AddRecruiters/container/AddRecruitersContainer';
import CreateCandidateContainer from './pages/CreateCandidate/container/CreateCandidateContainer';
import MoreContainer from './pages/More/container/MoreContainer';
import CandidateFeedbackContainer from './pages/CandidateFeedback/container/CandidateFeedbackContainer';
import SquadFormationContainer from './pages/SquadFormation/container/SquadFormationContainer';
import CandidateSelectionContainer from './pages/CandidateSelection/container/CandidateSelectionContainer';
import EventCoordinatorContainer from './pages/EventCoordinator/container/EventCoordinatorContainer';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import EventListContainer from './pages/EventList/container/EventListContainer';
import SignUpContainer from './pages/SignUp/container/SignUpContainer';
import ForgotPasswordContainer from './pages/ForgotPassword/container/ForgotPasswordContainer';
import './App.scss';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sideBarStyles: {}
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.setSideBar);
    this.setSideBar();
  }

  setSideBar = () => {
    const { userDetails } = this.props;
    let sideBarStyles = {};
    if (userDetails.user_id) {
      if (window.innerWidth < 992) {
        sideBarStyles = {
          padding: 0,
          margin: 0
        }
      } else {
        sideBarStyles = {};
      }
    } else {
      sideBarStyles = {
        padding: 0,
        margin: 0
      }
    }
    this.setState({ sideBarStyles });
  }

  render() {
    const { userDetails } = this.props;
    let sideMenuStyles = {};
    if (userDetails.user_id) {
      if (window.innerWidth < 992) {
        sideMenuStyles = {
          padding: 0,
          margin: 0
        }
      } else {
        sideMenuStyles = {};
      }
    } else {
      sideMenuStyles = {
        padding: 0,
        margin: 0
      }
    }
    return (
      <Fragment>
        <div className='spinnerWrapper hide'>
          <Spinner className='spinner' animation="grow" variant="primary" />
        </div>
        <Header history={this.props.history} />
        <div id="layoutSidenav" className='routerContent'>
          <SideNavBar history={this.props.history} />
          <div style={sideMenuStyles} id="layoutSidenav_content">
            <Switch>
              <Route path="/" exact component={LoginContainer} />
              <Route path="/home" component={DashboardContainer} />
              <Route path="/eventReport" component={ReportContainer} />
              <Route path="/squadReport" component={SquadReportContainer} />
              <Route path="/candidateUpload" component={CandidateUploadContainer} />
              <Route path="/eventRegister" component={EventRegistrationContainer} />
              <Route path="/eventFeedback" component={EventFeedbackContainer} />
              <Route path="/eventStatus" component={EventStatusContainer} />
              <Route path="/demandDashboard" component={DemandDashboardContainer} />
              <Route path="/addSPOC" component={SPOCCreationContainer} />
              <Route path="/previousEmpolyer" component={PreviousEmployerContainer} />
              <Route path="/addRecruiter" component={AddRecruitersContainer} />
              <Route path="/panel" component={PanelContainer} />
              <Route path="/more" component={MoreContainer} />
              <Route path="/createCandidate" component={CreateCandidateContainer} />
              <Route path="/candidateFeedback" component={CandidateFeedbackContainer} />
              <Route path="/squadFormation" component={SquadFormationContainer} />
              <Route path="/candidateSelection" component={CandidateSelectionContainer} />
              <Route path="/eventCoordinator" component={EventCoordinatorContainer} />
              <Route path="/eventList" component={EventListContainer} />
              <Route path="/signUp" component={SignUpContainer} />
              <Route path="/forgotPassword" component={ForgotPasswordContainer} />
            </Switch>
            <Footer />
          </div>
        </div>
      </Fragment>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
