import { connect } from 'react-redux';
import Login from '../component/Login';
import { LoginActions } from '../modules/LoginActions';

const mapDispatchToProps = (dispatch) => {
    return {
        loginAuth: (data) => dispatch(LoginActions.loginAuth(data))
    };
  };
  
  const mapStateToProps = state => (
    {
      userDetails: state.loginReducer.userDetails
    }
  );
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login);
  