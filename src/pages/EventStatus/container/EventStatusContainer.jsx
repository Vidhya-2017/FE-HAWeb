import { connect } from 'react-redux';
import EventStatus from '../component/EventStatus';
import { EventStatusActions } from '../modules/EventStatusActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList:EventStatusActions.getEventList,
    getSummary:EventStatusActions.getSummary,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventStatus);
