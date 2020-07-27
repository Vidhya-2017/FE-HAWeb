import React from 'react';
import { Row, Col, Modal, FormControl, InputGroup, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import SelectStyles from '../../../common/SelectStyles';

import '../scss/EventCoordinator.scss';

class EventCoordinator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formIsValid: false,
      showToast: false,
      toastMsg: '',
      EventDetailsList: [],
      userList: null,
      clientName: '',
      searchedText: '',
      clientId: '',
      users: [],
      showUserModal: false,
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

  handleEventChange = (eventSelected) => {
    this.setState({ eventSelected, userList: null, clientName: '' });
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
                  formIsValid: true,
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
          userList: null,
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
          users: res.userList, search: value
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
    const { eventSelected, users, EventDetailsList, showUserModal, formIsValid, userList, clientName, showToast, toastMsg } = this.state;
    return (
      <div className='eventCoordWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Event Coordinators</h3>
          {eventSelected && <i onClick={this.viewUserList} className="addUser fa fa-user-plus" aria-hidden="true"></i>}
        </div>
        <div className='eventCoordForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              <Select
                value={eventSelected}
                onChange={this.handleEventChange}
                options={EventDetailsList}
                defaultValue={eventSelected}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Event Name'
              />
            </Col>
          </Row>
          {eventSelected && eventSelected.value && clientName &&
            <p className="clientName">Client: {clientName}</p>
          }
          {userList && <p className='memberLabel'>Member List:</p>}
          {userList && <p className='toggleNote'>Note: Toggle this to become Event Organiser.</p>}
          {userList && userList.length === 0 &&
            <ListGroup.Item variant="danger">No records found.</ListGroup.Item>
          }
          <ListGroup className="userListGroup">
            {userList && userList.map((list) =>
              <ListGroup.Item className="userList">
                <div className='userDetails'>
                  <h6>{list.first_name} {list.last_name}</h6>
                  <p>{list.ispanel ? 'Panelist' : 'Organiser'}</p>
                </div>
                <div className='userControl'>
                  <Form.Check
                    type="switch"
                    id={list.user_id}
                    checked={!list.ispanel}
                    label=""
                    className='toggleUser'
                    onChange={(e) => this.toggleUserRole(e, list)}
                  />
                  <i className="fa fa-trash-o deleteIcon" onClick={() => this.removeUser(list)} />
                </div>
              </ListGroup.Item>
            )}
          </ListGroup>

          {userList && userList.length > 0 &&
            <div className='panelRegCntrlPanel'>
              <Button className='file-upload fileUploadBtn btn shadow' onClick={this.submitPanel}>Submit</Button>
            </div>
          }
        </div>

        <Modal className='eventModal' show={showUserModal} centered onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Coordinators</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search Users"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={this.searchUsers}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <ListGroup className="userListGroup">
              {users.map(list =>
                <ListGroup.Item className="userList">
                  <h6>{list.first_name} {list.last_name}</h6>

                  {userList.some((data) => data.user_id === list.user_id) ?
                    <Form.Check
                      type="checkbox"
                      checked={true}
                      id={list.user_id}
                      onChange={(e, user) => this.handleUserCheckClick(e, list)}
                    />
                    : <Form.Check
                      type="checkbox"
                      id={list.user_id}
                      onChange={(e, user) => this.handleUserCheckClick(e, list)}
                    />
                  }
                </ListGroup.Item>
              )}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button className='file-upload fileUploadBtn btn shadow' onClick={this.handleOnSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>
        {showToast &&
          <Toast
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#deeddd',
              border: '1px solid #28a745',
              color: '#6c757d',
              fontWeight: 500,
              width: 400
            }}
            onClose={() => this.setState({ showToast: false })}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body>{toastMsg}</Toast.Body>
          </Toast>
        }
      </div>
    )
  }
}

export default EventCoordinator;