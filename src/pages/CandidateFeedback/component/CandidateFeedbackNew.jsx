import React from "react";
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import CandidateFBTable from './CandidateFBTable';
import CustomizedSnackbars from '../../CandidateUpload/component/CustomizedSnackbars';

class CandidateFeedbackNew extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squadList: [],
      eventList: [],
      sprintList: [],
      candidateList: [],
      feedbackList: [],
      selectedEvent: null,
      selectedSquad: null,
      selectedSprint: null,
      showCandidateList: false,
      showSnackbar: false,
      toastMsg: '',
      severity: '',
    }
  }

  componentDidMount() {
    this.getEventList()
  }

  getEventList = () => {
    this.props.getEventList().then(response => {
      let eventList = [];
      if (response && response.errCode === 200) {
        eventList = response.arrRes.map(list => {
          return {
            value: list.EventId,
            label: list.Name
          }
        })
        this.setState({ eventList });
      } else {
        this.setState({ showSnackbar: true, severity: 'error', toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });

  }

  handleEventChange = (selectedEvent) => {
    if (selectedEvent) {
      const reqObj = { eventID: selectedEvent.value };
      this.props.getSquadList(reqObj).then(response => {
        if (response && response.arrRes.length > 0) {
          let squadList = [];
          squadList = response.arrRes.map(list => {
            return {
              value: list.ID,
              label: list.SquadName
            }
          });
          this.setState({ squadList, selectedEvent, showCandidateList: false });
        }
      });
    } else {
      this.setState({ squadList: [], selectedEvent, showCandidateList: false, selectedSquad: null, selectedSprint: null });
    }
  };

  handleSquadChange = (selectedSquad) => {
    const { selectedEvent } = this.state;
    if (selectedSquad) {
      this.setState({ selectedSquad, showCandidateList: false });
      const req = { EventID: selectedEvent.value };
      this.props.getEventDetails(req).then((eventResponse) => {
        if (eventResponse && eventResponse.arrRes) {
          const sprintList = eventResponse.arrRes[0].AssessmentScale.map(list => {
            return {
              value: list,
              label: list
            }
          })
          const OtherAssessmentData = eventResponse.arrRes[0].OtherAssessmentData.map(list => {
            return { ...list, value: 1 }
          })
          const user_id = this.props.userDetails.user_id;
          const organiserIDs = eventResponse.arrRes[0].OrganisersId;
          const panelistIDs = eventResponse.arrRes[0].PanelData;
          const isOrganiser = organiserIDs.find((id) => id.userID === user_id);
          const ispanelist = panelistIDs.find((id) => id.userID === user_id);
          if (ispanelist !== undefined || isOrganiser !== undefined) {
            const foundIndex = eventResponse.arrRes[0].AssessmentScale.findIndex(list => list === 'Final Assessment')
            sprintList.splice(foundIndex, 0, { value: 'Show and Tell assesment', label: 'Show and Tell assesment' });
            this.setState({
              CompetancyData: eventResponse.arrRes[0].CompetancyData, OtherAssessmentData,
              sprintList, candidateList: [],
              selectedCandidate: null, selectedSprint: null
            }, () => {
              this.candidateList(selectedSquad);
            });
          } else {
            this.setState({
              showSnackbar: true,
              severity: 'error',
              toastMsg: 'You do not have permission. Please contact Organiser.',
              squadList: [], sprintList: [], selectedSquad: null, selectedEvent: null,
              candidateList: [], selectedSprint: null,
            });
          }
        } else {
          this.setState({
            showSnackbar: true,
            severity: 'error',
            toastMsg: 'Something went wrong. Please try again later.'
          });
        }
      })
    } else {
      this.setState({ selectedSquad, selectedSprint: null, sprintList: [], showCandidateList: false });
    }
  }

  candidateList = (squadId) => {
    const reqObj = {
      squad_id: squadId.value
    }
    this.props.squadCandidateList(reqObj).then((response) => {
      if (response.errCode && response.errCode === 200) {
        this.setState({ candidateList: response.arrRes });
      } else {
        this.setState({
          showSnackbar: true,
          severity: 'error',
          toastMsg: 'Something went wrong. Please try again later.'
        });
      }
    });
  }

  handleSprintChange = (selectedSprint) => {
    this.setState({ selectedSprint, showCandidateList: false });
  }

  handleProceed = () => {
    const { selectedSquad, selectedEvent, selectedSprint, candidateList, OtherAssessmentData } = this.state;
    const updateCandidate = [...candidateList];
    const reqObj = {
      eventID: selectedEvent.value,
      squadID: selectedSquad.value,
      userID: this.props.userDetails.user_id
    };
    this.props.candidateSquadFeedbackList(reqObj).then((response) => {
      const currentSprintFB = response.arrRes.filter(list => list.sprintLevel === selectedSprint.value)
      if (currentSprintFB.length > 0) {
        const newCandiatesList = updateCandidate.map(candidate => {
          const candidateData = currentSprintFB.find(item => item.candidate_id === candidate.CandidateID);
          if (candidateData) {
            const newAssessmentArr = [];
            candidateData.AssesmentParams.forEach(list => {
              const findAssessment = OtherAssessmentData.find(i => i.OtherAssementScaleName === list.ParamName);
              if (findAssessment) {
                newAssessmentArr.push({
                  scaleVAL: list.ParamValue,
                  scaleID: findAssessment.OtherAssessmentId
                })
              }
            })
            return {
              ...candidate,
              feedback: candidateData.feedbackTxt,
              role: candidateData.role,
              competancy_rating: candidateData.competancy_rating,
              otherAssessment: newAssessmentArr,
              finalStatus: candidateData.sq_final_status,
              isFeedBackSubmitted: true
            }
          } else {
            return {
              ...candidate,
              feedback: '',
              role: '',
              competancy_rating: '',
              otherAssessment: [],
              finalStatus: '',
              isFeedBackSubmitted: false
            };
          }
        })
        this.setState({ candidateList: newCandiatesList, feedbackList: response.arrRes, showCandidateList: true })
      } else {
        const newCandiatesList = updateCandidate.map(candidate => {
          return {
            ...candidate,
            feedback: '',
            role: '',
            competancy_rating: '',
            otherAssessment: [],
            finalStatus: '',
            isFeedBackSubmitted: false
          }
        });
        this.setState({ candidateList: newCandiatesList, feedbackList: response.arrRes, showCandidateList: true });
      }
    })
  }

  handleSubmit = (reqObj) => {
    this.props.candidateSquadWiseFeedback(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          selectedEvent: null,
          selectedSquad: null,
          selectedSprint: null,
          showCandidateList: false,
          showSnackbar: true,
          severity: 'success',
          toastMsg: 'Feedback submitted successfully.'
        })
      } else {
        this.setState({ showSnackbar: true, severity: 'error', toastMsg: 'Something went Wrong. Please try again later.' })

      }
    })
  }

  closeSnackbar = () => {
    this.setState({ showSnackbar: false })
  }

  render() {
    const { classes } = this.props;
    const { squadList, candidateList, OtherAssessmentData, CompetancyData, showSnackbar, severity, toastMsg,
      eventList, selectedEvent, selectedSquad, selectedSprint, sprintList, showCandidateList, feedbackList } = this.state;
    return (
      <Paper elevation={3} className={classes.paperRoot}>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar
              squadList={squadList}
              eventList={eventList}
              sprintList={sprintList}
              selectedEvent={selectedEvent}
              selectedSquad={selectedSquad}
              selectedSprint={selectedSprint}
              handleEventChange={this.handleEventChange}
              handleSquadChange={this.handleSquadChange}
              handleSprintChange={this.handleSprintChange}
              handleProceed={this.handleProceed}
            />
            {selectedSprint && candidateList.length > 0 && showCandidateList &&
              <CandidateFBTable
                OtherAssessmentData={OtherAssessmentData}
                candidateList={candidateList}
                CompetancyData={CompetancyData}
                selectedSprint={selectedSprint}
                selectedEvent={selectedEvent}
                selectedSquad={selectedSquad}
                feedbackList={feedbackList}
                userID={this.props.userDetails.user_id}
                handleSubmit={this.handleSubmit}
              />}
          </Paper>
        </div>
        <CustomizedSnackbars
          showSnackbar={showSnackbar}
          closeSnackbar={this.closeSnackbar}
          severity={severity}
          toastMessage={toastMsg} />
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
  paperRoot: { margin: '20px 12%' },
  paper: {
    width: "100%",
  },
});
export default withStyles(useStyles, { withTheme: true })(CandidateFeedbackNew);
