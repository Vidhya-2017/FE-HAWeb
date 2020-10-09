import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Hidden, InputLabel, Grid, Typography, Dialog, DialogTitle, TextField, DialogContent, Button
} from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from 'react-select';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import * as moment from 'moment';

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  dateTimePicker: {
    height: 40,
    width: '100%'
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
    menu: styles => ({ ...styles, backgroundColor: '#fff', border: '1px solid #999', zIndex: 1000 }),
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
  skills: { ...inputField },
  panelCat: { ...inputField },
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
  { value: 'once', label: 'once' },
  { value: 'weekly', label: 'Weekly' },
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
      panelEditMode: false,
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
      appointmentid: 1,
      startTimeVal: moment(),
      endTimeVal: moment(),
      untilDateVal: moment().format('YYYY-MM-DD'),
      startendtimeerror: false,
      showappointments: false,
      appointmentDetails: [],
      isUpdate: false,
      lastEditablevalue: [],
      appointmentValidations: [],
      panelid: '',
      panel_calendar_id: ''
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
        }
      },
    ]

    this.ColumnValue = [
      {
        title: "Start Time",
        field: "startTime",
      },
      {
        title: "End Time",
        field: "endTime",
      },
      {
        title: "Duration",
        field: "duration",
      },
      {
        title: "Recurrence Days",
        field: "recurrenceDaysValue",
      },
      {
        title: "Recurrence Pattern",
        field: "recurrencePatternValue",
      },
      {
        title: "Untill Date",
        field: "untillDateValue",
      }
    ]
  }

  componentDidMount() {
    this.props.getPanel().then((response) => {
      if (response && response.errCode === 200) {
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
    let skillIds = [];
    let skillName = []
    if (newData.skill_name === oldData.skill_name) {
      let arrlist = this.state.skillList.filter(skill => newData.skill_name.includes(skill.label))
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

  handleModalEdit = () => {
    const { formValues, panelCat, appointmentDetails, panelid, skills } = this.state;
    const skillIds = skills.map(skill => skill.skillId);
    const reqObj = {
      panel_name: formValues.name.value,
      sap_id: formValues.sapid.value,
      contact: formValues.contact.value,
      skill_id: skillIds.toString(),
      email_id: formValues.email.value,
      panel_category: panelCat.value,
      appointmentDetails: appointmentDetails,
      panel_id: panelid,
      updated_by: "1",
      created_by: "1"
    }
    this.props.editPanel(reqObj).then(response => {
      Object.entries(panelForm).map(([key, value]) => {
        value.value = "";
        value.valid = false;
        return 0;
      });
      if (response && response.errCode === 201) {
        const panleresult = response.panel_res;
        this.setState(prevState => ({
          panelListVal: prevState.panelListVal.map(
            el => el.panel_id === panleresult.panel_id ? {
              ...el,
              panel_name: panleresult.panel_name,
              email_id: panleresult.email_id,
              sap_id: panleresult.sap_id,
              skill_id: panleresult.skill_id,
              skill_name: panleresult.skill_name,
              contact: panleresult.contact,
              skill_value: panleresult.skill_value,
              updated_by: panleresult.updated_by,
              is_active: panleresult.is_active,
              created_date: panleresult.created_date,
              panel_category: panleresult.panel_category,
              appointment_detil: panleresult.appointment_detil
            } : el
          )
        }));

        this.setState({
          formValues: { ...panelForm },
          skills: '',
          showAddPanelModal: false,
          showToast: true,
          toastMsg: "Panel Updated successfully!",
          showappointments: false,
          formIsValid: false,
          appointmentDetails: [],
          panelCat: '',
          startTime: '',
          startTimeVal: moment(),
          endTime: '',
          endTimeVal: moment(),
          duration: '',
          untilDateVal: moment().format('YYYY-MM-DD'),
          recurrenceDays: '',
          recurrencePattern: '',
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          formValues: { ...panelForm },
          showAddPanelModal: false,
          showToast: true,
          toastMsg: " Panel Already exists!",
          showappointments: false,
          formIsValid: false,
          appointmentDetails: [],
          panelCat: '',
          startTime: '',
          startTimeVal: moment(),
          endTime: '',
          endTimeVal: moment(),
          duration: '',
          untilDateVal: moment().format('YYYY-MM-DD'),
          recurrenceDays: '',
          recurrencePattern: '',
        })
      }
      else {
        this.setState({
          formValues: { ...panelForm },
          showAddPanelModal: false,
          showToast: true,
          toastMsg: "Error in adding Panel!",
          showappointments: false,
          formIsValid: false,
          appointmentDetails: [],
          panelCat: '',
          startTime: '',
          startTimeVal: moment(),
          endTime: '',
          endTimeVal: moment(),
          duration: '',
          untilDateVal: moment().format('YYYY-MM-DD'),
          recurrenceDays: '',
          recurrencePattern: '',
        })
      }
    });
  }

  handleModalSubmit = () => {
    const { formValues, panelCat, appointmentDetails, panelListVal, skills } = this.state;
    const skillIds = skills.map(skill => skill.skillId);
    const reqObj = {
      panel_name: formValues.name.value,
      sap_id: formValues.sapid.value,
      contact: formValues.contact.value,
      skill_id: skillIds.toString(),
      email_id: formValues.email.value,
      panel_category: panelCat.value,
      appointmentDetails: appointmentDetails,
      created_by: "1"
    }
    skills.map(item => item.label);
    this.props.addPanel(reqObj).then(response => {
      Object.entries(panelForm).map(([key, value]) => {
        value.value = "";
        value.valid = false;
        return 0;
      });
      if (response && response.errCode === 201) {
        const panleresult = response.panel_res;

        this.setState({
          formValues: { ...panelForm },
          skills: '',
          showAddPanelModal: false,
          panelListVal: [...panelListVal, panleresult],
          showToast: true,
          toastMsg: "Panel added successfully!",
          showappointments: false,
          formIsValid: false,
          appointmentDetails: [],
          panelCat: '',
          startTime: '',
          startTimeVal: moment(),
          endTime: '',
          endTimeVal: moment(),
          duration: '',
          untilDateVal: moment().format('YYYY-MM-DD'),
          recurrenceDays: '',
          recurrencePattern: '',
        });
      }
      else if (response && response.errCode === 404) {
        this.setState({
          formValues: { ...panelForm },
          showAddPanelModal: false,
          showToast: true,
          toastMsg: " Panel Already exists!",
          showappointments: false,
          formIsValid: false,
          appointmentDetails: [],
          panelCat: '',
          startTime: '',
          startTimeVal: moment(),
          endTime: '',
          endTimeVal: moment(),
          duration: '',
          untilDateVal: moment().format('YYYY-MM-DD'),
          recurrenceDays: '',
          recurrencePattern: '',
        })
      }
      else {
        this.setState({
          formValues: { ...panelForm },
          showAddPanelModal: false,
          showToast: true,
          toastMsg: "Error in adding Panel!",
          showappointments: false,
          formIsValid: false,
          appointmentDetails: [],
          panelCat: '',
          startTime: '',
          startTimeVal: moment(),
          endTime: '',
          endTimeVal: moment(),
          duration: '',
          untilDateVal: moment().format('YYYY-MM-DD'),
          recurrenceDays: '',
          recurrencePattern: '',
        });
      }
    });
  };

  handleModalClose = () => {
    this.setState({
      showAddPanelModal: false, formValues: { ...panelForm }, skills: '', showappointments: false,
      formIsValid: false,
      panelEditMode: false,
      appointmentDetails: [],
      panelCat: '',
      startTime: '',
      startTimeVal: moment(),
      endTime: '',
      endTimeVal: moment(),
      duration: '',
      untilDateVal: moment().format('YYYY-MM-DD'),
      recurrenceDays: '',
      recurrencePattern: '',
    });
    Object.entries(panelForm).map(([key, value]) => {
      value.value = "";
      value.valid = false;
      return 0;
    });
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
    const appointmentdetails = this.state.appointmentDetails;
    if (formIsValid && (appointmentdetails.length || targetName === 'appointMent') > 0) {
      formIsValid = true;
    } else {
      formIsValid = false;
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
    let startTime = e.toString().slice(16, 21);
    let H = +startTime.substr(0, 2);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    startTime = h + startTime.substr(2, 3) + ampm;
    this.setState({ startTimeVal: e, startTime: startTime });
    this.inputFieldChange({ target: { value: e, name: "startTime", validation: { required: true }, type: "date" } });
    this.handleStartEndTimeChanges('start', e);
  }

  handleEndTimeChange = (e) => {
    let endTime = e.toString().slice(16, 21);
    let H = +endTime.substr(0, 2);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    endTime = h + endTime.substr(2, 3) + ampm;
    this.setState({ endTimeVal: e, endTime: endTime });
    this.inputFieldChange({ target: { value: e, name: "endTime", validation: { required: true }, type: "date" } });
    this.handleStartEndTimeChanges('end', e);
  }

  handleStartEndTimeChanges = (type, value) => {
    let StartTimeVale;
    let EndTimeVale;
    if (type === 'start') {
      StartTimeVale = value;
      EndTimeVale = this.state.endTimeVal
      let endTime = EndTimeVale.toString().slice(16, 21);
      let H = +endTime.substr(0, 2);
      let h = H % 12 || 12;
      let ampm = (H < 12 || H === 24) ? "AM" : "PM";
      endTime = h + endTime.substr(2, 3) + ampm;
      this.setState({ endTime: endTime });
    } else if (type === 'end') {
      StartTimeVale = this.state.startTimeVal;
      EndTimeVale = value;
      let starttime = StartTimeVale.toString().slice(16, 21);
      let H = +starttime.substr(0, 2);
      let h = H % 12 || 12;
      let ampm = (H < 12 || H === 24) ? "AM" : "PM";
      starttime = h + starttime.substr(2, 3) + ampm;
      this.setState({ startTime: starttime });
    }
    // get total seconds between the times
    let diff = EndTimeVale.valueOf() - StartTimeVale.valueOf();
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60);
    if ((hours >= 0 && minutes >= 0)) {
      if (hours === 0 && minutes === 0) {
        this.setState({ startendtimeerror: true, duration: '' });
      } else {
        if (hours.toString().length === 1) {
          hours = "0" + hours;
        }
        if (minutes.toString().length === 1) {
          minutes = "0" + minutes;
        }
        this.setState({ startendtimeerror: false, duration: hours + ':' + minutes, appointmentValidations: { durationvalidation: false } });
      }
    } else {
      this.setState({ startendtimeerror: true, duration: '' });
    }
  }

  handleDateChange = (e) => {
    let month = e.toString().slice(4, 7);
    let date = e.toString().slice(8, 10);
    let year = e.toString().slice(11, 15);
    let month1 = month.toLowerCase();
    let months = [0, "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    month1 = months.indexOf(month1);
    if (month1 <= 9) {
      month1 = `0${month1}`
    }
    const untilDate = `${year}-${month1}-${date}`
    this.setState({
      untilDateVal: e.toISOString().slice(0, 10), untilDate: untilDate,
      appointmentValidations: { untilDatevalidation: false }
    });
    this.inputFieldChange({ target: { value: e, name: "untilDate", validation: { required: true }, type: "date" } });
  }

  handleRecurrenceDaysChange = (e) => {
    this.inputFieldChange({ target: { value: e, name: "recurrenceDays", validation: { required: true }, type: "select-one-multi" } });
    this.setState({
      recurrenceDays: e,
      appointmentValidations: { recurrenceDaysvalidation: false }
    })
  }
  handleRecurrencePatternChange = (e) => {
    this.inputFieldChange({ target: { value: e.value, name: "recurrencePattern", validation: { required: true }, type: "select-one" } });
    this.setState({
      recurrencePattern: e,
      appointmentValidations: { recurrencePatternvalidation: false }
    });
  }
  handleDurationChange = (e) => {
    this.inputFieldChange({ target: { value: e.value, name: "duration", validation: { required: true }, type: "select-one" } });
    this.setState({
      duration: e,
      appointmentValidations: { durationvalidation: false }
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

  handlePanelEdit = (event, rowdata) => {
    let panelcategoryvalue;
    let skillsvalue;
    Object.entries(panelForm).map(([key, value]) => {
      if (key === 'name') {
        value.value = rowdata.panel_name;
        value.valid = true;
      }
      if (key === 'sapid') {
        value.value = rowdata.sap_id;
        value.valid = true;
      }
      if (key === 'email') {
        value.value = rowdata.email_id;
        value.valid = true;
      }
      if (key === 'contact') {
        value.value = rowdata.contact;
        value.valid = true;
      }
      if (key === 'skills') {
        value.value = rowdata.skill_id;
        skillsvalue = rowdata.skill_value;
        value.valid = true;
      }
      if (key === 'panelCat') {
        value.value = rowdata.panel_category;
        panelcategoryvalue = { value: rowdata.panel_category, label: rowdata.panel_category };
        value.valid = true;
      }
      return 0;
    });
    let appointmeidlen = rowdata.appointment_detil.length;
    this.setState({
      showAddPanelModal: true,
      panelEditMode: true,
      panelCat: panelcategoryvalue,
      skills: skillsvalue,
      appointmentDetails: rowdata.appointment_detil,
      appointmentid: appointmeidlen + 1,
      formIsValid: true,
      panelid: rowdata.panel_id
    });

  }

  handlesubmitvalidation = () => {
    const { startTime, endTime, duration, untilDateVal, recurrenceDays, recurrencePattern } = this.state;
    let formvalid = true;
    const validatefieldvalue = [{ startTime: startTime, endTime: endTime, duration: duration, untilDateVal: untilDateVal, recurrenceDays: recurrenceDays, recurrencePattern: recurrencePattern }];

    validatefieldvalue.map((val, key) => {
      let appointmentObj = {
        durationvalidation: false,
        untilDatevalidation: false,
        recurrenceDaysvalidation: false,
        recurrencePatternvalidation: false,
      }

      if (val.duration === '') {
        appointmentObj.durationvalidation = true;
        formvalid = false;
      }

      if (val.untilDateVal === '') {
        appointmentObj.untilDatevalidation = true;
        formvalid = false;
      }

      if (val.recurrenceDays === '' || recurrenceDays === null || (typeof val.recurrenceDays === 'object' && val.recurrenceDays.length === 0)) {
        appointmentObj.recurrenceDaysvalidation = true;
        formvalid = false;
      }

      if (val.recurrencePattern === '') {
        appointmentObj.recurrencePatternvalidation = true;
        formvalid = false
      }

      this.setState({ appointmentValidations: appointmentObj });
      return '1';
    });

    return formvalid;
  }


  handleAddAppointment = () => {
    const { appointmentid, startTime, startTimeVal, endTime, endTimeVal, duration, untilDateVal, recurrenceDays, recurrencePattern, appointmentDetails } = this.state;
    const formvalid = this.handlesubmitvalidation();
    if (formvalid && !this.state.startendtimeerror) {
      let stringData = this.state.recurrenceDays.reduce((result, item) => {
        return `${result}${item.label},`
      }, "");
      stringData = stringData.replace(/,(\s+)?$/, '');
      let appointvalue = appointmentid + 1;
      const appointmentObj = {
        appointmentid: appointmentid,
        startTime: startTime,
        startTimeVal: startTimeVal,
        endTime: endTime,
        endTimeVal: endTimeVal,
        duration: duration,
        untilDateVal: untilDateVal,
        untillDateValue: untilDateVal,
        recurrenceDays: recurrenceDays,
        recurrencePattern: recurrencePattern,
        recurrencePatternValue: recurrencePattern.value,
        recurrenceDaysValue: stringData
      }

      this.setState({ appointmentDetails: [...appointmentDetails, appointmentObj], startTime: '', startTimeVal: moment(), endTime: '', endTimeVal: moment(), duration: '', untilDateVal: moment().format('YYYY-MM-DD'), recurrenceDays: '', recurrencePattern: '', appointmentid: appointvalue });

      this.inputFieldChange({ target: { value: 'appointmen', name: "appointMent", validation: { required: true }, type: "text" } });
    }

  }

  handleEditAppointment = (rowdata, value) => {
    const panleditmode = this.state.panelEditMode;
    if (!panleditmode) {
      this.setState({
        showappointments: true,
        lastEditablevalue: value,
        startTimeVal: value.startTimeVal,
        endTimeVal: value.endTimeVal,
        startTime: value.startTime,
        endTime: value.endTime,
        duration: value.duration,
        recurrenceDays: value.recurrenceDays,
        recurrenceDaysValue: value.recurrenceDaysValue,
        recurrencePattern: value.recurrencePattern,
        recurrencePatternValue: value.recurrencePatternValue,
        untilDateVal: value.untilDateVal,
        untillDateValue: value.untillDateValue,
        isUpdate: true
      });
    } else {
      this.setState({
        showappointments: true,
        lastEditablevalue: value,
        startTimeVal: value.startTimeVal,
        endTimeVal: value.endTimeVal,
        startTime: value.startTime,
        endTime: value.endTime,
        duration: value.duration,
        recurrenceDays: value.recurrenceDays,
        recurrenceDaysValue: value.recurrenceDaysValue,
        recurrencePattern: value.recurrencePattern,
        recurrencePatternValue: value.recurrencePatternValue,
        untilDateVal: value.untilDateVal,
        untillDateValue: value.untillDateValue,
        isUpdate: true,
        panel_calendar_id: value.panel_calendar_id
      });
    }
  }

  handleUpdateAppointment = () => {
    const formvalid = this.handlesubmitvalidation();
    if (formvalid && !this.state.startendtimeerror) {
      const { startTime, startTimeVal, endTime, endTimeVal, duration, untilDateVal, recurrenceDays, recurrencePattern, lastEditablevalue, panel_calendar_id } = this.state;
      const appointmentidval = lastEditablevalue.appointmentid;
      let stringData = this.state.recurrenceDays.reduce((result, item) => {
        return `${result}${item.label},`
      }, "");
      stringData = stringData.replace(/,(\s+)?$/, '');

      this.setState(prevState => ({
        appointmentDetails: prevState.appointmentDetails.map(
          el => el.appointmentid === appointmentidval ? {
            ...el,
            appointmentid: appointmentidval,
            startTime: startTime,
            startTimeVal: startTimeVal,
            endTime: endTime,
            endTimeVal: endTimeVal,
            duration: duration,
            untilDateVal: untilDateVal,
            untillDateValue: untilDateVal,
            recurrenceDays: recurrenceDays,
            recurrencePattern: recurrencePattern,
            recurrencePatternValue: recurrencePattern.value,
            recurrenceDaysValue: stringData,
            panel_calendar_id: panel_calendar_id
          } : el
        )
      }));

      this.setState({
        lastEditablevalue: '', startTime: '', startTimeVal: moment(), endTime: '', endTimeVal: moment(), duration: '', untilDateVal: moment().format('YYYY-MM-DD'), recurrenceDays: '', recurrencePattern: '', isUpdate: false
      });
    }
  }

  handleCancelAppointment = () => {
    this.setState({
      startTime: '', startTimeVal: moment(), endTime: '', endTimeVal: moment(), duration: '',
      untilDateVal: moment().format('YYYY-MM-DD'), recurrenceDays: '', recurrencePattern: '', isUpdate: false, lastEditablevalue: ''
    });
  }

  hadleDeleteAppointment = (rowData, value) => {
    let appointmentvalue = [...this.state.appointmentDetails];
    let formvalid;
    const appointmentidval = value.appointmentid;
    appointmentvalue = appointmentvalue.filter(function (obj) {
      return obj.appointmentid !== appointmentidval;
    });

    if (appointmentvalue.length <= 0) {
      formvalid = false;
    } else {
      formvalid = true;
    }

    this.setState({ appointmentDetails: appointmentvalue, formIsValid: formvalid });
  }

  AppointmentShow = () => {
    this.setState({ showappointments: !this.state.showappointments });
  }

  render() {
    const { classes } = this.props;
    const { formIsValid, skillList, formValues, showappointments, appointmentValidations, appointmentDetails,
      showAddPanelModal, panelCat, skills, startTimeVal, endTimeVal, duration, untilDateVal, recurrenceDays,
      recurrencePattern, panelListVal, startendtimeerror, isUpdate, panelEditMode } = this.state;

    return (
      <div className="PanelList_container" id="panelDiv">
        <Dialog fullScreen open={showAddPanelModal} onClose={this.handleModalClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleModalClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1 }} >
                {panelEditMode ? 'Edit Panel Details' : 'Add Panel Details'}
              </Typography>
              {panelEditMode &&
                <Button style={(!formIsValid) ? { backgroundColor: "#ECECEC", color: "#000000", cursor: "pointer" } : { backgroundColor: "#1aba3d", color: "#ffffff" }} disabled={!formIsValid} variant="outlined" onClick={this.handleModalEdit}  >Update</Button>
              }
              {!panelEditMode &&
                <Button style={(!formIsValid) ? { backgroundColor: "#ECECEC", color: "#000000", cursor: "pointer" } : { backgroundColor: "#1aba3d", color: "#ffffff" }} disabled={!formIsValid} variant="outlined" onClick={this.handleModalSubmit}  >            Submit </Button>
              }
            </Toolbar>
          </AppBar>
          <DialogTitle id="Panel-Name">{panelEditMode ? 'Edit Panel Details' : 'Add Panel Details'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={2} >
                <InputLabel htmlFor="panelCategory" style={{ margin: 0, padding: '18px 0 0' }}>Panel Name</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
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
              <Hidden only={['xs']}><Grid item spacing={0} sm={1} ></Grid></Hidden>
              <Grid item xs={12} sm={2} >
                <InputLabel htmlFor="sapid" style={{ margin: 0, padding: '18px 0 0' }}>SAP ID</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  className="w-100"
                  required={true}
                  label="SAP ID"
                  variant="outlined"
                  margin="dense"
                  type="number"
                  name="sapid"
                  value={formValues.sapid.value}
                  onChange={this.inputFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={2} >
                <InputLabel htmlFor="email" style={{ margin: 0, padding: '18px 0 0' }}>Email ID</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
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
              <Grid item xs={12} sm={1} ></Grid>
              <Grid item xs={12} sm={2} >
                <InputLabel htmlFor="contact" style={{ margin: 0, padding: '18px 0 0' }}>Contact No</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField
                  className="w-100"
                  required={true}
                  label="Contact No"
                  inputProps={{ max: 12 }}
                  variant="outlined"
                  margin="dense"
                  type="number"
                  name="contact"
                  value={formValues.contact.value}
                  onChange={this.inputFieldChange}
                />
              </Grid>
              <Grid item xs={12} sm={2} >
                <InputLabel htmlFor="panelCategory" style={{ margin: 0, padding: '18px 0 0' }}>Panel Category</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <Select
                  className="w-100"
                  required={true}
                  label="Panel Category"
                  id="panelCategory"
                  name="panelCat"
                  styles={SelectStyles()}
                  options={panelCategoryOptions}
                  value={panelCat}
                  onChange={this.handlePanelChange}
                />
              </Grid>
              <Grid item xs={12} sm={1} ></Grid>
              <Grid item xs={12} sm={2} >
                <InputLabel htmlFor="selectSkills" style={{ margin: 0, padding: '18px 0 0' }}>Select Skills</InputLabel>
              </Grid>
              <Grid item xs={12} sm={3} >
                <Select
                  className="w-100"
                  required={true}
                  label="Select Skills"
                  id="skills"
                  name="skills"
                  options={skillList}
                  value={skills}
                  onChange={this.handleSkillsChange}
                  isMulti
                  styles={SelectStyles()}
                  closeMenuOnSelect={false}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button variant="outlined" color="primary" onClick={this.AppointmentShow}>
                  Add Appointment
              </Button>
              </Grid>

              {showappointments && <React.Fragment>

                <Grid item xs={12} sm={2}>
                  <InputLabel htmlFor="startTime" style={{ margin: 0, padding: '18px 0 0' }}>Start Time</InputLabel>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="startTime"
                      style={{ width: '100%' }}
                      InputProps={{ className: classes.dateTimePicker }}
                      label="Start Time"
                      inputVariant="outlined"
                      value={startTimeVal}
                      onChange={this.handleStartTimeChange}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item sm={1} ></Grid>
                <Grid item xs={12} sm={2}>
                  <InputLabel htmlFor="endTime" style={{ margin: 0, padding: '18px 0 0' }}>End Time</InputLabel>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="endTime"
                      style={{ width: '100%' }}
                      InputProps={{ className: classes.dateTimePicker }}
                      label="End Time"
                      inputVariant="outlined"
                      onChange={this.handleEndTimeChange}
                      value={endTimeVal}
                      helperText={startendtimeerror ? 'End time should be greater than start time' : ''}
                    />

                  </MuiPickersUtilsProvider>
                </Grid>


                <Grid item xs={12} sm={2} >
                  <InputLabel htmlFor="duration" style={{ margin: 0, padding: '18px 0 0' }}>Duration</InputLabel>
                </Grid>
                <Grid item xs={12} sm={3} >
                  <TextField
                    className="w-100"
                    required={true}
                    label="Duration"
                    id="duration"
                    name="duration"
                    variant="outlined"
                    margin="dense"
                    disabled={true}
                    value={duration}
                    helperText={appointmentValidations.durationvalidation ? 'End time must be greater than start time' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={1} ></Grid>
                <Grid item xs={12} sm={2} >
                  <InputLabel htmlFor="until" style={{ margin: 0, padding: '18px 0 0' }}>Until</InputLabel>
                </Grid>
                <Grid item xs={12} sm={3}>

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="untilDate"
                      label="Until Date"
                      format="dd/MM/yyyy"
                      inputVariant="outlined"
                      value={untilDateVal}
                      onChange={this.handleDateChange}
                      style={{ width: '100%' }}
                      InputProps={{ className: classes.dateTimePicker }}
                      helperText={appointmentValidations.untilDatevalidation ? 'Please select the untill date' : ''}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} sm={2} >
                  <InputLabel htmlFor="selectSkills" style={{ margin: 0, padding: '18px 0 0' }}>Recurrence Days</InputLabel>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Select
                    className="w-100"
                    required={true}
                    label="Recurrence Days"
                    id="recurrenceDays"
                    name="recurrenceDays"
                    options={daysOptions}
                    value={recurrenceDays}
                    onChange={this.handleRecurrenceDaysChange}
                    helperText={appointmentValidations.recurrenceDaysvalidation ? 'Please select the Recurrence Days' : ''}
                    isMulti
                    styles={SelectStyles()}
                    closeMenuOnSelect={false}
                  />
                  {appointmentValidations.recurrenceDaysvalidation ? <FormHelperText>Please select the Recurrence Days</FormHelperText> : ''}
                </Grid>
                <Grid item xs={12} sm={1} ></Grid>
                <Grid item xs={12} sm={2} >
                  <InputLabel htmlFor="reccurence" style={{ margin: 0, padding: '18px 0 0' }}>Recurrence Pattern</InputLabel>
                </Grid>
                <Grid item xs={12} sm={3} >
                  <Select
                    className="w-100"
                    required={true}
                    styles={SelectStyles()}
                    label="Recurrence Pattern"
                    id="recurrencePattern"
                    name="recurrencePattern"
                    options={recurrencePatternOptions}
                    value={recurrencePattern}
                    onChange={this.handleRecurrencePatternChange}
                  />
                  {appointmentValidations.recurrencePatternvalidation ? <FormHelperText>Please select the Recurrence Pattern</FormHelperText> : ''}
                </Grid>
                {!isUpdate &&
                  <React.Fragment>
                    <Grid item xs={10} sm={10}></Grid>
                    <Grid item xs={2} sm={2}>
                      <Button variant="outlined" color="primary"
                        onClick={() => { this.handleAddAppointment(); }}
                      >
                        Add More
                        </Button>
                    </Grid>
                  </React.Fragment>
                }
                {isUpdate &&
                  <React.Fragment>
                    <Grid item xs={8} sm={8}></Grid>
                    <Grid item xs={4} sm={4}>
                      <Button variant="outlined" color="primary" onClick={this.handleCancelAppointment}>
                        Cancel
                            </Button>  &nbsp;&nbsp;
                            <Button variant="outlined" color="primary" onClick={this.handleUpdateAppointment}>
                        Update
                            </Button>
                    </Grid>
                  </React.Fragment>
                }
              </React.Fragment>
              }
            </Grid>
            <br />
            {appointmentDetails.length > 0 &&
              <MaterialTable
                title="Appointment Details"
                columns={this.ColumnValue}
                data={appointmentDetails}
                style={{ boxShadow: 'none', border: 'solid 1px #ccc', maxWidth: "92%", maxHeight: "75%", paddingLeft: '100' }}
                options={{
                  actionsColumnIndex: -1,
                  pageSizeOptions: []
                }}
                actions={[
                  {
                    icon: 'edit',
                    tooltip: 'Edit Appointment',
                    onClick: (event, rowData) => this.handleEditAppointment(event, rowData)
                  },
                  {
                    icon: 'delete',
                    tooltip: 'Delete Appointment',
                    onClick: (event, rowData) => this.hadleDeleteAppointment(event, rowData)
                  }
                ]}
              />
            }
          </DialogContent>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3} id="panelPaper">
          <Typography variant="h4" className="text-center" gutterBottom>
            Panel List
            </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={panelListVal}
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
                onClick: (event) => this.setState({ showAddPanelModal: true, isUpdate: false, panelEditMode: false })
              },
              {
                icon: 'edit',
                tooltip: 'Edit Appointment',
                onClick: (event, rowData) => this.handlePanelEdit(event, rowData)
              },
              {
                icon: 'delete',
                tooltip: 'Delete Appointment',
                onClick: (event, rowData) => this.hadleDeleteAppointment(event, rowData)
              }
            ]}

          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Panel);
