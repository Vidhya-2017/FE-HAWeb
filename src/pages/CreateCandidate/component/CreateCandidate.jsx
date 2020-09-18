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
            { label: "High", 'value': '1' },
            { label: "Low", 'value': '2' },
            { label: "Critical", 'value': '3' }
        ]
    }
    componentWillMount() {
        if (this.props.location.data && this.props.location.data != '') {
            const primary_skill = this.props.location.data.primary_skills.map(d => ({
                "value": d.id,
                "label": d.name

            }))
            let PrimaryskillId = primary_skill.map((data, i) => {
                return data.value
            });
            let PrimarySkillIds = PrimaryskillId.toString();
            this.setState({
                selectedSkillId: PrimarySkillIds
            });



            const secondary_skill = this.props.location.data.secondary_skills.map(d => ({
                "value": d.id,
                "label": d.name

            }))
            let SecondarykillId = secondary_skill.map((data, i) => {
                return data.value
            });
            let SecondarykillIds = SecondarykillId.toString();
            this.setState({
                selectedAddSkillId: SecondarykillIds
            });

            const currentCompany = this.props.location.data.current_company.map(d => ({
                "value": d.id,
                "label": d.name

            }))
            let CurrentCompanyId = currentCompany.map((data, i) => {
                return data.value
            });
            let CurrentCompanyIds = CurrentCompanyId.toString();
            this.setState({
                selectedCompanyId: CurrentCompanyIds
            });

            const currentLocation = this.props.location.data.current_location.map(d => ({
                "value": d.id,
                "label": d.name
            }))
            let CurrentLocationId = currentLocation.map((data, i) => {
                return data.value
            });
            let CurrentLocationIds = CurrentLocationId.toString();
            this.setState({
                selectedLocationId: CurrentLocationIds
            });

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
            let CandidateSourceId = candidateSource.map((data, i) => {
                return data.value
            });
            let CandidateSourceIds = CandidateSourceId.toString();
            this.setState({
                selectedSourceId: CandidateSourceIds
            });

            const candidateRecruiter = this.props.location.data.recruiter.map(d => ({
                "value": d.id,
                "label": d.name
            }))
            let recruiterId = candidateRecruiter.map((data, i) => {
                return data.value
            });
            let recruiterIds = recruiterId.toString();
            this.setState({
                selectedrecruiter: recruiterIds
            });


            const Dna_spoc = this.props.location.data.spoc.map(d => ({
                "value": d.id,
                "label": d.name

            }))


            let spocId = Dna_spoc.map((data, i) => {
                return data.value
            });
            let spocIds = spocId.toString();
            this.setState({
                selectedSpocId: spocIds
            });

            this.props.location.data.hr_test_taken === '0' ? this.setState({ isHanRankerTest: true, hratest: "0" }) : this.setState({ isHanRankerTest: false, hratest: "0" })

            const candidateName = this.props.location.data.candidate_name;
            const candidateContact = this.props.location.data.contact;
            const candidateEmail = this.props.location.data.email_id;
            const candidateRemarks = this.props.location.data.remarks;
            const totalExperience = this.props.location.data.total_experience;
            const relevantExperience = this.props.location.data.relevant_experience;
            const testCompleteddt = this.props.location.data.test_completed_dt;
            const testShareddt = this.props.location.data.testlink_received_dt;
            const candidatehrScore = this.props.location.data.hr_score;
            const candidatehrRemarks = this.props.location.data.hr_remarks

            const shareddate = moment(testCompleteddt).format("YYYY-MM-DD");
            const completedDate = moment(testCompleteddt).format("YYYY-MM-DD");
            const noticePeriod = [{ 'value': '', 'label': this.props.location.data.notice_period + "days" }]
            const candidatePriority = [{ 'value': '', 'label': this.props.location.data.priority }]
            const PriorityName = candidatePriority.map((data, i) => {
                return data.label
            });
            const CandidatePriority = PriorityName.toString();
            this.setState({
                selectedPriority: CandidatePriority
            });

            this.setState({
                username: candidateName,
                contact: candidateContact,
                email: candidateEmail,
                te: totalExperience,
                re: relevantExperience,
                skills: primary_skill,
                listCompany: currentCompany,
                location: currentLocation,
                location: preferredLocation,
                testCompletedDate: completedDate,
                testRecieved: shareddate,
                hrScore: candidatehrScore,
                hraRemarks: candidatehrRemarks,
                source: candidateSource,
                spoc: Dna_spoc,
                recruiter: candidateRecruiter,
                noticePeriod: noticePeriod,
                priorityData: candidatePriority,
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
        event.target.value === 'Yes' ? this.setState({ isHanRankerTest: true, hratest: "0" }) : this.setState({ isHanRankerTest: false, hratest: "1" })
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
            selectedAddSkillId: SecondarySkillIds
        });
    }
    totalExperience = e => {
        this.setState({ te: e.target.value })
    }

    relevantExperience = e => {
        this.setState({ re: e.target.value })
    }

    selectNP = (e, values) => {

        this.setState({ noticePeriod: values.value })
    }
    selectCompany = (e, values) => {
        console.log(values.value, "checking comapny details");

        this.setState({ selectedCompanyId: values.value })
    }
    selectSkill = (e, values) => {
        this.setState({ selectedSkillId: values.value })
    }
    selectLocation = (e, values) => {
        this.setState({ selectedLocationId: values.value })
    }
    selectPrefLocation = (e, values) => {
        let selectPreferredLocation = values.map((data, i) => {
            return data.value
        });
        let preferredLocation = selectPreferredLocation.toString();
        this.setState({ selectedPrefLocationId: preferredLocation })
    }
    selectRecruiter = (e) => {
        this.setState({ selectedrecruiter: e.target.value })
    }
    selectSource = (e, values) => {
        this.setState({ selectedSourceId: values.value })
    }

    selectSpoc = (e, values) => {
        this.setState({ selectedSpocId: values.value })
    }
    selectPriority = (e, values) => {
        this.setState({ priorityData: values.label })
    }

    selectRemarks = e => {
        this.setState({ remarks: e.target.value })
        console.log(e.target.value, "step 1");
    }

    handleSubmit(event) {

        event.preventDefault();
        let dateTime = new Date(this.state.testCompletedDate);
        let selectTestCompletedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        let CandidatetestRecieved = new Date(this.state.testCompletedDate);
        let selectTestRecievedDate = moment(CandidatetestRecieved).format("YYYY-MM-DD HH:mm:ss");

        const reqObj = {
            "candidate_name": this.state.username,
            "contact": this.state.contact,
            "email_id": this.state.email,
            "priority": this.state.priorityData,
            "total_experience": this.state.te,
            "relevant_experience": this.state.re,
            "current_company": this.state.selectedCompanyId,
            "notice_period": this.state.selectedNPId,
            "current_location": this.state.selectedLocationId,
            "preferred_location": this.state.selectedPrefLocationId,

            "hr_test_taken": this.state.hratest,

            "testlink_received_dt": selectTestRecievedDate,
            "test_completed_dt": selectTestCompletedDate,
            "hr_score": this.state.hrScore,
            "hr_remarks": this.state.hraRemarks,
            "source": this.state.selectedSourceId,
            "spoc": this.state.selectedSpocId,
            "recruiter": this.state.selectedrecruiter,
            "primary_skill": this.state.selectedSkillId,
            "secondary_skill": this.state.selectedAddSkillId,
            "remarks": this.state.remarks,
            "created_by": "1",
            "created_date": "",
            "updated_by": "",
            "updated_date": "",

        }

        this.props.createCandidateForm(reqObj).then((res) => {
            if (res && res.errCode === 201) {
                this.setState({ showToast: true, toastMsg: 'Candidate Successfully Added!' });
            } else if (res && res.errCode === 404) {
                alert(res.status)
                this.setState({ showToast: true, toastMsg: res.status });

            }

        })
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
        console.log(data, "inside create candidate");
        console.log(this.state.testCompletedDate, "inside render");


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
                <hr className={classes.headingDivide}></hr>
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
                                style={{ margin: 8 }}
                                placeholder="Candidate Name"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
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
                                style={{ margin: 8 }}
                                placeholder="Contact"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
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
                                defaultValue={this.state.email}
                                onChange={this.candidateEmail}
                                required
                            />
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={skills}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.skills[0]}

                                    onChange={this.selectSkill}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label={"Primary Skills"}
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
                            <div>
                                <Autocomplete
                                    multiple
                                    options={skills}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.skills}
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
                                style={{ margin: 8 }}
                                placeholder="Total Experience"
                                margin="normal"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
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
                                    defaultValue={this.state.listCompany[0]}
                                    onChange={this.selectCompany}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Current Company"
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
                            <div>
                                <Autocomplete
                                    options={location}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.location[0]}
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
                                    defaultValue={this.state.noticePeriod[0]}

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
                                <RadioGroup row aria-label="position" name="position" onChange={this.onChangeValue}>
                                    <FormControlLabel
                                        defaultValue={this.state.isHanRankerTest}
                                        value="Yes"
                                        control={<Radio color="primary" />}
                                        label="Yes"
                                        labelPlacement="Yes"
                                    />
                                    <FormControlLabel
                                        defaultValue={this.state.isHanRankerTest}
                                        value="No"
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
                                    defaultValue={this.state.source[0]}
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
                                    defaultValue={this.state.spoc[0]}
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
                                    defaultValue={this.state.recruiter[0]}
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
                                />
                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.gridAlign}>
                            <div>
                                <Autocomplete
                                    options={this.priorityList}
                                    getOptionLabel={option => option.label}
                                    defaultValue={this.state.priorityData[0]}
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