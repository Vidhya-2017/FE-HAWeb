import React from 'react';
import MaterialTable from "material-table";
import {
    Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent,
    Button
} from '@material-ui/core';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import '../scss/AccountMaster.scss';

const styles = (theme) => ({
    iconRoot: {
        color: '#6b6b6b'
    },
    paperRoot: {
        width: '70%',
        margin: '20px auto',
        padding: '10px 20px'
    },
});

class AccountMaster extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accountMasterListVal: [],
            snackBarOpen: false,
            snackvariant: '',
            snackmsg: '',
            accountName: '',
            showAddAccountMasterModal: false,
            formIsValid: false
        }
        this.columnFields = [
            {
                title: "Account Name",
                field: "account_name",
                validate: rowData => rowData.account_name !== ''
            }
        ]
    }

    componentDidMount() {
        this.props.getAccountMasterList().then((response) => {
            if (response && response.arrRes) {
                this.setState({
                    accountMasterListVal: response.arrRes,
                    snackBarOpen: true,
                    snackvariant: 'success',
                    snackmsg: "Account Master Data loaded successfully"
                })
            } else {
                this.setState({
                    accountMasterListVal: [],
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in loading Account Master Data"
                })
            }
        });
    }

    onCloseSnackBar = () =>{
        this.setState({snackBarOpen:false});
    }


    handleDelete = (id) => {
        const filteredItems = this.state.accountMasterListVal.filter((item) => item.id !== id);
        const reqObj = {
            id: id,
            updated_by: 1
        }

        this.props.deleteAccountMasterList(reqObj).then(response => {
            if (response && response.errCode === 200) {
                this.setState({
                    accountMasterListVal: filteredItems,
                    snackBarOpen: true,
                    snackvariant: 'success',
                    snackmsg: "Account Master deleted successfully",
                });
            }
            else {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in Account Master deletion"
                });
            }

        });
    }

    editSubmit = (newData) => {
        const reqObj = {
            id: newData.id,
            account_name: newData.account_name
        }
        this.props.editAccountMasterList(reqObj).then(response => {
            if (response && response.errCode === 200) {
                this.setState(prevState => ({
                    accountMasterListVal: prevState.accountMasterListVal.map(
                        el => el.id === newData.id ? {
                            ...el,
                            id: newData.id,
                            account_name: newData.account_name
                        } : el
                    )
                }))
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'success',
                    snackmsg: "Account Master Details updated successfully",
                });
            }
            else if (response && response.errCode === 404) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Failed in updating Account Master Details "
                });
            }
            else {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in updating the Account Master Details"
                });
            }
        });
    }

    handleModalSubmit = () => {
        const { accountName } = this.state;
        const reqObj = {
            account_name: accountName
        }
        this.props.addAccountMasterList(reqObj).then(response => {
            if (response && response.errCode === 200) {
                const myObj = {
                    id: response.arrRes,
                    account_name: accountName
                }
                const updatedItems = [...this.state.accountMasterListVal, myObj];
                this.setState({
                    accountName: '',
                    showAddAccountMasterModal: false,
                    accountMasterListVal: updatedItems,
                    snackBarOpen: true,
                    snackvariant: 'success',
                    snackmsg: "Account Master added successfully!"
                })
            }
            else if (response && response.errCode === 404) {
                this.setState({
                    accountName: '',
                    showAddAccountMasterModal: false,
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Account Master Already exists!"
                })
            }
            else {
                this.setState({
                    accountName: '',
                    showAddAccountMasterModal: false,
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in adding Account Master!"
                })
            }
        });
    };

    handleModalClose = () => {
        this.setState({ showAddAccountMasterModal: false, accountName: '' })
    }


    render() {
        const { classes } = this.props;
        const { accountName, snackvariant, snackBarOpen, snackmsg } = this.state;
        return (
            <div className="AccountMaster_container">
                <Dialog
                    disableBackdropClick
                    maxWidth="xs"
                    fullWidth={true}
                    open={this.state.showAddAccountMasterModal}
                    onClose={this.handleModalClose}
                    aria-labelledby="Account Master-Name"
                >
                    <DialogTitle id="Account Master-Name">Add Account Master Details</DialogTitle>
                    <DialogContent >
                        <div style={{ display: 'flex', flexDirection: "column" }}>
                            <Typography style={{ padding: '15px 15px 10px 0' }}>Account Name:</Typography>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                placeholder="Account Name"
                                type="text"
                                name="accountName"
                                value={accountName}
                                onChange={(e) => this.setState({ accountName: e.target.value })}
                            />

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleModalClose} variant="contained" color="primary">
                            Cancel
                </Button>
                        <Button onClick={this.handleModalSubmit} disabled={accountName === '' || accountName === null} variant="contained" color="primary">
                            Submit
                </Button>
                    </DialogActions>
                </Dialog>
                <Paper className={classes.paperRoot} elevation={3}>
                    <Typography variant="h4" className="text-center" gutterBottom>
                        Account Master
            </Typography>
                    <MaterialTable
                        title=""
                        columns={this.columnFields}
                        data={this.state.accountMasterListVal}
                        style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                        options={{
                            actionsColumnIndex: -1,
                            pageSizeOptions: []
                        }}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add Account Master Data',
                                isFreeAction: true,
                                onClick: (event) => this.setState({ showAddAccountMasterModal: true })
                            },
                        ]}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    if (oldData) {
                                        this.editSubmit(newData, oldData);
                                    }
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    this.handleDelete(oldData.id);
                                })
                        }}
                    />
                    {snackBarOpen &&
                        <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AccountMaster);