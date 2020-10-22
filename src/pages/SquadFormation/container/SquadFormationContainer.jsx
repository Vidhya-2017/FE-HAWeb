import { connect } from 'react-redux';
import SquadFormation from '../component/SquadFormation';
import { SquadFormationActions } from '../modules/SquadFormationActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: SquadFormationActions.getEventList,
    checkIsOrganiser: SquadFormationActions.checkIsOrganiser,
    getSquadList: SquadFormationActions.getSquadList,
    addSquad: SquadFormationActions.addSquad,
    getCandidateList: SquadFormationActions.getCandidateList,
    getSquadCandidateList: SquadFormationActions.getSquadCandidateList,
    squadCandidatesInsert: SquadFormationActions.squadCandidatesInsert
    
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SquadFormation);
