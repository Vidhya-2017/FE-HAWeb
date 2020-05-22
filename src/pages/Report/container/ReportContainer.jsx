import { connect } from 'react-redux';
import Report from '../component/Report';
import {ReportActions} from '../modules/ReportActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: ReportActions.getEventList,
  };
};

const mapStateToProps = state => (
  {
    
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Report);
