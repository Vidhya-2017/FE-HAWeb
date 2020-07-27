import { connect } from 'react-redux';
import More from '../component/More';
import { MoreActions } from '../modules/MoreActions';

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(More);
