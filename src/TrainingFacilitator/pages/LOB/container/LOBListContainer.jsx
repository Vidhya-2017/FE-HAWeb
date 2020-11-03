import { connect } from 'react-redux';
import LOBList from '../component/LOBList';
import { LOBAction } from '../modules/LOBAction';

const mapDispatchToProps = (dispatch) => {
    return {
        getLOBList: LOBAction.getLOBList,
        addLOB: LOBAction.addLOB,
        editLOB: LOBAction.editLOB,
        deleteLOB: LOBAction.deleteLOB,
    }
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LOBList);