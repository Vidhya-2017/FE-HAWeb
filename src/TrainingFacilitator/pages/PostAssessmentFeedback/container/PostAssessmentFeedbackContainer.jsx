import { connect } from 'react-redux';
import PostAssessmentFeedback from '../component/PostAssessmentFeedback';
import { PostAssessmentFeedbackAction } from '../modules/PostAssessmentFeedbackAction';

const mapDispatchToProps = (dispatch) => {
    return {
        postAssessmentFeedback: PostAssessmentFeedbackAction.postAssessmentFeedback,
        getAssessmentList: PostAssessmentFeedbackAction.getAssessmentList,
        
    };
};

const mapStateToProps = state => (
    {
        userDetails: state.loginReducer.userDetails
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(PostAssessmentFeedback);