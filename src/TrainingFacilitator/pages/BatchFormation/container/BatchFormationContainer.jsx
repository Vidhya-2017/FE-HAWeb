import { connect } from 'react-redux';
import BatchFormation from '../component/BatchFormation';
import { BatchFormationAction } from '../modules/BatchFormationAction';

const mapDispatchToProps = (dispatch) => {
  return {
      getTrainingList:BatchFormationAction.getTrainingList,
      addBatchName: BatchFormationAction.addBatchName,
      getBatchList: BatchFormationAction.getBatchList,
      getCandidateMapList: BatchFormationAction.getCandidateMapList,
      insertCandidateBatchMap: BatchFormationAction.insertCandidateBatchMap,
    };
};

const mapStateToProps = state => (
  {
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(BatchFormation);
 