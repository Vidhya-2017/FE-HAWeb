import React from 'react';
import { Row, Col, FormControl, InputGroup, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/CandidateSelection.scss';
import CandidateSkeleton from './CandidateSkeleton';
import {  Grid, TextField, InputAdornment, Checkbox, FormControlLabel,Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';

class CandidateSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: '',
      EventDetailsList: [],
      eventSelected: null,
      candidateList: [],
      searchQuery: '',
      count: 0
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


  eventFieldChange = (e,eventSelected) => {
    const event_id = eventSelected.value;
    if (eventSelected) {
        if (event_id) {
        this.setState({ eventSelected: eventSelected, candidateList: [] });
        this.checkIsOrganiser(event_id);
      }
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
        this.handleCounter();
      } else if (response && response.errCode === 404 && response.status === "No records found") {
        this.setState({ showToast: true, candidateList: null, toastMsg: "No records found." })

      } else {
        this.setState({ showToast: true, candidateList: null, toastMsg: 'Something went Wrong. Please try again later.' })
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
    this.handleCounter();
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

  handleCandidateSelectionAll = (e) => {
    const { candidateList, eventSelected } = this.state;
    const updatedcandidateList = [...candidateList];
    updatedcandidateList.map(list => (list.EventID = e.target.checked ? eventSelected.value : ''))
    this.setState({
      candidateList: updatedcandidateList
    })
    this.handleCounter();

  }

  handleCounter = () => {
    this.count = this.candidateList.filter(value => value.EventID).length
    this.setState({ count: this.count })
  }

  render() {
    const { showToast, toastMsg, candidateList, EventDetailsList, searchQuery, eventSelected, count } = this.state;
    return (
      <div className='candidateSelectionWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Candidate Selection</h3>
        </div>
        <div className='candidateSelectionForm'>
        <div className='paper'>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <span>Event Name:</span>
              </Grid>
              <Grid item xs={7}>
                <Autocomplete
                  options={EventDetailsList}
                  getOptionLabel={option => option ? option.label : ''}
                  value={eventSelected}
                  defaultValue={eventSelected}
                  onChange={this.eventFieldChange}
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

          {candidateList && eventSelected && 
          <div>
            <p className='memberLabel'>Candidate List:</p>
                  <TextField
                    inputProps={{ style: { height: 5 } }}
                    id="outlined-multiline-flexible"
                    type="text"
                    name="eventName"
                    variant="outlined"
                    label="Event Name"
                    margin="normal"
                    fullWidth
                    value={searchQuery}
                    onChange={this.searchCandidate}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                     }}
                  />
            <div className="checkBoxAll">
              <p>Selected Candidate:{count}</p>
              <FormControlLabel
                value="end"
                control={<Checkbox color="primary" />}
                label="Select All"
                onChange={(e) => this.handleCandidateSelectionAll(e)}
              />
            </div>
          </div>}
          { candidateList && candidateList.length > 0 && 
            <div className="candidateList">
              {candidateList.map(list => 
              <TableContainer component={Paper}>
            <Table  size="small" >
              <TableBody>
                 <TableRow key={list.ID}>
                    <TableCell component="th" scope="row">
                      <div className="candidateDetails">
                        <p>{list.EmpName}</p>
                        <p>{list.SkillName}</p>
                        <p className="email">{list.EmailId}</p>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox
                      checked={list.EventID !== null && list.EventID !== ''}
                        color="primary"
                        value={list.id}
                        onChange={(e) => this.handleCandidateSelection(e, list)}
                      />
                    </TableCell>  
                  </TableRow> 
              </TableBody>   
            </Table>  
          </TableContainer>
          )}
            </div>
          }
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