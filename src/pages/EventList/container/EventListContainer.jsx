import { connect } from 'react-redux';
import EventList from '../component/EventList';
import { EventListAction } from '../modules/EventListAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: EventListAction.getEventList,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
