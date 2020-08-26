import React from 'react';

import Select from 'react-select';
import { Modal, FormControl, InputGroup, Row, Col, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import moment from 'moment';
import '../scss/CreateCandidate.scss';


class CreateCandidate extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {
            skills: [],
            location: [],
            recruiter: [],
            source: [],
            spoc: [],
            listCompany: "",
            addskills: "",
            showToast: false,
            toastMsg: null,
            selectedSkillId: "",
            selectedAddSkillId: [],
            selectedLocationId: "",
            selectedPrefLocationId: [],
            selectedrecruiter: "",
            selectedSourceId: "",
            selectedSpocId: "",
            selectedOption: "",
            isHanRankerTest: false,
            selectedCompanyId: "",
            selectedNPId: '',
            np: [ {'label':'30 days', 'value': '30'}, {'label':'60 days', 'value': '60'},{'label':'90 days', 'value': '90'},{'label':'Can join immediately', 'value': '15'}]
        };

    }
    onChangeValue(event) {
        event.target.value === 'Yes' ? this.setState({ isHanRankerTest: true }) : this.setState({ isHanRankerTest: false })
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
    selectSecondarySkill(e) {
        this.setState({ selectedAddSkillId: e })
    }
    selectNP = (e) => {
        this.setState({ selectedNPId: e.value })
    }
    selectCompany = (e) => {
        this.setState({ selectedCompanyId: e.label })
    }
    selectSkill = (e) => {
        this.setState({ selectedSkillId: e.value })
    }
    selectLocation = (e) => {
        this.setState({ selectedLocationId: e.value })
    }
    selectPrefLocation(e) {
        this.setState({ selectedPrefLocationId: e })
    }
    selectRecruiter = (e) => {
        this.setState({ selectedrecruiter: e.value })
    }
    selectSource = (e) => {
        this.setState({ selectedSourceId: e.value })
    }

    selectSpoc = (e) => {
        this.setState({ selectedSpocId: e.value })
    }
    handleSubmit(event) {
        let getAddId = this.state.selectedAddSkillId.map(function (id) {
            return id['value'];
        });
        let addSkillId = getAddId.toString();
        let getPrefLocation = this.state.selectedPrefLocationId.map(function (id) {
            return id['value'];
        })
        let PrefLocationID = getPrefLocation.toString();

        event.preventDefault();
        const data = new FormData(event.target);
        let dateTime = new Date(data.get('testcompleted'));
        let completedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

        let dateTimeShared = new Date(data.get('sharedDate'));
        let SharedDate = moment(dateTimeShared).format("YYYY-MM-DD HH:mm:ss");
        const reqObj = {
            "candidate_name": data.get('username'),
            "contact": data.get('contact'),
            "email_id": data.get('email'),
            "total_experience": data.get('te'),
            "relevant_experience": data.get('re'),
            "current_company": this.state.selectedCompanyId,
            "notice_period": this.state.selectedNPId,
            "current_location": this.state.selectedLocationId,
            "preferred_location": PrefLocationID,
            "hr_test_taken": "0",
            "testlink_received_dt": completedDate,
            "test_completed_dt": completedDate,
            "hr_score": data.get('hrscore'),
            "hr_remarks": data.get('hrremarks'),
            "source": this.state.selectedSourceId,
            "spoc": this.state.selectedSpocId,
            "recruiter": this.state.selectedrecruiter,
            "primary_skill": this.state.selectedSkillId,
            "secondary_skill": addSkillId,
            "created_by": "1",
            "created_date": SharedDate,
            "updated_by": "",
            "updated_date": ""
        }

        this.props.createCandidateForm(reqObj).then((res) => {
            if (res && res.errCode === 201) {
                this.setState({ showToast: true, toastMsg: 'Candidate Successfully Added!' });
            } else {
                alert(res.status)
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
        const { showToast, toastMsg, selectedOption, isHanRankerTest } = this.state;
        return (
            <section className="container-fluid candidate-wrapper">
                <h5>Create Candidate</h5>
                <hr></hr>
                <div className="row">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalCandidateName">
                                <Form.Label >Candidate Name</Form.Label>
                                <Form.Control type="CandidateName" name="username" placeholder="Candidate Name" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalContact">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control type="number" placeholder="Contact" name="contact" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="email" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalSkills">
                                <Form.Label>Primary Skills</Form.Label>

                                <Select options={this.state.skills} onChange={this.selectSkill.bind(this)} />

                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalAddSkills">
                                <Form.Label>Secondary Skills </Form.Label>
                                <Select options={this.state.skills} onChange={this.selectSecondarySkill.bind(this)} isMulti />

                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalTE">
                                <Form.Label>Total Experience</Form.Label>
                                <Form.Control type="number" placeholder="Total Experience" name="te" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalRE">
                                <Form.Label >Relevant Experience</Form.Label>
                                <Form.Control type="number" placeholder="Relevant Experience" name="re" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalCurrCompany">
                                <Form.Label> Current Company</Form.Label>
                                <Select options={this.state.listCompany} onChange={this.selectCompany.bind(this)} />

                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalCurrLocation">
                                <Form.Label>Current Location </Form.Label>
                                <Select options={this.state.location} onChange={this.selectLocation.bind(this)} />

                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalPrefLocation">
                                <Form.Label>Pref Location</Form.Label>
                                <Select options={this.state.location} onChange={this.selectPrefLocation.bind(this)} isMulti />

                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalNoticePeriod">
                                <Form.Label> Notice Period</Form.Label>
                                <Select options={this.state.np}  onChange={this.selectNP.bind(this)}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalHackerTest">
                                
                                <div className="row">
                                <Form.Label className="col-3">Hacker Rank Test Taken </Form.Label>
                                    <div onChange={this.onChangeValue}  className="row col-6">
                                        <div className="col-2"><input type="radio" value="Yes" name="HackerRankTest" /> Yes</div>
                                        <div className="col-2"><input type="radio" value="No" name="HackerRankTest" /> No</div>
                                    </div>

                                    </div>
                            </Form.Group>
                        </Form.Row>
                        {isHanRankerTest &&
                            <div>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formHorizontalTestCompletedDate">
                                        <Form.Label>Test Completed Date</Form.Label>
                                        <Form.Control type="date" placeholder="Test Completed Date" name="testcompleted" />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formHorizontalHackerRankScore">
                                        <Form.Label> Hacker Rank Score</Form.Label>
                                        <Form.Control type="text" placeholder="Hacker Rank Score" name="hrscore" />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formHorizontalHackerRankRemarks">
                                        <Form.Label> Hacker Rank Remarks</Form.Label>
                                        <Form.Control type="text" placeholder="Hacker Rank Remarks" name="hrremark" />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formHorizontalHackerRankRemarks">
                                        <Form.Label>Test shared Date</Form.Label>
                                        <Form.Control type="date" placeholder="Test shared Date" name="sharedDate" />
                                    </Form.Group>
                                </Form.Row>
                            </div>
                        }
                        <Form.Row>

                            <Form.Group as={Col} controlId="formHorizontalSource">
                                <Form.Label>Source</Form.Label>
                                <Select options={this.state.source} onChange={this.selectSource.bind(this)} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalDA">
                                <Form.Label> D&A Spoc</Form.Label>
                                <Select options={this.state.spoc} onChange={this.selectSpoc.bind(this)} />
                            </Form.Group>

                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalRecruiter" className="col-6">
                                <Form.Label>Recruiter</Form.Label>
                                <Select options={this.state.recruiter} onChange={this.selectRecruiter.bind(this)} />
                            </Form.Group>

                        </Form.Row>

                        <Form.Group as={Row}>
                            <Col >
                                <Button type="submit" className="btn-create">Create</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
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
            </section>

        )
    }
}

export default CreateCandidate;