import { connect } from 'react-redux';
import { SkillAction } from '../modules/SkillAction';
import SkillList from '../component/SkillList';


const mapDispatchToProps = (dispatch) => {
  return {
    getSkillList: SkillAction.getSkillList,
    deleteSkillList: SkillAction.deleteSkillList,
    addSkillList: SkillAction.addSkillList,
    editSkillList: SkillAction.editSkillList,
    getCurriculumList: SkillAction.getCurriculumList,
    addCurriculum: SkillAction.addCurriculum,
    editCurriculum: SkillAction.editCurriculum,
    delCurriculum: SkillAction.delCurriculum,
    multidelCurriculum: SkillAction.multidelCurriculum
  };
};


const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillList);

