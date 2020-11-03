import React, { Fragment } from 'react';
import queryString from 'query-string'
import moment from 'moment';
import {
  Paper, Stepper, Dialog, Slide, IconButton, Grid, Step, Button, Typography,
  StepLabel, withStyles, AppBar, Toolbar,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HomeContainer from '../../Home/container/HomeContainer';
import CandidateRegistration from './CandidateRegistration';
import Curriculum from './Curriculum';
import BatchFormation from './BatchFormation';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';
import '../scss/TrainingCreation.scss'

const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const trainingRegForm = {
  trainingName: { ...inputField },
  trainingType: { ...inputField },
  duration: { ...inputField },
  location: { ...inputField },
  account: { ...inputField },
  count: { ...inputField },
  skills: { ...inputField },
  assignSME: { ...inputField },
  programManager: { ...inputField },
  //programManagerSapid: { ...inputField },
  requestBy: { ...inputField },
  requestBySapid: { ...inputField },
  plannedEndDate: { ...inputField },
  plannedStDate: { ...inputField },
  actualEndDate: { ...inputField },
  actualStDate: { ...inputField },
}

const styles = (theme) => ({
  paperRoot: {
    width: '80%',
    margin: '20px auto',
    padding: '10px 20px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  gridRoot: {
    flexGrow: 1,
  },
  bottomBtn: {
    justifyContent: 'flex-end',
    display: 'flex',
    marginTop: 10
  },
  addBtn: {
    marginTop: 27,
    marginLeft: 20
  },
  listRoot: {
    width: '100%',
    minWidth: 360,
    maxWidth: 450,
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    border: 'solid 1px lightgray'
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});

class TrainingCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      errors: {},
      formValues: { ...trainingRegForm },
      programManagerList: [],
      skillList: [],
      smesList: [],
      locationList: [],
      accountList: [],
      selectedSkill: [],
      selectedSME: [],
      EventDetailsList: [],
      trainingTypeList: [],
      eventSelected: null,
      selectedAccount: null,
      selectedTrainingType: null,
      selectedProgramManager: null,
      selectedlocation: null,
      batchDetailsList: [],
      formIsValid: false,
      newBatchName: '',
      newBatchCount: '',
      showCandidateUpload: false,
      CRFormIsValid: false,
      batchSelected: null,
      smesListOption: [],
      snackBarOpen: false,
      snackmsg: '',
      snackvariant: '',
      editTrainingId: null,
      editRegForm: {},
      BFFormIsValid: false,
      CFFormIsValid: false,
    }
    this.candidateRegRef = React.createRef();
    this.batchFormationRef = React.createRef();
    this.curriculumRef = React.createRef();
  }

  componentDidMount() {
    const queryStr = queryString.parse(this.props.location.search)
    if (queryStr.tId !== undefined) {
      this.setState({ editTrainingId: queryStr.tId });
    }
    Promise.all([
      this.getAccount(),
      this.getLocation(),
      this.getTrainingType(),
      this.getSkillList(),
      this.getSmeList(),
      this.getProgramManager()
    ]).then((result) => {
      if (result[0].length > 0) {
        this.setState({ accountList: result[0] });
      }

      if (result[1].length > 0) {
        this.setState({ locationList: result[1] });
      }

      if (result[2].length > 0) {
        this.setState({ trainingTypeList: result[2] });
      }

      if (result[3].length > 0) {
        this.setState({ skillList: result[3] });
      }

      if (result[4].length > 0) {
        this.setState({ smesList: result[4] });
      }

      if (result[5].length > 0) {
        this.setState({ programManagerList: result[5] });
      }

      if (result[0].length > 0 && result[1].length > 0 && result[2].length > 0 && result[3].length > 0 && result[4].length > 0 && result[5].length > 0) {
        if (queryStr.tId > 0) {
          this.getEditTrainingData(queryStr.tId);
        } else {
          // this.setState({ snackBarOpen: true, snackmsg: "Data loaded successfully", snackvariant: "success" });
        }

      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant: "error" })
      }
    })

  }

  getAccount = async () => {
    const result = await this.props.getAccount();
    if (result && result.errCode === 200) {
      const accountList = result.arrRes.map(list => {
        return {
          value: list.id,
          id: list.id,
          label: list.account_name
        }
      });
      return accountList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  }
  getLocation = async () => {
    const result = await this.props.getLocation();
    //  console.log(result);
    if (result && result.errCode === 200) {
      const locationList = result.arrRes.map(list => {
        return {
          value: list.id,
          id: list.id,
          label: list.location_name
        }
      });
      return locationList;
    } else {
      const errorArr = [];
      return errorArr;
    }
    /*  this.props.getLocation().then(response => {
       if (response && response.errCode === 200) {
         const locationList = response.arrRes.map(list => {
           return {
             value: list.id,
             id: list.id,
             label: list.location_name
           }
         });
         this.setState({ locationList,
           snackBarOpen: true,
           snackmsg: "Data loaded successfully",
           snackvariant:"success" });
       } else {
         this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant:"error" })
       }
     }) */
  }
  getProgramManager = async () => {
    const result = await this.props.getProgramManager();
    //  console.log(result);
    if (result && result.errCode === 200) {
      const programManagerList = result.arrRes.map(list => {
        return {
          value: list.id,
          id: list.id,
          label: list.name.concat(" - ").concat(list.sap_id)
        }
      });
      return programManagerList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  }
  getTrainingType = async () => {
    const result = await this.props.getTrainingType();
    //  console.log(result);
    if (result && result.errCode === 200) {
      const trainingTypeList = result.arrRes.map(list => {
        return {
          value: list.id,
          id: list.id,
          label: list.type
        }
      });
      return trainingTypeList;
    } else {
      const errorArr = [];
      return errorArr;
    }
    /* 
    this.props.getTrainingType().then(response => {
      if (response && response.errCode === 200) {
        const trainingTypeList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.type
          }
        });
        this.setState({ trainingTypeList,
          snackBarOpen: true,
          snackmsg: "Data loaded successfully",
          snackvariant:"success" });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant:"error" })
      }
    }) */
  }

  getSkillList = async () => {
    const result = await this.props.getSkillList();
    //console.log(result);
    if (result && result.errCode === 200) {
      const skillList = result.arrRes.map(list => {
        return {
          value: list.id,
          id: list.id,
          label: list.skill_name
        }
      });
      return skillList;
    } else {
      const errorArr = [];
      return errorArr;
    }
    /* this.props.getSkillList().then(response => {
      if (response && response.errCode === 200) {
        const skillList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.skill_name
          }
        });
        this.setState({ skillList,
          snackBarOpen: true,
          snackmsg: "Data loaded successfully",
          snackvariant:"success" });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant:"error" })
      }
    }) */
  }
  getSmeList = async () => {
    const result = await this.props.getSmeList();
    //  console.log(result);
    if (result && result.errCode === 200) {
      const smesList = result.arrRes.map(list => {
        return {
          value: list.id,
          id: list.id,
          label: list.name,
          skill: list.SkillName,
          skillsId: list.skill_ids
        }
      });
      return smesList;
    } else {
      const errorArr = [];
      return errorArr;
    }
    /*  this.props.getSmeList().then(response => {
       if (response && response.errCode === 200) {
         const smesList = response.arrRes.map(list => {
           return {
             value: list.id,
             id: list.id,
             label: list.name,
             skill: list.SkillName,
             skillsId: list.skill_ids
           }
         });
         console.log(smesList);
         this.setState({ smesList,
           snackBarOpen: true,
           snackmsg: "Data loaded successfully",
           snackvariant:"success" });
       } else {
         this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',  snackvariant:"error"})
       }
     }) */
  }

  getTrainingList = () => {
    this.props.getTrainingList().then((response) => {
      if (response && response.errCode === 200) {
        const eventList = response.arrRes.map(list => {
          return {
            value: list.id,
            label: list.training_name,

          }
        });
        // console.log("TrainingList");
        this.setState({ EventDetailsList: eventList, loading: false, snackBarOpen: true, snackmsg: "Data loaded successfully", snackvariant: "success" });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant: "error" })
      }
    });
  }
  getEditTrainingData = (editTrainingId) => {
    let reqObj = { training_id: editTrainingId }
    console.log(reqObj);
    this.props.getEditTrainingData(reqObj).then((response) => {
      if (response && response.errCode === 200) {

        const trainingData = response.arrRes[0];
        //console.log("----TrainingList---",trainingData);
        const RegForm = Object.assign({ ...trainingRegForm });
        const selectttype = { value: trainingData.training_type, id: trainingData.training_type, label: trainingData.type, name: "trainingType" }
        const selectAcc = { value: trainingData.account, id: trainingData.account, label: trainingData.account_name, name: "account" }
        const selectLoc = { value: trainingData.location, id: trainingData.location, label: trainingData.location_name, name: "location" }
        const selectProgramManager = { value: trainingData.program_manager_id, id: trainingData.program_manager_id, label: trainingData.program_manager.concat(" - ").concat(trainingData.program_manager_sapid), name: "programManager" }

        RegForm.trainingName.value = trainingData.training_name;
        RegForm.trainingName.valid = true;

        RegForm.trainingType.value = trainingData.training_type;
        RegForm.trainingType.valid = true;

        RegForm.location.value = trainingData.location;
        RegForm.location.valid = true;

        RegForm.duration.value = trainingData.duration;
        RegForm.duration.valid = true;

        RegForm.account.value = trainingData.account;
        RegForm.account.valid = true;

        RegForm.count.value = trainingData.count;
        RegForm.count.valid = true;

        RegForm.requestBy.value = trainingData.request_by;
        RegForm.requestBy.valid = true;

        RegForm.requestBySapid.value = trainingData.requestedby_sapid;
        RegForm.requestBySapid.valid = true;

        RegForm.programManager.value = trainingData.program_manager_id;
        RegForm.programManager.valid = true;

        // RegForm.programManagerSapid.value=trainingData.program_mngr_sapid;
        // RegForm.programManagerSapid.valid=true;

        RegForm.skills.value = trainingData.skills;
        RegForm.skills.valid = true;

        RegForm.assignSME.value = trainingData.sme;
        RegForm.assignSME.valid = true;

        RegForm.plannedStDate.value = new Date(trainingData.planned_start_date);
        RegForm.plannedStDate.valid = true;

        RegForm.plannedEndDate.value = new Date(trainingData.planned_end_date);
        RegForm.plannedEndDate.valid = true;

        RegForm.actualStDate.value = new Date(trainingData.actual_start_date);
        RegForm.actualStDate.valid = true;

        RegForm.actualEndDate.value = new Date(trainingData.actual_end_date);
        RegForm.actualEndDate.valid = true;

        console.log(RegForm);
        this.setState({ formValues: RegForm, selectedTrainingType: selectttype, selectedLocation: selectLoc, selectedProgramManager: selectProgramManager, selectedAccount: selectAcc, smesListOption: trainingData.smes, snackBarOpen: true, snackmsg: "Data loaded successfully", snackvariant: "success" })
      } else {
        this.setState({ snackBarOpen: true, snackmsg: "Something went Wrong. Please try again later.", snackvariant: "error" })
      }
    });
  }


  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const updatedRegForm = {
      ...this.state.formValues
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ formValues: updatedRegForm, formIsValid });
  }

  checkValidity(inputValue, rules) {
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
      return isValid;
    }
  }

  submitForm = () => {
    const formData = {};
    const { formValues, editTrainingId } = this.state;
    const resetRegisterEvent = {
      ...formValues
    };
    for (let inputIdentifier in resetRegisterEvent) {
      formData[inputIdentifier] = resetRegisterEvent[inputIdentifier].value;
    }
    const reqObj = {
      account: formData.account,
      actualEndDate: moment(formData.actualEndDate).format("YYYY-MM-DD HH:mm:ss"),
      actualStDate: moment(formData.actualStDate).format("YYYY-MM-DD HH:mm:ss"),
      trainingName: formData.trainingName,
      count: formData.count,
      duration: formData.duration,
      location: formData.location,
      trainingType: formData.trainingType,
      plannedEndDate: moment(formData.plannedEndDate).format("YYYY-MM-DD HH:mm:ss"),
      plannedStDate: moment(formData.plannedStDate).format("YYYY-MM-DD HH:mm:ss"),
      skills: formData.skills,
      smeIds: formData.assignSME,
      programManagerId: formData.programManager,
      //  programManagerSapid: formData.programManagerSapid,
      requestBy: formData.requestBy,
      requestBySapid: formData.requestBySapid,
      CreatedBy: 1,
      UpdatedBy: 1,
    }
    //console.log(reqObj);
    if (!editTrainingId) {
      this.props.registerTraining(reqObj).then(result => {
        if (result && result.errCode === 200) {
          this.setState({
            formValues: { ...trainingRegForm }, selectedAccount: null, selectedTrainingType: null, selectedProgramManager: null, selectedLocation: null, selectedSkill: null, selectedSME: null, snackBarOpen: true, snackmsg: "Data Inserted successfully", snackvariant: "success"
          });
        } else {
          this.setState({
            formValues: { ...trainingRegForm }, selectedAccount: null, selectedTrainingType: null, selectedProgramManager: null, selectedLocation: null, selectedSkill: null, selectedSME: null, snackBarOpen: true, snackmsg: "Error in insertion", snackvariant: "error"
          });
        }

      })
    } else {

      reqObj.id = editTrainingId;
      reqObj.smes = reqObj.smeIds;

      this.props.EditTrainingList(reqObj).then(result => {
        if (result && result.errCode === 200) {
          this.setState({
            snackBarOpen: true, snackmsg: "Data loaded successfully", snackvariant: "success"
          });
        } else {
          this.setState({
            formValues: { ...trainingRegForm }, selectedAccount: null, selectedTrainingType: null, selectedProgramManager: null, selectedLocation: null, selectedSkill: null, selectedSME: null, snackBarOpen: true, snackmsg: "Update Failure", snackvariant: "error"
          });
        }
      })
    }
  }

  selectFieldChange = (e) => {
    if (e.target.name === 'location') {
      this.setState({ selectedLocation: e.target });
    }
    if (e.target.name === 'account') {
      this.setState({ selectedAccount: e.target });
    }
    if (e.target.name === 'trainingType') {
      this.setState({ selectedTrainingType: e.target });
    }
    if (e.target.name === 'programManager') {
      this.setState({ selectedProgramManager: e.target });
    }
    if (e.target.name === 'skills') {
      this.setState({ smesListOption: [] }, () => {
        const { smesList } = this.state;
        const TemSme = [];
        const onchangeSkill = e.target.value;
        smesList.forEach((list, index) => {
          const Indexkill = list.skillsId.filter(element => onchangeSkill.includes(element));
          if (Indexkill.length > 0) {
            TemSme.push({
              value: list.id,
              id: list.id,
              label: list.label.concat("-").concat(list.skill)
            });
          }
        });

        this.setState({ smesListOption: TemSme });
      });
    }

    this.inputFieldChange(e);
  }

  getSteps = () => ['Registration', 'Candidate Registration', 'Batch Creation', 'Curriculum'];

  handleStep = (index) => {
    this.setState({ activeStep: index, batchDetailsList: [], eventSelected: null });
  }

  handleNext = async () => {

    if (this.state.activeStep === 0) {
      this.submitForm();
    } else if (this.state.activeStep === 1) {
      await this.candidateRegRef.current.submitForm().then(res => {
        if (res === 200) {
          this.setState(prev => ({ activeStep: prev.activeStep + 1, CRFormIsValid: false, batchDetailsList: [], eventSelected: null }));
        }
      });
    } else if (this.state.activeStep === 2) {
      await this.batchFormationRef.current.insertCandidates().then(res => {
        if (res === 200) {
          this.setState(prev => ({ activeStep: prev.activeStep + 1, CRFormIsValid: false, batchDetailsList: [], eventSelected: null }));
        }
      });
    } else if (this.state.activeStep === 3) {
      this.curriculumRef.current.handleClickOpen();
    } else if (this.state.activeStep < 3) {
      this.setState(prev => ({ activeStep: prev.activeStep + 1, CRFormIsValid: false, batchDetailsList: [], eventSelected: null }));
    }
  }

  handleBack = async () => {
    this.setState(prev => ({ activeStep: prev.activeStep - 1, CRFormIsValid: false, batchDetailsList: [], eventSelected: null }));
  }

  onChangeTraining = (eventSelected) => {
    this.setState({ eventSelected: eventSelected.target, batchDetailsList: [], batchSelected: null, candidateList: [] });
    this.getBatchList(eventSelected.target.value);
  }

  getBatchList = (id) => {
    const reqObj = { training_id: id };
    this.props.getBatchList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const batchDetailsList = response.arrRes.map(list => {
          return {
            value: list.batch_id,
            label: `${list.batch_name}: Count - ${list.batch_count}`,
            trID: list.training_id
          }
        })
        this.setState({ batchDetailsList, snackBarOpen: true, snackmsg: "Data loaded successfully", snackvariant: "success" });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant: "error" })
      }
    });
  }

  showCandidateUpload = () => {
    this.setState({ showCandidateUpload: true });
  }

  handleCandidateUploadClose = () => {
    this.setState({ showCandidateUpload: false });
  }

  onBatchChange = (batchSelected) => {
    this.setState({ batchSelected: batchSelected.target })
  }

  checkAllFieldsValid = (CRFormIsValid) => {
    this.setState({ CRFormIsValid })
  }
  checkAllFieldsValidBF = (BFFormIsValid) => {
    this.setState({ BFFormIsValid })
  }
  checkAllFieldsValidCF = (CFFormIsValid) => {
    this.setState({ CFFormIsValid })
  }
  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  render() {
    const { classes } = this.props;
    const { skillList, activeStep, showCandidateUpload, CRFormIsValid, selectedProgramManager, selectedTrainingType, selectedAccount, selectedLocation, locationList, programManagerList, accountList, trainingTypeList, formValues, smesListOption, snackBarOpen, snackmsg, snackvariant, editTrainingId, formIsValid, BFFormIsValid, CFFormIsValid } = this.state;
    const steps = this.getSteps();
    let disableSubmitBtn = false;
    if (activeStep === 0) {
      disableSubmitBtn = !formIsValid;
    }
    if (activeStep === 1) {
      disableSubmitBtn = !CRFormIsValid;
    }
    if (activeStep === 2) {
      disableSubmitBtn = !BFFormIsValid;
    }
    if (activeStep === 3) {
      disableSubmitBtn = !CFFormIsValid;
    }

    return (
      <Paper className={classes.paperRoot} elevation={3}>
        <Typography variant="h4" className="text-center" gutterBottom>
          Training Registration
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} onClick={() => this.handleStep(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && <Grid container spacing={3} className={classes.gridRoot}>
          <Grid item xs={12} sm={6}>
            <div>
              <Textbox
                value={formValues.trainingName.value}
                fieldLabel="Training Name"
                id="trainingName"
                type="text"
                placeholder="Training Name"
                errorMessage={this.state.errors.trainingName === "" ? null : this.state.errors.trainingName}
                name="trainingName"
                onChange={this.inputFieldChange}
              />
              <SelectOne
                fieldLabel="Training Type"
                id="trainingType"
                name="trainingType"
                placeholder="Training Type"
                value={selectedTrainingType}
                options={trainingTypeList}
                onChange={this.selectFieldChange}
                errorMessage={this.state.errors.location === "" ? null : this.state.errors.location}
              />
              <SelectOne
                fieldLabel="Location"
                id="location"
                name="location"
                placeholder="Location"
                value={selectedLocation}
                options={locationList}
                onChange={this.selectFieldChange}
                errorMessage={this.state.errors.location === "" ? null : this.state.errors.location}
              />
              <Textbox
                fieldLabel="Duration"
                value={formValues.duration.value}
                id="duration"
                type="text"
                placeholder="Duration"
                errorMessage={this.state.errors.duration === "" ? null : this.state.errors.duration}
                name="duration"
                onChange={this.inputFieldChange}
              />
              <SelectOne
                fieldLabel="Account"
                id="account"
                name="account"
                value={selectedAccount}
                placeholder="Account"
                options={accountList}
                onChange={this.selectFieldChange}
                errorMessage={this.state.errors.account === "" ? null : this.state.errors.account}
              />
              <Textbox
                fieldLabel="Candidates Count"
                value={formValues.count.value}
                id="count"
                type="number"
                placeholder="Count"
                errorMessage={this.state.errors.count === "" ? null : this.state.errors.count}
                name="count"
                onChange={this.inputFieldChange}
              />
              <Textbox
                fieldLabel="Requested By"
                value={formValues.requestBy.value}
                id="requestBy"
                type="text"
                placeholder="Requested By"
                errorMessage={this.state.errors.requestBy === "" ? null : this.state.errors.requestBy}
                name="requestBy"
                onChange={this.inputFieldChange}
              />
              <Textbox
                fieldLabel="Requested By SAP ID"
                value={formValues.requestBySapid.value}
                id="requestBySapid"
                type="text"
                placeholder="Requested By SAP ID"
                errorMessage={this.state.errors.requestBySapid === "" ? null : this.state.errors.requestBySapid}
                name="requestBySapid"
                onChange={this.inputFieldChange}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectOne
              fieldLabel="Program Manager"
              id="programManager"
              name="programManager"
              placeholder="Program Manager"
              value={selectedProgramManager}
              options={programManagerList}
              onChange={this.selectFieldChange}
              errorMessage={this.state.errors.programManager === "" ? null : this.state.errors.programManager}
            />

            <SelectOne
              fieldLabel="Skills"
              id="skills"
              name="skills"
              placeholder="Skills"
              value={formValues.skills && formValues.skills.value}
              isMulti={true}
              options={skillList}
              onChange={this.selectFieldChange}
              errorMessage={this.state.errors.skills === "" ? null : this.state.errors.skills}
            />
            <SelectOne
              fieldLabel="Assign SME"
              id="assignSME"
              name="assignSME"
              placeholder="Assign SME"
              value={formValues.assignSME && formValues.assignSME.value}
              isMulti={true}
              options={smesListOption}
              onChange={this.selectFieldChange}
              errorMessage={this.state.errors.assignSME === "" ? null : this.state.errors.assignSME}
            />
            <DateTimePicker
              fieldLabel="Planned Start Date"
              value={formValues.plannedStDate.value}
              name="plannedStDate"
              minDate={new Date()}
              onChange={this.inputFieldChange}
            />
            <DateTimePicker
              value={formValues.plannedEndDate.value}
              fieldLabel="Planned End Date"
              name="plannedEndDate"
              disabled={formValues.plannedStDate.value === '' || formValues.plannedStDate.value === null}
              minDate={formValues.plannedStDate.value}
              onChange={this.inputFieldChange}
            />
            <DateTimePicker
              value={formValues.actualStDate.value}
              fieldLabel="Actual Start Date"
              minDate={new Date()}
              name="actualStDate"
              onChange={this.inputFieldChange}
            />
            <DateTimePicker
              fieldLabel="Actual End Date"
              value={formValues.actualEndDate.value}
              name="actualEndDate"
              disabled={formValues.actualStDate.value === '' || formValues.plannedStDate.value === null}
              minDate={formValues.actualStDate.value}
              onChange={this.inputFieldChange}
            />
          </Grid>
        </Grid>}
        {activeStep === 1 &&
          <Fragment>
            <div style={{ float: 'right' }}><Button variant="contained" onClick={this.showCandidateUpload} color="primary">Candidate Upload</Button></div>
            <Dialog fullScreen open={showCandidateUpload} onClose={this.handleCandidateUploadClose} TransitionComponent={Transition}>
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={this.handleCandidateUploadClose} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>Candidate Upload</Typography>
                </Toolbar>
              </AppBar>
              <HomeContainer />
            </Dialog>
            <CandidateRegistration
              ref={this.candidateRegRef}
              getTrainingList={this.props.getTrainingList}
              getAccount={this.props.getAccount}
              getLobList={this.props.getLobList}
              getLocation={this.props.getLocation}
              getProgramManager={this.props.getProgramManager}
              insertCandidate={this.props.insertCandidate}
              checkAllFieldsValid={this.checkAllFieldsValid}
            />
          </Fragment>
        }
        {activeStep === 2 && <Grid container spacing={3} className={classes.gridRoot}>
          <BatchFormation
            getTrainingList={this.props.getTrainingList}
            getBatchList={this.props.getBatchList}
            addBatchName={this.props.addBatchName}
            getCandidateMapList={this.props.getCandidateMapList}
            insertCandidateBatchMap={this.props.insertCandidateBatchMap}
            ref={this.batchFormationRef}
            checkAllFieldsValidBF={this.checkAllFieldsValidBF}
          />
        </Grid>}

        {activeStep === 3 &&

          <Grid container spacing={3} className={classes.gridRoot}>
            <Curriculum
              ref={this.curriculumRef}
              getTrainingList={this.props.getTrainingList}
              getTopicList={this.props.getTopicList}
              submitCurriculum={this.props.submitCurriculum}
              checkAllFieldsValidCF={this.checkAllFieldsValidCF}
            />
          </Grid>
        }
        <div className={classes.bottomBtn}>
          <Button
            variant="contained"
            onClick={this.handleBack}
            disabled={activeStep === 0}
            style={{ margin: 2 }}

          >Back</Button>
          {editTrainingId && editTrainingId > 0 &&
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              style={{ margin: 2 }}
              disabled={disableSubmitBtn}>Update
          </Button>}
          {!editTrainingId && <Button
            variant="contained"
            color="primary"
            onClick={this.handleNext}
            style={{ margin: 2 }}
            disabled={disableSubmitBtn}>Submit
          </Button>}
        </div >
        {snackBarOpen && <SnackBar snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant}
          onCloseSnackBar={this.onCloseSnackBar} />}
      </Paper >
    )
  }
}

export default withStyles(styles, { withTheme: true })(TrainingCreation);
