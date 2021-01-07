import React from 'react';
import {
  Paper, withStyles, Typography, Button, MenuItem, FormControl, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, InputBase
} from '@material-ui/core';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import '../scss/PostAssessmentFeedback.scss';
const BootstrapInput = withStyles((theme) => ({
  root: {
    minWidth: 180,
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
  stickyColumnCellName: { minWidth: 150, position: 'sticky', left: 0, zIndex: 1, background: '#fff' },
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

class PostAssessmentFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      snackvariant: '',
      assessmentListVal: [],
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
      this.setState({ data: users });
    this.props.getAssessmentList().then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          assessmentListVal: response.arrRes,
        })
      } 
    });
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
    const candidates_postFB = realdata.map(list => {
      return {
        candidateId: list.id,
        dryfice: list.dryfice,
        // canBeCertified: true,
        canBeCertified: list.can_be_certified,
        comment: list.comment
      }
    })

    let reqObj = {
      trainingId: realdata[0].training_id,
      candidates_postFB: candidates_postFB,
      createdBy: this.props.userDetails.user_id,
    }
    this.props.postAssessmentFeedback(reqObj).then((response) => {
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
    updatedUserData[findIndex]['can_be_certified'] = e.target.checked ? 'yes' : 'no'; 
    updatedUserData[findIndex]['rowclicked'] = !updatedUserData[findIndex]['rowclicked'];
    this.setState({ data: updatedUserData });
  };

  render() {
    const { data, snackvariant, snackBarOpen, snackmsg, assessmentListVal } = this.state;
    const { classes } = this.props;
    return (
      <div className="TRCandidateFeedback_container">
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h5" className="text-center" gutterBottom>
            Candidate Post Assessment Feedback
            </Typography>
          <Typography  className="text-left" gutterBottom>
            <b>SME Name:</b> {data.length > 0 ? data[0].sme_name : '-'} &emsp; &emsp;  <b>SPOC: </b> {data.length > 0 ? data[0].spoc : '-'}
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead className={classes.tableheader} >
                <TableRow >
                  {['Name', 'Dreyfus Rating', 'Can be Certified', 'Remarks',].map((val, index) =>
                    <TableCell key={val} style={{ padding: 8, fontSize: "15px" }} className={index === 0 ? classes.stickyColumnCell : ''}>{val}</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ padding: 8, fontSize: "13px" }} className={classes.stickyColumnCellName}>
                      {row.first_name}
                    </TableCell>
                    <TableCell style={{ padding: 8 }} className={classes.fontsize}>
                      <Select
                        name="dryfice"
                        id="dryfice"
                        value={row.dryfice}
                        onChange={(e) => this.onRatingChange(e, row)}
                        variant="outlined"
                        input={<BootstrapInput />}
                      >
                        {assessmentListVal.map((item) =>
                          <MenuItem key={item.id} value={item.id}>{item.assesment_type_name}</MenuItem>
                        )}
                      </Select>
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >
                      <Checkbox
                        checked={row.can_be_certified === 'yes'}
                        name="can_be_certified"
                        onChange={(e) => this.handleChange(e, row)}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </TableCell>
                    <TableCell style={{ padding: 8 }} >
                      <FormControl variant="outlined" className={classes.formControl}>
                        <Textbox
                          value={row.comment}
                          id="comment"
                          type="text"
                          placeholder="Remarks"
                          name="comment"
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
            <Button variant="contained" style={{ margin: 5 }} onClick={this.submitForm} color="primary">Submit</Button>
            <Button variant="contained" style={{ margin: 5 }} onClick={this.CancelAction}>Cancel</Button>
          </div>
          {snackBarOpen &&
            <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
        </Paper>
      </div >
    )
  }
}


export default withStyles(styles, { withTheme: true })(PostAssessmentFeedback);