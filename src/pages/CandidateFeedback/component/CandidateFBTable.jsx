import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import {
  Table, TableContainer, TableHead, TableRow, Paper, TableBody,
  MenuItem, TextField, TableCell, Button
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FinalStatusToggle from './FinalStatusToggle';
import CustomizedDialogs from './CustomizedDialogs';

class CandidateFBTable extends Component {
  constructor(props) {
    super(props);
    const candidateFB = props.candidateList.map(list => {
      let assessmentArr = [];
      if (list.otherAssessment && list.otherAssessment.length > 0) {
        assessmentArr = list.otherAssessment;
      } else {
        props.OtherAssessmentData.forEach(assessment => {
          assessmentArr.push({ scaleID: assessment.OtherAssessmentId, scaleVAL: 1 })
        })
      }
      return { ...list, otherAssessment: assessmentArr }
    })
    this.state = {
      candidateFB: candidateFB,
      alertMessage: false,
      showDailog: false,
      candidatePrevFB: {}
    }
  }

  handleChange = (event, candidate, assessment) => {
    const { candidateFB } = this.state;
    let updateCandidateFB = _.clone([...candidateFB]);
    const candidateIndex = updateCandidateFB.findIndex(i => i.CandidateID === candidate.CandidateID);
    const assessmentPresent = updateCandidateFB[candidateIndex].otherAssessment.findIndex(scale => scale.scaleID === assessment.OtherAssessmentId);
    if (assessmentPresent < 0) {
      updateCandidateFB[candidateIndex].otherAssessment.push({
        scaleID: assessment.OtherAssessmentId,
        scaleVAL: event.target.value
      });
    } else {
      updateCandidateFB[candidateIndex].otherAssessment[assessmentPresent].scaleVAL = event.target.value;
    }
    this.setState({ candidateFB: updateCandidateFB })
  }

  handleFeedbackText = (event, candidate) => {
    const { candidateFB } = this.state;
    let updateCandidateFB = _.clone([...candidateFB]);
    const candidateIndex = updateCandidateFB.findIndex(i => i.CandidateID === candidate.CandidateID);
    updateCandidateFB[candidateIndex]["feedback"] = event.target.value;
    this.setState({ candidateFB: updateCandidateFB });
  }

  handleStatusChange = (status, candidate) => {
    const { candidateFB } = this.state;
    let updateCandidateFB = _.clone([...candidateFB]);
    const candidateIndex = updateCandidateFB.findIndex(i => i.CandidateID === candidate.CandidateID);
    updateCandidateFB[candidateIndex]["finalStatus"] = status;
    this.setState({ candidateFB: updateCandidateFB });
  }

  handleCRChange = (event, candidate) => {
    const { candidateFB } = this.state;
    let updateCandidateFB = _.clone([...candidateFB]);
    const candidateIndex = updateCandidateFB.findIndex(i => i.CandidateID === candidate.CandidateID);
    updateCandidateFB[candidateIndex]["competancy_rating"] = event.target.value;
    this.setState({ candidateFB: updateCandidateFB });
  }

  handleRole = (event, candidate) => {
    const { candidateFB } = this.state;
    let updateCandidateFB = _.clone([...candidateFB]);
    const candidateIndex = updateCandidateFB.findIndex(i => i.CandidateID === candidate.CandidateID);
    updateCandidateFB[candidateIndex]["role"] = event.target.value;
    this.setState({ candidateFB: updateCandidateFB });
  }

  handleSubmit = () => {
    const { candidateFB } = this.state;
    const { selectedSprint } = this.props;
    let alertMessage = false;
    for (let i = 0; i < candidateFB.length; i++) {
      if (selectedSprint.value === 'Final Assessment') {
        if (candidateFB[i].feedback === undefined || candidateFB[i].feedback === '' ||
          candidateFB[i].role === undefined || candidateFB[i].role === '' ||
          candidateFB[i].competancy_rating === undefined || candidateFB[i].competancy_rating === '' ||
          candidateFB[i].finalStatus === undefined || candidateFB[i].finalStatus === '') {
          alertMessage = true;
          break;
        }
      } else if (selectedSprint.value === 'Show and Tell assesment') {
        if (candidateFB[i].feedback === undefined || candidateFB[i].feedback === '' ||
          candidateFB[i].competancy_rating === undefined || candidateFB[i].competancy_rating === '') {
          alertMessage = true;
          break;
        }
      } else {
        if (candidateFB[i].feedback === undefined || candidateFB[i].feedback === '') {
          alertMessage = true;
          break;
        }
      }
    }
    if (!alertMessage) {
      const reqObj = {
        userID: this.props.userID,
        eventID: this.props.selectedEvent.value,
        panelId: this.props.userID,
        squadID: this.props.selectedSquad.value,
        sprintLevel: this.props.selectedSprint.value,
        candidatesFB: []
      };
      candidateFB.forEach(candidate => {
        if (!candidate.isFeedBackSubmitted) {
          const candidateReqObj = {
            candidate_id: candidate.CandidateID,
            competancy_rating: candidate.competancy_rating,
            feedback: candidate.feedback,
            finalStatus: candidate.finalStatus,
            otherAssessment: candidate.otherAssessment,
            role: candidate.role
          }
          reqObj.candidatesFB.push(candidateReqObj);
        }
      })
      this.setState({ alertMessage });
      this.props.handleSubmit(reqObj);
    } else {
      this.setState({ alertMessage });
    }
  }

  showPrevFeedback = (candidate) => {
    const { feedbackList } = this.props;
    const candidateFBArr = feedbackList.filter(item => item.candidate_id === candidate.CandidateID)
    const candidatePrevFB = {
      feedbackList: candidateFBArr,
      name: candidate.EmpName
    }
    this.setState({ showDailog: true, candidatePrevFB });
  }

  handleCloseDialog = (showDailog) => {
    this.setState({ showDailog });
  }

  render() {
    const { classes, OtherAssessmentData, CompetancyData, selectedSprint, candidateList } = this.props;
    const { alertMessage, showDailog, candidatePrevFB } = this.state;
    const showSubmitBtn = candidateList.some(candidate => !candidate.isFeedBackSubmitted);
    return (
      <Paper elevation={0} className={classes.paperRoot}>
        <div className={classes.root}>
          {alertMessage && <Alert severity="error">Please fill all fields in below table.</Alert>}
          <Paper elevation={0}>
            {/* <TableContainer component={Paper}> */}
              <Table className={classes.table} size="medium" >
                <TableHead style={{background: '#EEEEEE'}}>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell className={classes.tablecell}>Name</TableCell>
                    {OtherAssessmentData.map(assessment =>
                      <TableCell className={classes.tablecell} key={assessment.OtherAssessmentId}>{assessment.OtherAssementScaleName}</TableCell>
                    )}
                    {(selectedSprint.value === 'Show and Tell assesment' || selectedSprint.value === 'Final Assessment') && <TableCell className={classes.tablecell}>Compentency Rating</TableCell>}
                    <TableCell className={classes.tablecell}>Feedback</TableCell>
                    {(selectedSprint.value === 'Final Assessment') &&
                      <>
                        <TableCell className={classes.tablecell}>Role</TableCell>
                        <TableCell className={classes.tablecell}>Final Status</TableCell>
                      </>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidateList.map((list, index) =>
                    <TableRow key={list.CandidateID} className={classes.tableRowRoot}>
                      <TableCell padding="checkbox"> <InfoOutlinedIcon onClick={() => this.showPrevFeedback(list)} /> </TableCell>
                      <TableCell className={classes.tablecell} >{list.EmpName}</TableCell>
                      {OtherAssessmentData.map(assessment => {
                        const assessmentData = list.otherAssessment.find(i => i.scaleID === assessment.OtherAssessmentId);
                        let assessmentValue = '--';
                        if (assessmentData) {
                          assessmentValue = assessmentData.scaleVAL
                        }
                        return (
                          <TableCell className={classes.tablecell} key={assessment.OtherAssessmentId}>
                            {list.isFeedBackSubmitted ? assessmentValue : <TextField
                              select
                              defaultValue="1"
                              size="small"
                              name={assessment.OtherAssementScaleName}
                              onChange={(e) => this.handleChange(e, list, assessment)}
                              variant="outlined"
                            >
                              {[1, 2, 3, 4, 5].map((value) => (
                                <MenuItem key={value} value={value}>
                                  {value}
                                </MenuItem>
                              ))}
                            </TextField>}
                          </TableCell>)
                      }
                      )}
                      {(selectedSprint.value === 'Show and Tell assesment' || selectedSprint.value === 'Final Assessment') &&
                        <TableCell className={classes.tablecell}>
                          {list.isFeedBackSubmitted ? list.competancy_rating : <TextField
                            select
                            size="small"
                            name="competancy"
                            defaultValue=""
                            style={{ width: 150, marginRight: 10 }}
                            onChange={(e) => this.handleCRChange(e, list)}
                            variant="outlined"
                          >
                            {CompetancyData.map((option) => (
                              <MenuItem key={option.compentancyID} value={option.CompetancyName}>
                                {option.CompetancyName}
                              </MenuItem>
                            ))}
                          </TextField>}
                        </TableCell>}

                      <TableCell padding="none">
                        {list.isFeedBackSubmitted ? list.feedback : <TextField
                          multiline
                          margin="dense"
                          rows={2}
                          name={`feedback${index}`}
                          variant="outlined"
                          style={{ width: 150, marginRight: selectedSprint.value === 'Final Assessment' ? 0 : 10 }}
                          onChange={(e) => this.handleFeedbackText(e, list)}
                        />}
                      </TableCell>
                      {(selectedSprint.value === 'Final Assessment') &&
                        <>
                          <TableCell className={classes.tablecell}>
                            {list.isFeedBackSubmitted ? list.role : <TextField
                              margin="dense"
                              name={`role${index}`}
                              variant="outlined"
                              style={{ width: 150 }}
                              onChange={(e) => this.handleRole(e, list)}
                            />}
                          </TableCell>
                          <TableCell className={classes.tablecell}>
                            <FinalStatusToggle finalStatus={list.finalStatus} isFeedBackSubmitted={list.isFeedBackSubmitted} handleStatusChange={(status) => this.handleStatusChange(status, list)} />
                          </TableCell>
                        </>
                      }
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            {/* </TableContainer> */}
            {showSubmitBtn && <div style={{ display: 'flex', padding: 10, justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            </div>}
            {showDailog && 
            <CustomizedDialogs
            showDailog={showDailog}
            candidateName={candidatePrevFB.name}
            feedbackList={candidatePrevFB.feedbackList}
            handleCloseDialog={this.handleCloseDialog}
            />}
          </Paper>
        </div>
      </Paper>
    )
  }
}


const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  tablecell: { padding: 10 },
  tableHeaderCell: { padding: 10, borderBottom: '1px solid #616161' },
  paperRoot: { margin: '0' },
  tableRowRoot: {

  },
  table: {
    minWidth: 750
  },
});
export default withStyles(useStyles, { withTheme: true })(CandidateFBTable);
