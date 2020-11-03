import { connect } from 'react-redux';
import { SMEAction } from '../modules/SMEAction';
import SMEList from '../component/SMEList';


const mapDispatchToProps = (dispatch) => {
  return {
    getSkillList: SMEAction.getSkillList,
    getSMEList:SMEAction.getSMEList,
    deleteSMEList:SMEAction.deleteSMEList,
    editSMEList:SMEAction.editSMEList,
    addSMEList:SMEAction.addSMEList,
    getRoleList: SMEAction.getRoleList,
  };
};


const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SMEList);
 
 