import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, InputLabel, Grid, Typography, Dialog, DialogTitle, TextField, DialogContent, Button
} from '@material-ui/core';
import Select from 'react-select';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    width: '95%',
    margin: '20px auto',
    padding: '10px 20px'
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SelectStyles = (width = 200, maxWidth = 215) => {
  const defaultStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      minWidth: 200,
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
    menu: styles => ({ ...styles, backgroundColor: '#fff', border: '1px solid #999', zIndex: 10 }),
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
  sapid: { ...inputField },
  duration: { ...inputField },
  recurrencePattern: { ...inputField },
  recurrenceDays: { ...inputField },
  skills: { ...inputField },
  panelCat: { ...inputField },
  startTime: { ...inputField },
  endTime: { ...inputField },
  untilDate: { ...inputField },
}

const panelCategoryOptions = [
  { value: 'coe', label: 'COE' },
  { value: 'day0', label: 'Day 0' },
  { value: 'cnc', label: 'CNC' },
  { value: 'delivery', label: 'Delivery' },
]
const daysOptions = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' }
]
const recurrencePatternOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]
const durationOptions = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
]
class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formValues: { ...panelForm },
      panelListVal: [],
      showToast: false,
      toastMsg: '',
      skills: [],
      skillList: [],
      showAddPanelModal: false,
      formIsValid: false,
      value: '',
      recurrenceDays: [],
      startTime: '',
      endTime: '',
      duration: '',
      recurrencePattern: '',
      untilDate: '',
      panel: '',
      startTimeVal: '2020-09-10T10:00:00',
      endTimeVal: '2020-09-10T10:00:00',
      untilDateVal: '2020-09-10T10:00:00',
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
        title: "Sap ID",
        field: "sap_id",
        type: "numeric",
        validate: rowData => this.editValidate(rowData, "sapid")
      },
      {
        title: "Email ID",
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
      },
      {
        title: "Panel Category",
        field: "panel_category",
        editComponent: props => {
          const defaultValueSelect = (props.rowData.panel_category.value) ? props.rowData.panel_category.value : props.rowData.panel_category;
          const defaultValuePanelCat = panelCategoryOptions.filter(panel => defaultValueSelect.includes(panel.value))
          return (
            <Select
              placeholder="Panel Category"
              onChange={e => props.onChange(e)}
              options={panelCategoryOptions}
              styles={SelectStyles()}
              required
              defaultValue={defaultValuePanelCat}
            />
          )
        },
      },
      {
        title: "Start Time",
        field: "start_time",
      },
      {
        title: "End Time",
        field: "end_time",
      },
      {
        title: "Duration(min)",
        field: "duration",
      },
      {
        title: "Until Date",
        field: "until_date",
      },
      {
        title: "Recurrence Days",
        field: "recurrence_days",
      },
      {
        title: "Recurrence Pattern",
        field: "recurrence_pattern",
      },
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
      start_time: newData.start_time,
      end_time: newData.end_time,
      duration: newData.duration,
      until_date: newData.until_date,
      recurrence_pattern: newData.recurrence_pattern,
      recurrence_days: newData.recurrence_days,
      panel_category: (newData.panel_category.value) ? newData.panel_category.value : newData.panel_category,

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
    const { formValues, startTime, endTime, duration, recurrencePattern, panelCat, untilDate, recurrenceDays } = this.state;
    const skillIds = this.state.skills.map(skill => skill.skillId);
    const recurrenceDaysArr = recurrenceDays.map(item => item.value)
    const reqObj = {
      panel_name: formValues.name.value,
      sap_id: formValues.sapid.value,
      contact: formValues.contact.value,
      skill_id: skillIds.toString(),
      email_id: formValues.email.value,
      panel_category: panelCat.value,
      start_time: startTime,
      end_time: endTime,
      duration: duration.value,
      recurrence_pattern: recurrencePattern.value,
      recurrence_week: recurrenceDaysArr.toString(),
      until_date: untilDate,
      created_by: "1"
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
          formValues: { ...panelForm },
          showAddPanelModal: false,
          showToast: true,
          toastMsg: " Panel Already exists!"
        })
      }
      else {
        this.setState({
          formValues: { ...panelForm },
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
      if (inputType === "select-one") {
        isValid = inputValue !== '' && isValid
      }
      if (inputType === "select-one-multi") {
        isValid = inputValue !== '' && isValid
      }
      if (inputType === "date") {
        isValid = inputValue !== '' && isValid
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

  handleStartTimeChange = (e) => {
    this.setState({ startTimeVal: e });
    var startTime = e.toString().slice(16, 21);
    var H = +startTime.substr(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    startTime = h + startTime.substr(2, 3) + ampm;
    this.setState({ startTime: startTime });
    this.inputFieldChange({ target: { value: e, name: "startTime", validation: { required: true }, type: "date" } });
  }
  handleEndTimeChange = (e) => {
    this.setState({ endTimeVal: e });
    var endTime = e.toString().slice(16, 21);
    var H = +endTime.substr(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "AM" : "PM";
    endTime = h + endTime.substr(2, 3) + ampm;
    this.setState({ endTime: endTime });
    this.inputFieldChange({ target: { value: e, name: "endTime", validation: { required: true }, type: "date" } });
  }
  handleDateChange = (e) => {
    this.setState({ untilDateVal: e });
    var month = e.toString().slice(4, 7);
    var date = e.toString().slice(8, 10);
    var year = e.toString().slice(11, 15);
    let month1 = month.toLowerCase();
    var months = [0, "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    month1 = months.indexOf(month1);
    if (month1 <= 9) {
      month1 = `0${month1}`
    }
    const untilDate = `${year}-${month1}-${date}`
    this.setState({ untilDate: untilDate });
    this.inputFieldChange({ target: { value: e, name: "untilDate", validation: { required: true }, type: "date" } });
  }
  handleRecurrenceDaysChange = (e) => {
    this.inputFieldChange({ target: { value: e, name: "recurrenceDays", validation: { required: true }, type: "select-one-multi" } });
    this.setState({
      recurrenceDays: e
    })
  }
  handleRecurrencePatternChange = (e) => {
    this.inputFieldChange({ target: { value: e.value, name: "recurrencePattern", validation: { required: true }, type: "select-one" } });
    this.setState({
      recurrencePattern: e
    })
  }
  handleDurationChange = (e) => {
    this.inputFieldChange({ target: { value: e.value, name: "duration", validation: { required: true }, type: "select-one" } });
    this.setState({
      duration: e
    })
  }
  handleSkillsChange = (e) => {
    this.inputFieldChange({ target: { value: e, name: "skills", validation: { required: true }, type: "select-one-multi" } });
    this.setState({
      skills: e
    })
  }
  handlePanelChange = (e) => {
    this.inputFieldChange({ target: { value: e.value, name: "panelCat", validation: { required: true }, type: "select-one" } });
    this.setState({
      panelCat: e
    })
  }
  render() {
    const { classes } = this.props;
    const { formIsValid, skillList, formValues } = this.state;
    return (
      <div className="PanelList_container" id="panelDiv">
        <Dialog fullScreen open={this.state.showAddPanelModal} onClose={this.handleModalClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleModalClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1 }} >
                Add Panel Details
            </Typography>
              <Button autoFocus style={(!formIsValid) ? { backgroundColor: "#ECECEC", color: "#000000" } : { backgroundColor: "blue", color: "#ffffff" }} disabled={!formIsValid} variant="outlined" onClick={this.handleModalSubmit}  >
                Submit
            </Button>
            </Toolbar>
          </AppBar>
          <DialogTitle id="Panel-Name">Add Panel Details</DialogTitle>
          <DialogContent >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="panelCategory">Panel Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Panel Name"
                  variant="outlined"
                  margin="dense"
                  type="text"
                  name="name"
                  value={formValues.name.value}
                  onChange={this.inputFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="sapid">Sap ID</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Sap ID"
                  variant="outlined"
                  margin="dense"
                  type="number"
                  name="sapid"
                  value={formValues.sapid.value}
                  onChange={this.inputFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="email">Email ID</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Email ID"
                  variant="outlined"
                  margin="dense"
                  type="email"
                  name="email"
                  value={formValues.email.value}
                  onChange={this.inputFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="contact">Contact Number</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Phone Number"
                  inputProps={{ max: 12 }}
                  variant="outlined"
                  margin="dense"
                  type="number"
                  name="contact"
                  value={formValues.contact.value}
                  onChange={this.inputFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="panelCategory">Panel Category</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <Select
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Panel Category"
                  id="panelCategory"
                  name="panelCat"
                  styles={SelectStyles()}
                  options={panelCategoryOptions}
                  value={this.state.panelCat}
                  onChange={this.handlePanelChange}
                />
              </Grid>
              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="selectSkills">Select Skills</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <Select
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Select Skills"
                  id="skills"
                  name="skills"
                  options={skillList}
                  value={this.state.skills}
                  onChange={this.handleSkillsChange}
                  isMulti
                  styles={SelectStyles()}
                  closeMenuOnSelect={false}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <br />
                <InputLabel htmlFor="startTime">Start Time</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    margin="normal"
                    id="startTime"
                    label="Start Time"
                    inputVariant="outlined"
                    style={{
                      width: "102%",
                    }}
                    value={this.state.startTimeVal}
                    onChange={this.handleStartTimeChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="selectSkills">Recurrence Days</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Select
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Recurrence Days"
                  id="recurrenceDays"
                  name="recurrenceDays"
                  options={daysOptions}
                  value={this.state.recurrenceDays}
                  onChange={this.handleRecurrenceDaysChange}
                  isMulti
                  styles={SelectStyles()}
                  closeMenuOnSelect={false}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <br />
                <InputLabel htmlFor="endTime">End Time</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    margin="normal"
                    id="endTime"
                    label="End Time"
                    inputVariant="outlined"
                    style={{
                      width: "102%",
                    }}
                    value={this.state.endTimeVal}
                    onChange={this.handleEndTimeChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>


              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="reccurence">Recurrence Pattern</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <Select
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Recurrence Pattern"
                  id="recurrencePattern"
                  name="recurrencePattern"
                  options={recurrencePatternOptions}
                  value={this.state.recurrencePattern}
                  onChange={this.handleRecurrencePatternChange}
                />
              </Grid>

              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="until">Until</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3}>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="untilDate"
                    label="Until Date"
                    format="MM/dd/yyyy"
                    inputVariant="outlined"
                    style={{
                      width: "102%",
                    }}
                    value={this.state.untilDateVal}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} sm={3} >
                <br />
                <InputLabel htmlFor="duration">Duration</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <Select
                  autoFocus
                  className="w-100"
                  required={true}
                  label="Duration"
                  id="duration"
                  name="duration"
                  options={durationOptions}
                  value={this.state.duration}
                  onChange={this.handleDurationChange}
                />
              </Grid>

            </Grid>
          </DialogContent>
        </Dialog>

        <Paper className={classes.paperRoot} elevation={3} id="panelPaper">
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
