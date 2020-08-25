import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent, Button
} from '@material-ui/core';
import '../scss/PreviousEmployer.scss';

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
class PreviousEmployer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      employerListVal: [],
      showAddEmployerModal: false,
      newEmployerScale: '',
      showToast: false,
      toastMessage: ''
    }
    this.columnFields = [
      {
        title: "Name",
        field: "company_name",
        validate: rowData => rowData.company_name !== '',
      },
    ]
  }

  componentDidMount() {
    this.props.getPreviousEmployer().then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          employerListVal: response.arrRes,
          showToast: true,
          toastMessage: "Employer Data loaded successfully"
        })
      } else {
        this.setState({
          employerListVal: [],
          showToast: true,
          toastMessage: "Error in loading Employer Data"
        })
      }
    });
  }

  handleDelete = (oldData) => {
    const reqObj = {
      id: oldData.company_id
    }
    this.props.deletePreviousEmployer(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const data = [...this.state.employerListVal];
        data.splice(data.indexOf(oldData), 1);
        this.setState({
          employerListVal: data,
          showToast: true,
          toastMessage: "Employer name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in Employer Name deletion"
        });
      }
    });
  }

  editSubmit = (updatedScale, oldData) => {
    const reqObj = {
      id: updatedScale.company_id,
      company_name: updatedScale.company_name,
    }
    this.props.editPreviousEmployer(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const data = [...this.state.employerListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, employerListVal: data, colsemployerType: '',
          showToast: true,
          toastMessage: "Employer name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " failed in updating Employer name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "error in updating the Employer name"
        });
      }
    });
  }

  handleModalClose = () => {
    this.setState({ showAddEmployerModal: false, newEmployerScale: '' })
  }

  handleModalSubmit = () => {
    const { newEmployerScale } = this.state;
    const reqObj = {
      company_name: newEmployerScale
    }
    this.props.addPreviousEmployer(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const myObj = {
          company_name: response.company
        }
        const updatedItems = [...this.state.employerListVal, myObj];
        this.setState({
          newEmployerScale: '',
          showAddEmployerModal: false,
          employerListVal: updatedItems,
          showToast: true,
          toastMessage: "Employer name added successfully!"
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          newEmployerScale: '',
          showAddEmployerModal: false,
          showToast: true,
          toastMessage: "Already Employer  name exists!"
        })
      }
      else {
        this.setState({
          newEmployerScale: '',
          showAddEmployerModal: false,
          showToast: true,
          toastMessage: "error in adding employer name!"
        })
      }
    });
  };

  render() {
    const { employerListVal, showAddEmployerModal, newEmployerScale } = this.state;
    const { classes } = this.props;
    return (
      <div className="Employer_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddEmployerModal}
          onClose={this.handleModalClose}
          aria-labelledby="employer"
        >
          <DialogTitle id="employer">Add Previous Company</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Company Name:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Employer Name"
                type="text"
                value={newEmployerScale}
                onChange={(e) => this.setState({ newEmployerScale: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={newEmployerScale === '' || newEmployerScale === null} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Company List
        </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={employerListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: []
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Employer',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddEmployerModal: true })
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
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PreviousEmployer);