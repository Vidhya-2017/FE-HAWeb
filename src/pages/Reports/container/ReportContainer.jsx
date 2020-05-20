import { connect } from 'react-redux';
import Report from '../component/Report';
import {ReportActions} from '../modules/ReportActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: ReportActions.getEventList,
    importExcel: ReportActions.importExcel
  };
};

const mapStateToProps = state => (
  {
    
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Report);
