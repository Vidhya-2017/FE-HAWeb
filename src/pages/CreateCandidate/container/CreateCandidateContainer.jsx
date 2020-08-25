import { connect } from 'react-redux';
import CreateCandidate from '../component/CreateCandidate';
import { CreateCandidateActions } from '../modules/CreateCandidateActions';

const mapDispatchToProps = (dispatch) => {
  return {
    createCandidateForm: CreateCandidateActions.createCandidateForm,    
    getPrimarySkillsReport: CreateCandidateActions.getPrimarySkillsReport,
    getListLocation: CreateCandidateActions.getListLocation,
    getListRecruiter: CreateCandidateActions.getListRecruiter,
    getListSource: CreateCandidateActions.getListSource,
    getListSpoc: CreateCandidateActions.getListSpoc
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CreateCandidate);
