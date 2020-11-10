import React, { Fragment } from 'react';
import { Row, Col, InputGroup, FormControl, Button, Toast, Form, Badge, Modal, Accordion, Card } from 'react-bootstrap';
import Select from 'react-select';
import RangeSlider from 'react-bootstrap-range-slider';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/CandidateFeedback.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

class CandidateFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      squadList: [],
      candidateList: [],
      sprintList: [],
      selectedEvent: null,
      selectedSquad: null,
      selectedSprint: null,
      selectedCandidate: null,
      CompetancyData: [],
      CompentencyOption: [],
      ShowCompentencyOption: false,
      selectedCompetancy: null,
      finalStatusOption: [{ value: "selected", label: "Selected" }, { value: "onhold", label: "On Hold" }, { value: "rejected", label: "Rejected" }],
      selectedFinalStatus: null,
      OtherAssessmentData: [],
      showFinalStatus: false,
      fbcomment: '',
      showSuccessMessage: false,
      toastMessage: '',
      showPrevFeedbackButton: false,
      showModal: false,
      previousFeedbackData: [],
      showRatingDiv: false,
      formIsValid: false,
      role: ''
    }
  }

  componentDidMount() {
    this.getEventList();
  }

  getEventList = () => {
    this.props.getEventList().then(response => {
      let eventList = [];
      eventList = response.arrRes.map(list => {
        return {
          value: list.EventId,
          label: list.Name
        }
      })
      this.setState({ eventData: response.arrRes, eventList });
    });
  }

  handleEventChange = (selectedEvent) => {
    this.setState({ selectedEvent, showPrevFeedbackButton: false });
    const reqObj = { eventID: selectedEvent.value }
    this.props.getSquadList(reqObj).then(response => {
      if (response && response.arrRes) {
        let squadList = [];
        squadList = response.arrRes.map(list => {
          return {
            value: list.ID,
            label: list.SquadName
          }
        })
        const req = { EventID: selectedEvent.value };
        this.props.getEventDetails(req).then((eventResponse) => {
          if (eventResponse && eventResponse.arrRes) {
            let sprintList = [];
            sprintList = eventResponse.arrRes[0].AssessmentScale.map(list => {
              return {
                value: list,
                label: list
              }
            })
            const OtherAssessmentData = eventResponse.arrRes[0].OtherAssessmentData.map(list => {
              return { ...list, value: 1 }
            })
            this.setState({ CompetancyData: eventResponse.arrRes[0].CompetancyData, OtherAssessmentData });
            const user_id = this.props.userDetails.user_id;
            const organiserIDs = eventResponse.arrRes[0].OrganisersId;
            const panelistIDs = eventResponse.arrRes[0].PanelData;
            const isOrganiser = organiserIDs.find((id) => id.userID === user_id);
            const ispanelist = panelistIDs.find((id) => id.userID === user_id);
            if (ispanelist !== undefined || isOrganiser !== undefined) {
              const foundIndex = eventResponse.arrRes[0].AssessmentScale.findIndex(list => list === 'Final Assessment')
              sprintList.splice(foundIndex, 0, { value: 'Show and Tell assesment', label: 'Show and Tell assesment' });
              this.setState({ squadList, sprintList, selectedSquad: null, candidateList: [], selectedCandidate: null, selectedSprint: null, showRatingDiv: false });

            } else {
              this.setState({
                showSuccessMessage: true,
                toastMessage: 'You do not have permission. Please contact Organiser.',
                squadList: [], sprintList: [], selectedSquad: null, selectedEvent: null, candidateList: [], selectedSprint: null, selectedCandidate: null, ShowCompentencyOption: false, CompentencyOption: [], selectedFinalStatus: null, showRatingDiv: false, formIsValid: false
              });
            }
          } else {
            this.setState({
              showSuccessMessage: true,
              toastMessage: 'Something went wrong. Please try again later.'
            });
          }
        });
      } else {
        this.setState({
          showSuccessMessage: true,
          toastMessage: 'No Squad has been created.'
        });
      }
    });
  }

  onSquadListChange = (selectedSquad) => {
    this.setState({ selectedSquad, showPrevFeedbackButton: false, showRatingDiv: false, selectedCandidate: null });
    this.candidateList(selectedSquad);
  }

  candidateList = (squadId) => {
    const reqObj = {
      squad_id: squadId.value
    }
    this.props.squadCandidateList(reqObj).then((response) => {
      let candidateList = [];
      candidateList = response.arrRes.map(list => {
        return {
          value: list.CandidateID,
          label: list.EmpName
        }
      })
      this.setState({ candidateList });
    });
  }

  onSprintListChange = (selectedSprint) => {
    this.setState({ selectedSprint, selectedCandidate: null, showRatingDiv: false, showPrevFeedbackButton: false });
    let CompentencyOption = [];
    CompentencyOption = this.state.CompetancyData.map(list => {
      return {
        value: list.compentancyID,
        label: list.CompetancyName
      }
    })
    if (selectedSprint.value === 'Show and Tell assesment' || selectedSprint.value === 'Final Assessment') {
      this.setState({ CompentencyOption, ShowCompentencyOption: true, selectedFinalStatus: null, formIsValid: false, selectedCompetancy: null });
    } else {
      this.setState({ CompentencyOption: [], ShowCompentencyOption: false, selectedFinalStatus: null, selectedCompetancy: null });
    }
    if (selectedSprint.value === 'Final Assessment') {
      this.setState({ showFinalStatus: true });
    } else {
      this.setState({ showFinalStatus: false, selectedFinalStatus: null });
    }
  }

  onCandidateListChange = (selectedCandidate) => {
    const user_id = this.props.userDetails.user_id;
    const reqObj = {
      event_id: this.state.selectedEvent.value,
      candidate_id: selectedCandidate.value,
      userID: user_id
    };
    this.props.candidateFeedbackList(reqObj).then((response) => {
      let Fbtext = '';
      let roletext = '';
      let fstatus = '';
      let fnstatus = '';
      let fcompetancyRating = '';
      if (response.errCode === 200) {
        const findFbIndex = response.arrRes.findIndex(data =>
          this.state.selectedSprint.value === data.sprintLevel);
        if (findFbIndex >= 0) {
          fstatus = response.arrRes[findFbIndex].sq_final_status;
          fcompetancyRating = response.arrRes[findFbIndex].competancy_rating;
          if (this.state.selectedSprint.value === 'Show and Tell assesment' || this.state.selectedSprint.value === 'Final Assessment') {
            const comIndex = this.state.CompentencyOption.findIndex(datas => fcompetancyRating === datas.label);
            fcompetancyRating = this.state.CompentencyOption[comIndex];
            this.setState({ selectedCompetancy: fcompetancyRating });
          }
          if (this.state.selectedSprint.value === 'Final Assessment') {
            const finIndex = this.state.finalStatusOption.findIndex(datas => fstatus === datas.value);
            fnstatus = this.state.finalStatusOption[finIndex];
            this.setState({ selectedFinalStatus: fnstatus });
          }
          Fbtext = response.arrRes[findFbIndex].feedbackTxt;
          roletext = response.arrRes[findFbIndex].role;
          this.state.OtherAssessmentData.forEach(item => {
            response.arrRes[findFbIndex].AssesmentParams.forEach(aitem => {
              if (item.OtherAssementScaleName === aitem.ParamName) {
                item.value = aitem.ParamValue;
              }
            })
          })
        } else {
          const { OtherAssessmentData } = this.state;
          const updateDataAss = [...OtherAssessmentData];
          updateDataAss.forEach(item => item.value = 1);
          this.setState({ OtherAssessmentData: updateDataAss });
          if (this.state.selectedSprint.value === 'Show and Tell assesment' || this.state.selectedSprint.value === 'Final Assessment') {
            const findcompIndex = response.arrRes.findIndex(data =>
              data.sprintLevel === 'Show and Tell assesment');
            if (findcompIndex >= 0) {
              fcompetancyRating = response.arrRes[findcompIndex].competancy_rating;
              const comIndex = this.state.CompentencyOption.findIndex(datas => fcompetancyRating === datas.label);
              fcompetancyRating = this.state.CompentencyOption[comIndex];
              this.setState({ selectedCompetancy: fcompetancyRating });
            }

            if (this.state.selectedSprint.value === 'Final Assessment') {
              const finIndex = this.state.finalStatusOption.findIndex(datass => fstatus === datass.value);
              fnstatus = this.state.finalStatusOption[finIndex];
              this.setState({ selectedFinalStatus: fnstatus });
            }
          }
        }

        this.setState({ previousFeedbackData: response.arrRes, selectedCandidate, showPrevFeedbackButton: true, showRatingDiv: true, fbcomment: Fbtext, role: roletext, selectedCompetancy: fcompetancyRating, selectedFinalStatus: fnstatus });
      } else {
        const { OtherAssessmentData } = this.state;
        const updateDataAss = [...OtherAssessmentData];
        updateDataAss.forEach(item => item.value = 1);
        this.setState({ previousFeedbackData: response.arrRes, selectedCandidate, showPrevFeedbackButton: true, showRatingDiv: true, OtherAssessmentData: updateDataAss, fbcomment: Fbtext, role: roletext, selectedCompetancy: '', selectedFinalStatus: '' });
      }
    })
  }

  onCompetancyChange = (selectedCompetancy) => {
    let formIsValid = true;
    if (this.state.selectedSprint.value === 'Show and Tell assesment') {
      if (this.state.fbcomment) {
        this.setState({ formIsValid });
      } else {
        this.setState({ formIsValid: false });
      }

    } else if (this.state.selectedSprint.value === 'Final Assessment') {
      if (this.state.fbcomment && this.state.selectedFinalStatus) {
        this.setState({ formIsValid });
      } else {
        this.setState({ formIsValid: false });
      }
    }
    this.setState({ selectedCompetancy });
  }
  onFinalStatusChange = (selectedFinalStatus) => {
    let formIsValid = true;
    if (this.state.selectedSprint.value === 'Final Assessment') {
      if (this.state.fbcomment && selectedFinalStatus && this.state.selectedCompetancy) {
        this.setState({ formIsValid });
      } else {
        this.setState({ formIsValid: false });
      }
    }
    this.setState({ selectedFinalStatus });
  }

  onSilderChange = (e, list) => {
    const { OtherAssessmentData } = this.state;
    list.value = e.target.value;
    const findAssessmentIndex = OtherAssessmentData.findIndex(assessment =>
      list.OtherAssessmentId === assessment.OtherAssessmentId);
    const updatedAssessmentData = [...OtherAssessmentData];
    updatedAssessmentData[findAssessmentIndex].value = e.target.value;
    this.setState({ OtherAssessmentData: updatedAssessmentData });
  }

  feedbackSubmit = () => {
    let status = '';
    let roledata = '';
    let finalcompetancy = '';
    if (this.state.selectedSprint.value === 'Show and Tell assesment') {
      status = '';
      finalcompetancy = this.state.selectedCompetancy.label;
    }
    else if (this.state.selectedSprint.value === 'Final Assessment') {
      status = this.state.selectedFinalStatus.value;
      finalcompetancy = this.state.selectedCompetancy.label;
    }
    if (this.state.selectedSprint.value === 'Final Assessment') {
      roledata = this.state.role;
    }
    const othAssRating = this.state.OtherAssessmentData.map(list => {
      return {
        scaleID: list.OtherAssessmentId,
        scaleVAL: list.value
      }
    })
    const reqObj = {
      eventID: this.state.selectedEvent.value,
      squadID: this.state.selectedSquad.value,
      candidate_id: this.state.selectedCandidate.value,
      otherAssessment: othAssRating,
      feedback: this.state.fbcomment,
      sprintLevel: this.state.selectedSprint.value,
      competancy_rating: finalcompetancy,
      finalStatus: status,
      userID: this.props.userDetails.user_id,
      panelId: this.props.userDetails.user_id,
      role: roledata
    }
    this.props.candidateFB(reqObj).then((response) => {
      if (response.status === 'Already Feedback submitted') {
        this.setState({
          showSuccessMessage: true,
          toastMessage: 'Feedback for this Candidate already submitted.'
        });
        //  this.props.history.push('/homePage');
      }
      else {
        const findcanIndex = this.state.candidateList.findIndex(data =>
          this.state.selectedCandidate.value === data.value);
        if (this.state.candidateList.length > (findcanIndex + 1)) {
          this.onCandidateListChange(this.state.candidateList[findcanIndex + 1]);
          this.setState({
            showSuccessMessage: true,
            toastMessage: 'Feedback submitted successfully and next candidate loaded.'
          });
        } else {
          this.setState({
            showSuccessMessage: true,
            toastMessage: 'Feedback submitted successfully this is the last candidate for the current sprint.'
          });
        }
      }
    })
  }

  getPreviousFeedback = () => {
    this.setState({ showModal: true });
  }

  handleClose = () => {
    this.setState({ showModal: false });
  }

  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type;
    let formIsValid = true;
    const inputField = {
      value: '',
      validation: {
        required: true
      },
      valid: false
    };
    const isvalid = this.checkValidity(targetValue, inputField.validation, targetType);
    if (this.state.selectedSprint.value === "Show and Tell assesment") {
      if (isvalid && targetValue && this.state.selectedCompetancy) {
        formIsValid = true;
      } else {
        formIsValid = false;
      }
    }
    else {
      if (isvalid && targetValue) {
        formIsValid = true;
      } else {
        formIsValid = false;
      }
    }
    if (this.state.selectedSprint.value === "Final Assessment" && targetName === 'feedback') {
      if (isvalid && targetValue && this.state.role && this.state.selectedCompetancy && this.state.selectedFinalStatus) {
        formIsValid = true;
      } else {
        formIsValid = false;
      }
    } else if (this.state.selectedSprint.value === "Final Assessment" && targetName === 'role') {
      if (isvalid && targetValue && this.state.fbcomment && this.state.selectedCompetancy && this.state.selectedFinalStatus) {
        formIsValid = true;
      } else {
        formIsValid = false;
      }
    }
    else {
      if (isvalid && targetValue) {
        formIsValid = true;
      } else {
        formIsValid = false;
      }
    }
    if (targetName === 'feedback') {
      this.setState({ formIsValid, fbcomment: targetValue });
    } else {
      this.setState({ formIsValid, role: targetValue });
    }
  }

  checkValidity(inputValue, rules, inputType) {
    let value = '';
    if (inputValue) value = inputValue.toString();
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    return isValid;
  }

  render() {
    const { selectedEvent, eventList, squadList, selectedSquad, sprintList, candidateList, selectedSprint, selectedCandidate, CompentencyOption, selectedCompetancy, ShowCompentencyOption, finalStatusOption, selectedFinalStatus, OtherAssessmentData, showFinalStatus, fbcomment, showSuccessMessage, toastMessage, showPrevFeedbackButton, showModal, previousFeedbackData, showRatingDiv, formIsValid, role } = this.state;
    return (
      <div className="candidateFeedBackWrapper">
        <h3 className='pageTitle'>Candidate Feedback</h3>
        <div className='feedbackForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              <Select
                className="mb-3"
                placeholder='Event Name'
                value={selectedEvent}
                options={eventList}
                onChange={this.handleEventChange}
                styles={SelectStyles()}
              />
            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Squad Name:</span></Col>
            <Col>
              <Select
                className="mb-3"
                placeholder='Squad Name'
                value={selectedSquad}
                options={squadList}
                onChange={this.onSquadListChange}
                styles={SelectStyles()}
              />
            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Sprint:</span></Col>
            <Col>
              <Select
                className="mb-3"
                placeholder='Sprint List'
                value={selectedSprint}
                options={sprintList}
                onChange={this.onSprintListChange}
                styles={SelectStyles()}
              />
            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Candidate:</span>
              {showPrevFeedbackButton &&
                <i className="fa fa-info-circle fa-lg" onClick={this.getPreviousFeedback} style={{ padding: '0px 20px' }} aria-hidden="true"></i>}
            </Col>
            <Col>
              <Select
                className="mb-3"
                placeholder='Candidate List'
                value={selectedCandidate}
                options={candidateList}
                styles={SelectStyles()}
                onChange={this.onCandidateListChange}
              />
            </Col>
          </Row>
          {showRatingDiv && <div>
            {OtherAssessmentData.map((list) =>
              <div key={list.OtherAssessmentId}>
                <Form.Group controlId="formBasicRange">
                  <Row>
                    <Col>
                      <Form.Label>{list.OtherAssementScaleName}</Form.Label> {' '}
                      <Badge pill variant="primary">{list.value}</Badge>
                    </Col>
                    <Col>
                      <RangeSlider
                        value={list.value}
                        onChange={(e) => this.onSilderChange(e, list)}
                        min={1}
                        max={5}
                        step={1}
                        tooltip='auto'
                        tooltipPlacement='top'
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </div>
            )}
            {ShowCompentencyOption && <Row>
              <Col className='fieldName'><span>Compentency Rating</span></Col>
              <Col>
                <Select
                  name="compentencyRating"
                  className="mb-3"
                  value={selectedCompetancy}
                  placeholder='Candidate List'
                  options={CompentencyOption}
                  styles={SelectStyles()}
                  onChange={this.onCompetancyChange}
                />
              </Col>
            </Row>}
            {showFinalStatus && <Row>
              <Col className='fieldName'><span>Final Status </span></Col>
              <Col>
                <Select
                  name="finalStatus"
                  className="mb-3"
                  value={selectedFinalStatus}
                  placeholder='Select Final Status'
                  options={finalStatusOption}
                  styles={SelectStyles()}
                  onChange={this.onFinalStatusChange}
                />
              </Col>
            </Row>}
            <Row>
              <Col className='fieldName'><span>Feedback</span></Col>
              <Col>
                <InputGroup className="mb-3">
                  <FormControl as="textarea" name="feedback" placeholder="Candidate Feedback" value={fbcomment} onChange={this.inputFieldChange} />
                </InputGroup>
              </Col>
            </Row>
            {showFinalStatus && <Row>
              <Col className='fieldName'><span>Role </span></Col>
              <Col>
                <InputGroup className="mb-3">
                  <FormControl name="role" placeholder="Role" value={role} onChange={this.inputFieldChange} />
                </InputGroup>
              </Col>
            </Row>}
          </div>}
          <div className="fbSubmitCntrlPanel">
            <Button disabled={!formIsValid} className='file-upload fileUploadBtn btn shadow' onClick={this.feedbackSubmit} >Submit </Button>
          </div>
          {showSuccessMessage &&
            <Toast
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: '#deeddd',
                border: '1px solid #28a745',
                color: '#6c757d',
                fontWeight: 500,
                width: 400
              }}
              onClose={() => this.setState({ showSuccessMessage: false })}
              show={showSuccessMessage}
              delay={3000}
              autohide
            >
              {/* <Toast.Header style={{ background: '#deeddd', borderBottom: '1px solid #28a745' }}>
                <strong className="mr-auto">Success</strong>
              </Toast.Header> */}
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
          }
          <Modal show={showModal} onHide={this.handleClose} className="candidateFeedbackModal">
            <Modal.Header closeButton>
              <Modal.Title>Previous FeedBack Details </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {previousFeedbackData.length > 0 && <Accordion defaultActiveKey="0">
                {previousFeedbackData.map((list) =>
                  <Card key={list.sidz}>
                    <Card.Header>
                      <Accordion.Toggle as={Button} variant="link" eventKey={list.sidz}>
                        {list.sprintLevel}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={list.sidz}>
                      <Card.Body>
                        <h6><b>Scores</b></h6>
                        {list.AssesmentParams.map((listData) =>
                          <Fragment key={listData.ParamName}>
                            <p>{listData.ParamName} : {listData.ParamValue}</p>
                          </Fragment>
                        )}
                        {(list.sprintLevel === 'Show and Tell assesment' || list.sprintLevel === 'Final Assessment') &&
                          <p> Compentency Rating : {list.competancy_rating}</p>
                        }
                        {list.sprintLevel === 'Final Assessment' && <p> Status: {list.sq_final_status}</p>}
                        {list.sprintLevel === 'Final Assessment' && <p>Role: {list.role}</p>}
                        <h6><b>Comments</b></h6>
                        <p>{list.feedbackTxt}</p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                )}
              </Accordion>}
              {previousFeedbackData.length === 0 &&
                <p>No data found.</p>}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    )
  }
}

export default CandidateFeedback;