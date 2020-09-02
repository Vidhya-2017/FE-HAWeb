import { connect } from 'react-redux';
import Dashboard from '../component/Dashboard';
import { DashboardActions } from '../modules/DashboardActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getCandidateReport: DashboardActions.getCandidateReport,
    changeCandidateInterviewStatus : DashboardActions.changeCandidateInterviewStatus,
    deleteCandidate : DashboardActions.deleteCandidate,
    getSearchResult: DashboardActions.getSearchResult,
    getCandidatePrimarySkillId: DashboardActions.getCandidatePrimarySkillId,
    updatTp1ScheduleDetails: DashboardActions.updatTp1ScheduleDetails,
    updatTp2ScheduleDetails:DashboardActions.updatTp2ScheduleDetails
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
