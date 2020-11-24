import React, { Fragment, Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {
  TextField, InputAdornment, Divider, Button, Dialog, DialogContent, DialogActions,
  List, ListItem, Typography, ListItemSecondaryAction, ListItemText
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Alert, AlertTitle } from '@material-ui/lab';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});


class AddCoordinator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      search: '',
      btnDisable: false,
      users: [],
      selectedUsers: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showUserModal !== this.state.showModal) {
      this.setState({ showModal: nextProps.showUserModal })
    }
  }

  searchUsers = (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      const req = { searchData: value }
      this.props.getUserBySearch(req).then((res) => {
        this.setState({
          users: [...res.userList], search: value
        })
      })
    } else {
      this.setState({ search: value, users: this.state.users })
    }
  }

  handleClose = () => {
    this.props.handleModalSubmit([]);
    this.setState({ showModal: false, users: [], search: '', selectedUsers: [] });
  }

  handleOnSubmit = () => {
    const userList = [...this.state.selectedUsers];
    this.setState({
      showModal: false, users: [], selectedUsers: [], search: ''
    }, () => {
      this.props.handleModalSubmit(userList);
    })
  }
  addUsers = (user) => {
    const userAvailable = this.state.selectedUsers.findIndex(list => list.user_id === user.user_id);
    if (userAvailable === -1) {
      this.setState({
        selectedUsers: this.state.selectedUsers.concat(user),
        users: this.state.users.filter(list => list.user_id !== user.user_id),
        btnDisable: this.state.selectedUsers.concat(user).length > 0
      });
    } else {
      console.log('---user already exists');
    }
  }

  deleteUser = (user) => {
    const updatedSelectedUsers = this.state.selectedUsers.filter(list => list.user_id !== user.user_id);
    this.setState({
      selectedUsers: updatedSelectedUsers,
      btnDisable: updatedSelectedUsers.length > 0,
      users: this.state.users.concat(user)
    })
  }

  render() {
    const { showModal, search, btnDisable, users, selectedUsers } = this.state;
    const listStyle = {
      border: 'solid 1px #EEEEEE',
      padding: 0,
      boxShadow: '1px 2px 2px #EEEEEE'
    }
    return (
      <Dialog open={showModal} fullWidth>
        <DialogTitle onClose={this.handleClose}> Add Coordinators </DialogTitle>
        <DialogContent>
          <div className="searchContainer">
            <TextField type="text" variant="outlined" label="Search Users" size="small" fullWidth
              onChange={this.searchUsers} value={search} InputProps={{
                endAdornment: (
                  <>
                    <InputAdornment position="end"> <SearchIcon /> </InputAdornment>
                    {search && <InputAdornment onClick={() => this.setState({ search: '' })} position="end">  <CloseIcon /></InputAdornment>}
                  </>
                )
              }}
            />
          </div>
          {users && users.length === 0 && selectedUsers && selectedUsers.length === 0 && search.length >= 3 &&
            <Alert severity="error" style={{marginTop: 10, marginBottom: 10 }}>
              No records found.
            </Alert>
          }
          {users.length > 0 && <List dense>
            {users.map((user) =>
              <ListItem key={user.user_id}>
                <ListItemText primary={user.first_name} secondary={user.email} />
                <ListItemSecondaryAction>
                  <Button key={user.user_id} color="primary" variant="outlined" size="small" onClick={() => this.addUsers(user)}>Add</Button>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>}
          {selectedUsers.length > 0 &&
            <div><Typography variant="h6">Select Users</Typography>
              <List dense disablePadding style={listStyle}>
                {selectedUsers.map((user) =>
                  <Fragment key={`${user.user_id}${user.first_name}`}>
                    <ListItem key={`${user.user_id}${user.first_name}`}>
                      <ListItemText primary={user.first_name} secondary={user.email} />
                      <ListItemSecondaryAction>
                        <IconButton key={`${user.user_id}${user.first_name}`} edge="end" onClick={() => this.deleteUser(user)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="fullWidth" component="li" />
                  </Fragment>
                )}
              </List>
            </div>}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" type="submit" onClick={this.handleOnSubmit} disabled={!btnDisable}>
            Add to Member List
            </Button>
        </DialogActions>
      </Dialog>
    )
  }
}


export default AddCoordinator;