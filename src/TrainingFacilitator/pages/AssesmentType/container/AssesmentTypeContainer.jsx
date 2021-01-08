import { connect } from 'react-redux';
import AssesmentType from '../component/AssesmentType';
import { AssesmentTypeAction } from '../modules/AssesmentTypeAction';

const mapDispatchToProps = (dispatch) => {
  return {
    // setAddAssesmentTypeList: (data) => dispatch( AssesmentTypeAction.setAddAssesmentTypeList(data))

    getAssessmentList: AssesmentTypeAction.getAssessmentList,
    DeleteAssesmentTypeList: AssesmentTypeAction.DeleteAssesmentTypeList,
    setAddAssesmentTypeList:AssesmentTypeAction.setAddAssesmentTypeList,
    EditAssesmentTypeList:AssesmentTypeAction.EditAssesmentTypeList
  };
};

const mapStateToProps = (state) => {
  return{
    userDetails: state.loginReducer.userDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssesmentType);
 