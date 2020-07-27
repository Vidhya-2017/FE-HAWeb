import { connect } from 'react-redux';
import EventRegistration from '../component/EventRegistration';
import { EventRegistrationAction } from '../modules/EventRegistrationAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: EventRegistrationAction.getEventList,
    getEventByUser: EventRegistrationAction.getEventByUser,
    getAdminBySearch: EventRegistrationAction.getAdminBySearch,
    registerEvent: EventRegistrationAction.registerEvent,
    editEvent: EventRegistrationAction.editEvent,
    geClientDetailsList: EventRegistrationAction.geClientDetailsList,
    addClientDetails: EventRegistrationAction.addClientDetails,
    closeEvent: EventRegistrationAction.closeEvent,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventRegistration);
