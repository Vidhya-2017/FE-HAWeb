import { connect } from 'react-redux';
import CandidateRegistration from '../component/CandidateRegistration';
import { CandidateRegistrationAction } from '../modules/CandidateRegistrationAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getTrainingList:CandidateRegistrationAction.getTrainingList,
    getLocationList :CandidateRegistrationAction.getLocationList,
    getLobList: CandidateRegistrationAction.getLobList,
    getAccountList: CandidateRegistrationAction.getAccountList,
    insertCandidate: CandidateRegistrationAction.insertCandidate,
  };
};


const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateRegistration);
 