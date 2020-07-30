import React from 'react';
import { Row, Col, Modal, FormControl, InputGroup, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/SquadFormation.scss';


class SquadFormation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: '',
      EventDetailsList: [],
      eventSelected: null,
      showUserModal: false,
      squadList: [],
      selectedSquad: null,
      newSquadName: '',
      candidateList: [],
      searchQuery: ''
    }
    this.candidateList = [];
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
    this.setState({ eventSelected, selectedSquad: null, candidateList: [] });
    let id = eventSelected.value;
    const user_id = this.props.userDetails.user_id;
    const isPanelReq = { eventID: id, userID: user_id };
    this.props.checkIsOrganiser(isPanelReq).then((panelRes) => {
      if (panelRes && panelRes.ispanel !== '' && !panelRes.ispanel) {
        this.getSquadList(id);
      } else {
        this.setState({ toastMsg: "You don't have permission. Please contact Organiser.", showToast: true });
      }
    });
  }

  getSquadList = (id, newSquadName = '') => {
    const reqObj = { eventID: id };
    this.props.getSquadList(reqObj).then((response) => {
      if (response && response.arrRes) {
        console.log(response.arrRes);
        const squadList = response.arrRes.map(list => {
          return {
            value: list.ID,
            ID: list.ID,
            label: list.SquadName,
            squad_team_img: list.squad_team_img
          }
        });
        let selectedSquad = null;
        if (newSquadName) {
          selectedSquad = squadList.find(list => list.label === newSquadName);
          this.setState({
            squadList,
            selectedSquad,
            showToast: true,
            toastMsg: 'Squad Created successfully',
            showUserModal: false
          })
        } else {
          this.setState({ squadList });
        }
      }
    })
  }
  createSquadName = () => {
    this.setState({ showUserModal: true });
  }

  handleClose = () => this.setState({ showUserModal: false });

  squadNameOnChange = (e) => {
    this.setState({ newSquadName: e.target.value })
  }

  handleNewSquadSubmit = () => {
    const { newSquadName, eventSelected } = this.state;
    const reqObj = {
      SquadID: "",
      SquadName: newSquadName,
      EventID: eventSelected.value,
      CreatedDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      CreatedBy: this.props.userDetails.user_id,
      UpdatedBy: this.props.userDetails.user_id,
      UpdatedDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    }
    this.props.addSquad(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.getSquadList(eventSelected.value, newSquadName);
      }
      else {
        this.setState({
          showToast: true,
          toastMsg: response.status,
        });
      }
    });
  }

  handleSquadChange = (selectedSquad) => {
    const { eventSelected } = this.state;
    this.setState({ selectedSquad });
    const req = { event_id: eventSelected.value };
    const request = { squad_id: selectedSquad.value };
    this.props.getSquadCandidateList(request).then((squadRes) => {
      if (squadRes && squadRes.errCode === 200) {
        const squadCandidates = squadRes.arrRes;
        this.props.getCandidateList(req).then((res) => {
          if (res && res.errCode === 200) {
            const eventCandidates = res.arrRes.filter(list => list.SquadName === null || list.SquadName === '');
            const candidateList = [...squadCandidates, ...eventCandidates]
            this.candidateList = candidateList
            this.setState({ candidateList })
          } else if (res && res.errCode === 404) {
            this.setState({ showToast: true, toastMsg: 'No Records found in Candidate List' })
          } else {
            this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
          }
        });
      } else if (squadRes && squadRes.errCode === 404) {
        this.setState({ showToast: true, toastMsg: 'No Records found in Squad Candidate List' })
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });

  }

  searchCandidate = (e) => {
    const query = e.target.value;
    const lowerCaseQuery = query.toLowerCase();
    const searchedData = (query
      ? this.candidateList.filter((list) =>
        list['EmpName']
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
      : this.candidateList);
    this.setState({ candidateList: searchedData, searchQuery: query });
  }

  handleCandidateSelection = (e, list) => {
    const { candidateList, selectedSquad } = this.state;
    const candidateIndex = candidateList && candidateList.findIndex((lst) => list.ID === lst.ID);
    const updatedcandidateList = [...candidateList];
    updatedcandidateList[candidateIndex].SquadName = e.target.checked ? selectedSquad.value : '';
    this.setState({
      candidateList: updatedcandidateList
    });
  }

  insertCandidate = () => {
    const { eventSelected, selectedSquad } = this.state;
    const reqObj = {
      SquadID: selectedSquad.value,
      CandidateID: this.CandidateIDs,
      EventID: eventSelected.value,
      isActive: true,
      CreatedBy: this.props.userDetails.user_id,
      UpdatedBy: this.props.userDetails.user_id
    }

    console.log(this.CandidateIDs, 'reqObj---', reqObj);
    this.props.squadCandidatesInsert(reqObj).then(response => {
      if (response && response.errCode === 200) {
        this.setState({
          toastMsg: "Squad Registered successfully",
          showToast: true,
          candidateList: [],
          eventSelected: null,
          selectedSquad: null,
        })
      } else if(response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMsg: response.status,
        });
      } else {
          this.setState({
            showToast: true,
            toastMsg: 'Something went Wrong. Please try again later.',
          });
        }
    })
  }

  render() {
    const { eventSelected, candidateList, searchQuery, squadList, newSquadName, selectedSquad, EventDetailsList, showToast, toastMsg, showUserModal } = this.state;
    this.CandidateIDs = [];
    candidateList.forEach(list => {
      if (list.SquadName !== null && list.SquadName !== '') {
        this.CandidateIDs.push(list.ID)
      }
    })
    return (
      <div className='squadWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Squad Formation</h3>
          {eventSelected && <i onClick={this.createSquadName} className="addUser fa fa-plus" aria-hidden="true"></i>}
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
          {squadList.length > 0 && <Row>
            <Col className='fieldName'><span>Squad Name:</span></Col>
            <Col>
              <Select
                value={selectedSquad}
                onChange={this.handleSquadChange}
                options={squadList}
                defaultValue={selectedSquad}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Event Name'
              />
            </Col>
          </Row>}
          {candidateList && candidateList.length > 0  && <div>
            <p className='memberLabel'>Candidate List: Count - {this.CandidateIDs.length}</p>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search Candidates"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={this.searchCandidate}
                value={searchQuery}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>}
          {candidateList && candidateList.length > 0 && <div className="candidateList">
            <ListGroup className="userListGroup">
              {candidateList.map(list =>
                <ListGroup.Item key={list.EmpName} className="userList">
                  <div className="candidateDetails">
                    <p>{list.EmpName}</p>
                    <p className="email">{list.SkillName}</p>
                  </div>
                  <Form.Check
                    type="checkbox"
                    size="lg"
                    id={list.user_id}
                    checked={list.SquadName !== null && list.SquadName !== ''}
                    label=""
                    className='toggleUser'
                    onChange={(e) => this.handleCandidateSelection(e, list)}
                  />
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>}
          {candidateList && candidateList.length > 0 && <div className='panelRegCntrlPanel'>
            <Button disabled={this.CandidateIDs.length === 0} className='file-upload fileUploadBtn btn shadow' onClick={this.insertCandidate}>Submit</Button>
          </div>}
        </div>
        <Modal className='eventModal' show={showUserModal} centered onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Squad Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Squad Name"
                aria-label="Squad Name"
                value={newSquadName}
                aria-describedby="Squad Name"
                onChange={this.squadNameOnChange}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={newSquadName.length === 0} className='file-upload fileUploadBtn btn shadow' onClick={this.handleNewSquadSubmit}>Submit</Button>
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
export default SquadFormation;