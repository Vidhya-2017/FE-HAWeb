import { connect } from 'react-redux';
import CandidateFeedbackNew from '../component/CandidateFeedbackNew';
import { CandidateFeedbackActions } from '../modules/CandidateFeedbackActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList:CandidateFeedbackActions.getEventList,
    getSquadList:CandidateFeedbackActions.getSquadList,
    squadCandidateList:CandidateFeedbackActions.squadCandidateList,
    getEventDetails:CandidateFeedbackActions.getEventDetails,
    candidateFB:CandidateFeedbackActions.candidateFB,
    candidateFeedbackList:CandidateFeedbackActions.candidateFeedbackList,
    candidateSquadFeedbackList: CandidateFeedbackActions.candidateSquadFeedbackList,
    candidateSquadWiseFeedback:CandidateFeedbackActions.candidateSquadWiseFeedback,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateFeedbackNew);
