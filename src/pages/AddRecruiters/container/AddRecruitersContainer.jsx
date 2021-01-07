import { connect } from 'react-redux';
import { AddRecruitersAction } from '../modules/AddRecruitersAction';
import AddRecruiters from '../component/AddRecruiters';


const mapDispatchToProps = (dispatch) => {
  return {
    getRecruiter: AddRecruitersAction.getRecruiter,
    deleteRecruiter: AddRecruitersAction.deleteRecruiter,
    editRecruiter: AddRecruitersAction.editRecruiter,
    addRecruiter: AddRecruitersAction.addRecruiter

  };
};


const mapStateToProps = (state) => {
  return {
    userDetails: state.loginReducer.userDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRecruiters);
 