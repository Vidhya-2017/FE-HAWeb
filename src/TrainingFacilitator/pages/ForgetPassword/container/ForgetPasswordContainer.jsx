import { connect } from 'react-redux';
import ForgetPassword from '../component/ForgetPassword';

const mapDispatchToProps = {
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
