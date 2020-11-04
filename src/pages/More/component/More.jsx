import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent, Button, Snackbar } from '@material-ui/core';
import MaterialTable from "material-table";
import MuiAlert from '@material-ui/lab/Alert';
import '../scss/More.scss';
import moment from 'moment';

const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const inputField1 = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const inputField2 = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const inputField3 = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};
const inputField4 = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const inputField5 = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};
const clientForm = {
  name: { ...inputField },

}
const clientForm1 = {
  name1: { ...inputField1 },

}
const clientForm2 = {
  name2: { ...inputField2 },

}
const clientForm3 = {
  name3: { ...inputField3 },

}
const clientForm4 = {
  name4: { ...inputField4 },
  name5: { ...inputField5 },


}

function TabContainer(props) {
  return (
    <Typography {...props} component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 15,
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
});

class More extends React.Component {


  handleChange = (event, value) => {
    this.setState({ activeTabIndex: value });
  };

  constructor(props) {
    super(props)
    this.state = {
      activeTabIndex: 0,
      clientListVal: [],
      locationListVal: [],
      skillListVal: [],
      competancyListVal: [],
      assessmentListVal: [],
      formValues: { ...clientForm },
      formValues1: { ...clientForm1 },
      formValues2: { ...clientForm2 },
      formValues3: { ...clientForm3 },
      formValues4: { ...clientForm4 },
      showAddclientModal: false,
      showAddclientModal1: false,
      showAddclientModal2: false,
      showAddclientModal3: false,
      showAddclientModal4: false,
      showToast: false,
      toastMessage: '',
      formIsValid: false,
      defaultvalue: '0',
      latitude: '',
      longitude: ''
    }
    this.columnFields = [
      {
        title: "Client Name",
        field: "ClientName",
        validate: rowData => rowData.ClientName !== '',
      },

    ]
    this.columnFields1 = [
      {
        title: "Location Name",
        field: "loc_name",
        validate: rowData => rowData.loc_name !== '',
      },

    ]
    this.columnFields2 = [
      {
        title: "Skill Name",
        field: "Skills",
        validate: rowData => rowData.Skills !== '',
      },

    ]
    this.columnFields3 = [
      {
        title: "Competancy Name",
        field: "CompetancyName",
        validate: rowData => rowData.CompetancyName !== '',
      },

    ]
    this.columnFields4 = [
      {
        title: "Assessment Scale Name",
        field: "AssName",
        validate: rowData => rowData.AssName !== '',
      },
      {
        title: "Assessment Value",
        field: "AssVal",
        validate: rowData => rowData.AssVal !== '',
      },

    ]
  }

  componentDidMount() {
    // Get client
    this.props.getClient().then((response) => {

      if (response && response.arrRes) {
        this.setState({
          clientListVal: response.arrRes,
          showToast: true,
          toastMessage: " client Data loaded successfully"
        })
      } else {
        this.setState({
          clientListVal: [],
          showToast: true,
          toastMessage: "Error in loading  client Data"
        })
      }
    });

    // Get location

    this.props.getLocation().then((response) => {

      if (response && response.arrRes) {
        // console.log(response);
        this.setState({
          locationListVal: response.arrRes,
          showToast: true,
          toastMessage: " Location Data loaded successfully"
        })
      } else {
        this.setState({
          locationListVal: [],
          showToast: true,
          toastMessage: "Error in loading  location Data"
        })
      }
    });

    // Get skill

    this.props.getSkill().then((response) => {

      if (response && response.arrRes) {
        this.setState({
          skillListVal: response.arrRes,
          showToast: true,
          toastMessage: " Skill Data loaded successfully"
        })
      } else {
        this.setState({
          skillListVal: [],
          showToast: true,
          toastMessage: "Error in loading  skill Data"
        })
      }
    });

    // Get competancy

    this.props.getCompetancy().then((response) => {

      if (response && response.arrRes) {
        this.setState({
          competancyListVal: response.arrRes,
          showToast: true,
          toastMessage: " competancy Data loaded successfully"
        })
      } else {
        this.setState({
          competancyListVal: [],
          showToast: true,
          toastMessage: "Error in loading competancy Data"
        })
      }
    });

    // Assessment details 
    this.props.getAssessment().then((response) => {

      if (response && response.arrRes) {
        this.setState({
          assessmentListVal: response.arrRes,
          showToast: true,
          toastMessage: "assessment Data loaded successfully"
        })
      } else {
        this.setState({
          assessmentListVal: [],
          showToast: true,
          toastMessage: "Error in loading assessment Data"
        })
      }
    });
  }

  // Client delete
  clienthandleDelete = (oldData) => {
    const reqObj = {
      ClientId: oldData.ClientId
    }
    this.props.deleteClient(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.clientListVal];
        data.splice(data.indexOf(oldData), 1);
        this.setState({
          clientListVal: data,
          showToast: true,
          toastMessage: " client Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in  client Name deletion"
        });
      }
    });
  }

  // Location delete
  locationhandleDelete = (oldData1) => {
    const reqObj = {
      LocId: oldData1.loc_id
    }
    this.props.deleteLocation(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.locationListVal];
        data.splice(data.indexOf(oldData1), 1);
        this.setState({
          locationListVal: data,
          showToast: true,
          toastMessage: " Location Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in  location Name deletion"
        });
      }
    });
  }

  // Skill delete
  skillhandleDelete = (oldData2) => {
    const reqObj = {
      skillId: oldData2.SkillId
    }
    this.props.deleteSkill(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.skillListVal];
        data.splice(data.indexOf(oldData2), 1);
        this.setState({
          skillListVal: data,
          showToast: true,
          toastMessage: " Skill Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in skill Name deletion"
        });
      }
    });
  }



  // Competancy delete
  competancyhandleDelete = (oldData3) => {
    const reqObj = {
      CompetancyId: oldData3.ID
    }
    this.props.deleteCompetancy(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.competancyListVal];
        data.splice(data.indexOf(oldData3), 1);
        this.setState({
          competancyListVal: data,
          showToast: true,
          toastMessage: " Competancy Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in  competancy Name deletion"
        });
      }
    });
  }

  // Assessment delete

  assessmenthandleDelete = (oldData4) => {
    const reqObj = {
      AssessId: oldData4.AssId,

    }
    this.props.deleteAssessment(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.assessmentListVal];
        data.splice(data.indexOf(oldData4), 1);
        this.setState({
          assessmentListVal: data,
          showToast: true,
          toastMessage: " Assessment Name deleted successfully",
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in assessment Name deletion"
        });
      }
    });
  }
  // client edit
  clienteditSubmit = (updatedScale, oldData) => {
    const reqObj = {
      ClientId: updatedScale.ClientId,
      ClientName: updatedScale.ClientName
    }
    this.props.editClient(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.clientListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, clientListVal: data,
          showToast: true,
          toastMessage: " client name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " failed in updating  client name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "error in updating the  client name"
        });
      }
    });
  }

  // location edit
  locationeditSubmit = (updatedScale, oldData) => {
    const { latitude } = this.state;
    const { longitude } = this.state;
    const dateTime = new Date();
    const date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

    });
    const reqObj = {
      "LocName": updatedScale.loc_name, "LocLatitude": latitude,
      "LocLongitude": longitude, "UpdatedDate": date, "UpdatedBy": 1, "LocId": updatedScale.loc_id, "isactive": "true",
    };
    // const reqObj = {
    //   loc_id: updatedScale.loc_id,
    //    loc_name: updatedScale.loc_name
    // }
    this.props.editLocation(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.locationListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, locationListVal: data,
          showToast: true,
          toastMessage: "Location name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: "Failed in updating location name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in updating the location name"
        });
      }
    });
  }


  // skill edit
  skilleditSubmit = (updatedScale, oldData) => {
    const reqObj = {
      skillId: updatedScale.SkillId,
      skillName: updatedScale.Skills
    }
    this.props.editSkill(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.skillListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, skillListVal: data,
          showToast: true,
          toastMessage: "Skill name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: "Failed in updating  skill name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in updating the skill name"
        });
      }
    });
  }


  // competancy edit
  competancyeditSubmit = (updatedScale, oldData) => {
    const reqObj = {
      CompetancyId: updatedScale.ID,
      CompetancyName: updatedScale.CompetancyName
    }
    this.props.editCompetancy(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.competancyListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, competancyListVal: data,
          showToast: true,
          toastMessage: " client name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " Failed in updating  competancy name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in updating the  competancy name"
        });
      }
    });
  }


  // assessment edit
  assessmenteditSubmit = (updatedScale, oldData) => {
    const reqObj = {
      AssessName: updatedScale.AssName,
      AssessValue: updatedScale.AssVal,
      AssessId: updatedScale.AssId,
      updatedBy: 1
    }
    this.props.editAssessment(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const data = [...this.state.assessmentListVal];
        data[data.indexOf(oldData)] = updatedScale;
        this.setState(prevState => ({
          ...prevState, assessmentListVal: data,
          showToast: true,
          toastMessage: "Assessment name updated successfully",
        }))
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " Failed in updating  assessment name"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "Error in updating the  assessment name"
        });
      }
    });
  }


  // client
  handleModalClose = () => {
    this.setState({ showAddclientModal: false, formValues: { ...clientForm } })
  }

  handleModalSubmit = () => {
    const { formValues } = this.state;
    const reqObj = {

      ClientName: formValues.name.value,
      ClientStatus: 1
    }
    this.props.addClient(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          ClientName: formValues.name.value,
          ClientId: response.arrRes
        }
        const updatedItems = [...this.state.clientListVal, myObj];
        this.setState({
          formValues: { ...clientForm },
          showAddclientModal: false,
          clientListVal: updatedItems,
          showToast: true,
          toastMessage: "Client name added successfully!"
        })
      }
      else {
        this.setState({
          showAddclientModal: false,
          showToast: true,
          toastMessage: "Error in adding  client name!"
        })
      }
    });
  };
  // location
  handleModalClose1 = () => {
    this.setState({ showAddclientModal1: false, formValues1: { ...clientForm1 } })
  }

  handleModalSubmit1 = () => {
    const { formValues1 } = this.state;
    const { latitude } = this.state;
    const { longitude } = this.state;
    const dateTime = new Date();
    const date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
    });
    const reqObj = {
      "LocName": formValues1.name1.value, "LocLatitude": latitude,
      "LocLongitude": longitude, "CreatedDate": date, "CreatedBy": 1
    };
    // const reqObj = {

    //    loc_name: formValues1.name1.value,
    //    LocationStatus: 1
    // }
    this.props.addLocation(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          loc_name: formValues1.name1.value,
          loc_id: response.arrRes
        }
        const updatedItems = [...this.state.locationListVal, myObj];
        this.setState({
          formValues1: { ...clientForm1 },
          showAddclientModal1: false,
          locationListVal: updatedItems,
          showToast: true,
          toastMessage: " Location name added successfully!"
        })
      }
      else {
        this.setState({
          showAddclientModal1: false,
          showToast: true,
          toastMessage: "Error in adding  location name!"
        })
      }
    });
  };
  // skill
  handleModalClose2 = () => {
    this.setState({ showAddclientModal2: false, formValues2: { ...clientForm2 } })
  }

  handleModalSubmit2 = () => {
    const { formValues2 } = this.state;
    const reqObj = {
      skillName: formValues2.name2.value
    }
    this.props.addSkill(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          Skills: formValues2.name2.value,
          skillId: response.arrRes
        }
        const updatedItems = [...this.state.skillListVal, myObj];
        this.setState({
          formValues2: { ...clientForm2 },
          showAddclientModal2: false,
          skillListVal: updatedItems,
          showToast: true,
          toastMessage: "Skill name added successfully!"
        })
      }
      else {
        this.setState({
          showAddclientModal2: false,
          showToast: true,
          toastMessage: "Error in adding  skill name!"
        })
      }
    });
  };

  // competancy
  handleModalClose3 = () => {
    this.setState({ showAddclientModal3: false, formValues3: { ...clientForm3 } })
  }

  handleModalSubmit3 = () => {
    const { formValues3 } = this.state;
    const reqObj = {

      CompetancyName: formValues3.name3.value,
      CompetancyStatus: 1
    }
    this.props.addCompetancy(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          CompetancyName: formValues3.name3.value,
          ID: response.arrRes
        }
        const updatedItems = [...this.state.competancyListVal, myObj];
        this.setState({
          formValues3: { ...clientForm3 },
          showAddclientModal3: false,
          competancyListVal: updatedItems,
          showToast: true,
          toastMessage: "Competancy name added successfully!"
        })
      }
      else {
        this.setState({
          showAddclientModal3: false,
          showToast: true,
          toastMessage: "Error in adding  competancy name!"
        })
      }
    });
  };

  // assessment
  handleModalClose4 = () => {
    this.setState({ showAddclientModal4: false, formValues4: { ...clientForm4 } })
  }

  handleModalSubmit4 = () => {
    const { formValues4 } = this.state;
    const reqObj = {

      AssessName: formValues4.name4.value,
      AssessValue: formValues4.name5.value,
      AssessmentStatus: 1,
      "createdBy": 1
      //  "createdBy": this.props.userDetails.user_id 
    }
    this.props.addAssessment(reqObj).then(response => {
      if (response && response.errCode === 201) {
        const myObj = {
          AssName: formValues4.name4.value,
          AssVal: formValues4.name5.value,
          AssessmentId: response.arrRes
        }
        const updatedItems = [...this.state.assessmentListVal, myObj];
        this.setState({
          formValues4: { ...clientForm4 },
          showAddclientModal4: false,
          assessmentListVal: updatedItems,
          showToast: true,
          toastMessage: "Assessment name added successfully!"
        })
      }
      else {
        this.setState({
          showAddclientModal4: false,
          showToast: true,
          toastMessage: "Error in adding assessment name!"
        })
      }
    });
  };


  // client
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
  // location

  inputFieldChange1 = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type ? e.target.type : '';
    const updatedRegForm = {
      ...this.state.formValues1
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity1(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues1: updatedRegForm, formIsValid });
  }

  //Validation
  checkValidity1(inputValue, rules, inputType, inputName) {
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

  // skill
  inputFieldChange2 = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type ? e.target.type : '';
    const updatedRegForm = {
      ...this.state.formValues2
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity2(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues2: updatedRegForm, formIsValid });
  }

  //Validation
  checkValidity2(inputValue, rules, inputType, inputName) {
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

  // competancy

  inputFieldChange3 = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type ? e.target.type : '';
    const updatedRegForm = {
      ...this.state.formValues3
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity3(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues3: updatedRegForm, formIsValid });
  }

  //Validation
  checkValidity3(inputValue, rules, inputType, inputName) {
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

  // assessment

  inputFieldChange4 = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type ? e.target.type : '';
    const updatedRegForm = {
      ...this.state.formValues4
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity4(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues4: updatedRegForm, formIsValid });
  }

  //Validation
  checkValidity4(inputValue, rules, inputType, inputName) {
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
    const { classes } = this.props;
    const { activeTabIndex } = this.state;
    const { formIsValid, formValues, formValues1, formValues2, formValues3, formValues4, clientListVal, locationListVal, skillListVal, competancyListVal, assessmentListVal, showAddclientModal, showAddclientModal1, showAddclientModal2, showAddclientModal3, showAddclientModal4, showToast, toastMessage } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs value={activeTabIndex} onChange={this.handleChange}>
            <Tab label="Add Client" />
            <Tab label="Add Location" />
            <Tab label="Add Skill" />
            <Tab label="Add Competancy" />
            <Tab label="Add Assessment" />
          </Tabs>
        </AppBar>
        {
          activeTabIndex === 0 &&
          <div>
              <Dialog
                disableBackdropClick
                maxWidth="xs"
                fullWidth={true}
                open={showAddclientModal}
                onClose={this.handleModalClose}
                aria-labelledby=" client" >
                <DialogTitle id=" client">Add  Client</DialogTitle>
                <DialogContent >
                  <div>
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
                <MaterialTable
                  title="Client"
                  columns={this.columnFields}
                  data={clientListVal}
                  style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                  options={{
                    actionsColumnIndex: -1,
                    pageSizeOptions: []
                  }}
                  actions={[
                    {
                      icon: 'add',
                      tooltip: 'Add client',
                      isFreeAction: true,
                      onClick: (event) => this.setState({ showAddclientModal: true })
                    },
                  ]}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                          this.clienteditSubmit(newData, oldData);
                        }
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        this.clienthandleDelete(oldData);
                      })
                  }}
                />
              </Paper>
          </div>}
        {activeTabIndex === 1 &&
          <div>
              <Dialog
                disableBackdropClick
                maxWidth="xs"
                fullWidth={true}
                open={showAddclientModal1}
                onClose={this.handleModalClose1}
                aria-labelledby="location"
              >
                <DialogTitle id="location">Add  Location</DialogTitle>
                <DialogContent >
                  <div >
                    <TextField
                      name="name1"
                      required={true}
                      value={formValues1.name1.value}
                      autoFocus
                      variant="outlined"
                      margin="dense"
                      className="w-100"
                      label="Enter Name"
                      type="text"
                      inputProps={{ pattern: "[a-zA-Z]" }}
                      onChange={this.inputFieldChange1} />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleModalClose1} variant="contained" color="primary">
                    Cancel
            </Button>
                  <Button onClick={this.handleModalSubmit1} disabled={!formIsValid} variant="contained" color="primary">
                    Submit
            </Button>
                </DialogActions>
              </Dialog>
              <Paper className={classes.paperRoot} elevation={3}>
                <MaterialTable
                  title="Location"
                  columns={this.columnFields1}
                  data={locationListVal}
                  style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                  options={{
                    actionsColumnIndex: -1,
                    pageSizeOptions: []
                  }}
                  actions={[
                    {
                      icon: 'add',
                      tooltip: 'Add location',
                      isFreeAction: true,
                      onClick: (event) => this.setState({ showAddclientModal1: true })
                    },
                  ]}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                          this.locationeditSubmit(newData, oldData);
                        }
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((locationresolve) => {
                        locationresolve();
                        this.locationhandleDelete(oldData);
                      })
                  }}
                />
              </Paper>
          </div>
        }
        {
          activeTabIndex === 2 &&
          <div>
              <Dialog
                disableBackdropClick
                maxWidth="xs"
                fullWidth={true}
                open={showAddclientModal2}
                onClose={this.handleModalClose2}
                aria-labelledby="skill"
              >
                <DialogTitle id="skill">Add  Skill</DialogTitle>
                <DialogContent >
                  <div >
                    <TextField
                      name="name2"
                      required={true}
                      value={formValues2.name2.value}
                      autoFocus
                      variant="outlined"
                      margin="dense"
                      className="w-100"
                      label="Enter Name"
                      type="text"
                      inputProps={{ pattern: "[a-zA-Z]" }}
                      onChange={this.inputFieldChange2} />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleModalClose2} variant="contained" color="primary">
                    Cancel
            </Button>
                  <Button onClick={this.handleModalSubmit2} disabled={!formIsValid} variant="contained" color="primary">
                    Submit
            </Button>
                </DialogActions>
              </Dialog>
              <Paper className={classes.paperRoot} elevation={3}>
                <MaterialTable
                  title="Skills"
                  columns={this.columnFields2}
                  data={skillListVal}
                  style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                  options={{
                    actionsColumnIndex: -1,
                    pageSizeOptions: []
                  }}
                  actions={[
                    {
                      icon: 'add',
                      tooltip: 'Add skill',
                      isFreeAction: true,
                      onClick: (event) => this.setState({ showAddclientModal2: true })
                    },
                  ]}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                          this.skilleditSubmit(newData, oldData);
                        }
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        this.skillhandleDelete(oldData);
                      })
                  }}
                />
              </Paper>
          </div>
        }
        {
          activeTabIndex === 3 &&
          <div>
              <Dialog
                disableBackdropClick
                maxWidth="xs"
                fullWidth={true}
                open={showAddclientModal3}
                onClose={this.handleModalClose3}
                aria-labelledby="competancy"
              >
                <DialogTitle id="competancy">Add  Competancy</DialogTitle>
                <DialogContent >
                  <div >
                    <TextField
                      name="name3"
                      required={true}
                      value={formValues3.name3.value}
                      autoFocus
                      variant="outlined"
                      margin="dense"
                      className="w-100"
                      label="Enter Name"
                      type="text"

                      inputProps={{ pattern: "[a-zA-Z]" }}
                      onChange={this.inputFieldChange3} />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleModalClose3} variant="contained" color="primary">
                    Cancel
            </Button>
                  <Button onClick={this.handleModalSubmit3} disabled={!formIsValid} variant="contained" color="primary">
                    Submit
            </Button>
                </DialogActions>
              </Dialog>
              <Paper className={classes.paperRoot} elevation={3}>
                <MaterialTable
                  title="Competancy"
                  columns={this.columnFields3}
                  data={competancyListVal}
                  style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                  options={{
                    actionsColumnIndex: -1,
                    pageSizeOptions: []
                  }}
                  actions={[
                    {
                      icon: 'add',
                      tooltip: 'Add competancy',
                      isFreeAction: true,
                      onClick: (event) => this.setState({ showAddclientModal3: true })
                    },
                  ]}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                          this.competancyeditSubmit(newData, oldData);
                        }
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        this.competancyhandleDelete(oldData);
                      })
                  }}
                />
              </Paper>
          </div>
        }
        {
          activeTabIndex === 4 &&
          <div>
              <Dialog
                disableBackdropClick
                maxWidth="xs"
                fullWidth={true}
                open={showAddclientModal4}
                onClose={this.handleModalClose4}
                aria-labelledby="assessment"
              >
                <DialogTitle id="assessment">Add Assessment</DialogTitle>
                <DialogContent >
                  <div >
                    <TextField
                      name="name4"
                      required={true}
                      value={formValues4.name4.value}
                      autoFocus
                      variant="outlined"
                      margin="dense"
                      className="w-100"
                      label="Enter Name"
                      type="text"

                      inputProps={{ pattern: "[a-zA-Z]" }}
                      onChange={this.inputFieldChange4} />
                    <TextField
                      name="name5"
                      required={true}
                      value={formValues4.name5.value}
                      autoFocus
                      variant="outlined"
                      margin="dense"
                      className="w-100"
                      label="Enter Value"
                      type="text"

                      inputProps={{ pattern: "[0-9]" }}
                      onChange={this.inputFieldChange4} />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleModalClose4} variant="contained" color="primary">
                    Cancel
            </Button>
                  <Button onClick={this.handleModalSubmit4} disabled={!formIsValid} variant="contained" color="primary">
                    Submit
            </Button>
                </DialogActions>
              </Dialog>
              <Paper className={classes.paperRoot} elevation={3}>
                <MaterialTable
                  title="Assessment"
                  columns={this.columnFields4}
                  data={assessmentListVal}
                  style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                  options={{
                    actionsColumnIndex: -1,
                    pageSizeOptions: []
                  }}
                  actions={[
                    {
                      icon: 'add',
                      tooltip: 'Add assessment',
                      isFreeAction: true,
                      onClick: (event) => this.setState({ showAddclientModal4: true })
                    },
                  ]}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                          this.assessmenteditSubmit(newData, oldData);
                        }
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        this.assessmenthandleDelete(oldData);
                      })
                  }}
                />
              </Paper>
          </div>
        }
        {showToast &&
          <Snackbar
            style={{ width: 320 }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={showToast}
            autoHideDuration={3000}
            onClose={() => this.setState({ showToast: false })}
          >
            <MuiAlert onClose={() => this.setState({ showToast: false })} severity="success">
              {toastMessage}
            </MuiAlert>
          </Snackbar>
        }
      </div>
    );
  }
}

More.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(More);
