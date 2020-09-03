import { connect } from 'react-redux';
import { PanelAction } from '../modules/PanelAction';
import Panel from '../component/Panel';


const mapDispatchToProps = (dispatch) => {
  return {
    getPanel: PanelAction.getPanel,
    deletePanel: PanelAction.deletePanel,
    editPanel: PanelAction.editPanel,
    addPanel: PanelAction.addPanel,
    getSkills: PanelAction.getSkills
  };
};


const mapStateToProps = (state) => {
  return {
    userDetails: state.loginReducer.userDetails
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
 