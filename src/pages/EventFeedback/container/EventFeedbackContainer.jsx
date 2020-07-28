import { connect } from 'react-redux';
import EventFeedback from '../component/EventFeedback';
import { EventFeedbackActions } from '../modules/EventFeedbackActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList:EventFeedbackActions.getEventList,
    geClientDetailsById:EventFeedbackActions.geClientDetailsById,
    clientFeedbackOnEvent:EventFeedbackActions.clientFeedbackOnEvent,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventFeedback);
