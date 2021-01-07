import { connect } from 'react-redux';
import SquadReport from '../component/SquadReport';
import {SquadReportActions} from '../modules/SquadReportActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getEventList: SquadReportActions.getEventList,
    squadEventReport: SquadReportActions.squadEventReport,
    eventReportWeb: SquadReportActions.eventReportWeb,
    getSquadList: SquadReportActions.getSquadList,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
    
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SquadReport);
