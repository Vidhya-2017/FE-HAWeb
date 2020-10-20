import { connect } from 'react-redux';
import SMECompletedTopics from '../component/SMECompletedTopics';
import { SMECompletedTopicsAction } from '../modules/SMECompletedTopicsAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getTrainingList: SMECompletedTopicsAction.getTrainingList,
    trainingListDetails:SMECompletedTopicsAction.trainingListDetails,
    getCurriculumBySkill:SMECompletedTopicsAction.getCurriculumBySkill,
    insertCurriculamData: SMECompletedTopicsAction.insertCurriculamData,
  };
};

const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SMECompletedTopics);
 