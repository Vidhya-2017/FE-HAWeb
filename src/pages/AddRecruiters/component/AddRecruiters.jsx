import React from 'react';
import { Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent, Button } from '@material-ui/core';
import MaterialTable from "material-table";
import '../scss/AddRecruiters.scss';



const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '70%',
    },
    margin: '20px auto',
    padding: '10px 20px'
  },
});


const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const recruiterForm = {
  name: { ...inputField },
  email: { ...inputField },
  phoneNumber: { ...inputField },
  sapid: { ...inputField }
}


class AddRecruiters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recruiterListVal: [],
      showAddRecruiterModal: false,
      showToast: false,
      toastMessage: '',
      formIsValid: false,
      formValues: { ...recruiterForm },
    }
    this.columnFields = [
      {
        title: "Name",
        field: "recruiter_name",
        validate: rowData => rowData.recruiter_name !== '',
      },
      {
        title: "SAP ID",
        field: "recruiter_sapid",
        validate: rowData => rowData.recruiter_sapid !== '',
      },
      {
        title: "Contact No.",
        field: "recruiter_contact_no",
        validate: rowData => rowData.recruiter_contact_no !== '',
      },
      {
        title: "Email",
        field: "recruiter_email",
        validate: rowData => rowData.recruiter_email !== '',
      },
    ]
  }


  componentDidMount() {
    this.props.getRecruiter().then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          recruiterListVal: response.arrRes,
          showToast: true,
          toastMessage: "Recruiter Data loaded successfully"
        })
      } else {
        this.setState({
          recruiterListVal: [],
          showToast: true,
          toastMessage: "Error in loading Recruiter Data"
        })
      }
    });
  }

  handleDelete = (oldData) => {
    const reqObj = {
      recruiter_id: oldData.recruiter_id
    }
    this.props.deleteRecruiter(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.recruiterListVal];
        data.splice(data.indexOf(oldData), 1);
        this.setState({
          recruiterListVal: data,
          showToast: true,
          toastMessage: "Recruiter Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in Recruiter Name deletion"
        });
      }
    });
  }

  editSubmit = (updatedScale, oldData) => {
    const reqObj = {
      recruiter_id: updatedScale.recruiter_id,
      recruiter_sapid: updatedScale.recruiter_sapid,
      recruiter_name: updatedScale.recruiter_name,
      recruiter_email: updatedScale.recruiter_email,
      recruiter_contact_no: updatedScale.recruiter_contact_no
    }
    this.props.editRecruiter(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.recruiterListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, recruiterListVal: data,
          showToast: true,
          toastMessage: "Recruiter name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " failed in updating Recruiter name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "error in updating the Recruiter name"
        });
      }
    });
  }

  handleModalClose = () => {
    this.setState({
      showAddRecruiterModal: false,
      formValues: { ...recruiterForm }
    })
  }

  handleModalSubmit = () => {
    const { formValues } = this.state;
    const reqObj = {
      recruiter_sapid: formValues.sapid.value,
      recruiter_name: formValues.name.value,
      recruiter_email: formValues.email.value,
      recruiter_contact_no: formValues.phoneNumber.value
    }
    this.props.addRecruiter(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          recruiter_sapid: formValues.sapid.value,
          recruiter_name: formValues.name.value,
          recruiter_email: formValues.email.value,
          recruiter_contact_no: formValues.phoneNumber.value,
          recruiter_id: response.arrRes
        }
        const updatedItems = [...this.state.recruiterListVal, myObj];
        this.setState({
          formValues: { ...recruiterForm },
          showAddRecruiterModal: false,
          recruiterListVal: updatedItems,
          showToast: true,
          toastMessage: "Recruiter name added successfully!"
        })
      }
      else {
        this.setState({
          showAddRecruiterModal: false,
          showToast: true,
          toastMessage: "error in adding Recruiter name!"
        })
      }
    });
  };

  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type ? e.target.type : '';
    const updatedRegForm = {
      ...this.state.formValues
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues: updatedRegForm, formIsValid });
  }

  checkValidity(inputValue, rules, inputType, inputName) {
    if (inputValue) {
      const value = inputValue.toString();
      let isValid = true;
      if (!rules) {
        return true;
      }
      if (rules.required) {
        isValid = value.trim() !== '' && isValid;
      }
      if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
      }
      if (inputType === "email") {
        const pattern = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
        isValid = pattern.test(value) && isValid
      }
      if (inputName === "sapid") {
        const pattern = RegExp(/^\d{7}|\d{8}$/);
        isValid = pattern.test(value) && isValid
      }
      if (inputName === "phoneNumber") {
        const pattern = RegExp(/^([+]\d{2})?\d{10}$/);
        isValid = pattern.test(value) && isValid
      }
      return isValid;
    }
  }

  render() {
    const { formIsValid, formValues, recruiterListVal, showAddRecruiterModal } = this.state;
    const { classes } = this.props;
    return (
      <div className="recruiter_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddRecruiterModal}
          onClose={this.handleModalClose}
          aria-labelledby="recruiter"
        >
          <DialogTitle id="recruiter">Add Recruiter</DialogTitle>
          <DialogContent >
            <div >
              <TextField name="name"
                required={true}
                value={formValues.name.value}
                autoFocus
                variant="outlined"
                margin="dense"
                className="w-100"
                label="Enter Name"
                type="text"
                inputProps={{ pattern: "[a-zA-Z]" }}
                onChange={this.inputFieldChange} />
              <TextField name="sapid"
                required={true}
                autoFocus
                variant="outlined"
                margin="dense"
                value={formValues.sapid.value}
                type="number"
                className="w-100"
                label="Enter Sap Id"
                onChange={this.inputFieldChange} />
              <TextField name="phoneNumber"
                autoFocus
                variant="outlined"
                margin="dense"
                value={formValues.phoneNumber.value}
                className="w-100"
                required={true}
                type="number"
                inputProps={{ max: 12 }}
                label="Enter Phone Number"
                onChange={this.inputFieldChange} />
              <TextField
                type="email"
                required={true} name="email"
                value={formValues.email.value}
                autoFocus
                variant="outlined"
                margin="dense"
                className="w-100"
                label="Enter Email Address"
                onChange={this.inputFieldChange} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={!formIsValid} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>Add Recruiter</Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={recruiterListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: []
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Recruiter',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddRecruiterModal: true })
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

export default withStyles(styles, { withTheme: true })(AddRecruiters);
