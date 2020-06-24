import { connect } from 'react-redux';
import Dashboard from '../component/Dashboard';
import { DashboardActions } from '../modules/DashboardActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: DashboardActions.getEventList,
    feedbackSummary: DashboardActions.feedbackSummary,
    eventReportWeb: DashboardActions.eventReportWeb,
    getSquadList: DashboardActions.getSquadList,
    panelFeedbackReport: DashboardActions.panelFeedbackReport
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
