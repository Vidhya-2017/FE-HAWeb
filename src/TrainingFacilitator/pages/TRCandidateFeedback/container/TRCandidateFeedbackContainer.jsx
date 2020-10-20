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
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(TRCandidateFeedback);