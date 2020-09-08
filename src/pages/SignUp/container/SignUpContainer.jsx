import { connect } from 'react-redux';
import SignUp from '../component/SignUp';
import { SignUpActions } from '../modules/SignUpActions';

const mapDispatchToProps = (dispatch) => {
  return {
    signUpDetails: SignUpActions.signUpDetails,
    secretQuestions: SignUpActions.secretQuestions,

  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
