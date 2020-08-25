import { connect } from 'react-redux';
import { PreviousEmployerAction } from '../modules/PreviousEmployerAction';
import PreviousEmployer from '../component/PreviousEmployer';


const mapDispatchToProps = (dispatch) => {
  return {
    getPreviousEmployer: PreviousEmployerAction.getPreviousEmployer,
    deletePreviousEmployer: PreviousEmployerAction.deletePreviousEmployer,
    editPreviousEmployer: PreviousEmployerAction.editPreviousEmployer,
    addPreviousEmployer: PreviousEmployerAction.addPreviousEmployer

  };
};

const mapStateToProps = (state) => {
  return {
    userDetails: state.loginReducer.userDetails  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviousEmployer);

