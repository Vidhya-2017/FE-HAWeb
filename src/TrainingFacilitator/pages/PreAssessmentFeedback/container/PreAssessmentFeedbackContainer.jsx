import { connect } from 'react-redux';
import PreAssessmentFeedback from '../component/PreAssessmentFeedback';
import { PreAssessmentFeedbackAction } from '../modules/PreAssessmentFeedbackAction';

const mapDispatchToProps = (dispatch) => {
    return {
        insertPreAssessmentFeedback: PreAssessmentFeedbackAction.insertPreAssessmentFeedback,
    };
};

const mapStateToProps = state => (
    {
        userDetails: state.loginReducer.userDetails
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(PreAssessmentFeedback);