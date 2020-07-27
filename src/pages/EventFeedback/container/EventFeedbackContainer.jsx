import { connect } from 'react-redux';
import EventFeedback from '../component/EventFeedback';
import { EventFeedbackActions } from '../modules/EventFeedbackActions';

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventFeedback);
