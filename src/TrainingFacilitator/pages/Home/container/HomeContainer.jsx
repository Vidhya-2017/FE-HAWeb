import { connect } from 'react-redux';
import { HomeActions } from '../modules/HomeActions';
import HomeList from '../component/Home';

const mapDispatchToProps = (dispatch) => {
  return {
    insertCandidates: HomeActions.insertCandidates,
    getTrainingList: HomeActions.getAllTrainingList,
    getSkillList: HomeActions.getSkillList,
    insertCurriculum: HomeActions.insertCurriculum,
    // importExcel: (data) => dispatch(HomeActions.importExcel(data))
  };
};


const mapStateToProps = (state) => {
  return {
    // importDetails: state.HomeReducer
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeList);


