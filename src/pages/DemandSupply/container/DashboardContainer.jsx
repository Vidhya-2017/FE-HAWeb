import { connect } from 'react-redux';
import Dashboard from '../component/Dashboard';
import { DashboardActions } from '../modules/DashboardActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getCandidateReport: DashboardActions.getCandidateReport
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
