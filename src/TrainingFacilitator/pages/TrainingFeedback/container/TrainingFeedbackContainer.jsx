import { connect } from 'react-redux';
import TrainingFeedback from '../component/TrainingFeedback';
import { TrainingFeedbackAction } from '../modules/TrainingFeedbackAction';

const mapDispatchToProps = (dispatch) => {
    return {
        getTrainingList: TrainingFeedbackAction.getTrainingList,
        getCandidateFeedbackList:TrainingFeedbackAction.getCandidateFeedbackList,
        getCandidateList:TrainingFeedbackAction.getCandidateList

    };
};

const mapStateToProps = state => (
    {
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(TrainingFeedback);