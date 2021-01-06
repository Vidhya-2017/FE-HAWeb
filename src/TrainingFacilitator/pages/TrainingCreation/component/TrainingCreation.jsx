import React, { Fragment } from "react";
import queryString from "query-string";
import _ from 'lodash';
import moment from "moment";
import {
  Paper,
  Stepper,
  Dialog,
  Slide,
  IconButton,
  Grid,
  Step,
  Button,
  Typography,
  StepLabel,
  withStyles,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import HomeContainer from "../../Home/container/HomeContainer";
import CandidateRegistration from "./CandidateRegistration";
import Curriculum from "./Curriculum";
import TrainingProgressDetails from "./TrainingProgressDetails"
import BatchFormation from "./BatchFormation";
import Textbox from "../../../components/UI_Component/Textbox/Textbox";
import SelectOne from "../../../components/UI_Component/Select/SelectOne";
import SnackBar from "../../../components/UI_Component/SnackBar/SnackBar";
import DateTimePicker from "../../../components/UI_Component/DateTimePicker/DateTimePicker";
import "../scss/TrainingCreation.scss";

const inputField = {
  value: "",
  validation: {
    required: true,
  },
  valid: false,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const durationTypeList = [
  { value: 'Month', id: 'Month', label: 'Month' },
  { value: 'Week', id: 'Week', label: 'Week' },
  { value: 'Days', id: 'Days', label: 'Days' }
]
const trainingModeList = [
  { value: 'ILT', id: 'ILT', label: 'ILT' },
  { value: 'VILT', id: 'VILT', label: 'VILT' },
  { value: 'E-Learning', id: 'E-Learning', label: 'E-Learning' },
  { value: 'SME Session', id: 'SME Session', label: 'SME Session' }
]
const trainingRegForm = {
  trainingName: { ...inputField },
  texTrainingID: { ...inputField },
  trainingMode: { ...inputField },
  trainingType: { ...inputField },
  duration: { ...inputField },
  durationType: { ...inputField },
  location: { ...inputField },
  lob: { ...inputField },
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
};

const styles = (theme) => ({
  paperRoot: {
    width: "80%",
    margin: "20px auto",
    padding: "10px 20px",
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
    justifyContent: "flex-end",
    display: "flex",
    marginTop: 10,
  },
  addBtn: {
    marginTop: 27,
    marginLeft: 20,
  },
  listRoot: {
    width: "100%",
    minWidth: 360,
    maxWidth: 450,
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    border: "solid 1px lightgray",
  },
  appBar: {
    position: "relative",
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
      formValues: _.clone({ ...trainingRegForm }),
      programManagerList: [],
      skillList: [],
      smesList: [],
      locationList: [],
      accountList: [],
      selectedSkill: [],
      isEditMode: false,
      selectedSME: [],
      EventDetailsList: [],
      trainingTypeList: [],
      eventSelected: null,
      selectedAccount: null,
      selectedTrainingType: null,
      selectedTrainingMode: null,
      selectedDurationType: null,
      selectedProgramManager: null,
      selectedlocation: null,
      batchDetailsList: [],
      formIsValid: false,
      newBatchName: "",
      newBatchCount: "",
      showCandidateUpload: false,
      CRFormIsValid: false,
      batchSelected: null,
      smesListOption: [],
      snackBarOpen: false,
      snackmsg: "",
      snackvariant: "",
      lobList: [],
      editTrainingId: null,
      editRegForm: {},
      selectedLOB: null,
      BFFormIsValid: false,
      CFFormIsValid: false,
      TPFormIsValid: false
    };
    this.candidateRegRef = React.createRef();
    this.batchFormationRef = React.createRef();
    this.curriculumRef = React.createRef();
    this.trainingCompletedRef = React.createRef();
  }

  componentDidMount() {
    const queryStr = queryString.parse(this.props.location.search);
    if (queryStr.tId !== undefined) {
      this.setState({ editTrainingId: queryStr.tId });
    }
    Promise.all([
      this.getAccount(),
      this.getLocation(),
      this.getTrainingType(),
      this.getSkillList(),
      this.getSmeList(),
      this.getProgramManager(),
      this.getLobList(),
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
      if (result[6].length > 0) {
        this.setState({ lobList: result[6] });
      }

      if (
        result[0].length > 0 &&
        result[1].length > 0 &&
        result[2].length > 0 &&
        result[3].length > 0 &&
        result[4].length > 0 &&
        result[5].length > 0 &&
        result[6].length > 0
      ) {
        if (queryStr.tId > 0) {
          this.getEditTrainingData(queryStr.tId);
        } else {
          // this.setState({ snackBarOpen: true, snackmsg: "Data loaded successfully", snackvariant: "success" });
        }
      } else {
        this.setState({
          snackBarOpen: true,
          snackmsg: "Something went Wrong. Please try again later.",
          snackvariant: "error",
        });
      }
    });
  }

  getLobList = async () => {
    const result = await this.props.getLobList();
    if (result && result.errCode === 200) {
      const lobList = result.arrRes.map((list) => {
        return {
          value: list.id,
          LobId: list.id,
          label: list.lob_name
        };
      });
      return lobList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  }
  getAccount = async () => {
    const result = await this.props.getAccount();
    if (result && result.errCode === 200) {
      const accountList = result.arrRes.map((list) => {
        return {
          value: list.id,
          id: list.id,
          label: list.account_name,
        };
      });
      return accountList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  };
  getLocation = async () => {
    const result = await this.props.getLocation();
    if (result && result.errCode === 200) {
      const locationList = result.arrRes.map((list) => {
        return {
          value: list.id,
          id: list.id,
          label: list.location_name,
        };
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
  };
  getProgramManager = async () => {
    const result = await this.props.getProgramManager();
    if (result && result.errCode === 200) {
      const programManagerList = result.arrRes.map((list) => {
        return {
          value: list.id,
          id: list.id,
          label: list.name.concat(" - ").concat(list.sap_id),
        };
      });
      return programManagerList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  };
  getTrainingType = async () => {
    const result = await this.props.getTrainingType();
    if (result && result.errCode === 200) {
      const trainingTypeList = result.arrRes.map((list) => {
        return {
          value: list.id,
          id: list.id,
          label: list.type,
        };
      });
      return trainingTypeList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  };

  getSkillList = async () => {
    const result = await this.props.getSkillList();
    if (result && result.errCode === 200) {
      const skillList = result.arrRes.map((list) => {
        return {
          value: list.id,
          id: list.id,
          label: list.skill_name,
        };
      });
      return skillList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  };
  getSmeList = async () => {
    const result = await this.props.getSmeList();
    if (result && result.errCode === 200) {
      const smesList = result.arrRes.map((list) => {
        return {
          value: list.id,
          id: list.id,
          label: list.name,
          skill: list.SkillName,
          skillsId: list.skill_ids,
        };
      });
      return smesList;
    } else {
      const errorArr = [];
      return errorArr;
    }
  };

  getTrainingList = () => {
    this.props.getTrainingList().then((response) => {
      if (response && response.errCode === 200) {
        const eventList = response.arrRes.map((list) => {
          return {
            value: list.id,
            label: list.training_name,
          };
        });
        this.setState({
          EventDetailsList: eventList,
          loading: false,
          snackBarOpen: true,
          snackmsg: "Data loaded successfully",
          snackvariant: "success",
        });
      } else {
        this.setState({
          snackBarOpen: true,
          snackmsg: "Something went Wrong. Please try again later.",
          snackvariant: "error",
        });
      }
    });
  };
  getEditTrainingData = (editTrainingId) => {
    let reqObj = { training_id: editTrainingId };
    this.props.getEditTrainingData(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const trainingData = response.arrRes[0];
        const RegForm = _.clone({ ...trainingRegForm });
        const selectttype = {
          value: trainingData.training_type,
          id: trainingData.training_type,
          label: trainingData.type,
          name: "trainingType",
        };
        const selectedTrMode = {
          value: trainingData?.training_mode,
          id: trainingData?.training_mode,
          label: trainingData?.training_mode,
          name: "trainingMode",
        };

        const selectedDrType = {
          value: trainingData?.duration_type,
          id: trainingData?.duration_type,
          label: trainingData?.duration_type,
          name: "durationType",
        };
        const selectAcc = {
          value: trainingData.account,
          id: trainingData.account,
          label: trainingData.account_name,
          name: "account",
        };
        const selectLoc = {
          value: trainingData.location,
          id: trainingData.location,
          label: trainingData.location_name,
          name: "location",
        };

        const selectedLOB = {
          value: trainingData.lob_name,
          id: trainingData.lob,
          label: trainingData.lob_name,
          name: "lob",
        };

        const selectProgramManager = {
          value: trainingData.program_manager_id,
          id: trainingData.program_manager_id,
          label: trainingData.program_manager
            .concat(" - ")
            .concat(trainingData.program_mngr_sapid),
          name: "programManager",
        };

        RegForm.trainingName.value = trainingData.training_name;
        RegForm.trainingName.valid = true;
        RegForm.texTrainingID.value = trainingData.tex_trainingid;
        RegForm.texTrainingID.valid = true;

        RegForm.trainingType.value = trainingData.training_type;
        RegForm.trainingType.valid = true;

        RegForm.trainingMode.value = trainingData.training_mode;
        RegForm.trainingMode.valid = true;

        RegForm.lob.value = trainingData.lob;
        RegForm.lob.valid = true;

        RegForm.durationType.value = trainingData.duration_type;
        RegForm.durationType.valid = true;

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
        const smeList = trainingData.smes.map(list => {
          return {
            ...list,
            label: `${list.label} - ${list.skill}`,
          }
        })
        for (const [key] of Object.entries(trainingRegForm)) {
          trainingRegForm[key] = {
            value: "",
            validation: {
              required: true,
            },
            valid: false,
          }
        }
        this.setState({
          formValues: _.clone({ ...RegForm }),
          selectedTrainingType: selectttype,
          selectedTrainingMode: selectedTrMode,
          selectedDurationType: selectedDrType,
          selectedLOB: selectedLOB,
          selectedLocation: selectLoc,
          selectedProgramManager: selectProgramManager,
          selectedAccount: selectAcc,
          smesListOption: smeList,
          snackBarOpen: true,
          isEditMode: true,
          snackmsg: "Data loaded successfully",
          snackvariant: "success",
        });
      } else {
        this.setState({
          snackBarOpen: true,
          snackmsg: "Something went Wrong. Please try again later.",
          snackvariant: "error",
        });
      }
    });
  };

  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const updatedRegForm = {
      ...this.state.formValues,
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName],
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {
      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ formValues: updatedRegForm, formIsValid });
  };

  checkValidity(inputValue, rules) {
    if (inputValue) {
      const value = inputValue.toString();
      let isValid = true;
      if (!rules) {
        return true;
      }
      if (rules.required) {
        isValid = value.trim() !== "" && isValid;
      }
      if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid;
      }
      return isValid;
    }
  }

  submitForm = () => {
    const formData = {};
    const { formValues, editTrainingId } = this.state;
    const resetRegisterEvent = {
      ...formValues,
    };
    for (let inputIdentifier in resetRegisterEvent) {
      formData[inputIdentifier] = resetRegisterEvent[inputIdentifier].value;
    }
    const reqObj = {
      account: formData.account,
      actualEndDate: moment(formData.actualEndDate).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      actualStDate: moment(formData.actualStDate).format("YYYY-MM-DD HH:mm:ss"),
      trainingName: formData.trainingName,
      texTrainingId: formData.texTrainingID,
      count: formData.count,
      duration: formData.duration,
      location: formData.location,
      lob: formData.lob,
      trainingType: formData.trainingType,
      trainingMode: formData.trainingMode,
      durationType: formData.durationType,
      plannedEndDate: moment(formData.plannedEndDate).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      plannedStDate: moment(formData.plannedStDate).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      skills: formData.skills,
      smeIds: formData.assignSME,
      programManagerId: formData.programManager,
      //  programManagerSapid: formData.programManagerSapid,
      requestBy: formData.requestBy,
      requestBySapid: formData.requestBySapid,
      CreatedBy: 1,
      UpdatedBy: 1,
    };
    if (!editTrainingId) {
      this.props.registerTraining(reqObj).then((result) => {
        if (result && result.errCode === 200) {
          this.setState({
            formValues: _.clone({ ...trainingRegForm }),
            selectedAccount: null,
            selectedTrainingType: null,
            selectedTrainingMode: null,
            selectedDurationType: null,
            selectedLOB: null,
            selectedProgramManager: null,
            selectedLocation: null,
            selectedSkill: null,
            selectedSME: null,
            snackBarOpen: true,
            snackmsg: "Data Inserted successfully",
            snackvariant: "success",
          });
        } else {
          this.setState({
            formValues: _.clone({ ...trainingRegForm }),
            selectedAccount: null,
            selectedTrainingType: null,
            selectedTrainingMode: null,
            selectedDurationType: null,
            selectedLOB: null,
            selectedProgramManager: null,
            selectedLocation: null,
            selectedSkill: null,
            selectedSME: null,
            snackBarOpen: true,
            snackmsg: "Error in insertion",
            snackvariant: "error",
          });
        }
      });
    } else {
      reqObj.id = editTrainingId;
      reqObj.smes = reqObj.smeIds;

      this.props.EditTrainingList(reqObj).then((result) => {
        if (result && result.errCode === 200) {
          this.props.history.push('/trainingCreation');
          this.setState({
            formValues: _.clone({ ...trainingRegForm }),
            selectedAccount: null,
            selectedTrainingMode: null,
            selectedTrainingType: null,
            selectedDurationType: null,
            selectedLOB: null,
            selectedProgramManager: null,
            selectedLocation: null,
            selectedSkill: null,
            selectedSME: null,
            snackBarOpen: true,
            snackmsg: "Data loaded successfully",
            snackvariant: "success",
          });
        } else {
          this.setState({
            formValues: _.clone({ ...trainingRegForm }),
            selectedAccount: null,
            selectedTrainingMode: null,
            selectedTrainingType: null,
            selectedDurationType: null,
            selectedLOB: null,
            selectedProgramManager: null,
            selectedLocation: null,
            selectedSkill: null,
            selectedSME: null,
            snackBarOpen: true,
            snackmsg: "Update Failure",
            snackvariant: "error",
          });
        }
      });
    }
  };

  selectFieldChange = (e) => {
    if (e.target.name === "location") {
      this.setState({ selectedLocation: e.target });
    }
    if (e.target.name === "account") {
      this.setState({ selectedAccount: e.target });
    }
    if (e.target.name === "trainingType") {
      this.setState({ selectedTrainingType: e.target });
    }
    if (e.target.name === "trainingMode") {
      this.setState({ selectedTrainingMode: e.target });
    }

    if (e.target.name === "durationType") {
      this.setState({ selectedDurationType: e.target });
    }
    if (e.target.name === "programManager") {
      this.setState({ selectedProgramManager: e.target });
    }
    if (e.target.name === "lob") {
      this.setState({ selectedLOB: e.target });
    }
    if (e.target.name === "skills") {
      this.setState({ smesListOption: [] }, () => {
        const { smesList } = this.state;
        console.log('-----skill changes----')
        const TemSme = [];
        const onchangeSkill = e.target.value;
        smesList.forEach((list, index) => {
          const Indexkill = list.skillsId.filter((element) =>
            onchangeSkill.includes(element)
          );
          if (Indexkill.length > 0) {
            TemSme.push({
              value: list.id,
              id: list.id,
              label: list.label.concat("-").concat(list.skill),
            });
          }
        });

        this.setState({ smesListOption: TemSme });
      });
    }
    this.inputFieldChange(e);
  };

  getSteps = () => [
    "Registration",
    "Candidate Registration",
    "Batch Creation",
    "Curriculum",
    "Training Execution"
  ];

  handleStep = (index) => {
    this.setState({
      activeStep: index,
      batchDetailsList: [],
      eventSelected: null,
    });
  };

  handleNext = async () => {
    if (this.state.activeStep === 0) {
      this.submitForm();
    } else if (this.state.activeStep === 1) {
      await this.candidateRegRef.current.submitForm().then((res) => {
        if (res === 200) {
          this.setState((prev) => ({
            activeStep: prev.activeStep + 1,
            CRFormIsValid: false,
            batchDetailsList: [],
            eventSelected: null,
          }));
        }
      });
    } else if (this.state.activeStep === 2) {
      await this.batchFormationRef.current.insertCandidates().then((res) => {
        if (res === 200) {
          this.setState((prev) => ({
            activeStep: prev.activeStep + 1,
            CRFormIsValid: false,
            batchDetailsList: [],
            eventSelected: null,
          }));
        }
      });
    } else if (this.state.activeStep === 3) {
      this.curriculumRef.current.handleClickOpen();
    } else if (this.state.activeStep === 4) {
      this.trainingCompletedRef.current.handleSubmit();
    }
    else if (this.state.activeStep < 4) {
      this.setState((prev) => ({
        activeStep: prev.activeStep + 1,
        CRFormIsValid: false,
        batchDetailsList: [],
        eventSelected: null,
      }));
    }
  };

  handleBack = async () => {
    this.setState((prev) => ({
      activeStep: prev.activeStep - 1,
      CRFormIsValid: false,
      batchDetailsList: [],
      eventSelected: null,
    }));
  };

  onChangeTraining = (eventSelected) => {
    this.setState({
      eventSelected: eventSelected.target,
      batchDetailsList: [],
      batchSelected: null,
      candidateList: [],
    });
    this.getBatchList(eventSelected.target.value);
  };

  getBatchList = (id) => {
    const reqObj = { training_id: id };
    this.props.getBatchList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const batchDetailsList = response.arrRes.map((list) => {
          return {
            value: list.batch_id,
            label: `${list.batch_name}: Count - ${list.batch_count}`,
            trID: list.training_id,
          };
        });
        this.setState({
          batchDetailsList,
          snackBarOpen: true,
          snackmsg: "Data loaded successfully",
          snackvariant: "success",
        });
      } else {
        this.setState({
          snackBarOpen: true,
          snackmsg: "Something went Wrong. Please try again later.",
          snackvariant: "error",
        });
      }
    });
  };

  showCandidateUpload = () => {
    this.setState({ showCandidateUpload: true });
  };

  handleCandidateUploadClose = () => {
    this.setState({ showCandidateUpload: false });
  };

  onBatchChange = (batchSelected) => {
    this.setState({ batchSelected: batchSelected.target });
  };

  checkAllFieldsValid = (CRFormIsValid) => {
    this.setState({ CRFormIsValid });
  };
  checkAllFieldsValidBF = (BFFormIsValid) => {
    this.setState({ BFFormIsValid });
  };
  checkAllFieldsValidCF = (CFFormIsValid) => {
    this.setState({ CFFormIsValid });
  };
  // checkAllFieldsValidTP = (TPFormIsValid) => {
  //   this.setState({ TPFormIsValid });
  // };
  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  };

  render() {
    const { classes } = this.props;
    const {
      skillList,
      isEditMode,
      activeStep,
      showCandidateUpload,
      CRFormIsValid,
      selectedProgramManager,
      selectedTrainingType,
      selectedTrainingMode,
      selectedDurationType,
      selectedLocation,
      locationList,
      programManagerList,
      accountList,
      trainingTypeList,
      formValues,
      smesListOption,
      snackBarOpen,
      snackmsg,
      snackvariant,
      editTrainingId,
      formIsValid,
      lobList,
      selectedLOB,
      BFFormIsValid,
      CFFormIsValid,
      // TPFormIsValid
    } = this.state;
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
    // if(activeStep === 4){
    //   disableSubmitBtn = !TPFormIsValid;
    // }

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
        {activeStep === 0 && (
          <Grid container spacing={3} className={classes.gridRoot}>
            <Grid item xs={12} sm={6}>
              <div>
                <Textbox
                  value={formValues.trainingName.value}
                  fieldLabel="Training Name"
                  id="trainingName"
                  type="text"
                  placeholder="Training Name"
                  errorMessage={
                    this.state.errors.trainingName === ""
                      ? null
                      : this.state.errors.trainingName
                  }
                  name="trainingName"
                  onChange={this.inputFieldChange}
                />
                <Textbox
                  value={formValues.texTrainingID.value}
                  fieldLabel="TEX Training ID"
                  id="texTrainingID"
                  type="text"
                  placeholder="TEX Training ID"
                  errorMessage={
                    this.state.errors.texTrainingID === ""
                      ? null
                      : this.state.errors.texTrainingID
                  }
                  name="texTrainingID"
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
                  errorMessage={
                    this.state.errors.trainingType === ""
                      ? null
                      : this.state.errors.trainingType
                  }
                />
                <SelectOne
                  fieldLabel="Mode of Training"
                  id="trainingMode"
                  name="trainingMode"
                  placeholder="Mode of Training"
                  value={selectedTrainingMode}
                  options={trainingModeList}
                  onChange={this.selectFieldChange}
                  errorMessage={
                    this.state.errors.trainingMode === ""
                      ? null
                      : this.state.errors.trainingMode
                  }
                />
                <SelectOne
                  fieldLabel="Location"
                  id="location"
                  name="location"
                  placeholder="Location"
                  value={selectedLocation}
                  options={locationList}
                  onChange={this.selectFieldChange}
                  errorMessage={
                    this.state.errors.location === ""
                      ? null
                      : this.state.errors.location
                  }
                />
                <SelectOne
                  fieldLabel="Duration Type"
                  id="durationType"
                  name="durationType"
                  placeholder="Duration Type"
                  value={selectedDurationType}
                  options={durationTypeList}
                  onChange={this.selectFieldChange}
                  errorMessage={
                    this.state.errors.durationType === ""
                      ? null
                      : this.state.errors.durationType
                  }
                />
                <Textbox
                  fieldLabel="Duration"
                  value={formValues.duration.value}
                  id="duration"
                  type="number"
                  isDisabled={selectedDurationType === null}
                  placeholder="Duration"
                  errorMessage={
                    this.state.errors.duration === ""
                      ? null
                      : this.state.errors.duration
                  }
                  name="duration"
                  onChange={this.inputFieldChange}
                />
                <SelectOne
                  fieldLabel="Account"
                  id="account"
                  name="account"
                  isMulti={true}
                  value={formValues.account && formValues.account.value}
                  // value={selectedAccount}
                  placeholder="Account"
                  options={accountList}
                  onChange={this.selectFieldChange}
                  errorMessage={
                    this.state.errors.account === ""
                      ? null
                      : this.state.errors.account
                  }
                />
                <SelectOne
                  fieldLabel="LOB"
                  id="lob"
                  name="lob"
                  placeholder="LOB"
                  value={selectedLOB}
                  options={lobList}
                  onChange={this.selectFieldChange}
                  errorMessage={
                    this.state.errors.lob === ""
                      ? null
                      : this.state.errors.lob
                  }
                />
                <Textbox
                  fieldLabel="Candidates Count"
                  value={formValues.count.value}
                  id="count"
                  type="number"
                  placeholder="Count"
                  errorMessage={
                    this.state.errors.count === ""
                      ? null
                      : this.state.errors.count
                  }
                  name="count"
                  onChange={this.inputFieldChange}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>

              <Textbox
                fieldLabel="Requested By"
                value={formValues.requestBy.value}
                id="requestBy"
                type="text"
                placeholder="Requested By"
                errorMessage={
                  this.state.errors.requestBy === ""
                    ? null
                    : this.state.errors.requestBy
                }
                name="requestBy"
                onChange={this.inputFieldChange}
              />
              <Textbox
                fieldLabel="Requested By SAP ID"
                value={formValues.requestBySapid.value}
                id="requestBySapid"
                type="text"
                placeholder="Requested By SAP ID"
                errorMessage={
                  this.state.errors.requestBySapid === ""
                    ? null
                    : this.state.errors.requestBySapid
                }
                name="requestBySapid"
                onChange={this.inputFieldChange}
              />
              <SelectOne
                fieldLabel="Program Manager"
                id="programManager"
                name="programManager"
                placeholder="Program Manager"
                value={selectedProgramManager}
                options={programManagerList}
                onChange={this.selectFieldChange}
                errorMessage={
                  this.state.errors.programManager === ""
                    ? null
                    : this.state.errors.programManager
                }
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
                errorMessage={
                  this.state.errors.skills === ""
                    ? null
                    : this.state.errors.skills
                }
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
                errorMessage={
                  this.state.errors.assignSME === ""
                    ? null
                    : this.state.errors.assignSME
                }
              />
              <DateTimePicker
                fieldLabel="Planned Start Date"
                value={formValues.plannedStDate.value}
                name="plannedStDate"
                minDate={new Date()}
                disabled={isEditMode}
                onChange={this.inputFieldChange}
              />
              <DateTimePicker
                value={formValues.plannedEndDate.value}
                fieldLabel="Planned End Date"
                name="plannedEndDate"
                disabled={
                  isEditMode ||
                  formValues.plannedStDate.value === "" ||
                  formValues.plannedStDate.value === null
                }
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
                disabled={
                  formValues.actualStDate.value === "" ||
                  formValues.plannedStDate.value === null
                }
                minDate={formValues.actualStDate.value}
                onChange={this.inputFieldChange}
              />
            </Grid>
          </Grid>
        )}
        {activeStep === 1 && (
          <Fragment>
            <div style={{ float: "right" }}>
              <Button
                variant="contained"
                onClick={this.showCandidateUpload}
                color="primary"
              >
                Candidate Upload
              </Button>
            </div>
            <Dialog
              fullScreen
              open={showCandidateUpload}
              onClose={this.handleCandidateUploadClose}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={this.handleCandidateUploadClose}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>
                    Candidate Upload
                  </Typography>
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
        )}
        {activeStep === 2 && (
          <Grid container spacing={3} className={classes.gridRoot}>
            <BatchFormation
              getTrainingList={this.props.getTrainingList}
              getBatchList={this.props.getBatchList}
              getMentorList={this.props.getMentorList}
              addBatchName={this.props.addBatchName}
              getCandidateMapList={this.props.getCandidateMapList}
              insertCandidateBatchMap={this.props.insertCandidateBatchMap}
              ref={this.batchFormationRef}
              checkAllFieldsValidBF={this.checkAllFieldsValidBF}
            />
          </Grid>
        )}

        {activeStep === 3 && (
          <Grid container spacing={3} className={classes.gridRoot}>
            <Curriculum
              ref={this.curriculumRef}
              getTrainingList={this.props.getTrainingList}
              getTopicList={this.props.getTopicList}
              submitCurriculum={this.props.submitCurriculum}
              checkAllFieldsValidCF={this.checkAllFieldsValidCF}
            />
          </Grid>
        )}
        {activeStep === 4 && (
          <Grid container spacing={3} className={classes.gridRoot}>
            <TrainingProgressDetails
              ref={this.trainingCompletedRef}
              getTrainingList={this.props.getTrainingList}
              onChangeTraining={this.props.onChangeTraining}
              onChangeSkill={this.props.onChangeSkill}
              dayOnChange={this.props.dayOnChange}
              searchCurriculum={this.props.searchCurriculum}
              getCurriculumBySkill={this.props.getCurriculumBySkill}
              trainingListDetails={this.props.trainingListDetails}
              getSmeCoveredList={this.props.getSmeCoveredList}
              insertCurriculamData={this.props.insertCurriculamData}
            // checkAllFieldsValidTP={this.checkAllFieldsValidTP}
            />
          </Grid>
        )}
        <div className={classes.bottomBtn}>
          <Button
            variant="contained"
            onClick={this.handleBack}
            disabled={activeStep === 0}
            style={{ margin: 2 }}
          >
            Back
          </Button>
          {editTrainingId && editTrainingId > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              style={{ margin: 2 }}
              disabled={disableSubmitBtn}
            >
              Update
            </Button>
          )}
          {!editTrainingId && (
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              style={{ margin: 2 }}
              disabled={disableSubmitBtn}
            >
              Submit
            </Button>
          )}
        </div>
        {snackBarOpen && (
          <SnackBar
            snackBarOpen={snackBarOpen}
            snackmsg={snackmsg}
            snackvariant={snackvariant}
            onCloseSnackBar={this.onCloseSnackBar}
          />
        )}
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TrainingCreation);
