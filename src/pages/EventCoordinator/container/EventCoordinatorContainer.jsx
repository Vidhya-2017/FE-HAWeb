import { connect } from 'react-redux';
import EventCoordinator from '../component/EventCoordinator';
import { EventCoordinatorActions } from '../modules/EventCoordinatorActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: EventCoordinatorActions.getEventList,
    checkIsOrganiser: EventCoordinatorActions.checkIsOrganiser,
    geClientDetailsById: EventCoordinatorActions.geClientDetailsById,
    getPanelList: EventCoordinatorActions.getPanelList,
    getUserBySearch: EventCoordinatorActions.getUserBySearch,
    registerPanel: EventCoordinatorActions.registerPanel
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventCoordinator);
