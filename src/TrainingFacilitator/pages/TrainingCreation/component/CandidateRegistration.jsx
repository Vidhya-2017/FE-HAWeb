import React, { Fragment } from 'react';
import {
    withStyles, Grid
} from '@material-ui/core';
import moment from 'moment';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';


const styles = (theme) => ({
    paperRoot: {
        width: '70%',
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
});

const months = [{ value: 'January', label: 'January' }, { value: 'February', label: 'February' }, { value: 'March', label: 'March' }, { value: 'April', label: 'April' }, { value: 'May', label: 'May' }, { value: 'June', label: 'June' }, { value: 'July', label: 'July' }, { value: 'August', label: 'August' }, { value: 'September', label: 'September' }, { value: 'October', label: 'October' }, { value: 'November', label: 'November' }, { value: 'December', label: 'December' }]

const inputField = {
    value: '',
    validation: {
        required: true
    },
    valid: false
};

const candidateRegForm = {
    trainingid: { ...inputField },
    sapid: { ...inputField },
    firstname: { ...inputField },
    lastname: { ...inputField },
    email: { ...inputField },
    phoneno: { ...inputField },
    location: { ...inputField },
    lob: { ...inputField },
    account: { ...inputField },
    expectedjoiningdate: { ...inputField },
    joiningmonth: { ...inputField },
}

class CandidateRegistration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formValues: { ...candidateRegForm },
            showToast: false,
            toastMsg: '',
            errors: {},
            trainingList: [],
            locationList: [],
            lobList: [],
            accountList: [],
            selectedTraining: null,
            selectedLocation: null,
            selectedLob: null,
            selectedAccount: null,
            selectedMonth: null,
            formIsValid: false,
            formDisable: false,
            snackBarOpen: false,
            snackmsg: '',
            snackvariant:'',
        }
    }

    componentDidMount() {
        this.getLocation();
        this.getLob();
        this.getAccount();
        this.getTrainingList();
    }

    getTrainingList = () => {
        this.props.getTrainingList().then(response => {
            if (response && response.arrRes) {
                const trainingList = response.arrRes.map(list => {
                    return {
                        value: list.id,
                        id: list.id,
                        label: list.training_name,
                        trainingType: list.training_type
                    }
                });
                this.setState({ trainingList,
                    snackBarOpen: true,
                    snackmsg: "Data loaded successfully",
                    snackvariant:"success" });
            } else {
                this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant:"error" })
            }
        })
    }

    getAccount = () => {
        this.props.getAccount().then(response => {
            if (response && response.arrRes) {
                const accountList = response.arrRes.map(list => {
                    return {
                        value: list.id,
                        id: list.id,
                        label: list.account_name
                    }
                });
                this.setState({ accountList,
                    snackBarOpen: true,
                    snackmsg: "Data loaded successfully",
                    snackvariant:"success" });
            } else {
                this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant:"error"})
            }
        })
    }

    getLocation = () => {
        this.props.getLocation().then(response => {
            if (response && response.arrRes) {
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
                this.setState({snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant:"error"})
            }
        })
    }
    getLob = () => {
        this.props.getLobList().then((response) => {
            if (response && response.arrRes.length > 0) {
                const lobList = response.arrRes.map(list => {
                    return {
                        value: list.id,
                        LobId: list.id,
                        label: list.lob_name
                    }
                });
                this.setState({ lobList,
                    snackBarOpen: true,
                    snackmsg: "Data loaded successfully",
                    snackvariant:"success"  });
            } else {
                this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant:"error" })

            }
        });
    }



    inputFieldChange = (e) => {
        const targetName = e.target.name;
        const targetValue = e.target.value;

        console.log(targetValue);

        if (targetName === 'trainingid' && targetValue !== '') {
            this.setState({ formDisable: true });
        }

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
        this.props.checkAllFieldsValid(formIsValid);
        this.setState({ formValues: updatedRegForm, formIsValid });
        
    }

    checkValidity(inputValue, rules) {
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


    selectFieldChange = (e) => {
        if (e.target.name === 'location') {
            this.setState({ selectedLocation: e.target });
        }
        if (e.target.name === 'account') {
            this.setState({ selectedAccount: e.target });
        }
        if (e.target.name === 'lob') {
            this.setState({ selectedLob: e.target });
        }
        if (e.target.name === 'joiningmonth') {
            this.setState({ selectedMonth: e.target });
        }
        if (e.target.name === 'trainingid') {
            const { formValues } = this.state;
            const updatedRegForm = { ...formValues };
            if (e.target.trainingType !== '1') {
                updatedRegForm.expectedjoiningdate.valid = true;
                updatedRegForm.joiningmonth.valid = true;
            }
            else {
                updatedRegForm.expectedjoiningdate.valid = false;
                updatedRegForm.joiningmonth.valid = false;
            }
            this.setState({ formValues: updatedRegForm, selectedTraining: e.target });
        }
        this.inputFieldChange(e);
    }



    submitForm = (e) => {
        this.setState({ showToast: false })
        const formData = {};
        const { formValues } = this.state;
        const resetRegisterCandidate = {
            ...formValues
        };
        for (let inputIdentifier in resetRegisterCandidate) {
            formData[inputIdentifier] = resetRegisterCandidate[inputIdentifier].value;
        }
        let reqObj = {
            training_id: formData.trainingid,
            sap_id: formData.sapid,
            first_name: formData.firstname,
            last_name: formData.lastname,
            email: formData.email,
            phone_number: formData.phoneno,
            location_id: formData.location,
            lob_id: formData.lob,
            account_id: formData.account,
            created_by: 1,
        }
        if (this.state.selectedTraining.trainingType === '1') {
            reqObj = {
                ...reqObj,
                joining_month: formData.joiningmonth,
                expected_joining_date: moment(formData.expectedjoiningdate).format("YYYY-MM-DD")
            }
        } else {
            reqObj = {
                ...reqObj,
                joining_month: '',
                expected_joining_date: ''
            }
        }
        return this.props.insertCandidate(reqObj).then(response => {
            let snackmsg = '';
            let snackvariant = '';
          if (response && response.errCode === 200) {
            snackmsg = 'Inserted Successfully.';
            snackvariant= 'success';
          } else if (response.errCode === 404 && response.status === 'Email Id already exists') {
            snackmsg = 'Email Id already exists.';
            snackvariant= 'error';
          } else {
            snackmsg = 'Something went Wrong. Please try again later.';
            snackvariant= 'error';
          }
          this.setState({
            snackBarOpen: true,
            snackmsg,
            snackvariant,
            formValues: { ...candidateRegForm },
            selectedLocation: null,
            selectedLob: null,
            selectedAccount: null,
            selectedMonth: null,
            selectedTraining: null,
            formDisable: false
          });
          return response.errCode;
        })
    }
    onCloseSnackBar = () =>{
        this.setState({snackBarOpen:false});
    }

    render() {
        const { classes } = this.props
        const { trainingList, selectedTraining, locationList, selectedLocation, selectedLob, lobList, selectedAccount, accountList, selectedMonth, formValues, formDisable, snackBarOpen, snackmsg, snackvariant } = this.state;
        console.log(formValues);
        return (
            <Grid container spacing={3} className={classes.gridRoot}>
                <Grid item xs={12} sm={6}>
                    <div>
                        <SelectOne
                            fieldLabel="Training Name"
                            value={selectedTraining ? selectedTraining : null}
                            id="trainingid"
                            name="trainingid"
                            placeholder='Training Name'
                            options={trainingList}
                            onChange={this.selectFieldChange}
                            errorMessage={this.state.errors.trainingid === "" ? null : this.state.errors.trainingid}
                        />
                        <Textbox
                            value={formValues.sapid.value}
                            fieldLabel="SAP ID"
                            id="sapid"
                            type="number"
                            placeholder="SAP ID"
                            errorMessage={this.state.errors.sapid === "" ? null : this.state.errors.sapid}
                            name="sapid"
                            isDisabled={!formDisable}
                            onChange={this.inputFieldChange}
                        />
                        <Textbox
                            value={formValues.firstname.value}
                            fieldLabel="First Name"
                            id="firstname"
                            type="text"
                            placeholder="First Name"
                            errorMessage={this.state.errors.firstname === "" ? null : this.state.errors.firstname}
                            name="firstname"
                            isDisabled={!formDisable}
                            onChange={this.inputFieldChange}
                        />
                        <Textbox
                            value={formValues.lastname.value}
                            fieldLabel="Last Name"
                            id="lastname"
                            type="text"
                            placeholder="Last Name"
                            errorMessage={this.state.errors.lastname === "" ? null : this.state.errors.lastname}
                            name="lastname"
                            onChange={this.inputFieldChange}
                            isDisabled={!formDisable}
                        />
                        <Textbox
                            value={formValues.email.value}
                            fieldLabel="Email ID"
                            id="email"
                            type="email"
                            placeholder="Email ID"
                            errorMessage={this.state.errors.email === "" ? null : this.state.errors.email}
                            name="email"
                            onChange={this.inputFieldChange}
                            isDisabled={!formDisable}
                        />
                        <Textbox
                            value={formValues.phoneno.value}
                            fieldLabel="Mobile No"
                            id="phoneno"
                            type="number"
                            placeholder="Mobile No"
                            errorMessage={this.state.errors.phoneno === "" ? null : this.state.errors.phoneno}
                            name="phoneno"
                            onChange={this.inputFieldChange}
                            isDisabled={!formDisable}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>

                    <SelectOne
                        fieldLabel="Location"
                        id="location"
                        name="location"
                        placeholder="Location"
                        value={selectedLocation}
                        options={locationList}
                        onChange={this.selectFieldChange}
                        errorMessage={this.state.errors.location === "" ? null : this.state.errors.location}
                        isDisabled={!formDisable}
                    />

                    <SelectOne
                        fieldLabel="LOB"
                        value={selectedLob ? selectedLob : null}
                        id="lob"
                        name="lob"
                        placeholder='LOB'
                        options={lobList}
                        onChange={this.selectFieldChange}
                        errorMessage={this.state.errors.lob === "" ? null : this.state.errors.lob}
                        isDisabled={!formDisable}
                    />

                    <SelectOne
                        fieldLabel="Account"
                        value={selectedAccount ? selectedAccount : null}
                        id="account"
                        name="account"
                        placeholder='Account'
                        options={accountList}
                        onChange={this.selectFieldChange}
                        errorMessage={this.state.errors.account === "" ? null : this.state.errors.account}
                        isDisabled={!formDisable}
                    />

                    {selectedTraining && selectedTraining.trainingType === "1" && <Fragment>
                    <Grid container spacing={3} className={classes.gridRoot}>
                    <Grid item xs={12} sm={6}>
                        <div>
                        <DateTimePicker
                            value={formValues.expectedjoiningdate.value}
                            fieldLabel="Expected Joining Date"
                            maxDays={90}
                            minDate={new Date()}
                            name="expectedjoiningdate"
                            onChange={this.inputFieldChange}
                            disabled={!formDisable}
                        />
                        </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <div>
                        <SelectOne
                            fieldLabel="Joining Month"
                            value={selectedMonth ? selectedMonth : null}
                            id="joiningmonth"
                            name="joiningmonth"
                            placeholder='Joining Month'
                            options={months}
                            onChange={this.selectFieldChange}
                            errorMessage={this.state.errors.joiningmonth === "" ? null : this.state.errors.joiningmonth}
                            isDisabled={!formDisable}
                        />
                        </div>
                        </Grid>
                        </Grid>

                    </Fragment>}

                </Grid>
                {snackBarOpen && <SnackBar snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} onCloseSnackBar={this.onCloseSnackBar} />}
                {/* <Buttons
                    className="float-right"
                    value="Submit"
                    disabled={!formIsValid}
                    onClick={this.submitForm} /> */}
            </Grid>
        )
    }
}

export default (withStyles(styles, { withTheme: true })(CandidateRegistration));
