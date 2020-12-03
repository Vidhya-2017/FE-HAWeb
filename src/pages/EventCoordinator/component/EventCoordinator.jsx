import React, { Fragment } from 'react';
import moment from 'moment';
import {
  Grid, TextField, FormControlLabel, Card, Switch, Button, Divider,
  Snackbar, List, ListItem, ListItemSecondaryAction, ListItemText
} from '@material-ui/core';
import { Alert, AlertTitle, Autocomplete } from '@material-ui/lab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddCoordinator from './AddCoordinator';
import '../scss/EventCoordinator.scss';

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
      loading: false,
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
    let clientName = '';
    let clientId = '';
    let userList = [];
    this.setState({ eventSelected, userList, clientId, clientName, loading: true }, () => {
      if (eventSelected && eventSelected.value) {
        let id = eventSelected.value;
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
                      clientName, clientId, userList, loading: false
                    });
                  })
                }
              })
            }
          } else {
            this.setState({ loading: false, toastMsg: "You don't have permission. Please contact Organiser.", showToast: true, userList: [], eventSelected, clientName: '' });
          }
        });
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

  handleModalSubmit = (selectedUsers) => {
    if(selectedUsers.length > 0) {
      this.setState({ userList: [...this.state.userList, ...selectedUsers], showUserModal: false });
    } else {
      this.setState({ showUserModal: false });
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


  render() {
    const { eventSelected, users, loading, EventDetailsList, search, showUserModal, userList, clientName, showToast, toastMsg } = this.state;
    return (
      <div className='eventCoordWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Event Coordinators</h3>
          {eventSelected &&
            <PersonAddIcon onClick={this.viewUserList} className="addUser" />}
        </div>
        <div className='eventCoordForm'>
          <div className='paper'>
            <Grid container spacing={2}>
              <Grid item xs={5}> <p style={{margin: '14px 0'}}>Event Name:</p> </Grid>
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
          {userList && eventSelected && !loading &&
            <div style={{ display: 'flex' }}>
              <span className='memberLabel'>Co-Ordinators List:</span>
            </div>
          }
          {/* {userList && eventSelected && !loading && <p className='toggleNote'>Note: Toggle this to become Event Organiser.</p>} */}
          {userList && userList.length === 0 && eventSelected && !loading &&
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>No records found.
            </Alert>
          }
          {userList.length > 0 && <Card className="candidateList">
            <List style={{ padding: 0 }}>
              {userList && userList.map((list) =>
                <Fragment>
                  <ListItem key={list.user_id}>
                    <ListItemText
                      id={list.user_id}
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
                            color="primary"
                          />
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Fragment>
              )}
            </List>
          </Card>}
          {userList && userList.length > 0 &&
            <div className='panelRegCntrlPanel'>
              <Button variant="contained" color="primary" onClick={this.submitPanel}>Submit</Button>
            </div>
          }
        </div>
          <AddCoordinator handleModalSubmit={this.handleModalSubmit} userList={userList} showUserModal={showUserModal} getUserBySearch={this.props.getUserBySearch} />
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
            <Alert onClose={() => this.setState({ showToast: false })} severity="success">
              {toastMsg}
            </Alert>
          </Snackbar>
        }
      </div>
    )
  }
}

export default EventCoordinator;