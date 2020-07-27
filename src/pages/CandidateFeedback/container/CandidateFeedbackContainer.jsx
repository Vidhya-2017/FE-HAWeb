import { connect } from 'react-redux';
import CandidateFeedback from '../component/CandidateFeedback';
import { CandidateFeedbackActions } from '../modules/CandidateFeedbackActions';

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateFeedback);
