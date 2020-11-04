import { connect } from 'react-redux';
import { MoreActions } from '../modules/MoreActions';
import More from '../component/More';


const mapDispatchToProps = (dispatch) => {
  return {
    // Client
    getClient: MoreActions.getClient,
    deleteClient: MoreActions.deleteClient,
    editClient: MoreActions.editClient,
    addClient: MoreActions.addClient,
    // Location
    getLocation: MoreActions.getLocation,
    deleteLocation: MoreActions.deleteLocation,
    editLocation: MoreActions.editLocation,
    addLocation: MoreActions.addLocation,

    // Skill
    getSkill: MoreActions.getSkill,
    deleteSkill: MoreActions.deleteSkill,
    editSkill: MoreActions.editSkill,
    addSkill: MoreActions.addSkill,

    // Competancy
    getCompetancy: MoreActions.getCompetancy,
    deleteCompetancy: MoreActions.deleteCompetancy,
    editCompetancy: MoreActions.editCompetancy,
    addCompetancy: MoreActions.addCompetancy,

    // Assessment
    getAssessment: MoreActions.getAssessment,
    deleteAssessment: MoreActions.deleteAssessment,
    editAssessment: MoreActions.editAssessment,
    addAssessment: MoreActions.addAssessment


  };
};


const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(More);
 