import { connect } from 'react-redux';
import SMEAssign from '../component/SMEAssign';
import { SMEAssignAction } from '../modules/SMEAssignAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getTrainingList:SMEAssignAction.getTrainingList,
    getSMEBySearch :SMEAssignAction.getSMEBySearch,
    insertSME: SMEAssignAction.insertSME,
    geSMEByTraining:SMEAssignAction.geSMEByTraining,
  };
};


const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SMEAssign);
 