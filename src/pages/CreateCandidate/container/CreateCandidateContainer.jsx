import { connect } from 'react-redux';
import CreateCandidate from '../component/CreateCandidate';
import { CreateCandidateActions } from '../modules/CreateCandidateActions';

const mapDispatchToProps = (dispatch) => {
  return {
    createCandidateForm: CreateCandidateActions.createCandidateForm, 
    updateCandidateForm: CreateCandidateActions.updateCandidateForm,   
    getPrimarySkillsReport: CreateCandidateActions.getPrimarySkillsReport,
    getListLocation: CreateCandidateActions.getListLocation,
    getListRecruiter: CreateCandidateActions.getListRecruiter,
    getListSource: CreateCandidateActions.getListSource,
    getListSpoc: CreateCandidateActions.getListSpoc,
    getCompanyLists: CreateCandidateActions.getCompanyLists
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CreateCandidate);
