import React from 'react';
import { Row, Col, FormControl, InputGroup, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/CandidateSelection.scss';
import CandidateSkeleton from './CandidateSkeleton';

class CandidateSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: '',
      EventDetailsList: [],
      eventSelected: null,
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
        this.setState({ EventDetailsList: eventList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });
  }


  eventFieldChange = (eventSelected) => {
    const event_id = eventSelected.value;
    if (event_id) {
      this.setState({ eventSelected: eventSelected, candidateList: [] });
      this.checkIsOrganiser(event_id);
    }
  }

  checkIsOrganiser = (eventId) => {
    const user_id = this.props.userDetails.user_id;
    const req = { eventID: eventId, userID: user_id };
    this.props.checkIsOrganiser(req).then((response) => {
      if (response && response.ispanel !== '' && !response.ispanel) {
        this.getBulkCandidateList(eventId);
      } else {
        this.setState({ candidateList: null, toastMsg: "You don't have permission to select Candidates.", showToast: true });
      }
    });
  }

  getBulkCandidateList = (event_id) => {
    const req = { event_id };
    this.props.bulkCandidateList(req).then((response) => {
      if (response && response.errCode === 200) {
        this.candidateList = [...response.assignedCandid, ...response.nonAssignedCan];
        this.setState({
          candidateList: this.candidateList,
        });
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
    const { candidateList, eventSelected } = this.state;
    const candidateIndex = candidateList && candidateList.findIndex((lst) => list.ID === lst.ID);
    const updatedcandidateList = [...candidateList];
    updatedcandidateList[candidateIndex].EventID = e.target.checked ? eventSelected.value : '';
    this.setState({
      candidateList: updatedcandidateList
    });
  }


  insertCandidate = () => {
    const { candidateList, eventSelected } = this.state;
    const candidateIDs = [];
    candidateList.forEach((candidate) => {
      if (candidate.EventID !== '' && candidate.EventID !== null) {
        candidateIDs.push(candidate.ID)
      }
    });
    const user_id = this.props.userDetails.user_id;
    const reqObj = {
      eventID: eventSelected.value,
      UpdatedBy: user_id,
      candidateIDs
    }
    this.props.eventCandidateAssign(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.setState({ showToast: true, candidateList: [], eventSelected: null, toastMsg: 'Candidates added successfully.' });
      } else {
        this.setState({ candidateList: [], eventSelected: null, showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }

  render() {
    const { showToast, toastMsg, candidateList, EventDetailsList, searchQuery, eventSelected } = this.state;
    return (
      <div className='candidateSelectionWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Candidate Selection</h3>
        </div>
        <div className='candidateSelectionForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              <Select
                value={eventSelected}
                onChange={this.eventFieldChange}
                options={EventDetailsList}
                defaultValue={eventSelected}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Event Name'
              />
            </Col>
          </Row>
          {candidateList && eventSelected && <div>
            <p className='memberLabel'>Candidate List:</p>
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
              <p>{list.SkillName}</p>
              <p className="email">{list.EmailId}</p>
              </div>
              <Form.Check
                type="checkbox"
                size="lg"
                id={list.user_id}
                checked={list.EventID !== null && list.EventID !== ''}
                label=""
                className='toggleUser'
                onChange={(e) => this.handleCandidateSelection(e, list)}
              />
              </ListGroup.Item>
            )}
            </ListGroup>
          </div>}
          {candidateList && candidateList.length === 0 && eventSelected &&
            <CandidateSkeleton />}
          {candidateList && candidateList.length > 0 && <div className='panelRegCntrlPanel'>
            <Button className='file-upload fileUploadBtn btn shadow' onClick={this.insertCandidate}>Submit</Button>
          </div>}
        </div>
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

export default CandidateSelection;