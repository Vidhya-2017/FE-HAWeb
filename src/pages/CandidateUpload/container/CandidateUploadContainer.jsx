import { connect } from 'react-redux';
import CandidateUpload from '../component/CandidateUpload';
import {CandidateUploadActions} from '../modules/CandidateUploadActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: CandidateUploadActions.getEventList,
    importExcel: CandidateUploadActions.importExcel
  };
};

const mapStateToProps = state => (
  {
    
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CandidateUpload);
