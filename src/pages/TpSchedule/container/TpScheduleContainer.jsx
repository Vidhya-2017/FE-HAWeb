import { connect } from 'react-redux';
import TpSchedule from '../component/TpSchedule';
import { DashboardActions } from '../modules/TpScheduleActions';
import { CreateCandidateActions } from '../../CreateCandidate/modules/CreateCandidateActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getCandidateReport: DashboardActions.getCandidateReport,
    changeCandidateInterviewStatus : DashboardActions.changeCandidateInterviewStatus,
    deleteCandidate : DashboardActions.deleteCandidate,
    getSearchResult: DashboardActions.getSearchResult,
    getCandidatePrimarySkillId: DashboardActions.getCandidatePrimarySkillId,
    updatTp1ScheduleDetails: DashboardActions.updatTp1ScheduleDetails,
    updatTp2ScheduleDetails:DashboardActions.updatTp2ScheduleDetails,
    editCandidate :DashboardActions.editCandidate,
    getPrimarySkillsReport: CreateCandidateActions.getPrimarySkillsReport,
    getListLocation: CreateCandidateActions.getListLocation,
    getListRecruiter: CreateCandidateActions.getListRecruiter,
    getListSource: CreateCandidateActions.getListSource,
    getListSpoc: CreateCandidateActions.getListSpoc,
    candidateDetails: DashboardActions.candidateDetails,
    getCompanyLists: CreateCandidateActions.getCompanyLists,
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(TpSchedule);
