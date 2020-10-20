import React from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Modal, FormControl, InputGroup, Toast } from 'react-bootstrap';
import Buttons from '../../../components/UI_Component/Buttons/Buttons';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import '../scss/SMEAssign.scss'



class SMEAssign extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

      showToast: false,
      toastMsg: '',
      showUserModal: false,
      errors: {},
      trainingList: [],
      userList: [],
      users: [],
      selectedTraining: null,
      formIsValid: false,
      formDisable: false,
    }
  }
  componentDidMount() {
    this.getTrainingList();
  }

  getTrainingList = () => {
    this.props.getTrainingList().then(response => {
      if (response && response.arrRes) {
        const trainingList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.training_name
          }
        });
        this.setState({ trainingList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }


  viewSMEList = () => {
    this.setState({ showUserModal: true });
  }

  handleClose = () => this.setState({ showUserModal: false });

  searchSME = (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      const req = { 'searchData': value }
      this.props.getSMEBySearch(req).then((res) => {
        console.log(res);
        this.setState({
          users: res.arrRes, search: value
        })
      })

    }
    if (value.length === 0) {
      this.setState({ users: [], search: value })
    }
  }

  handleUserCheckClick = (e, list) => {
    const { userList } = this.state;
    if (e.target.checked) {
      const userData = list;
      this.updatedUserList = [...userList, userData];
    }
    else {
      this.updatedUserList = userList.filter((val) => { return val.ID !== e.target.value.ID })
    }
  }

  handleOnSubmit = () => {
    this.setState({
      userList: this.updatedUserList, showUserModal: false
    })
  }

  removeUser = (e) => {
    this.setState({
      userList: this.state.userList.filter((val) => { return val.id !== e.id })
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
        toastMsg: 'Please Select SME'
      })
    }
  }

  submitForm = () => {
    const user_id = 1;
    const { selectedTraining } = this.state;
    console.log(this.state.userList);
    const userList = this.state.userList.map((list) => {
      return {
        id: list.id,
      };
    });

    const reqObj = {
      id: selectedTraining.value,
      smeids: userList,
      updatedby: user_id,
    }

    this.setState({ loading: true });
    this.props.insertSME(reqObj).then((response) => {
      console.log(response);
      if (response.errCode === 200) {
        this.setState({
          selectedTraining: null,
          loading: false,
          showToast: true,
          userList: [],
          toastMsg: 'SME Allocated successfully.'
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

  selectFieldChange = (selectedTraining) => {

    this.setState({ selectedTraining: selectedTraining.target, userList: [] });
    let id = selectedTraining.target.value;

    let userList = [];
    const reqObj = { training_id: id };
    this.props.geSMEByTraining(reqObj).then((response) => {
      if (response && response.arrRes) {
        if (response.errCode === 200) {
          userList = response.arrRes;
        }
        this.setState({
          userList
        });

      }
    })

  }


  render() {

    const { trainingList, selectedTraining, userList, showToast, showUserModal, toastMsg, users } = this.state;


    return (
      <div className="batchMaster_container">
        <section className="blue_theme">
          <Container>
            <Row>
              <Col xs={12} md={12} lg="12" style={{ justifyContent: 'space-between', display: 'flex' }} >
                <h2 style={{ width: '100%', marginBottom: 10 }} className="text-center">Assign SME</h2>
                {selectedTraining && <i onClick={this.viewSMEList} style={{ margin: 10, paddingTop: 30 }} className="addUser fa fa-user-plus" aria-hidden="true"></i>}
              </Col>
            </Row>
            <Row>
              <Col>Training Name</Col>
                <SelectOne
                  fieldLabel=""
                  value={selectedTraining ? selectedTraining : null}
                  id="trainingid"
                  name="trainingid"
                  placeholder='Training Name'
                  options={trainingList}
                  onChange={this.selectFieldChange}
                  errorMessage={this.state.errors.trainingid === "" ? null : this.state.errors.trainingid}
                />
            </Row>
            {userList && userList.length === 0 && selectedTraining &&
              <ListGroup.Item variant="danger">No records found.</ListGroup.Item>
            }
            <ListGroup className="userListGroup">
              {userList && userList.map((list) =>
                <ListGroup.Item className="userList" style={{ display: 'flex', justifyContent: 'space-between' }} key={list.id}>
                  <div className='userDetails'>
                    <h6 style={{ textTransform: 'capitalize' }}>{list.name} - <span style={{ color: "darkgrey" }}>{list.sap_id}</span></h6>
                  </div>
                  <div className='userControl'>
                    <i style={{ color: 'red' }} className="fa fa-trash-o deleteIcon" onClick={() => this.removeUser(list)} />
                  </div>
                </ListGroup.Item>
              )}
            </ListGroup>

            <Row style={{ justifyContent: 'flex-end', padding: '15px 20px 0' }}>

              {userList && userList.length > 0 &&
                <Buttons
                  className="float-right"
                  value="Submit"
                  onClick={this.submitForm} />
              }

            </Row>

            <Modal className='eventModal' show={showUserModal} centered onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add SME</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search Users"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={this.searchSME}
                  />
                  <InputGroup.Append>
                    <InputGroup.Text id="basic-addon1">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                <ListGroup className="userListGroup">
                  {users.length > 0 && users.map(list =>
                    <ListGroup.Item className="userList" style={{ display: 'flex', justifyContent: 'space-between' }} key={list.id}>
                      <div>
                        <h6 style={{ textTransform: 'capitalize' }}>{list.name} - <span style={{ color: "darkgrey" }}>{list.sap_id}</span></h6>
                      </div>
                      {userList.some((data) => data.id === list.id) ?
                        <Form.Check
                          type="checkbox"
                          checked={true}
                          id={list.id}
                          onChange={(e, user) => this.handleUserCheckClick(e, list)}
                        />
                        : <Form.Check
                          type="checkbox"
                          id={list.id}
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
            {
              showToast &&
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
          </Container >
        </section >

      </div >
    )
  }
}


export default SMEAssign;