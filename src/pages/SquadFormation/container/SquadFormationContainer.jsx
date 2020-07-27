import { connect } from 'react-redux';
import SquadFormation from '../component/SquadFormation';
import { SquadFormationActions } from '../modules/SquadFormationActions';

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(SquadFormation);
