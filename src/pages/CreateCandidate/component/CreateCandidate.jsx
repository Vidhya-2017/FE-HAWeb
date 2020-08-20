import React from 'react';

import Select from 'react-select';
import { Modal, FormControl, InputGroup, Row, Col, ListGroup, Form, Toast, Button } from 'react-bootstrap';
import moment from 'moment';
import '../scss/CreateCandidate.scss';

class CreateCandidate extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            skills: "",
            addskills: "",
            showToast: false,
            toastMsg: null
          };

    }
    handleDropdownChange = (e) => {
        this.setState({ skills: e.target.value });
      }
    
    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let dateTime = new Date(data.get('testcompleted'));
            let completedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        const reqObj = {
            "candidate_name": data.get('username'),
            "contact": data.get('contact'),
            "email_id": data.get('email'),
            "total_experience": data.get('te'),
            "relevant_experience": data.get('re'),
            "current_company": data.get('currcompany'),
            "notice_period": data.get('noticeperiod'),
            "current_location": data.get('currlocation'),
            "preferred_location": data.get('preflocation'),
            "hr_test_taken":"0", 
            "testlink_received_dt":completedDate,
            "test_completed_dt": completedDate,
            "hr_score": data.get('hrscore'),
            "hr_remarks": data.get('hrremarks'),
            "source": data.get('source'),
            "spoc": data.get('spoc'),
            "recruiter": data.get('recruiter'),
            "primary_skill": data.get('skills'),
            "secondary_skill": data.get('addskills'),
            "created_by": "1",
            "created_date": "2020-01-03",
            "updated_by": "",
            "updated_date": ""
        }

        this.props.createCandidateForm(reqObj).then((res) => {
            if (res.errCode === 201) {
                this.setState({ showToast: true, toastMsg: 'Candidate Successfully Added!' });
            }

        })
    }


    render() {
        const { showToast, toastMsg } = this.state;
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
                                <Form.Control type="email" placeholder="Email" name="email"/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                        <Form.Group as={Col} controlId="formHorizontalSkills">
                                <Form.Label>Skills</Form.Label>
                                <Form.Control as="select" defaultValue="Skills" name="skills" onChange={(e) => this.setState({skills: e.target.value})}>
                                    <option>Choose...</option>
                                    <option>Angular</option>
                                    <option>React</option>
                                </Form.Control>

                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalAddSkills">
                                <Form.Label>Additional Skills </Form.Label>
                                <Form.Control as="select" defaultValue="Additional Skills" name="addskills">
                                    <option>Choose...</option>
                                    <option>HTML5</option>
                                    <option>SASS</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalTE">
                                <Form.Label>Total Experience</Form.Label>
                                <Form.Control type="number" placeholder="Total Experience" name="te"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalRE">
                                <Form.Label >Relevant Experience</Form.Label>
                                <Form.Control type="number" placeholder="Relevant Experience" name="re"/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalCurrCompany">
                                <Form.Label> Current Company</Form.Label>
                                <Form.Control type="text" placeholder="Curr Company" name="currcompany"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalCurrLocation">
                                <Form.Label>Current Location </Form.Label>
                                <Form.Control type="text" placeholder="Current Location" name="currlocation"/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalPrefLocation">
                                <Form.Label>Pref Location</Form.Label>
                                <Form.Control type="text" placeholder="Pref Location" name="preflocation"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalNoticePeriod">
                                <Form.Label> Notice Period</Form.Label>
                                <Form.Control as="select" defaultValue="Notice Period" name="noticeperiod">
                                    <option>30 days</option>
                                    <option>60 days</option>
                                    <option>90 days</option>
                                    <option>Can join immediately</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalHackerTest">
                                <Form.Label>Hacker Rank Test Taken </Form.Label>
                                <Col>
                                    <Form.Check
                                        type="radio"
                                        label="Yes"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        name="hrtest"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="No"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        name="hrtest"
                                    />

                                </Col>
                            </Form.Group>
                            </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalTestCompletedDate">
                                <Form.Label>Test Completed Date</Form.Label>
                                <Form.Control type="date" placeholder="Test Completed Date" name="testcompleted"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalHackerRankScore">
                                <Form.Label> Hacker Rank Score</Form.Label>
                                <Form.Control type="text" placeholder="Hacker Rank Score" name="hrscore"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalHackerRankRemarks">
                                <Form.Label> Hacker Rank Remarks</Form.Label>
                                <Form.Control type="text" placeholder="Hacker Rank Remarks" name="hrremark"/>
                            </Form.Group>

                        </Form.Row>

                        <Form.Row>
                            
                            <Form.Group as={Col} controlId="formHorizontalSource">
                                <Form.Label>Source</Form.Label>
                                <Form.Control type="text" placeholder="Source" name="source"/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formHorizontalDA">
                                <Form.Label> D&A Spoc</Form.Label>
                                <Form.Control as="select" defaultValue="D&A Spoc" name="spoc">
                                    <option>panel one</option>
                                    <option>panel two</option>
                                    <option>panel three</option>
                                </Form.Control>
                            </Form.Group>

                        </Form.Row>
                        
                        <Form.Row>
                            <Form.Group as={Col} controlId="formHorizontalRecruiter">
                                <Form.Label>Recruiter</Form.Label>
                                <Form.Control as="select" defaultValue="recruiter" name="recruiter">
                                    <option>panel one</option>
                                    <option>panel two</option>
                                    <option>panel three</option>
                                </Form.Control>
                            </Form.Group>
                           
                        </Form.Row>

                        <Form.Group as={Row}>
                            <Col >
                                <Button type="submit">Create</Button>
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