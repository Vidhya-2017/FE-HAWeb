import { connect } from 'react-redux';
import DurationMaster from '../component/DurationMaster';
import { DurationMasterAction } from '../modules/DurationMasterAction';

const mapDispatchToProps = (dispatch) => {
  return {

    getDurationMasterList: DurationMasterAction.getDurationMasterList,
    deleteDurationMasterList: DurationMasterAction.deleteDurationMasterList,
    addDurationMasterList: DurationMasterAction.addDurationMasterList,
    editDurationMasterList: DurationMasterAction.editDurationMasterList
  };
};

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DurationMaster);
