import { connect } from 'react-redux';
import TrainingFeedback from '../component/TrainingFeedback';
import { TrainingFeedbackAction } from '../modules/TrainingFeedbackAction';

const mapDispatchToProps = (dispatch) => {
    return {
        getTrainingList: TrainingFeedbackAction.getTrainingList,
        getCandidateFeedbackList:TrainingFeedbackAction.getCandidateFeedbackList,
        getCandidateList:TrainingFeedbackAction.getCandidateList,
        trainingRecomendations:TrainingFeedbackAction.trainingRecomendations,
        getPostAssessmentList:TrainingFeedbackAction.getPostAssessmentList,
        getPreAssessmentList:TrainingFeedbackAction.getPreAssessmentList,
    };
};

const mapStateToProps = state => (
    {
        userDetails: state.loginReducer.userDetails
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(TrainingFeedback);