import { connect } from 'react-redux';
import TRCandidateFeedback from '../component/TRCandidateFeedback';
import { TRCandidateFeedbackAction } from '../modules/TRCandidateFeedbackAction';

const mapDispatchToProps = (dispatch) => {
    return {
        insertCandidateFeedback: TRCandidateFeedbackAction.insertCandidateFeedback,
    };
};

const mapStateToProps = state => (
    {
        userDetails: state.loginReducer.userDetails
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(TRCandidateFeedback);