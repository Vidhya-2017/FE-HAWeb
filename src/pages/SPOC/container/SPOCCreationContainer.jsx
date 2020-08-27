import { connect } from 'react-redux';
import { SPOCCreationAction } from '../modules/SPOCCreationAction';
import SPOCCreation from '../component/SPOCCreation';


const mapDispatchToProps = (dispatch) => {
  return {
    getSPOC: SPOCCreationAction.getSPOC,
    deleteSPOC: SPOCCreationAction.deleteSPOC,
    editSPOC: SPOCCreationAction.editSPOC,
    addSPOC: SPOCCreationAction.addSPOC
  };
};


const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SPOCCreation);
 