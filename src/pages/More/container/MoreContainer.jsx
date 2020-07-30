import { connect } from 'react-redux';
import More from '../component/More';
import { MoreActions } from '../modules/MoreActions';

const mapDispatchToProps = (dispatch) => {
  return {
    addClientDetails: MoreActions.addClientDetails,
    addSkillDetails: MoreActions.addSkillDetails,
    addLocationDetails: MoreActions.addLocationDetails,
    addCompetancyDetails: MoreActions.addCompetancyDetails,
    addAssessmentDetails: MoreActions.addAssessmentDetails
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(More);
