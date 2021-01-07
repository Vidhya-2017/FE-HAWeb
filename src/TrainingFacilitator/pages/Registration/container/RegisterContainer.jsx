import { connect } from 'react-redux';
import Registration from '../component/Registration';

const mapDispatchToProps = {
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
