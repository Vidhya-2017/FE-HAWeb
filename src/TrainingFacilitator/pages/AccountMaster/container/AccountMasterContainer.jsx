import { connect } from 'react-redux';
import AccountMaster from '../component/AccountMaster';
import { AccountMasterAction } from '../modules/AccountMasterAction';

const mapDispatchToProps = (dispatch) => {
    return {

        getAccountMasterList: AccountMasterAction.getAccountMasterList,
        deleteAccountMasterList: AccountMasterAction.deleteAccountMasterList,
        addAccountMasterList: AccountMasterAction.addAccountMasterList,
        editAccountMasterList: AccountMasterAction.editAccountMasterList
    };
};

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountMaster);