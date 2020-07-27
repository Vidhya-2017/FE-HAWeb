import { connect } from 'react-redux';
import CandidateSelection from '../component/CandidateSelection';
import { CandidateSelectionActions } from '../modules/CandidateSelectionActions';

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateSelection);
