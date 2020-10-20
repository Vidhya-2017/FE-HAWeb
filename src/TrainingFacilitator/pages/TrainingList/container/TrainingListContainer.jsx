import { connect } from 'react-redux';
import TrainingList from '../component/TrainingList';
import { TrainingListAction } from '../modules/TrainingListAction';

const mapDispatchToProps = (dispatch) => {
  return {
     getTrainingList: TrainingListAction.getTrainingList,
     DeleteTrainingList: TrainingListAction.DeleteTrainingList,
     EditTrainingList:TrainingListAction.EditTrainingList,
     getSkillList: TrainingListAction.getSkillList,
     getLocation: TrainingListAction.getLocation,
     getAccount: TrainingListAction.getAccount,
     getTrainingType:TrainingListAction.getTrainingType,
     getSMEList:TrainingListAction.getSMEList,
  };
};

const mapStateToProps = (state) => {
  return{
    TrainingList: state.TrainingListReducer
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(TrainingList);
 