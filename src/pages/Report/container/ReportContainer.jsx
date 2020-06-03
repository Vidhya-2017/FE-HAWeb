import { connect } from 'react-redux';
import Report from '../component/Report';
import {ReportActions} from '../modules/ReportActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: ReportActions.getEventList,
    eventReport: ReportActions.eventReport,
    eventReportWeb: ReportActions.eventReportWeb
  };
};

const mapStateToProps = state => (
  {
    
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Report);
