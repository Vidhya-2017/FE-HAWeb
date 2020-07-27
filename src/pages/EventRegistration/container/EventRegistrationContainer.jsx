import { connect } from 'react-redux';
import EventRegistration from '../component/EventRegistration';
import { EventRegistrationAction } from '../modules/EventRegistrationAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: EventRegistrationAction.getEventList,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventRegistration);
