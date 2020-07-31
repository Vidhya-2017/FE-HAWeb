import { connect } from 'react-redux';
import CandidateFeedback from '../component/CandidateFeedback';
import { CandidateFeedbackActions } from '../modules/CandidateFeedbackActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList:CandidateFeedbackActions.getEventList,
    getSquadList:CandidateFeedbackActions.getSquadList,
    squadCandidateList:CandidateFeedbackActions.squadCandidateList,
    getEventDetails:CandidateFeedbackActions.getEventDetails,
    candidateFB:CandidateFeedbackActions.candidateFB,
    candidateFeedbackList:CandidateFeedbackActions.candidateFeedbackList,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateFeedback);
