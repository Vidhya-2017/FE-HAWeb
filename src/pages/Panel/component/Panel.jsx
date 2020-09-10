import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent,
  Button
} from '@material-ui/core';
import Select from 'react-select';

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

const SelectStyles = (width = 200, maxWidth = 215) => {
  const defaultStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      minWidth: 200,
      // maxWidth: maxWidth,
      minHeight: 40,
      borderColor: '#000',
      borderRadius: '5px',
      marginBottom: '4px',
      marginTop: '8px',
      marginRight: '0px',
      outline: 'transparent',
      border: 'solid 1px #ced4da',
      boxShadow: 'none',
      ':hover': {
        borderColor: '#00000050',
        boxShadow: '0 0 0 1px #000000',
      },
      ':active': {
        borderColor: '#00000050',
        boxShadow: '0 0 0 1px #000000',
      },
      ':focus': {
        borderColor: '#00000050',
        boxShadow: '0 0 0 1px #000000'
      }
    }),
    menu: styles => ({ ...styles, backgroundColor: '#fff', border: '1px solid #999' }),
    indicatorSeparator: styles => ({ ...styles, backgroundColor: 'none' }),
    option: (styles, { isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: '#fff',
        ':active': {
          backgroundColor: '#eee',
        },
        ':hover': {
          backgroundColor: '#dadada',
        },
        ':focus': {
          backgroundColor: '#eee',
        },
        color: isSelected ? '#000' : '#333'
      }
    }
  }
  return defaultStyle;
};

const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const panelForm = {
  name: { ...inputField },
  email: { ...inputField },
  contact: { ...inputField },
  sapid: { ...inputField }
}

class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formValues: { ...panelForm },
      panelListVal: [],
      showToast: false,
      toastMsg: '',
      skillList: [],
      showAddPanelModal: false,
      formIsValid: false,
      value: ''
    }
    this.columnFields = [
      {
        title: "Panel Name",
        field: "panel_name",
        validate: rowData => rowData.name !== ''
      },
      {
        title: "Contact Number",
        field: "contact",
        type: "numeric",
        validate: rowData => this.editValidate(rowData, "contact")
      },
      {
        title: "Sap Id",
        field: "sap_id",
        type: "numeric",
        validate: rowData => this.editValidate(rowData, "sapid")
      },
      {
        title: "Email id",
        field: "email_id",
        validate: rowData => this.editValidate(rowData, "email")
      },
      {
        title: "Skills",
        field: "skill_name",
        editComponent: props => {
          const defaultValue = this.state.skillList.filter(skill => props.rowData.skill_id.includes(skill.skillId))
          return (
            <Select
              placeholder="Skills"
              onChange={e => props.onChange(e)}
              options={this.state.skillList}
              styles={SelectStyles()}
              isMulti
              required
              defaultValue={defaultValue}
            />
          )
        },
        validate: rowData => this.editValidate(rowData, "skill")
      }
    ]
  }

  componentDidMount() {
    this.props.getPanel().then((response) => {
      if (response && response.arrRes) {
        this.setState({
          panelListVal: response.arrRes,
          showToast: true,
          toastMsg: "Panel Data loaded successfully"
        })
      } else {
        this.setState({
          panelListVal: [],
          showToast: true,
          toastMsg: "Error in loading Panel Data"
        })
      }
    });
    this.getSkills();
  }

  getSkills = () => {
    this.props.getSkills().then(response => {
      if (response && response.errCode === 200) {
        const skillList = response.arrRes.map(list => {
          return {
            value: list.skill_name,
            skillId: list.skill_id,
            label: list.skill_name
          }
        });
        this.setState({ skillList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }

  handleDelete = (id) => {
    const filteredItems = this.state.panelListVal.filter((item) => item.panel_id !== id);
    const reqObj = {
      panel_id: id,
    }
    this.props.deletePanel(reqObj).then(response => {
      if (response && response.errCode === 201) {
        this.setState({
          name: '',
          panelListVal: filteredItems,
          deleteModal: false,
          showToast: true,
          toastMsg: "Panel deleted successfully",
        });
      }
      else {
        this.setState({
          name: '',
          deleteModal: false,
          showToast: true,
          toastMsg: "Error in Panel deletion"
        });
      }
    });
  }

  editSubmit = (newData, oldData) => {
    var skillIds = [];
    var skillName = []
    if (newData.skill_name === oldData.skill_name) {
      var arrlist = this.state.skillList.filter(skill => newData.skill_name.includes(skill.label))
      skillIds = arrlist.map(item => item.skillId);
      skillName = arrlist.map(skill => skill.label);
    }
    else {
      skillIds = newData.skill_name.map(skill => skill.skillId)
      skillName = newData.skill_name.map(skill => skill.label);
    }
    const reqObj = {
      panel_id: newData.panel_id,
      panel_name: newData.panel_name,
      email_id: newData.email_id,
      sap_id: newData.sap_id,
      skill_id: skillIds.toString(),
      contact: newData.contact,
    }
    this.props.editPanel(reqObj).then(response => {
      if (response && response.errCode === 201) {
        this.setState(prevState => ({
          panelListVal: prevState.panelListVal.map(
            el => el.panel_id === newData.panel_id ? {
              ...el,
              panel_name: newData.panel_name,
              email_id: newData.email_id,
              sap_id: newData.sap_id,
              skill_id: skillIds,
              skill_name: skillName.toString(),
              contact: newData.contact,
            } : el
          )
        }))
        this.setState({
          name: '',
          showToast: true,
          toastMsg: "Panel Details updated successfully",
        });
      }
      else if (response && response.errCode === 404) {
        this.setState({
          name: '',
          showToast: true,
          toastMsg: " Failed in updating Panel Details "
        });
      }
      else {
        this.setState({
          name: '',
          showToast: true,
          toastMsg: "Error in updating the Panel Details"
        });
      }
    });
  }

  handleModalSubmit = () => {
    const { formValues } = this.state;
    const skillIds = this.state.skills.map(skill => skill.skillId);
    const reqObj = {
      panel_name: formValues.name.value,
      sap_id: formValues.sapid.value,
      contact: formValues.contact.value,
      skill_id: skillIds.toString(),
      email_id: formValues.email.value,
    }
    const skillNames = this.state.skills.map(item => item.label);
    this.props.addPanel(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          panel_id: response.arrRes,
          panel_name: formValues.name.value,
          sap_id: formValues.sapid.value,
          contact: formValues.contact.value,
          email_id: formValues.email.value,
          skill_name: skillNames.toString(),
          skill_id: skillIds
        }
        const updatedItems = [...this.state.panelListVal, myObj];
        this.setState({
          add: false,
          formValues: { ...panelForm },
          skills: '',
          showAddPanelModal: false,
          panelListVal: updatedItems,
          showToast: true,
          toastMsg: "Panel added successfully!"
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          name: '',
          add: false,
          showAddPanelModal: false,
          showToast: true,
          toastMsg: " Panel Already exists!"
        })
      }
      else {
        this.setState({
          name: '',
          add: false,
          showAddPanelModal: false,
          showToast: true,
          toastMsg: "Error in adding Panel!"
        })
      }
    });
  };

  handleModalClose = () => {
    this.setState({ showAddPanelModal: false, formValues: { ...panelForm }, skills: '' })
  }


  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type ? e.target.type : '';
    const updatedPanelForm = {
      ...this.state.formValues
    };
    const updatedFormElement = {
      ...updatedPanelForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
    updatedPanelForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedPanelForm) {
      formIsValid = updatedPanelForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues: updatedPanelForm, formIsValid });
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
      if (inputName === "contact") {
        const pattern = RegExp(/^([+]\d{2})?\d{10}$/);
        isValid = pattern.test(value) && isValid
      }
      return isValid;
    }
  }
  editValidate(data, action) {
    switch (action) {
      case "contact":
        const phonePattern = RegExp(/^([+]\d{2})?\d{10}$/);
        if (phonePattern.test(data.contact)) {
          return true;
        }
        else
          return false;
      case "sapid":
        const sapidPattern = RegExp(/^\d{7}|\d{8}$/);
        if (sapidPattern.test(data.sap_id)) {
          return true;
        }
        else
          return false;
      case "email":
        const emailPattern = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
        if (emailPattern.test(data.email_id)) {
          return true;
        }
        else
          return false;
      case "skill":
        if (data.skill_name !== null) {
          return true;
        }
        else
          return false;
      default:
        return false;
    }
  }
  render() {
    const { classes } = this.props;
    const { formIsValid, skillList, formValues } = this.state;
    return (
      <div className="PanelList_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={this.state.showAddPanelModal}
          onClose={this.handleModalClose}
          aria-labelledby="Panel-Name"
        >
          <DialogTitle id="Panel-Name">Add Panel Details</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex', flexDirection: "column" }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Panel Name:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Panel Name"
                type="text"
                name="name"
                value={formValues.name.value}
                onChange={this.inputFieldChange}
              />
              <Typography style={{ padding: '15px 15px 10px 0' }}>Sap Id:</Typography>
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="Sap Id"
                type="number"
                name="sapid"
                value={formValues.sapid.value}
                onChange={this.inputFieldChange}
              />
              <Typography style={{ padding: '15px 15px 10px 0' }}>Email Id:</Typography>
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="Email Id"
                type="email"
                name="email"
                value={formValues.email.value}
                onChange={this.inputFieldChange}
              />
              <Typography style={{ padding: '15px 15px 10px 0' }}>Select Skills:</Typography>

              <Select
                placeholder="Skills"
                id="skills"
                name="skills"
                options={skillList}
                value={this.state.skills}
                onChange={(val) => this.setState({ skills: val })}
                isMulti
                required
                styles={SelectStyles()}
                closeMenuOnSelect={false}
              />

              <Typography style={{ padding: '15px 15px 10px 0' }}>Contact Number:</Typography>
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="Contact Number"
                type="number"
                name="contact"
                value={formValues.contact.value}
                onChange={this.inputFieldChange}
              />
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
            Panel List
            </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={this.state.panelListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: []
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Panel Data',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddPanelModal: true })
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
                  this.handleDelete(oldData.panel_id);
                })
            }}
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Panel);
