import { connect } from 'react-redux';
import EventCoordinator from '../component/EventCoordinator';
import { EventCoordinatorActions } from '../modules/EventCoordinatorActions';

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventCoordinator);
