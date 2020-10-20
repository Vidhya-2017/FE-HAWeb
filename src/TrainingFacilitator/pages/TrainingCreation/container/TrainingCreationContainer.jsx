import { connect } from 'react-redux';
import { TrainingCreationAction } from '../modules/TrainingCreationAction';
import TrainingCreation from '../component/TrainingCreation';

const mapDispatchToProps = (dispatch) => {
  return {
	getProgramManager: TrainingCreationAction.getProgramManager,
    getSkillList: TrainingCreationAction.getSkillList,
    getLocation: TrainingCreationAction.getLocation,
    getAccount: TrainingCreationAction.getAccount,
    registerTraining: TrainingCreationAction.registerTraining,
    getTrainingList: TrainingCreationAction.getTrainingList,
    getBatchList: TrainingCreationAction.getBatchList,
    addBatchName: TrainingCreationAction.addBatchName,
    getTrainingType: TrainingCreationAction.getTrainingType,
    getLobList: TrainingCreationAction.getLobList,
    insertCandidate: TrainingCreationAction.insertCandidate,
    getCandidateMapList: TrainingCreationAction.getCandidateMapList,
    insertCandidateBatchMap: TrainingCreationAction.insertCandidateBatchMap,
    getSmeList: TrainingCreationAction.getSmeList,
    getTopicList: TrainingCreationAction.getTopicList,
    submitCurriculum: TrainingCreationAction.submitCurriculum,
    getEditTrainingData: TrainingCreationAction.getEditTrainingData,
    EditTrainingList: TrainingCreationAction.EditTrainingList,
  };
};

const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(TrainingCreation);
 