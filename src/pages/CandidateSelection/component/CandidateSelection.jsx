import React from 'react';
import { Row, Col, Modal, FormControl, InputGroup, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
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

  render() {
    const { showToast, toastMsg, candidateList, EventDetailsList, searchQuery, eventSelected } = this.state;
    console.log('--EmpName---', candidateList);
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
            <ListGroup.Item className="userList">
              <div>
              <p>{list.EmpName}</p>
              <p>{list.SkillName}</p>
              <p>{list.EmailId}</p>
              </div>
              </ListGroup.Item>
            )}
            </ListGroup>
          </div>}
          {candidateList && candidateList.length === 0 && eventSelected &&
            <CandidateSkeleton />}
          {candidateList && candidateList.length > 0 && <div className='panelRegCntrlPanel'>
            <Button className='file-upload fileUploadBtn btn shadow' >Submit</Button>
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