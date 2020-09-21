import React from 'react';

//import Select from 'react-select';
// import { Modal, FormControl, InputGroup, Row, Col, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import moment from 'moment';
import '../scss/CreateCandidate.scss';
import { Paper, Grid, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent, Button, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from "@material-ui/core/MenuItem";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Input from "@material-ui/core/Input";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Modal, Toast } from 'react-bootstrap';



const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    gridAlign: {
        padding: "5px 50px 20px 40px !important"
    },
    heading: {
        padding: "25px 0px 0px 38px"
    },
    headingDivide: {
        width: "95%"
    },
    MuiOutlinedInputInput: {
        padding: "11.5px 14px !important"
    }
});

class CreateCandidate extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {
            userId: "",
            username: "",
            contact: "",
            email: "",
            skills: [],
            location: [],
            recruiter: [],
            source: [],
            spoc: [],
            te: "",
            re: "",
            listCompany: [],
            secSkills: [],
            priSkills: [],
            addskills: "",
            showToast: false,
            toastMsg: null,
            selectedSkillId: "",
            selectedAddSkillId: "",
            selectedLocationId: "",
            selectedPrefLocationId: [],
            selectedrecruiter: "",
            selectedSourceId: "",
            selectedSpocId: "",
            selectedOption: "",
            testCompletedDate: "",
            hrScore: "",
            hraRemarks: "",
            testRecieved: "",
            isHanRankerTest: false,
            hrtestValue: "",
            selectedCompanyId: "",
            selectedNPId: "",
            selectedPriority: "",
            priorityData: "",
            actualData: [],
            remarks: "",
            noticePeriod: [],
            hratest: "",
        };
        this.np = [
            { 'label': '30 days', 'value': '30' },
            { 'label': '60 days', 'value': '60' },
            { 'label': '90 days', 'value': '90' },
            { 'label': 'Can join immediately', 'value': '15' }
        ];
        this.priorityList = [
            { label: "High", 'id': '1' },
            { label: "Low", 'id': '2' },
            { label: "Critical", 'id': '3' }
        ];
        // this.baseState = this.state 
    }
    componentWillMount() {
        if (this.props.location.data && this.props.location.data != '') {

            const primary_skill = this.props.location.data.primary_skills.map(d => ({
                "value": d.id,
                "label": d.name

            }))
            this.setState({ selectedSkillId: primary_skill[0] });

            const secondary_skill = this.props.location.data.secondary_skills.map(d => ({
                "value": d.id,
                "label": d.name

            }))

            const SecondarykillId = secondary_skill.map((data, i) => {
                return data.value
            });

            const SecondarykillIds = SecondarykillId.toString();
            this.setState({ selectedAddSkillId: SecondarykillIds });

            const currentCompany = this.props.location.data.current_company.map(d => ({
                "value": d.id,
                "label": d.name

            }))

            const currentLocation = this.props.location.data.current_location.map(d => ({
                "value": d.id,
                "label": d.name
            }))

            const preferredLocation = this.props.location.data.preferred_location.map(d => ({
                "value": d.id,
                "label": d.name
            }))
            let PreferredLocationId = preferredLocation.map((data, i) => {
                return data.value
            });
            let PreferredLocationIds = PreferredLocationId.toString();
            this.setState({
                selectedPrefLocationId: PreferredLocationIds
            });

            const candidateSource = this.props.location.data.source.map(d => ({
                "value": d.id,
                "label": d.name
            }))

            const candidateRecruiter = this.props.location.data.recruiter.map(d => ({
                "value": d.id,
                "label": d.name
            }))

            const Dna_spoc = this.props.location.data.spoc.map(d => ({
                "value": d.id,
                "label": d.name

            }))

            this.props.location.data.hr_test_taken === '0' ? this.setState({ isHanRankerTest: true, hratest: "0", hrtestValue: "Yes" }) : this.setState({ isHanRankerTest: false, hratest: "0", hrtestValue: "No" })

            const candidateId = this.props.location.data.candidate_id;
            const candidateName = this.props.location.data.candidate_name;
            const candidateContact = this.props.location.data.contact;
            const candidateEmail = this.props.location.data.email_id;
            const candidateRemarks = this.props.location.data.remarks;
            const totalExperience = this.props.location.data.total_experience;
            const relevantExperience = this.props.location.data.relevant_experience;
            const testCompleteddt = this.props.location.data.test_completed_dt;
            const testShareddt = this.props.location.data.testlink_received_dt;
            const candidatehrScore = this.props.location.data.hr_score;
            const candidatehrRemarks = this.props.location.data.hr_remarks;
            const shareddate = moment(testCompleteddt).format("YYYY-MM-DD");
            const completedDate = moment(testCompleteddt).format("YYYY-MM-DD");
            const noticePeriod = [{ 'value': '', 'label': this.props.location.data.notice_period + " days" }];
            const candidatePriority = [{ 'id': '', 'label': this.props.location.data.priority }];

            this.setState({
                userId: candidateId,
                username: candidateName,
                contact: candidateContact,
                email: candidateEmail,
                te: totalExperience,
                re: relevantExperience,
                priSkills: primary_skill,
                secSkills: secondary_skill,
                selectedCompanyId: currentCompany[0],
                selectedLocationId: currentLocation[0],
                location: preferredLocation,
                testCompletedDate: completedDate,
                testRecieved: shareddate,
                hrScore: candidatehrScore,
                hraRemarks: candidatehrRemarks,
                selectedSourceId: candidateSource[0],
                selectedSpocId: Dna_spoc[0],
                selectedrecruiter: candidateRecruiter[0],
                selectedNPId: noticePeriod[0],
                selectedPriority: candidatePriority[0],
                remarks: candidateRemarks,

            })
        }
    }


    candidateName = e => {
        this.setState({ username: e.target.value })
    }
    selectTestDate = e => {
        this.setState({ testCompletedDate: e.target.value })
    }
    HackerRankScore = e => {
        this.setState({ hrScore: e.target.value })
    }
    hrRemarks = e => {
        this.setState({ hraRemarks: e.target.value })
    }
    selectTestRecieved = e => {
        this.setState({ testRecieved: e.target.value })
    }
    candidateContact = e => {
        this.setState({ contact: e.target.value })
    }
    candidateEmail = e => {
        this.setState({ email: e.target.value })
    }
    onChangeValue(event) {
        event.target.value === '0' ? this.setState({ isHanRankerTest: true, hratest: "0" }) : this.setState({ isHanRankerTest: false, hratest: "1" })
    }
    handleOptionChange = (changeEvent) => {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    }
    getPrimarySkills = () => {
        this.props.getPrimarySkillsReport().then((res) => {
            if (res && res.errCode === 200) {

                const options = res.arrRes.map(d => ({
                    "value": d.skill_id,
                    "label": d.skill_name

                }))
                this.setState({
                    skills: options
                })
            }

        })
    }
    getCompanyLists = () => {
        this.props.getCompanyLists().then((res) => {
            if (res && res.errCode === 200) {
                const options = res.arrRes.map(d => ({
                    "value": d.company_id,
                    "label": d.company_name

                }))
                this.setState({
                    listCompany: options
                })
            }

        })
    }
    getListLocation = () => {
        this.props.getListLocation().then((res) => {
            if (res && res.errCode === 200) {
                const options = res.arrRes.map(d => ({
                    "value": d.location_id,
                    "label": d.location_name

                }))
                this.setState({
                    location: options
                })
            }
        })
    }
    getListRecruiter = () => {
        this.props.getListRecruiter().then((res) => {
            if (res && res.errCode === 200) {
                const options = res.arrRes.map(d => ({
                    "value": d.recruiter_id,
                    "label": d.recruiter_name

                }))
                this.setState({
                    recruiter: options
                })

            }
        })
    }
    getListSource = () => {
        this.props.getListSource().then((res) => {
            if (res && res.errCode === 200) {
                const options = res.arrRes.map(d => ({
                    "value": d.source_id,
                    "label": d.source_name

                }))
                this.setState({
                    source: options
                })
            }
        })
    }

    getListSpoc = () => {
        this.props.getListSpoc().then((res) => {
            if (res && res.errCode === 200) {
                const options = res.arrRes.map(d => ({
                    "value": d.spoc_id,
                    "label": d.spoc_name

                }))
                this.setState({
                    spoc: options
                })
            }
        })
    }

    selectSecondarySkill = (e, values) => {

        let skillIds = values.map((data, i) => {
            return data.value
        });
        let SecondarySkillIds = skillIds.toString();
        this.setState({
            selectedAddSkillId: values
        });
    }
    totalExperience = e => {
        this.setState({ te: e.target.value })
    }

    relevantExperience = e => {
        this.setState({ re: e.target.value })
    }

    selectNP = (e, value) => {
        this.setState({ selectedNPId: value })
    }
    selectCompany = (e, value) => {
        this.setState({ selectedCompanyId: value })
    }
    selectSkill = (e, value) => {
        this.setState({ selectedSkillId: value })
    }
    selectLocation = (e, value) => {
        this.setState({ selectedLocationId: value })
    }
    selectPrefLocation = (e, values) => {
        let selectPreferredLocation = values.map((data, i) => {
            return data.value
        });
        let preferredLocation = selectPreferredLocation.toString();
        this.setState({ selectedPrefLocationId: preferredLocation })
    }
    selectRecruiter = (e, value) => {
        this.setState({ selectedrecruiter: value })
    }
    selectSource = (e, value) => {
        this.setState({ selectedSourceId: value })
    }
    selectSpoc = (e, value) => {
        this.setState({ selectedSpocId: value })
    }
    selectPriority = (e, value) => {
        this.setState({ selectedPriority: value })
    }
    selectRemarks = e => {
        this.setState({ remarks: e.target.value })
    }

    handleSubmit(event) {

        event.preventDefault();
        let dateTime = new Date(this.state.testCompletedDate);
        let selectTestCompletedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        let CandidatetestRecieved = new Date(this.state.testCompletedDate);
        let selectTestRecievedDate = moment(CandidatetestRecieved).format("YYYY-MM-DD HH:mm:ss");


        let priorName = this.state.selectedPriority;
        let priorValue = priorName.label.toString();

        let recruitersId = this.state.selectedrecruiter;
        let selectedRecruiterId = recruitersId.value.toString();

        let sourceId = this.state.selectedSourceId;
        let CandidateSelectedsrec = sourceId.value.toString();

        let SelectedspocId = this.state.selectedSpocId;
        let candidateSpocId = SelectedspocId.value.toString();

        let SelectedNoticePeriod = this.state.selectedNPId;
        let candidateNoticePeriod = SelectedNoticePeriod.label.toString();

        let candidateCompanyId = this.state.selectedCompanyId;
        let candidateCompany = candidateCompanyId.value.toString();

        let candidateCurrentLocation = this.state.selectedLocationId;
        let candidateCL = candidateCurrentLocation.value.toString();

        let candidatePrimarySkill = this.state.selectedSkillId;
        let candidatePrimarySkillId = candidatePrimarySkill.value.toString();

        const reqObj = {
            "candidate_name": this.state.username,
            "contact": this.state.contact,
            "email_id": this.state.email,
            "priority": priorValue,
            "total_experience": this.state.te,
            "relevant_experience": this.state.re,
            "current_company": candidateCompany,
            "notice_period": candidateNoticePeriod,
            "current_location": candidateCL,
            "preferred_location": this.state.selectedPrefLocationId,
            "hr_test_taken": this.state.hratest,
            "testlink_received_dt": selectTestRecievedDate,
            "test_completed_dt": selectTestCompletedDate,
            "hr_score": this.state.hrScore,
            "hr_remarks": this.state.hraRemarks,
            "source": CandidateSelectedsrec,
            "spoc": candidateSpocId,
            "recruiter": selectedRecruiterId,
            "primary_skill": candidatePrimarySkillId,
            "secondary_skill": this.state.selectedAddSkillId,
            "remarks": this.state.remarks,
            "created_by": "1",
            "created_date": "",
            "updated_by": "",
            "updated_date": "",

        }

        const prepopulatedData = {
            "id": this.state.userId,
            "candidate_name": this.state.username,
            "contact": this.state.contact,
            "email_id": this.state.email,
            "priority": priorValue,
            "total_experience": this.state.te,
            "relevant_experience": this.state.re,
            "current_company": candidateCompany,
            "notice_period": candidateNoticePeriod,
            "current_location": candidateCL,
            "preferred_location": this.state.selectedPrefLocationId,
            "hr_test_taken": this.state.hratest,
            "testlink_received_dt": selectTestRecievedDate,
            "test_completed_dt": selectTestCompletedDate,
            "hr_score": this.state.hrScore,
            "hr_remarks": this.state.hraRemarks,
            "source": CandidateSelectedsrec,
            "spoc": candidateSpocId,
            "recruiter": selectedRecruiterId,
            "primary_skill": candidatePrimarySkillId,
            "secondary_skill": this.state.selectedAddSkillId,
            "remarks": this.state.remarks,
            "created_by": "1",
            "created_date": "",
            "updated_by": "1",
            "updated_date": "",
            // ...reqObj
        }

        if (this.props.location.data && this.props.location.data != '') {
            this.props.updateCandidateForm(prepopulatedData).then((res) => {
                if (res && res.errCode === 201) {
                    this.setState({ showToast: true, toastMsg: 'Candidate Successfully Updated!' });
                } else if (res && res.errCode === 404) {
                    alert(res.status)
                    this.setState({ showToast: true, toastMsg: res.status });
                }
            })
        } else {
            this.props.createCandidateForm(reqObj).then((res) => {
                if (res && res.errCode === 201) {
                    this.setState({ showToast: true, toastMsg: 'Candidate Successfully Added!' });
                } else if (res && res.errCode === 404) {
                    alert(res.status)
                    this.setState({ showToast: true, toastMsg: res.status });
                }
            })
        }
    }

    componentDidMount() {
        this.getPrimarySkills()
        this.getListLocation();
        this.getListRecruiter();
        this.getListSource();
        this.getListSpoc();
        this.getCompanyLists();

    }

    render() {
        const { classes, candidateDetails } = this.props;
        const { data } = this.props.location;

        const {
            showToast,
            toastMsg,
            selectedOption,
            isHanRankerTest,
            skills,
            listCompany,
            location,
            np,
            source,
            spoc,
            recruiter,
            priority
        } = this.state;

        return (
            <div className={classes.root}>

                <h5 className={classes.heading}>Create Candidate</h5>
                <hr className={classes.headingDivide} ref={form => this.form = form}></hr>
                <form
                    className={classes.container}
                    onSubmit={this.handleSubmit.bind(this)}
                    autoComplete="off"
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.gridAlign} >
                            <TextField
                                type="CandidateName"
                                name="username"
                                required
                                variant="outlined"
                                margin="dense"
                                label="Candidate Name"
                                // style={{ margin: 8 }}
                                placeholder="Candidate Name"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ style: { height: 5 } }}
                                defaultValue={this.state.username}
                                onChange={this.candidateName}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <TextField
                                type="number"
                                name="contact"
                                variant="outlined"
                                margin="dense"
                                label="Contact"
                                // style={{ margin: 8 }}
                                placeholder="Contact"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ style: { height: 5 } }}
                                defaultValue={this.state.contact}
                                onChange={this.candidateContact}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <TextField
                                type="email"
                                name="email"
                                variant="outlined"
                                margin="dense"
                                id="formHorizontalEmail"
                                label="Email"
                                placeholder="Email"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ style: { height: 5 } }}
                                defaultValue={this.state.email}
                                onChange={this.candidateEmail}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <Autocomplete
                                options={skills}
                                getOptionLabel={option => option.label}
                                defaultValue={this.state.priSkills[0]}

                                onChange={this.selectSkill}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label={"Primary Skills"}
                                        placeholder="Select"
                                        margin="dense"
                                        fullWidth
                                        margin="dense"
                                        variant="outlined"
                                        required
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    multiple
                                    options={skills}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.secSkills}
                                    onChange={this.selectSecondarySkill}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label={"Secondary Skills"}
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <TextField
                                type="number"
                                name="te"
                                variant="outlined"
                                margin="dense"
                                label="Total Experience"
                                // style={{ margin: 8 }}
                                placeholder="Total Experience"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ style: { height: 5 } }}
                                defaultValue={this.state.te}
                                onChange={this.totalExperience}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <TextField
                                type="number"
                                name="re"
                                variant="outlined"
                                margin="dense"
                                label="Relevant Experience"
                                placeholder="Relevant Experience"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ style: { height: 5 } }}
                                defaultValue={this.state.re}
                                onChange={this.relevantExperience}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={listCompany}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedCompanyId}
                                    onChange={this.selectCompany}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Current Company"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={location}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedLocationId}
                                    onChange={this.selectLocation}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Current Location"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    multiple
                                    options={location}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.location}
                                    onChange={this.selectPrefLocation}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Preferred Location"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={this.np}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedNPId}

                                    onChange={this.selectNP}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label={"Notice period"}
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <FormLabel component="legend" >Hacker rank test taken
                                <RadioGroup row aria-label="position" name="position" onChange={this.onChangeValue} defaultValue={this.state.hratest}>
                                    <FormControlLabel
                                        // defaultValue={this.state.isHanRankerTest}
                                        value="0"
                                        control={<Radio color="primary" />}
                                        label="Yes"
                                        labelPlacement="Yes"
                                    />
                                    <FormControlLabel
                                        defaultValue={this.state.isHanRankerTest}
                                        value="1"
                                        control={<Radio color="primary" />}
                                        label="No"
                                        labelPlacement="No"
                                    />
                                </RadioGroup>
                            </FormLabel>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={source}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedSourceId}
                                    onChange={this.selectSource}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Source"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </Grid>


                        {isHanRankerTest &&
                            <Grid container spacing={3}>
                                <Grid item xs={6} className={classes.gridAlign}>
                                    <div>
                                        <TextField
                                            id="date"
                                            variant="outlined"
                                            margin="dense"
                                            label="Test Completed Date"
                                            style={{ margin: 8 }}
                                            placeholder="Test Completed Date"
                                            fullWidth
                                            type="date"
                                            name="TestCompletedDate"
                                            defaultValue={this.state.testCompletedDate}
                                            className={classes.textField}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={this.selectTestDate}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6} className={classes.gridAlign}>
                                    <div>
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            margin="dense"
                                            label="Hacker Rank Score"
                                            style={{ margin: 8 }}
                                            placeholder="Hacker Rank Score"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ style: { height: 5 } }}
                                            defaultValue={this.state.hrScore}
                                            onChange={this.HackerRankScore}
                                            required={true}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6} className={classes.gridAlign}>
                                    <div>
                                        <TextField
                                            type="text"
                                            variant="outlined"
                                            margin="dense"
                                            label="Hacker Rank Remarks"
                                            style={{ margin: 8 }}
                                            placeholder="Hacker Rank Remarks"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            inputProps={{ style: { height: 5 } }}
                                            defaultValue={this.state.hraRemarks}
                                            onChange={this.hrRemarks}
                                            required={true}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={6} className={classes.gridAlign}>
                                    <div>
                                        <TextField
                                            id="date"
                                            variant="outlined"
                                            margin="dense"
                                            label="Test shared Date"
                                            style={{ margin: 8 }}
                                            placeholder="Test shared Date"
                                            fullWidth
                                            type="date"
                                            name="TestSahreddDate"
                                            defaultValue={this.state.testRecieved}
                                            className={classes.textField}
                                            InputLabelProps={{ shrink: true }}
                                            onChange={this.selectTestRecieved}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        }
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={spoc}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedSpocId}
                                    onChange={this.selectSpoc}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="D&A Spoc"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={recruiter}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedrecruiter}

                                    onChange={this.selectRecruiter}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label={"Recruiter"}
                                            placeholder="Select"
                                            margin="dense"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                                {/* <Autocomplete
                                    options={recruiter}
                                    getOptionLabel={option => option.label}
                                    defaultValue={recruiter[0]}
                                    onChange={this.selectRecruiter}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Recruiter"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                /> */}
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={this.priorityList}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.selectedPriority}
                                    onChange={this.selectPriority}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Priority"
                                            placeholder="Select"
                                            margin="normal"
                                            fullWidth
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign} >
                            <TextField
                                type="text"
                                name="remarks"
                                variant="outlined"
                                margin="dense"
                                label="Remarks"
                                placeholder="Enter Remarks"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ style: { height: 5 } }}
                                defaultValue={this.state.remarks}
                                candidateRemarks
                                onChange={this.selectRemarks}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={6} className={classes.gridAlign}>
                        <Button variant="contained" color="primary" type="submit" >
                            Create
                        </Button>
                    </Grid>
                </form>
                {showToast &&
                    <Toast
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#deeddd',
                            border: '1px solid #28a745',
                            color: '#6c757d',
                            fontWeight: 500,
                            width: 400
                        }}
                        onClose={() => this.setState({ showToast: false })}
                        show={showToast}
                        delay={3000}
                        autohide
                    >
                        <Toast.Body>{toastMsg}</Toast.Body>
                    </Toast>
                }
            </div>

        )
    }
}

export default withStyles(styles, { withTheme: true })(CreateCandidate);