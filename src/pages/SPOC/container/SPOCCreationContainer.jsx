import { connect } from 'react-redux';
import { SPOCCreationAction } from '../modules/SPOCCreationAction';
import SPOCCreation from '../component/SPOCCreation';


const mapDispatchToProps = (dispatch) => {
  return {
    addSPOC: SPOCCreationAction.addSPOC,
  };
};


const mapStateToProps = (state) => {
  return {
    userDetails: state.loginReducer.userDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SPOCCreation);
 