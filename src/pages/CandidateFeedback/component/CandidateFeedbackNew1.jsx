import React, {useEffect, useCallback} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableContainer, Toolbar, Typography, Paper, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1,
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  return (
    <>
    <Toolbar>
      <Typography className={classes.title} variant="h5" noWrap>
        Candidate Feedback
      </Typography>
    </Toolbar>
    <div style={{ display: 'flex', padding: '0 10px 10px'}}>
        <Autocomplete
          id="combo-box-demo"
          options={props.eventList}
          getOptionLabel={(option) => option.label}
          size="small"
          style={{ maxWidth: 250, width: "100%", marginRight: 10 }}
          onChange={(event, newValue) => props.handleEventChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Select the Events" variant="outlined" />}
        />
        <Autocomplete
          id="combo-box-demo"
          options={props.squadList}
          getOptionLabel={(option) => option.label}
          size="small"
          style={{ maxWidth: 250, width: "100%", marginRight: 10 }}
          // onChange={(event, newValue) => props.handleChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Select the Squad" variant="outlined" />}
        />
        <Autocomplete
          id="combo-box-demo"
          options={props.sheetOptions}
          getOptionLabel={(option) => option.label}
          size="small"
          style={{ maxWidth: 250, width: "100%", marginRight: 10 }}
          onChange={(event, newValue) => props.handleChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Select the Sprint" variant="outlined" />}
        />
        {/* <Button size="small" variant="contained" style={{ padding: 10, width: 120, marginLeft: 10 }} color="primary">
          Submit
        </Button> */}
      </div>
      </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  tablecell: { padding: 10 },
  tableHeaderCell: { padding: 10, borderBottom: '1px solid #616161' },
  paperRoot: { margin: '20px 15%' },
  paper: {
    width: "100%",
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));
export default function CandidateFeedbackNew(props) {
  const classes = useStyles();
  const [eventList, seteventList] = React.useState([]);
  const [selectedEvent, setselectedEvent] = React.useState();
  const [competancyData, setCompetancyData] = React.useState([]);
  const [otherAssessmentData, setOtherAssessmentData] = React.useState([]);
  const [squadList, setsquadList] = React.useState([]);
  const [sprintList, setsprintList] = React.useState([]);
  const [selectedSquad, setselectedSquad] = React.useState();
  const [candidateList, setcandidateList] = React.useState([]);
  const [selectedCandidate, setselectedCandidate] = React.useState();
  const [selectedSprint, setselectedSprint] = React.useState();

  useEffect(() => {
    props.getEventList().then(response => {
      const events = response.arrRes.map(list => {
        return {
          value: list.EventId,
          label: list.Name
        }
      })
      seteventList(events);
    });
  }, [])
  
  const handleEventChange = useCallback((selectedEvent) => {
    setselectedEvent(selectedEvent);
    const reqObj = { eventID: selectedEvent.value }
    props.getSquadList(reqObj).then(response => {
      if (response && response.arrRes) {
        let squadList = [];
        squadList = response.arrRes.map(list => {
          return {
            value: list.ID,
            label: list.SquadName
          }
        })
        const req = { EventID: selectedEvent.value };
        props.getEventDetails(req).then((eventResponse) => {
          if (eventResponse && eventResponse.arrRes) {
            let sprintList = [];
            sprintList = eventResponse.arrRes[0].AssessmentScale.map(list => {
              return {
                value: list,
                label: list
              }
            })
            const OtherAssessmentData = eventResponse.arrRes[0].OtherAssessmentData.map(list => {
              return { ...list, value: 1 }
            })
            setCompetancyData(eventResponse.arrRes[0].CompetancyData);
            setOtherAssessmentData(OtherAssessmentData);
            // this.setState({ CompetancyData: eventResponse.arrRes[0].CompetancyData, OtherAssessmentData });
            const user_id = props.userDetails.user_id;
            const organiserIDs = eventResponse.arrRes[0].OrganisersId;
            const panelistIDs = eventResponse.arrRes[0].PanelData;
            const isOrganiser = organiserIDs.find((id) => id.userID === user_id);
            const ispanelist = panelistIDs.find((id) => id.userID === user_id);
            if (ispanelist !== undefined || isOrganiser !== undefined) {
              const foundIndex = eventResponse.arrRes[0].AssessmentScale.findIndex(list => list === 'Final Assessment')
              sprintList.splice(foundIndex, 0, { value: 'Show and Tell assesment', label: 'Show and Tell assesment' });
              // this.setState({ squadList, sprintList, selectedSquad: null, candidateList: [], selectedCandidate: null, selectedSprint: null, showRatingDiv: false });
              setsquadList(squadList);
            } else {
              // this.setState({
              //   showSuccessMessage: true,
              //   toastMessage: 'You do not have permission. Please contact Organiser.',
              //   squadList: [], sprintList: [], selectedSquad: null, selectedEvent: null, candidateList: [], selectedSprint: null, selectedCandidate: null, ShowCompentencyOption: false, CompentencyOption: [], selectedFinalStatus: null, showRatingDiv: false, formIsValid: false
              // });
            }
          } else {
            // this.setState({
            //   showSuccessMessage: true,
            //   toastMessage: 'Something went wrong. Please try again later.'
            // });
          }
        });
      } else {
        // this.setState({
        //   showSuccessMessage: true,
        //   toastMessage: 'No Squad has been created.'
        // });
      }
    });
  }, []);
  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar 
          squadList={squadList}
          eventList={eventList} 
          handleEventChange={handleEventChange}/>
        </Paper>
      </div>
    </Paper>
  );
}

