import { connect } from 'react-redux';
import ForgotPassword from '../component/ForgotPassword';
import { ForgotPasswordActions } from '../modules/ForgotPasswordActions';

const mapDispatchToProps = (dispatch) => {
  return {
    getSecurityQues: ForgotPasswordActions.getSecurityQues,
    validateSecurityQues: ForgotPasswordActions.validateSecurityQues,
    changePassword: ForgotPasswordActions.changePassword,
    
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
