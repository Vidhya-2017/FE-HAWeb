import React from 'react';
import { Row, Col, FormControl, InputGroup, ListGroup, Form, Toast } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/EventCoordinator.scss';
import {
  Grid, TextField, InputAdornment, Checkbox, FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableRow, Card, Switch, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, List, ListItem, ListItemSecondaryAction, ListItemText
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SearchIcon from '@material-ui/icons/Search';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

class EventCoordinator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: '',
      EventDetailsList: [],
      userList: [],
      clientName: '',
      searchedText: '',
      eventSelected: null,
      clientId: '',
      users: [],
      showUserModal: false,
      btnDisable: false
    }
  }

  componentDidMount() {
    this.props.getEventList().then((response) => {
      if (response && response.arrRes) {
        const eventList = response.arrRes.map(list => {
          return {
            value: list.EventId,
            EventId: list.EventId,
            label: list.Name
          }
        });
        this.setState({ EventDetailsList: eventList, loading: false });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });
  }

  handleEventChange = (e, eventSelected) => {
    this.setState({ eventSelected, userList: [], clientName: '' });
    let id = eventSelected.value;
    let clientName = '';
    let clientId = '';
    let userList = [];
    const user_id = this.props.userDetails.user_id;
    const isPanelReq = { eventID: id, userID: user_id };
    this.props.checkIsOrganiser(isPanelReq).then((panelRes) => {
      if (panelRes && panelRes.ispanel !== '' && !panelRes.ispanel) {
        const reqObj = { eventId: id };
        if (id) {
          this.props.geClientDetailsById(reqObj).then((response) => {
            if (response && response.arrRes) {
              clientId = response.arrRes[0].ClientId;
              clientName = response.arrRes[0].ClientName;
              this.props.getPanelList(reqObj).then((res) => {
                if (res.errCode === 200) {
                  userList = res.arrRes;
                }
                this.setState({
                  clientName, clientId, userList
                });
              })
            }
          })
        }
      } else {
        this.setState({ toastMsg: "You don't have permission. Please contact Organiser.", showToast: true });
      }
    });
  }

  toggleUserRole = (e, list) => {
    const { userList } = this.state;
    const userIndex = userList.findIndex((user) => user.user_id === list.user_id);
    const updatedUserList = [...userList];
    updatedUserList[userIndex].ispanel = !e.target.checked;
    this.setState({ userList: updatedUserList });
  }

  removeUser = (e) => {
    this.setState({
      userList: this.state.userList.filter((val) => { return val.user_id !== e.user_id })
    })
  }

  submitPanel = () => {
    if (this.state.userList && this.state.userList.length !== 0) {
      this.submitPanelReg();
    }
    else {
      this.setState({
        loading: false,
        showToast: true,
        toastMsg: 'Please Select User'
      })
    }
  }

  submitPanelReg = () => {
    const user_id = this.props.userDetails.user_id;
    const { eventSelected } = this.state;
    const userList = this.state.userList.map((list) => {
      return {
        uid: list.user_id,
        ispanel: list.ispanel
      };
    });
    var dateTime = new Date();
    var date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    const reqObj = {
      ClientId: this.state.clientId,
      EventId: eventSelected.value,
      Userdetail: userList,
      CreatedDate: date,
      CreatedBy: user_id,
      UpdatedBy: user_id,
      UpdatedDate: date,
    }
    this.setState({ loading: true });
    this.props.registerPanel(reqObj).then((response) => {
      if (response.errCode === 200) {
        this.setState({
          eventSelected: null,
          loading: false,
          showToast: true,
          userList: [],
          clientName: '',
          clientId: '',
          toastMsg: 'Panel Registered successfully.'
        })
      } else {
        this.setState({
          loading: false,
          showToast: true,
          toastMsg: 'Something went wrong. Please try again later.'
        })
      }
    });
  }

  viewUserList = () => {
    this.setState({ showUserModal: true });
  }

  handleClose = () => this.setState({ showUserModal: false });

  searchUsers = (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      const req = { 'searchData': value }
      this.props.getUserBySearch(req).then((res) => {
        this.setState({
          users: res.userList, search: value, btnDisable: true
        })
      })

    }
    if (value.length === 0) {
      this.setState({ users: [], search: value })
    }
  }


  handleUserCheckClick = (e, list) => {
    if (e.target.checked) {
      const userData = list;
      userData.ispanel = true;
      this.updatedUserList = [...this.state.userList, userData];
    }
    else {
      this.updatedUserList = this.state.userList.filter((val) => { return val.ID !== e.target.value.ID })
    }
  }

  handleOnSubmit = () => {
    this.setState({
      userList: this.updatedUserList, showUserModal: false
    })
  }

  render() {
    const { eventSelected, users, EventDetailsList, showUserModal, userList, clientName, showToast, toastMsg } = this.state;
    return (
      <div className='eventCoordWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Event Coordinators</h3>
          {eventSelected && <i onClick={this.viewUserList} className="addUser fa fa-user-plus" aria-hidden="true"></i>}
        </div>
        <div className='eventCoordForm'>
          <div className='paper'>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <span>Event Name:</span>
              </Grid>
              <Grid item xs={7}>
                <Autocomplete
                  options={EventDetailsList}
                  getOptionLabel={option => option.label}
                  value={eventSelected}
                  defaultValue={eventSelected}
                  onChange={this.handleEventChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Event Name"
                      placeholder="Event Name"
                      margin="dense"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
          {eventSelected && eventSelected.value && clientName &&
            <p className="clientName">Client: {clientName}</p>
          }
          {userList && eventSelected && <p className='memberLabel'>Member List:</p>}
          {userList && eventSelected && <p className='toggleNote'>Note: Toggle this to become Event Organiser.</p>}
          {userList && userList.length === 0 && eventSelected &&
            <TextField
              fullWidth
              disabled
              error
              label="No records found."
              variant="outlined"
              inputProps={{
                style: { color: '#721c24', backgroundColor: '#f5c6cb' },
              }}
            />
          }
          {userList.length > 0 && <Card className="candidateList">
            <List style={{padding: 0}}>
              {userList && userList.map((list) =>
                <ListItem key={list.ID} style={{ border: 'solid 1px #e3e3e3'}}>
                   <ListItemText
                   id={list.ID}
                    primary={`${list.first_name} ${list.last_name}`}
                    secondary={list.ispanel ? 'Panelist' : 'Organiser'}
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      control={
                        <Switch
                          id={list.user_id}
                          checked={!list.ispanel}
                          onChange={(e) => this.toggleUserRole(e, list)}
                          name="checkedB"
                          color="primary"
                        />
                      }
                    />
                    <DeleteOutlinedIcon color="secondary" onClick={() => this.removeUser(list)} />
                  </ListItemSecondaryAction>
                </ListItem>
              )}
            </List>
          </Card>}
          {userList && userList.length > 0 &&
            <div className='panelRegCntrlPanel'>
              <Button className='file-upload fileUploadBtn btn shadow' onClick={this.submitPanel}>Submit</Button>
            </div>
          }
        </div>
        <Dialog
          open={showUserModal}
          onClose={this.handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Add Coordinators
          <CloseIcon style={{ marginLeft: '43%' }} onClick={this.handleClose} />
          </DialogTitle>
          <DialogContent style={{ margin: 0, width: '380px' }}>
            <TextField
              id="outlined-multiline-flexible"
              type="text"
              name="Search"
              variant="outlined"
              label="Search Users"
              margin="normal"
              fullWidth
              onChange={this.searchUsers}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="userListGroup">
              <List dense  >
                {users.length > 0 && users.map(list =>
                  <ListItem key={list.ID} button style={{ height: '65px', border: 'solid 1px #e0e0e0' }} >
                    <ListItemText id={list.ID} >

                      <h6>{list.first_name} {list.last_name}</h6>

                    </ListItemText>
                    <ListItemSecondaryAction>
                      {userList.some((data) => data.user_id === list.user_id) ?
                        <Checkbox
                          checked={true}
                          id={list.user_id}
                          onChange={(e, user) => this.handleUserCheckClick(e, list)}
                          color="primary"
                        /> :
                        <Checkbox
                          id={list.user_id}
                          onChange={(e, user) => this.handleUserCheckClick(e, list)}
                          color="primary"
                        />
                      }
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </div>
            <DialogContentText>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit" onClick={this.handleOnSubmit} disabled={!this.state.btnDisable}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        {showToast &&
          <Snackbar
            style={{ width: 320 }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={showToast}
            autoHideDuration={3000}
            onClose={() => this.setState({ showToast: false })}
          >
            <MuiAlert onClose={() => this.setState({ showToast: false })} severity="success">
              {toastMsg}
            </MuiAlert>
          </Snackbar>
        }
      </div>
    )
  }
}

export default EventCoordinator;