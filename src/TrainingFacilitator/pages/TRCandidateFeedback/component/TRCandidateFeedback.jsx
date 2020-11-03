import React from 'react';
import {
  Paper, withStyles, Typography, Button, MenuItem, FormControl, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, InputBase
} from '@material-ui/core';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import '../scss/TRCandidateFeedback.scss';
const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  }
}))(InputBase);

const styles = (theme) => ({
  formControl: {
    margin: '0 8px 8px',
    minWidth: 200,
  },
  formControlPercentage: {
    margin: '0 8px 8px',
    minWidth: 50,
  },
  formControlFinalAssessment: {
    margin: '0 8px 8px',
    minWidth: 70,
  },
  selectEmpty: {
  },
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {

    width: '90%',
    margin: '20px auto',
    padding: '10px 20px'
  },
  tableheader: {
    backgroundColor: '#E0E0E0',
  },
  stickyColumnHeader: { position: 'sticky', left: 0, zIndex: 1, background: '#E0E0E0' },
  stickyColumnHeaderName: { position: 'sticky', left: 46, zIndex: 1, background: '#E0E0E0' },
  stickyColumnCell: { position: 'sticky', left: 0, zIndex: 1, background: '#E0E0E0' },
  stickyColumnCellName: { position: 'sticky', left: 0, zIndex: 1, background: '#fff' },
  select: { padding: '11px 12px' },
  margin: {
    margin: theme.spacing(1)
  },
  selectRoot: {
    width: 60
  },
  fontsize: {
    fontSize: 13
  }
});

class TrainingFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      snackvariant: '',
      updated_by: '',
      snackmsg: '',
      default_date: false,
    }
  }

  componentDidMount() {
    if (this.props.location.state === undefined || this.props.location.state === '') {
      this.props.history.push('/candidateFeedbackList')
    } else {
      const users = this.props.location.state.data;
      console.log(users);
      this.setState({ data: users })
    }
  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  onRatingChange = (e, list) => {
    const { data } = this.state;
    list.value = e.target.value;
    const findIndex = data.findIndex(user =>
      list.id === user.id);
    const updatedUserData = [...data];
    updatedUserData[findIndex][e.target.name] = e.target.value;
    updatedUserData[findIndex]['rowclicked'] = true;
    this.setState({ data: updatedUserData });
  }

  inputFieldChange = (e, list) => {
    const { data } = this.state;
    list.value = e.target.value;
    if (e.target.name === 'assessment' || e.target.name === 'percentage_complete' || e.target.name === 'final_assessment_score') {
      if (e.target.value > 100 || e.target.value < 0 || e.target.value === 'e') {
        e.target.value = 0;
      }
    }
    const findIndex = data.findIndex(user => list.id === user.id);
    const updatedUserData = [...data];
    updatedUserData[findIndex][e.target.name] = e.target.value;
    updatedUserData[findIndex]['rowclicked'] = true;
    this.setState({ data: updatedUserData });
  }

  submitForm = (e) => {
    const { data } = this.state;
    const realdata = data.filter(item => item.rowclicked === true);
    
    let reqObj = {
      data: realdata,
      created_by: 1,
    }
      this.props.insertCandidateFeedback(reqObj).then((response) => {
        if (response && response.errCode === 200) {
          this.setState({
            snackvariant: 'success',
            snackBarOpen: true,
            snackmsg: "Candidates Feedback Added Successfully"
          })
          this.props.history.push('/candidateFeedbackList');
        } else {
          this.setState({
            snackvariant: 'error',
            snackBarOpen: true,
            snackmsg: "Error in Loading Data"
          })
          this.props.history.push('/candidateFeedbackList');
        }
      })
  }

  CancelAction = () => {
    this.props.history.push('/candidateFeedbackList')
  }

  handleChange = (e, list) => {
    const { data } = this.state;
    const findIndex = data.findIndex(user => list.id === user.id);
    const updatedUserData = [...data];
    updatedUserData[findIndex]['default_end_date'] = !updatedUserData[findIndex]['default_end_date'];updatedUserData[findIndex]['rowclicked'] = !updatedUserData[findIndex]['rowclicked'];
    this.setState({ data: updatedUserData });
  };

  render() {
    const { data, snackvariant, snackBarOpen, snackmsg } = this.state;
    const { classes } = this.props;
    return (
      <div className="TRCandidateFeedback_container">
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Candidate Feedback
            </Typography>
          <Typography variant="h6" className="text-left" gutterBottom>
          <b>SME Name:</b> {data.length > 0 ? data[0].sme_name : '-'} &emsp; &emsp;  <b>SPOC: </b> {data.length > 0 ? data[0].spoc : '-'}
          </Typography>
         
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead className={classes.tableheader} >
                <TableRow >
                  {['Name', 'Attendance', 'SME session Interaction', 'Theory', 'Hands-on', 'Hands-on Performance', 'Assessment %', 'Assessment Schedule Compliance', 'Overall', 'SMEs Interaction', 'Remarks', 'Completed', 'Completed On Time', 'Certification', 'Final Score', '% complete'].map((val, index) =>
                    <TableCell key={val} style={{ padding: 8, fontSize:"15px" }}  className={index === 0 ? classes.stickyColumnCell : ''}>{val}</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ padding: 8, fontSize:"13px" }} component="th" scope="row" className={classes.stickyColumnCellName}>
                      {row.first_name}
                    </TableCell>
                    <TableCell style={{ padding: 8 }} className={classes.fontsize}>
                      <Select
                        name="attendance"
                        id="attendance"
                        value={row.attendance}
                        onChange={(e) => this.onRatingChange(e, row)}
                        variant="outlined"
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={3}>4</MenuItem>
                        <MenuItem value={3}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >
                      <Select
                        name="sme_session_interaction"
                        id="sme_session_interaction"
                        value={row.sme_session_interaction}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="theory"
                        id="theory"
                        value={row.theory}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="hands_on"
                        id="hands_on"
                        value={row.hands_on}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="hands_on_performance"
                        id="hands_on_performance"
                        value={row.hands_on_performance}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <FormControl variant="outlined" className={classes.formControlFinalAssessment}>
                        <Textbox
                          value={row.assessment}
                          id="assessment"
                          type="tel"
                          placeholder="Assessment %"
                          name="assessment"
                          onChange={(e) => this.inputFieldChange(e, row)}
                          input={<BootstrapInput />}
                        />
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="assessment_schedule_compliance"
                        id="assessment_schedule_compliance"
                        value={row.assessment_schedule_compliance}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="overall"
                        id="overall"
                        value={row.overall}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="sme_interaction"
                        id="sme_interaction"
                        value={row.sme_interaction}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <FormControl variant="outlined" className={classes.formControl}>
                        <Textbox
                          value={row.remarks}
                          id="remarks"
                          type="text"
                          placeholder="Remarks"
                          name="remarks"
                          onChange={(e) => this.inputFieldChange(e, row)}
                          input={<BootstrapInput />}
                        />
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="training_completed"
                        id="training_completed"
                        value={row.training_completed}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={'Yes'}>Yes</MenuItem>
                        <MenuItem value={'No'}>No</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >
                      <div style={{ display: 'flex' }}>
                        <Checkbox
                          checked={row.default_end_date}
                          name="default_date"
                          onChange={(e) => this.handleChange(e, row)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                        {row.default_end_date === true &&
                          <DateTimePicker
                            value={row.actual_training_completed_date}
                            maxDays={90}
                            minDate={new Date()}
                            disabled={true}
                            name="actual_training_completed_date"
                            input={<BootstrapInput />}
                          />
                        }
                        {row.default_end_date === false &&
                        
                          <DateTimePicker
                            value={row.training_completed_date === '' ? '' : new Date(row.training_completed_date)}
                            maxDays={90}
                            minDate={new Date()}
                            name="training_completed_date"
                            onChange={(e) => this.inputFieldChange(e, row)}
                            input={<BootstrapInput />}
                          />
                        }</div>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <Select
                        name="certification"
                        id="certification"
                        value={row.certification}
                        onChange={(e) => this.onRatingChange(e, row)}
                        input={<BootstrapInput />}
                      >
                        <MenuItem value={'Foundation'}>Foundation</MenuItem>
                        <MenuItem value={'Associate'}>Associate</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <FormControl variant="outlined" className={classes.formControlFinalAssessment}>
                        <Textbox
                          value={row.final_assessment_score}
                          id="final_assessment_score"
                          type="tel"
                          placeholder="Final Assessment Score"
                          name="final_assessment_score"
                          onChange={(e) => this.inputFieldChange(e, row)}
                          input={<BootstrapInput />}
                        />
                      </FormControl>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >

                      <FormControl variant="outlined" className={classes.formControlFinalAssessment}>
                        <Textbox
                          value={row.percentage_complete}
                          id="percentage_complete"
                          type="tel"
                          placeholder="% Complete"
                          name="percentage_complete"
                          onChange={(e) => this.inputFieldChange(e, row)}
                          input={<BootstrapInput />}
                        />
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0'}}>
          <Button variant="contained" style={{ margin: 5}} onClick={this.submitForm} color="primary">Submit</Button>
          <Button variant="contained" style={{ margin: 5}} onClick={this.CancelAction}>Cancel</Button>
          </div>
          {snackBarOpen &&
            <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
        </Paper>
      </div >
    )
  }
}


export default withStyles(styles, { withTheme: true })(TrainingFeedback);