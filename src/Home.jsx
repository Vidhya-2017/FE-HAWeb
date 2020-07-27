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
import EventRegistrationContainer from './pages/EventRegistration/container/EventRegistrationContainer';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
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
