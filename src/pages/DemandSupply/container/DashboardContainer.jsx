import { connect } from 'react-redux';
import Dashboard from '../component/Dashboard';
import { DashboardActions } from '../modules/DashboardActions';
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
    CandidatesbulkUpload: DashboardActions.CandidatesbulkUpload,
    getCandidatecv: DashboardActions.getCandidatecv
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
