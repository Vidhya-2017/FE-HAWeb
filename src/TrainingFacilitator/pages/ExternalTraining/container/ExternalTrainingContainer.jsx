import { connect } from 'react-redux';
import ExternalTraining from '../component/ExternalTraining';

const mapDispatchToProps = {
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ExternalTraining);
 