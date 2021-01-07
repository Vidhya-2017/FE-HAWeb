import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Spinner } from 'react-bootstrap';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
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
import TpSchedule from './pages/TpSchedule/container/TpScheduleContainer';
import Footer from './components/Footer/Footer';
import EventListContainer from './pages/EventList/container/EventListContainer';
import SignUpContainer from './pages/SignUp/container/SignUpContainer';
import ForgotPasswordContainer from './pages/ForgotPassword/container/ForgotPasswordContainer';
import DemandDBContainer from './pages/DemandDashboard/container/DemandDBContainer';
// Training Facilitator Imports
import SMEAssignContainer from './TrainingFacilitator/pages/SMEAssign/container/SMEAssignContainer'
// import ForgetPassword from './pages/ForgetPassword/ForgetPassword';
import SMEListContainer from './TrainingFacilitator/pages/SME/container/SMEListContainer';
import SkillListContainer from './TrainingFacilitator/pages/Skill/container/SkillListContainer';
import TrainingCreationContainer from './TrainingFacilitator/pages/TrainingCreation/container/TrainingCreationContainer';
import ExternalTrainingContainer from './TrainingFacilitator/pages/ExternalTraining/container/ExternalTrainingContainer';
import TrainingTypeContainer from './TrainingFacilitator/pages/TrainingType/container/TrainingTypeContainer';
import DurationMasterContainer from './TrainingFacilitator/pages/DurationMaster/container/DurationMasterContainer';
import AssesmentTypeContainer from './TrainingFacilitator/pages/AssesmentType/container/AssesmentTypeContainer';
import CandidateRegistrationContainer from './TrainingFacilitator/pages/CandidateRegistration/container/CandidateRegistrationContainer';
import BatchFormationContainer from './TrainingFacilitator/pages/BatchFormation/container/BatchFormationContainer';
import TFCandidateSelectionContainer from './TrainingFacilitator/pages/CandidateSelection/container/TFCandidateSelectionContainer';
import TrainingListContainer from './TrainingFacilitator/pages/TrainingList/container/TrainingListContainer';
import SMECompletedTopicsContainer from './TrainingFacilitator/pages/SMECompletedTopics/container/SMECompletedTopics';
import LOBListContainer from './TrainingFacilitator/pages/LOB/container/LOBListContainer';
import AccountMasterContainer from './TrainingFacilitator/pages/AccountMaster/container/AccountMasterContainer';
import TrainingFeedbackContainer from './TrainingFacilitator/pages/TrainingFeedback/container/TrainingFeedbackContainer';
import TRCandidateFeedbackContainer from './TrainingFacilitator/pages/TRCandidateFeedback/container/TRCandidateFeedbackContainer';
import PostAssessmentFeedbackContainer from './TrainingFacilitator/pages/PostAssessmentFeedback/container/PostAssessmentFeedbackContainer';
import PreAssessmentFeedbackContainer from './TrainingFacilitator/pages/PreAssessmentFeedback/container/PreAssessmentFeedbackContainer';
// import Home from './TrainingFacilitator/pages/Home/container/HomeContainer';
import './App.scss';
import TrainingDashboard from './TrainingFacilitator/pages/TrainingDashboard/TrainingDashboard';

const outerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#1b91e5',
    },
  },
});
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
      <ThemeProvider theme={outerTheme}>
        <div className='spinnerWrapper hide'>
          <Spinner className='spinner' animation="grow" variant="primary" />
        </div>
        <Header history={this.props.history} />
        <div className='routerContent'>
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
              <Route path="/demand" component={DemandDashboardContainer} />
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
              <Route path="/TpSchedule" component={TpSchedule} />
              <Route path="/demandDashboard" render={(props) => <MuiPickersUtilsProvider utils={MomentUtils}><DemandDBContainer {...props} /></MuiPickersUtilsProvider>} />

              {/* Training Facilitator Route */}
              <Route path="/trainingDashboard" component={TrainingDashboard} />
              <Route path="/trainingCreation" component={TrainingCreationContainer} />
              <Route path="/user" component={SMEListContainer} />
              <Route path="/skill" component={SkillListContainer} />
              <Route path="/externalTraining" component={ExternalTrainingContainer} />
              <Route path="/trainingType" component={TrainingTypeContainer} />
              <Route path="/durationMaster" component={DurationMasterContainer} />
              <Route path="/assesmentType" component={AssesmentTypeContainer} />
              <Route path="/smeAssign" component={SMEAssignContainer} />
              <Route path="/batchFormation" component={BatchFormationContainer} />
              <Route path="/lob" component={LOBListContainer} />
              {/* <Route path="/home" component={Home} />    */}
              {/* <PrivateRoute component={Home} path="/home" /> */}
              <Route path="/candidateRegistration" component={CandidateRegistrationContainer} />
              <Route path="/TFCandidateSelection" component={TFCandidateSelectionContainer} />
              <Route path="/trainingList" component={TrainingListContainer} />
              <Route path="/account" component={AccountMasterContainer} />
              <Route path="/smeTopicsCovered" component={SMECompletedTopicsContainer} />
              <Route path="/candidateFeedbackList" component={TrainingFeedbackContainer} />
              <Route path="/trainingcandidateFeedback" component={TRCandidateFeedbackContainer} />
              <Route path="/preAssessmentFeedback" component={PreAssessmentFeedbackContainer} />
              <Route path="/postAssessmentFeedback" component={PostAssessmentFeedbackContainer} />

            </Switch>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
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
