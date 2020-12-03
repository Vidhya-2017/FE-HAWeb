import React, { Fragment } from 'react';
import { Toast } from 'react-bootstrap';
import {
  Grid, Typography, ListItemSecondaryAction, List, ListItem, ListItemText,
  TextField, InputAdornment, Checkbox, FormControlLabel,
  Button, Paper
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import CustomizedSnackbars from '../../CandidateUpload/component/CustomizedSnackbars';

import '../scss/CandidateSelection.scss';

class CandidateSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackbar: false,
      toastMsg: '',
      severity: '',
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
        this.setState({ showSnackbar: true, severity: 'error', toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });
  }


  eventFieldChange = (e, eventSelected) => {
    this.setState({ eventSelected: eventSelected, candidateList: [] });
    if (eventSelected && eventSelected.value) {
      this.checkIsOrganiser(eventSelected.value);
    }
  }

  checkIsOrganiser = (eventId) => {
    const user_id = this.props.userDetails.user_id;
    const req = { eventID: eventId, userID: user_id };
    this.props.checkIsOrganiser(req).then((response) => {
      if (response && response.ispanel !== '' && !response.ispanel) {
        this.getBulkCandidateList(eventId);
      } else {
        this.setState({ candidateList: null, severity: 'error', toastMsg: "You don't have permission to select Candidates.", showSnackbar: true });
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
        this.setState({ showSnackbar: true, candidateList: null, severity: 'error', toastMsg: "No records found." })

      } else {
        this.setState({ showSnackbar: true, candidateList: null, severity: 'error', toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });
  }

  searchCandidate = (e = "") => {
    const query = e.target.value ? e.target.value : "";
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
        this.setState({ showSnackbar: true, candidateList: [], eventSelected: null, severity: 'success', toastMsg: 'Candidates added successfully.' });
      } else {
        this.setState({ candidateList: [], eventSelected: null, showSnackbar: true, severity: 'error', toastMsg: 'Something went Wrong. Please try again later.' })
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
    this.count = this.candidateList.filter(value => value.EventID).length;
    this.setState({ count: this.count })
  }

  closeSnackbar = () => {
    this.setState({ showSnackbar: false })
  }

  render() {
    const { showSnackbar, toastMsg, severity, candidateList, EventDetailsList, searchQuery, eventSelected, count } = this.state;
    return (
      <div className='candidateSelectionWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Candidate Selection</h3>
        </div>
        <div className='candidateSelectionForm'>
          <div className='paper'>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <p className='eventLabel'>Event Name:</p>
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
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <p className='memberLabel'>Candidate List:-</p>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    type="text"
                    name="eventName"
                    variant="outlined"
                    label="Search Candidates"
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={this.searchCandidate}
                    InputProps={{
                      endAdornment: (
                        <>
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                          {searchQuery && <InputAdornment onClick={this.searchCandidate} position="end">
                            <CloseIcon />
                          </InputAdornment>}
                        </>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <div className="checkBoxAll">
                <p>Selected Candidate: <span>{count}</span></p>
                <FormControlLabel
                  value="end"
                  control={<Checkbox color="primary" checked={candidateList.every(candidate => candidate.EventID)} />}
                  label="Select All"
                  onChange={(e) => this.handleCandidateSelectionAll(e)}
                />
              </div>
            </div>}
          {candidateList && candidateList.length > 0 &&
            <Paper elevation={3}>
              <List className="candidateList" dense >
                {candidateList.map((list) => {
                  return (
                    <ListItem key={list.ID} style={{ border: 'solid 1px #e3e3e3' }}>
                      <ListItemText primary={
                        <Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >{list.EmpName} {' - '}</Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >{list.SkillName}</Typography>
                        </Fragment>
                      } secondary={
                        <Typography
                          component="p"
                          variant="body2"
                          color="textSecondary"
                        >
                          {list.EmailId}
                        </Typography>} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          checked={list.EventID !== null && list.EventID !== ''}
                          color="primary"
                          value={list.id}
                          onChange={(e) => this.handleCandidateSelection(e, list)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List></Paper>}
          {searchQuery && candidateList.length === 0 &&
            <Typography color="error" align="center">No records found based on Candidate Search</Typography>}
          {candidateList && candidateList.length > 0 && <div className='panelRegCntrlPanel'>
            <Button className='file-upload fileUploadBtn btn shadow' onClick={this.insertCandidate}>Submit</Button>
          </div>}
        </div>
        <CustomizedSnackbars showSnackbar={showSnackbar} closeSnackbar={this.closeSnackbar} severity={severity} toastMessage={toastMsg} />
      </div>
    )
  }
}

export default CandidateSelection;