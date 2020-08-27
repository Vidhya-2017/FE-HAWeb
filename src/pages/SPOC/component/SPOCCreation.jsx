import React from 'react';
import { Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent, Button } from '@material-ui/core';
import MaterialTable from "material-table";
import '../scss/SPOCCreation.scss';



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


const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const spocForm = {
  name: { ...inputField },
  email: { ...inputField },
  phoneNumber: { ...inputField },
  sapid: { ...inputField }
}

class SPOCCreation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      spocListVal: [],
      formValues: { ...spocForm },
      showAddSpocModal: false,
      showToast: false,
      toastMessage: '',
      formIsValid: false
    }
    this.columnFields = [
      {
        title: "Name",
        field: "spoc_name",
        validate: rowData => rowData.spoc_name !== '',
      },
      {
        title: "SAP ID",
        field: "spoc_sapid",
        validate: rowData => rowData.spoc_sapid !== '',
      },
      {
        title: "Contact No.",
        field: "spoc_contact_no",
        validate: rowData => rowData.spoc_contact_no !== '',
      },
      {
        title: "Email",
        field: "spoc_email",
        validate: rowData => rowData.spoc_email !== '',
      },
    ]
  }



  componentDidMount() {
    this.props.getSPOC().then((response) => {
      console.log(response)
      if (response && response.arrRes) {
        this.setState({
          spocListVal: response.arrRes,
          showToast: true,
          toastMessage: "SPOC Data loaded successfully"
        })
      } else {
        this.setState({
          spocListVal: [],
          showToast: true,
          toastMessage: "Error in loading SPOC Data"
        })
      }
    });
  }

  handleDelete = (oldData) => {
    const reqObj = {
      spoc_id: oldData.spoc_id
    }
    this.props.deleteSPOC(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.spocListVal];
        data.splice(data.indexOf(oldData), 1);
        this.setState({
          spocListVal: data,
          showToast: true,
          toastMessage: "SPOC Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in SPOC Name deletion"
        });
      }
    });
  }

  editSubmit = (updatedScale, oldData) => {
    const reqObj = {
      spoc_id: updatedScale.spoc_id,
      spoc_sapid: updatedScale.spoc_sapid,
      spoc_name: updatedScale.spoc_name,
      spoc_email: updatedScale.spoc_email,
      spoc_contact_no: updatedScale.spoc_contact_no
    }
    this.props.editSPOC(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.spocListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, spocListVal: data,
          showToast: true,
          toastMessage: "SPOC name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " failed in updating SPOC name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "error in updating the SPOC name"
        });
      }
    });
  }

  handleModalClose = () => {
    this.setState({ showAddSpocModal: false, formValues: { ...spocForm } })
  }

  handleModalSubmit = () => {
    const { formValues } = this.state;
    const reqObj = {
      spoc_sapid: formValues.sapid.value,
      spoc_name: formValues.name.value,
      spoc_email: formValues.email.value,
      spoc_contact_no: formValues.phoneNumber.value
    }
    this.props.addSPOC(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          spoc_sapid: formValues.sapid.value,
          spoc_name: formValues.name.value,
          spoc_email: formValues.email.value,
          spoc_contact_no: formValues.phoneNumber.value,
          spoc_id: response.arrRes

        }
        const updatedItems = [...this.state.spocListVal, myObj];
        this.setState({
          formValues: { ...spocForm },
          showAddSpocModal: false,
          spocListVal: updatedItems,
          showToast: true,
          toastMessage: "SPOC name added successfully!"
        })
      }
      else {
        this.setState({
          showAddSpocModal: false,
          showToast: true,
          toastMessage: "error in adding SPOC name!"
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

  //Validation
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
    const { formIsValid, formValues, spocListVal, showAddSpocModal, showToast, toastMessage } = this.state;
    const { classes } = this.props;
    return (
      <div className="spoc_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddSpocModal}
          onClose={this.handleModalClose}
          aria-labelledby="SPOC"
        >
          <DialogTitle id="SPOC">Add SPOC</DialogTitle>
          <DialogContent >
            <div >
              <TextField
                name="name"
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

              <TextField
                name="sapid"
                required={true}
                variant="outlined"
                margin="dense"
                value={formValues.sapid.value}
                type="number"
                className="w-100"
                label="Enter Sap Id"
                onChange={this.inputFieldChange} />

              <TextField
                name="phoneNumber"
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
                required={true}
                value={formValues.email.value}
                variant="outlined"
                margin="dense"
                className="w-100"
                name="email"
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
          <Typography variant="h4" className="text-center" gutterBottom>
            Add SPOC
                        </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={spocListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: []
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add SPOC',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddSpocModal: true })
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
export default withStyles(styles, { withTheme: true })(SPOCCreation);
