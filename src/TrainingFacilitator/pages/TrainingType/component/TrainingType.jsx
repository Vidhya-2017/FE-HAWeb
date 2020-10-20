import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent,
  Button
} from '@material-ui/core';
import '../scss/TrainingType.scss';
import moment from 'moment';

import SnackBar from "../../../components/UI_Component/SnackBar/SnackBar";

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    width: '70%',
    margin: '20px auto',
    padding: '10px 20px'
  },
    root: {
      fontSize: '1rem',
    }
});

class TrainingType extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trainingtypeListVal: [],
      showTrainingModal: false,
      newTrainingType: '',
      showToast: false,
      toastMessage: '',
      snackBarOpen: false,
      snackmsg: '',
      snackvariant: '',
    }
    this.columnFields = [
      {
        title: "Training Type",
        field: "type",
        validate: rowData => rowData.type !== '',
      },
    ]
  }

  componentDidMount() {
    this.props.getTrainingTypeList().then((response) => {
      if (response && response.arrRes) {
        this.setState({
          trainingtypeListVal: response.arrRes,
          snackBarOpen: true,
          snackmsg: "Training Type Loaded Successfully",
          snackvariant: "success"
        })
      } else {
        this.setState({
          trainingtypeListVal: [],
          snackBarOpen: true,
          snackmsg: "Error in Loading Training Types",
          snackvariant: "error"
        })
      }
    });
  }



  handleModalClose = () => {
    this.setState({ showTrainingModal: false, newTrainingType: '' })
  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  handleModalSubmit = () => {
    const { newTrainingType } = this.state;
    const date = moment().format("YYYY-MM-DD");
    const reqObj = {
      training_type: newTrainingType,
      created_by: 1,
      updated_by: 1,
      created_date: date
    }
    this.props.addTrainingType(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const myObj = {
          id: response.TrainingTypeID,
          type: response.TrainingTypeName
        }
        const updatedItems = [...this.state.trainingtypeListVal, myObj];
        this.setState({
          showTrainingModal: false,
          newTrainingType: '',
          trainingtypeListVal: updatedItems,
          snackBarOpen: true,
          snackmsg: "Training Type Added Successfully",
          snackvariant: "success"
        })
      }
      else if (response && response.errCode === 404 && response.status === 'Training type exists!') {
        this.setState({
          showTrainingModal: false,
          newTrainingType: '',
          snackBarOpen: true,
          snackmsg: "Training Type Already Exists",
          snackvariant: "error"
        })
      }
      else {
        this.setState({
          showTrainingModal: false,
          newTrainingType: '',
          snackBarOpen: true,
          snackmsg: "Error in Adding Training Type",
          snackvariant: "error"
        })
      }
    });
  };

  editSubmit = (updatedTrainingtype, oldData) => {
    if (oldData.type !== updatedTrainingtype.type) {
      const reqObj = {
        id: updatedTrainingtype.id,
        training_type: updatedTrainingtype.type,
        updated_by: 1
      }
      this.props.editTrainingType(reqObj).then(response => {
        if (response && response.errCode === 200) {
          const data = [...this.state.trainingtypeListVal];
          data[data.indexOf(oldData)] = updatedTrainingtype;
          this.setState(prevState => ({
            ...prevState, trainingtypeListVal: data,
            snackBarOpen: true,
            snackmsg: "Training Type Edited Successfully",
            snackvariant: "success"
          }))
        }
        else if (response && response.errCode === 404 && response.status === 'Training type exists!') {
          this.setState({
            snackBarOpen: true,
            snackmsg: "Training Type Already Exists",
            snackvariant: "error"
          })
        }
        else {
          this.setState({
            snackBarOpen: true,
            snackmsg: "Error in Editing Training Type",
            snackvariant: "error"
          });
        }
      });
    }

  }

  handleDelete = (oldData) => {
    const reqObj = {
      id: oldData.id,
      updated_by: 1
    }
    this.props.deleteTrainingType(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const data = [...this.state.trainingtypeListVal];
        data.splice(data.indexOf(oldData), 1);
        this.setState({
          trainingtypeListVal: data,
          snackBarOpen: true,
          snackmsg: "Training Type Deleted Successfully",
          snackvariant: "success"
        });
      }
      else {
        this.setState({
          snackBarOpen: true,
          snackmsg: "Error In Deleting Training Type ",
          snackvariant: "error"
        });
      }
    });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  render() {
    const { trainingtypeListVal, showTrainingModal, newTrainingType, snackBarOpen, snackmsg, snackvariant } = this.state;
    const { classes } = this.props;
    return (
      <div className="TrainingType_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showTrainingModal}
          onClose={this.handleModalClose}
          aria-labelledby="training-type"
        >
          <DialogTitle id="training-type">Add Training Type</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Training Type:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Training Type"
                type="text"
                value={newTrainingType}
                onChange={(e) => this.setState({ newTrainingType: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={newTrainingType === '' || newTrainingType === null} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Training Type
        </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={trainingtypeListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: [],
              headerStyle: {
                backgroundColor: '#E0E0E0',
                whiteSpace: 'nowrap',
                whiteSpace: 'nowrap',
                lineHeight :'15px',
                fontSize: '16px',
                color:'#212529',
                zIndex: 0
              },
              rowStyle: {
                lineHeight :'15px',
                fontSize:'13px',
                whiteSpace: 'nowrap',
                fontSize: '14px'
              }
            }}
           actions={[
            {
              icon: 'add',
              tooltip: 'Add Training Type',
              isFreeAction: true,
              // disabled : true,
              onClick: (event) => this.setState({ showTrainingModal: true })
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
                this.handleDelete(oldData);
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


export default withStyles(styles, { withTheme: true })(TrainingType);