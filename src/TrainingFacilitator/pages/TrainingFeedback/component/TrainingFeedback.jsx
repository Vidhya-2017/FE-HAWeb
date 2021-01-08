import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Table, TableBody, Tooltip, FormControl, Toolbar, Typography, Paper,
  Checkbox, IconButton, TableCell, TablePagination, TableRow, TableSortLabel,
  TableHead, Grid, Button, Dialog, DialogTitle, TextField, DialogActions, DialogContent
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { withRouter } from 'react-router';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import TableContainer from "@material-ui/core/TableContainer";
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import ExportCSV from './ExportCSV';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const initialAssessmentRows = [
  { id: 'first_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'remarks', numeric: true, disablePadding: false, label: 'Remarks' },
];
const postAssessmentRows = [
  { id: 'first_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'dreyfus_rating', numeric: false, disablePadding: true, label: 'Dreyfus' },
  { id: 'remarks', numeric: false, disablePadding: true, label: 'Comments' },
  { id: 'isCertified', numeric: false, disablePadding: true, label: 'Can be Certified' },
]
const preAssessmentRows = [
  { id: 'first_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'score', numeric: false, disablePadding: true, label: 'Score' },
  { id: 'final_conclusion', numeric: false, disablePadding: true, label: 'Final Conclusion' },
  { id: 'remarks', numeric: false, disablePadding: true, label: 'Comments' },

]
const inProgressRows = [
  { id: 'first_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'attendance', numeric: true, disablePadding: false, label: 'Attendance' },
  { id: 'smesessioninteraction', numeric: true, disablePadding: false, label: 'SME Session Interaction' },
  { id: 'theory', numeric: true, disablePadding: false, label: 'Theory' },
  { id: 'handson', numeric: true, disablePadding: false, label: 'Hands-on' },
  { id: 'handsonperformance', numeric: true, disablePadding: false, label: 'Hands-on Performance' },
  { id: 'assessment', numeric: true, disablePadding: false, label: 'Assessment %' },
  { id: 'assessmentschedulecompliance', numeric: true, disablePadding: false, label: 'Assessment Schedule Compliance' },
  { id: 'overall', numeric: true, disablePadding: false, label: 'Overall' },
  { id: 'smesinteraction', numeric: true, disablePadding: false, label: "SME's Interaction" },
  { id: 'smename', numeric: true, disablePadding: false, label: 'SME Name' },
  { id: 'remarks', numeric: true, disablePadding: false, label: 'Remarks' },
  { id: 'trainingcompleted', numeric: true, disablePadding: false, label: 'Training Completed' },
  { id: 'trainingcompleteddate', numeric: true, disablePadding: false, label: 'Training Completed Date' },
  { id: 'certification', numeric: true, disablePadding: false, label: 'Certification' },
  { id: 'finalassessmentscore', numeric: true, disablePadding: false, label: 'Final Score' },
  { id: 'percentcompleted', numeric: true, disablePadding: false, label: '% complete' },
  { id: 'spoc', numeric: true, disablePadding: false, label: 'SPOC' },

];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, assessmentType, orderBy, numSelected, rowCount, classes } = this.props;
    let rows = [];
    if (assessmentType === 'Interim') {
      rows = inProgressRows;
    } else if (assessmentType === 'Pre-Assessment') {
      rows = preAssessmentRows;
    } else if (assessmentType === 'Post-Assessment') {
      rows = postAssessmentRows;
    } else if (assessmentType === 'Initial Assessment') {
      rows = initialAssessmentRows;
    }
    return (
      <TableHead>
        <TableRow className={classes.tableheader}>
          <TableCell padding="checkbox" className={classes.stickyColumnHeader}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected > 0}
              onChange={onSelectAllClick}
              color="primary"
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                className={row.id === 'first_name' ? classes.stickyColumnHeaderName : ''}
                style={{ fontSize: "15px", padding: 8 }}
                key={row.id}
                align={'left'}
                // padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: '#000000',
        backgroundColor: '#B3E5FC',
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, selectedData, userData } = props;

  const bulkEdit = () => {
    let pathName = '';
    if (props.assessmentLevel === 'Interim') {
      pathName = '/trainingcandidateFeedback';
    } else if (props.assessmentLevel === 'Pre-Assessment') {
      pathName = '/preAssessmentFeedback';
    } else if (props.assessmentLevel === 'Post-Assessment') {
      pathName = '/postAssessmentFeedback';
    }
    let userdata = userData.filter(user => selectedData.includes(user.id))
    props.history.push({
      pathname: pathName,
      state: { data: userdata }
    })
  }

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
              Candidates List
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 &&
          <Tooltip title="Edit">
            <IconButton aria-label="Edit" onClick={bulkEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        }
      </div>
    </Toolbar>
  );
};


EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3)
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  paperRoot: {
    width: '90%',
    margin: '20px auto',
    padding: '10px 20px'
  },
  formControl: {
    margin: '0 8px 8px',
    minWidth: 200,
  },
  tableheader: {
    backgroundColor: '#E0E0E0'
  },
  stickyColumnHeader: { position: 'sticky', left: 0, zIndex: 1, background: '#E0E0E0' },
  stickyColumnHeaderName: { position: 'sticky', left: 46, zIndex: 1, background: '#E0E0E0' },
  stickyColumnCell: { position: 'sticky', left: 0, zIndex: 1, background: '#fff' },
  stickyColumnCellName: { position: 'sticky', left: 46, zIndex: 1, background: '#fff' }
});

const weekList = [
  { value: 'Week 1', id: 1, label: 'Week 1' },
  { value: 'Week 2', id: 1, label: 'Week 2' },
  { value: 'Week 3', id: 1, label: 'Week 3' },
  { value: 'Week 4', id: 1, label: 'Week 4' },
  { value: 'Week 5', id: 1, label: 'Week 5' },
  { value: 'Week 6', id: 1, label: 'Week 6' },
]

const durationTypeList = [
  { value: 'Month', id: 'Month', label: 'Month' },
  { value: 'Week', id: 'Week', label: 'Week' },
  { value: 'Days', id: 'Days', label: 'Days' }
]

const assessmentList = [
  {
    value: 'Initial Assessment',
    id: 0,
    label: 'Initial Assessment'
  },
  {
    value: 'Pre-Assessment',
    id: 1,
    label: 'Pre-Assessment'
  },
  {
    value: 'Interim',
    id: 3,
    label: 'Interim'
  },
  {
    value: 'Post-Assessment',
    id: 2,
    label: 'Post-Assessment'
  }
]
class TrainingFeedback extends React.Component {
  state = {
    order: 'asc',
    orderBy: '',
    selected: [],
    data: [],
    excelData: [],
    page: 0,
    rowsPerPage: 10,
    trainingListVal: [],
    selectedTraining: null,
    selectedWeek: null,
    selectedDrType: null,
    selectedAssessment: null,
    filteredFeedback: [],
    training_id: '',
    pushData: [],
    snackvariant: '',
    updated_by: '',
    snackmsg: '',
    comments: '',
    subject: '',
    showRecommendationModal: false
  };
  componentDidMount() {
    this.props.getTrainingList().then((response) => {
      if (response && response.errCode === 200) {
        const trainingListVal = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.training_name
          }
        });
        this.setState({
          trainingListVal,
        })
      } else {
        this.setState({
          trainingListVal: [],
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "Error in loading Data"
        })
      }
    });

  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      const { data } = this.state;
      // const feedbackFalse = data.filter(item=> item.feedback_given === false);
      this.setState(state => ({ selected: data.map(n => n.id) }));
      // return;

    } else {
      this.setState({ selected: [] });
    }
  };

  handleClick = (event, id, name) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  handleAssessmentChange = (e) => {
    if (e.target.value === "Interim") {
      this.getCandidateInterimFB();
    } else if (e.target.value === "Pre-Assessment") {
      this.getCandidatePreAssessmtFB();
    } else if (e.target.value === "Post-Assessment") {
      this.getCandidatePostAssessmtFB();
    } else if (e.target.value === "Initial Assessment") {
      this.getCandidateInterimFB();
    }
    this.setState({
      selectedAssessment: e.target,
      selected: [],
      selectedWeek: null,
      selectedDrType: null
    })
  }

  getCandidatePostAssessmtFB = () => {
    const reqObj = {
      trainingId: this.state.training_id,
      createdBy: this.props.userDetails.user_id,
    }
    this.props.getPostAssessmentList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const smeNames = response.sme.map(sme => sme.sme_name);
        const programManagerNames = response.programManager.map(pm => pm.program_manager_name);
        const nonfeedback_levels = { training_id: this.state.training_id, feedback_given: false, rowclicked: false, comment: '', can_be_certified: false, dryfice: '', sme_name: smeNames, spoc: programManagerNames }
        const feedback_levels = { feedback_given: true, sme_name: smeNames, rowclicked: false, spoc: programManagerNames }
        const feedback_given_list = response.feedback_given_list.map(list1 => {
          return { ...list1, ...feedback_levels }
        })
        const feedback_notgiven_list = response.no_feedback_given_list.map(list => {
          return { ...list, ...nonfeedback_levels }
        })
        const newdata = [...feedback_notgiven_list, ...feedback_given_list];

        this.setState({
          data: newdata,
          selected: [],
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Candidates Loaded Successfully"
        })
      } else {
        this.setState({
          data: [],
          selected: [],
          training_id: '',
          selectedTraining: null,
          selectedAssessment: null,
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "No Candidates Found"
        })
      }
    });
  }

  getCandidatePreAssessmtFB = () => {
    const reqObj = {
      trainingId: this.state.training_id,
      createdBy: this.props.userDetails.user_id,
    }
    this.props.getPreAssessmentList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const smeNames = response.sme.map(sme => sme.sme_name);
        const programManagerNames = response.programManager.map(pm => pm.program_manager_name);
        const nonfeedback_levels = { training_id: this.state.training_id, feedback_given: false, rowclicked: false, score: '', sme_name: smeNames, spoc: programManagerNames, final_conclusion: '', comment: '' }
        const feedback_levels = { feedback_given: true, rowclicked: false, sme_name: smeNames, spoc: programManagerNames }
        const feedback_given_list = response.feedback_given_list.map(list1 => {
          return { ...list1, ...feedback_levels }
        })
        const feedback_notgiven_list = response.no_feedback_given_list.map(list => {
          return { ...list, ...nonfeedback_levels }
        })
        const newdata = [...feedback_notgiven_list, ...feedback_given_list];
        this.setState({
          data: newdata,
          selected: [],
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Candidates Loaded Successfully"
        })
      } else {
        this.setState({
          data: [],
          selected: [],
          training_id: '',
          selectedTraining: null,
          selectedAssessment: null,
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "No Candidates Found"
        })
      }
    });
  }
  getCandidateInterimFB = () => {
    const reqObj = {
      training_id: this.state.training_id,
      user_id: 1,
    }
    this.props.getCandidateList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const nonfeedback_levels = { "training_id": this.state.training_id, "attendance": 0, "sme_session_interaction": 0, "theory": 0, "hands_on": 0, "hands_on_performance": 0, "assessment": '0', "assessment_schedule_compliance": 0, "overall": 0, "sme_interaction": 0, "sme_name": response.sme.sme_name, "remarks": '', "training_completed": 'Yes', "training_completed_date": '', "certification": 'Foundation', "final_assessment_score": 0, "percentage_complete": '0', "spoc": response.programManager.program_manager_name, "default_end_date": true, "actual_training_completed_date": response.sme.enddate, "feedback_given": false, "rowclicked": false }
        const feedback_levels = { "default_end_date": false, "actual_training_completed_date": response.sme.enddate, "feedback_given": true, "rowclicked": false }
        const feedback_given_list = response.feedback_given_list.map(list1 => {
          return { ...list1, ...feedback_levels }
        })
        const feedback_notgiven_list = response.no_feedback_given_list.map(list => {
          return { ...list, ...nonfeedback_levels }
        })
        const newdata = [...feedback_notgiven_list, ...feedback_given_list];
        const excelDataArray = newdata.map(list => {
          return { "Training Name": this.state.selectedTraining.label, "First Name": list.first_name, "Last Name": list.last_name, "SAP ID": list.sap_id, "Contact No": list.phone_number, "Email Id": list.email, "SME Name": list.sme_name, "SPOC": list.spoc, "Training Completed Date": list.training_completed_date, "Training Completed": list.training_completed, "Remarks": list.remarks, "SME Interaction": list.sme_interaction, "SME Session Interaction": list.sme_session_interaction, "Theory": list.theory, "Hands On": list.hands_on, "Hands On Performance": list.hands_on_performance, "Certification": list.certification, "Attendance": list.attendance, "Assessment %": list.assessment, "Assessment Schedule Compliance": list.assessment_schedule_compliance, "OverAll %": list.overall, "% Completed": list.percentage_complete }
        })
        this.setState({
          data: newdata,
          excelData: excelDataArray,
          selected: [],
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Candidates Loaded Successfully"
        })
      } else {
        this.setState({
          data: [],
          selected: [],
          training_id: '',
          selectedTraining: null,
          selectedAssessment: null,
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "No Candidates Found"
        })
      }
    });
  }

  handleDrTypeChange = (e) => {
    this.setState({
      selectedDrType: e.target,
    })
  }

  handleWeekChange = (e) => {
    this.setState({
      selectedWeek: e.target.value,
    })
  }

  handleTrainingChange = (e) => {
    this.setState({
      training_id: e.target.value,
      selectedTraining: e.target,
      selectedAssessment: null,
      selectedDrType: null
    })
  }

  showRecommendationModal = () => {
    this.setState({ showRecommendationModal: true })
  }

  handleModalClose = () => {
    this.setState({ showRecommendationModal: false, subject: '', comments: '' })
  }

  handleModalSubmit = () => {
    const { comments, selectedTraining, selectedAssessment, subject } = this.state;
    const reqObj = {
      trainingId: selectedTraining.id,
      subjectTxt: subject,
      assessmentLevel: selectedAssessment.value,
      recommentTxt: comments,
      userId: 1
    }
    this.props.trainingRecomendations(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Thanks for your recommendations."
        })
      }

    })
  }
  render() {
    const { classes } = this.props;
    const { data, excelData, order, selectedWeek, selectedDrType, selectedAssessment,
      comments, subject, showRecommendationModal, orderBy, selected, rowsPerPage, page, trainingListVal, selectedTraining, snackvariant, snackBarOpen, snackmsg } = this.state;

    return (
      <div className="TrainingFeedback_container">
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Candidate Feedback
            </Typography>
          <Grid container spacing={1} >
            <FormControl variant="outlined" className={classes.formControl}>
              <label>Training List</label>
              <SelectOne
                value={selectedTraining ? selectedTraining : null}
                id="training"
                name="training"
                placeholder='Select Training'
                options={trainingListVal}
                onChange={this.handleTrainingChange}
              />
            </FormControl>
            {selectedTraining &&
              <FormControl variant="outlined" className={classes.formControl}>
                <label>Assessment Level</label>
                <SelectOne
                  value={selectedAssessment ? selectedAssessment : null}
                  id="training"
                  name="training"
                  placeholder='Select Assessment'
                  options={assessmentList}
                  onChange={this.handleAssessmentChange}
                />
              </FormControl>
            }
            {selectedTraining && selectedAssessment && selectedAssessment.value === 'Interim' &&
              <FormControl variant="outlined" className={classes.formControl}>
                <label>Assessment Frequency</label>
                <SelectOne
                  value={selectedDrType ? selectedDrType : null}
                  id="durationType"
                  name="durationType"
                  placeholder='Select Duration Type'
                  options={durationTypeList}
                  onChange={this.handleDrTypeChange}
                />
              </FormControl>
            }
            {selectedTraining && selectedAssessment && selectedAssessment.value === 'Interim' &&
              <FormControl variant="outlined" className={classes.formControl}>
                <label>Day/Week/Date</label>
                <Textbox
                  value={selectedWeek ? selectedWeek : ''}
                  id="training"
                  name="training"
                  placeholder='Day / Week / Date'
                  options={weekList}
                  onChange={this.handleWeekChange}
                />
              </FormControl>
            }
          </Grid>
          <div style={{ display: 'flex', height: 50, justifyContent: 'flex-end', padding: '10px 0' }}>
            {excelData !== '' && selectedTraining && selectedAssessment && selectedAssessment.value === 'Interim' &&
              <ExportCSV csvData={excelData} fileName={"Candiate Feedback List"} />
            }
            {selectedTraining && selectedAssessment &&
              <Button onClick={this.showRecommendationModal} variant="contained" size="small" color="primary">Recommendation</Button>
            }
          </div>
          {selectedAssessment && selectedAssessment.value === 'Initial Assessment' &&
            <TableContainer component={Paper}>
              {/* <EnhancedTableToolbar numSelected={selected.length} selectedData={selected} userData={data} history={this.props.history} /> */}
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    assessmentType={selectedAssessment.value}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                    classes={classes}
                  />
                  <TableBody>
                    {stableSort(data, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            className={classes.stickyColumnCellName}
                            hover
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                          // selected={isSelected}
                          >
                            <TableCell padding="checkbox" className={classes.stickyColumnCell}>
                              <Checkbox color="primary" checked={isSelected} onClick={event => this.handleClick(event, n.id, n.first_name)} />
                            </TableCell>

                            <TableCell style={{ padding: 8 }} component="th" scope="row" padding="none" className={classes.stickyColumnCellName}>
                              {n.first_name}
                            </TableCell>
                            <TableCell style={{ padding: 8 }}>{n.remarks}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          }
          {selectedAssessment && selectedAssessment.value === 'Post-Assessment' &&
            <TableContainer component={Paper}>
              <EnhancedTableToolbar numSelected={selected.length} assessmentLevel={selectedAssessment.value} selectedData={selected} userData={data} history={this.props.history} />
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    assessmentType={selectedAssessment.value}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                    classes={classes}
                  />
                  <TableBody>
                    {stableSort(data, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            className={classes.stickyColumnCellName}
                            hover
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            <TableCell padding="checkbox" className={classes.stickyColumnCell}>
                              <Checkbox color="primary" checked={isSelected} onClick={event => this.handleClick(event, n.id, n.first_name)} />
                            </TableCell>

                            <TableCell style={{ padding: 8 }} component="th" scope="row" padding="none" className={classes.stickyColumnCellName}>
                              {n.first_name}
                            </TableCell>
                            <TableCell style={{ padding: 8 }}>{n.dryfice_arr && n.dryfice_arr.value ? n.dryfice_arr.value : '---'}</TableCell>
                            <TableCell style={{ padding: 8 }}>{n.comment}</TableCell>
                            <TableCell style={{ padding: 8 }}>{n.can_be_certified ? n.can_be_certified : '---'}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>

              </div>
            </TableContainer>
          }
          {selectedAssessment && selectedAssessment.value === 'Pre-Assessment' &&

            <TableContainer component={Paper}>
              <EnhancedTableToolbar numSelected={selected.length} assessmentLevel={selectedAssessment.value} selectedData={selected} userData={data} history={this.props.history} />
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    assessmentType={selectedAssessment.value}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                    classes={classes}
                  />
                  <TableBody>
                    {stableSort(data, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            className={classes.stickyColumnCellName}
                            hover
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            <TableCell padding="checkbox" className={classes.stickyColumnCell}>
                              <Checkbox color="primary" checked={isSelected} onClick={event => this.handleClick(event, n.id, n.first_name)} />
                            </TableCell>

                            <TableCell style={{ padding: 8 }} component="th" scope="row" padding="none" className={classes.stickyColumnCellName}>
                              {n.first_name}
                            </TableCell>
                            <TableCell style={{ padding: 8 }}>{n.score ? n.score : 0}</TableCell>
                            <TableCell style={{ padding: 8 }}>{n.final_conclusion ? n.final_conclusion : 0}</TableCell>
                            <TableCell style={{ padding: 8 }}>{n.comment}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          }
          {selectedWeek && selectedDrType && selectedAssessment && selectedAssessment.value === 'Interim' && <TableContainer component={Paper}>
            <EnhancedTableToolbar numSelected={selected.length} assessmentLevel={selectedAssessment.value} selectedData={selected} userData={data} history={this.props.history} />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  assessmentType={selectedAssessment.value}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                  classes={classes}
                />
                <TableBody>
                  {stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      const isSelected = this.isSelected(n.id);
                      return (
                        <TableRow
                          className={classes.stickyColumnCellName}
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox" className={classes.stickyColumnCell}>
                            <Checkbox color="primary" checked={isSelected} onClick={event => this.handleClick(event, n.id, n.first_name)} />
                          </TableCell>

                          <TableCell style={{ padding: 8 }} component="th" scope="row" padding="none" className={classes.stickyColumnCellName}>
                            {n.first_name}
                          </TableCell>
                          <TableCell style={{ padding: 8 }}>{n.attendance}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.sme_session_interaction}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.theory}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.hands_on}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.hands_on_performance}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.assessment}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.assessment_schedule_compliance}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.overall}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.sme_interaction}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.sme_name}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.remarks}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.training_completed}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.training_completed_date}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.certification}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.final_assessment_score}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.percentage_complete}</TableCell>
                          <TableCell style={{ padding: 8 }}>{n.spoc}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </TableContainer>}
          {snackBarOpen &&
            <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
        </Paper>

        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showRecommendationModal}
          onClose={this.handleModalClose}
        >
          <DialogTitle >Recommendation</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 40px 10px 0' }}>Subject:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Subject"
                type="text"
                value={subject}
                onChange={(e) => this.setState({ subject: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Comments:</Typography>
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="Comments"
                type="text"
                value={comments}
                onChange={(e) => this.setState({ comments: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" >
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={comments === '' || subject === ''} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

TrainingFeedback.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, withRouter)(TrainingFeedback);
