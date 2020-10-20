import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent, Button
} from '@material-ui/core';
import '../scss/AssesmentType.scss';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import moment from 'moment';

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    [theme.breakpoints.up('md')]: {
      width: '55%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '45%',
    },
    margin: '20px auto',
    padding: '10px 20px'
  },
});
class AssesmentType extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      assessmentListVal: [],
      showAddAssessmentModal: false,
      newAssessmentScale: '',
      snackBarOpen: false,
      snackvariant: '',
      snackmsg: ''
    }
    this.columnFields = [
      {
        title: "Name",
        field: "assesment_type_name",
        validate: rowData => rowData.assesment_type_name !== '',
      },
    ]
  }

  componentDidMount() {

    this.props.getAssessmentList().then((response) => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        this.setState({
          assessmentListVal: response.arrRes,
          snackBarOpen: true,
          snackvariant: 'success',
          snackmsg: "Assessment Data loaded successfully"
        })
        console.log(this.state.assessmentListVal);
      } else {
        this.setState({
          assessmentListVal: [],
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "Error in loading Assessment Data"
        })
      }
    });
  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  handleDelete = (id) => {
    const filteredItems = this.state.assessmentListVal.filter((item) => item.id !== id);
    const reqObj = {
      id: id,
      updated_by: 1
    }
    this.props.DeleteAssesmentTypeList(reqObj).then(response => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        this.setState({
          assessmentListVal: filteredItems,
          snackBarOpen: true,
          snackvariant: 'success',
          snackmsg: "Assessment name deleted successfully",
        });
      }
      else {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "Error in Assessment name deletion"
        });
      }
    });
  }

  editSubmit = (updatedScale, oldData) => {
    const reqObj = {
      id: updatedScale.id,
      assesment_type_name: updatedScale.assesment_type_name,
      updated_by: "1"
    }
    this.props.EditAssesmentTypeList(reqObj).then(response => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        this.setState(prevState => ({
          assessmentListVal: prevState.assessmentListVal.map(
            el => el.id === updatedScale.id ? { ...el, assesment_type_name: updatedScale.assesment_type_name } : el
          )
        }))
        this.setState({
          snackBarOpen: true,
          snackvariant: 'success',
          snackmsg: "Assessment name updated successfully",
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " failed in updating Assessment name"
        });
      }
      else {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "error in updating the Assessment name"
        });
      }
    });
  }

  handleModalClose = () => {
    this.setState({ showAddAssessmentModal: false, newAssessmentScale: '' })
  }

  handleModalSubmit = () => {
    const { newAssessmentScale } = this.state;
    const date = moment().format("YYYY-MM-DD");
    const reqObj = {
      assesment_type_name: newAssessmentScale,
      created_by: 1,
      updated_by: 1,
      created_date: date
    }
    this.props.setAddAssesmentTypeList(reqObj).then(response => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        console.log(response);
        const myObj = {
          id: response.AssessmentTypeId,
          assesment_type_name: response.AssessmentTypeName
        }
        const updatedItems = [...this.state.assessmentListVal, myObj];
        this.setState({
          newAssessmentScale: '',
          showAddAssessmentModal: false,
          assessmentListVal: updatedItems,
          snackBarOpen: true,
          snackvariant: 'success',
          snackmsg: "Assessment name added successfully!"
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showAddAssessmentModal: false,
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "Already Assessment type name exists!"
        })
      }
      else {
        this.setState({
          showAddAssessmentModal: false,
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "error in adding aseessment name!"
        })
      }
    });
  };

  render() {
    const { assessmentListVal, showAddAssessmentModal, newAssessmentScale, snackvariant, snackBarOpen, snackmsg } = this.state;
    const { classes } = this.props;
    return (
      <div className="AssesmentType_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddAssessmentModal}
          onClose={this.handleModalClose}
          aria-labelledby="assessment-type"
        >
          <DialogTitle id="assessment-type">Add Assessment Scale</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Assessment Name:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Assessment Name"
                type="text"
                value={newAssessmentScale}
                onChange={(e) => this.setState({ newAssessmentScale: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={newAssessmentScale === '' || newAssessmentScale === null} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Assessment Scale
        </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={assessmentListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: []
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Assessment Type',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddAssessmentModal: true })
              },
            ]}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  resolve();
                  if (oldData) {
                    this.editSubmit(newData, oldData);
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  resolve();
                  this.handleDelete(oldData.id);
                })
            }}
          />
          {snackBarOpen &&
            <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
        </Paper>
      </div>
    )
  }
}


export default withStyles(styles, { withTheme: true })(AssesmentType);