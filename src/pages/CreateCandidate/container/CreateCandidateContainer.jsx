import { connect } from 'react-redux';
import CreateCandidate from '../component/CreateCandidate';
import { CreateCandidateActions } from '../modules/CreateCandidateActions';

const mapDispatchToProps = (dispatch) => {
  return {
    createCandidateForm: CreateCandidateActions.createCandidateForm
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CreateCandidate);
