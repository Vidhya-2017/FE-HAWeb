import { connect } from 'react-redux';
import CandidateSelection from '../component/CandidateSelection';
import { CandidateSelectionAction } from '../modules/CandidateSelectionAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getTrainingList:CandidateSelectionAction.getTrainingList,
    getCandidatesByTrainingList:CandidateSelectionAction.getCandidatesByTrainingList,
    insertCandidates:CandidateSelectionAction.insertCandidates,
  };
};


const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateSelection);
 