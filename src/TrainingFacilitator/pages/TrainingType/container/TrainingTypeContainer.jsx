import { connect } from 'react-redux';
import TrainingType from '../component/TrainingType';
import { TrainingTypeAction } from '../modules/TrainingTypeAction';

const mapDispatchToProps = (dispatch) => {
  return {
    getTrainingTypeList: TrainingTypeAction.getTrainingTypeList,
    addTrainingType:TrainingTypeAction.addTrainingType,
    editTrainingType:TrainingTypeAction.editTrainingType,
    deleteTrainingType: TrainingTypeAction.deleteTrainingType,
  };
};

const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(TrainingType);
 