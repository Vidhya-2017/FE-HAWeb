import { connect } from 'react-redux';
import DemandDashboard from '../component/DemandDashboard';
import { DemandDBAction } from '../modules/DemandDBAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getDemandReport: DemandDBAction.getDemandReport,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(DemandDashboard);
