import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent,
  Button,
} from '@material-ui/core';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    width: '70%',
    margin: '20px auto',
    padding: '10px 20px'
  },
});

class DurationMaster extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      durationMaster: '',
      newDurationMaster: '',
      errors: {},
      durationMasterListVal: [],
      showAddDurationMasterModal: false,
      snackvariant: '',
      snackBarOpen: false,
      snackmsg: ''
    }
    this.columnFields = [
      {
        title: "Duration Master",
        field: "duration",
        validate: rowData => rowData.duration !== '',
      },
    ]
  }

  componentDidMount() {
    this.props.getDurationMasterList().then((response) => {

      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        this.setState({
          durationMasterListVal: response.arrRes,
          snackBarOpen: true,
          snackvariant: 'success',
          snackmsg: "Duration Master Data loaded successfully"
        })
      } else {
        this.setState({
          durationMasterListVal: [],
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "Error in loading Duration Master Data"
        })
      }
    });
  }

  handleDelete = (id) => {

    const filteredItems = this.state.durationMasterListVal.filter((item) => item.id !== id);
    const reqObj = {
      id: id,
      updated_by: 1
    }
    this.props.deleteDurationMasterList(reqObj).then(response => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        this.setState({
          durationMasterListVal: filteredItems,
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Duration Master deleted successfully",
        });
      }
      else {
        this.setState({
          durationMaster: '', deleteModal: false,
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "Error in Duration Master deletion"
        });
      }
    });
  }

  editSubmit = (newData, oldData) => {
    const reqObj = {
      id: newData.id,
      duration: newData.duration,
      updated_by: "1"
    }
    this.props.editDurationMasterList(reqObj).then(response => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        this.setState(prevState => ({
          durationMasterListVal: prevState.durationMasterListVal.map(
            el => el.id === newData.id ? { ...el, duration: newData.duration } : el
          )
        }))
        this.setState({
          durationMaster: '',
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Duration Master updated successfully",
        });
      }
      else if (response && response.errCode === 404) {
        this.setState({
          durationMaster: '',
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: " failed in updating Duration Master "
        });
      }
      else {
        this.setState({
          durationMaster: '',
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "error in updating Duration Master"
        });
      }
    });
  }

  handleModalClose = () => {
    this.setState({ showAddDurationMasterModal: false, newDurationMaster: '' })
  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  handleModalSubmit = () => {
    const { newDurationMaster } = this.state;
    const reqObj = {
      duration: newDurationMaster,
      created_by: 1,
      updated_by: 1,
    }
    this.props.addDurationMasterList(reqObj).then(response => {
      if (response === undefined) {
        this.setState({
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Server is disconnected"
        })
      }
      else if (response && response.errCode === 200) {
        const myObj = {
          id: response.duration_id,
          duration: newDurationMaster
        }
        const updatedItems = [...this.state.durationMasterListVal, myObj];
        this.setState({
          newDurationMaster: '',
          snackvariant: 'success',
          showAddDurationMasterModal: false,
          durationMasterListVal: updatedItems,
          snackBarOpen: true,
          snackmsg: "Duration Master added successfully!"
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          newDurationMaster: '',
          add: false,
          showAddDurationMasterModal: false,
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: " Duration Master Already exists!"
        })
      }
      else {
        this.setState({
          newDurationMaster: '',
          add: false,
          showAddDurationMasterModal: false,
          snackBarOpen: true,
          snackvariant: 'error',
          snackmsg: "Error in adding Duration Master!"
        })
      }
    });
  };

  render() {
    const { durationMasterListVal, showAddDurationMasterModal, newDurationMaster, snackvariant, snackBarOpen, snackmsg } = this.state;
    const { classes } = this.props;
    return (
      <div className="DurationMaster_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddDurationMasterModal}
          onClose={this.handleModalClose}
          aria-labelledby="Duration-Master"
        >
          <DialogTitle id="Duration-Master">Add Duration Master</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Duration Master:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Duration Master"
                type="text"
                value={newDurationMaster}
                onChange={(e) => this.setState({ newDurationMaster: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={newDurationMaster === '' || newDurationMaster === null} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Duration Master
        </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={durationMasterListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: []
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Duration Master',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddDurationMasterModal: true })
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


export default withStyles(styles, { withTheme: true })(DurationMaster);