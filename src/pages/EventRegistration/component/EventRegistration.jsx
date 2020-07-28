import React from 'react';
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import SkillListMenu from '../../../components/commonUI/SkillListMenu';
import LevelOfAssessment from '../../../components/commonUI/LevelOfAssessment';
import AssessingParameter from '../../../components/commonUI/AssessingParameter';
import DateTime from '../../../components/commonUI/DateTime';
import Duration from '../../../components/commonUI/Duration';
import CompetancyMenu from '../../../components/commonUI/Compentency';
import EventLocation from '../../../components/commonUI/EventLocation';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/EventRegistration.scss';

const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const regEventForm = {
  eventName: inputField,
  eventLocation: inputField,
  clientName: inputField,
  date: inputField,
  duration: inputField,
  skillset: inputField,
  competancy: inputField,
  assessmentLevel: inputField,
  assessingParameter: inputField
}
class EventRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: null,
      registerEvent: { ...regEventForm },
      updatedEvent: {},
      formIsValid: false,
      loading: false,
      showToast: false,
      toastMsg: '',
      clientDetailsList: [],
      organizerList: [],
      showOrgnizerModal: false,
      deleteAlert: false,
      eventAssigned: false,
      eventId: '',
      selectedLevel: [],
      eventSkillList: [],
      updatedOrganizerList: [],
      edit: false,
      eventList: [],
      showEditBtn: false
    }
  }

  componentDidMount() {
    this.getEventList();
  }


  getEventList = () => {
    this.props.getEventList().then((response) => {
      if (response && response.arrRes.length > 0) {
        this.geClientDetailsList(response.arrRes[0].EventId);
        const eventList = response.arrRes.map(list => {
          return {
            value: list.EventId,
            EventId: list.EventId,
            label: list.Name
          }
        });
        this.setState({ eventList, eventAssigned: true });
      } else {
        this.geClientDetailsList('');
      }
    });
  }
  geClientDetailsList = (eventID) => {
    this.props.geClientDetailsList().then((response) => {
      if (response && response.arrRes) {
        this.setState({ clientDetailsList: response.arrRes });
      } else {
        this.setState({
          showToast: true,
          toastMsg: 'Something went wrong. Please try again later.'
        })
      }
      if (eventID) this.geUserEventList(eventID);
    })
  }

  geUserEventList = async (eventID) => {
    const req = { EventID: eventID };
    this.props.getEventByUser(req).then((response) => {
      var assessmentScale = [];
      if (response.arrRes && response.arrRes.length > 0) {
        const myObject = response.arrRes[0];
        const user_id = this.props.userDetails.user_id;
        const isEventMappedUser = myObject.OrganisersId.find((org) => org.userID === user_id);
        let showEditBtn = false;
        if (isEventMappedUser && isEventMappedUser.userID) {
          showEditBtn = true;
        }
        if (myObject) {
          const assessingParameter = myObject.OtherAssessmentData.map((list) => {
            return list.OtherAssessmentId;
          })
          const competancyList = myObject.CompetancyData.map((list) => {
            return list.compentancyID;
          })
          const assessmentLevel = myObject.AssessmentScale.length - 2
          const updatedFormElement = {
            eventName: { value: myObject.Name, validation: { required: true }, valid: false },
            eventLocation: { value: myObject.Location, validation: { required: true }, valid: false },
            clientName: { value: myObject.Client, validation: { required: true }, valid: false },
            date: { value: myObject.EventDate, validation: { required: true }, valid: false },
            duration: { value: myObject.Duration, validation: { required: true }, valid: false },
            skillset: { value: myObject.Skills.map((list) => list.trim()), validation: { required: true }, valid: false },
            competancy: { value: competancyList.map((list) => list.trim()), validation: { required: true }, valid: false },
            assessmentLevel: { value: assessmentLevel.toString(), validation: { required: true }, valid: false },
            assessingParameter: { value: assessingParameter, validation: { required: true }, valid: false }
          }
          myObject.AssessmentScale.map((list, index) => assessmentScale.push({ id: index, value: list, checked: true }));
          this.setState({
            registerEvent: updatedFormElement,
            eventAssigned: true,
            eventId: myObject.EventId,
            organizerList: myObject.Organisers,
            showEditBtn,
            selectedLevel: assessmentScale
          });
          // this.geClientDetailsList();
        }
      } else {
        this.setState({
          showToast: true,
          toastMsg: 'Something went wrong. Please try again later.'
        })
      }
    })
  }


  onEventChange = (e) => {
    console.log('onEventChange---', e);
    this.inputFieldChange(e);
  }

  eventFieldChange = (e) => {
    this.geUserEventList(e.target.value);
    this.inputFieldChange(e);
  }

  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const updatedRegForm = {
      ...this.state.registerEvent
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
    console.log('--registerEvent--', updatedRegForm);
    this.setState({ registerEvent: updatedRegForm, formIsValid });
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

  handleEventChange = (selectedEvent) => {
    this.setState({ selectedEvent });
    console.log('-----e---', selectedEvent);
    this.geUserEventList(selectedEvent.EventID)
  }
  render() {
    const { selectedEvent, registerEvent, clientDetailsList, formIsValid, loading, showToast, toastMsg, showOrgnizerModal,
      showEditBtn, eventAssigned, selectedLevel, edit, eventList } = this.state;
      const eventSelected = eventList.find(list => list.label === registerEvent.eventName.value);
    return (
      <div className='eventRegisterWrapper'>
        <h3 className='pageTitle'>Event Register</h3>
        <div className='registerForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              {!eventAssigned ? <InputGroup size="sm" className="mb-3">
                <FormControl
                  placeholder="Event Name"
                  type="text"
                  className='inputField'
                  name="eventName"
                  value={registerEvent.eventName.value}
                  onChange={this.inputFieldChange}
                />
              </InputGroup> :
                <Select
                  value={eventSelected}
                  onChange={this.handleEventChange}
                  options={eventList}
                  defaultValue={eventSelected}
                  styles={SelectStyles(220)}
                  className="mb-3"
                  placeholder='Event Name'
                />
              }
            </Col>
          </Row>
          <EventLocation selectedValue={registerEvent.eventLocation.value} onEventChange={this.onEventChange} />
          <SkillListMenu eventDisabled={eventAssigned} isCandidateSkill={false} eventSkillList={[]} selectedValue={registerEvent.skillset && registerEvent.skillset.value} showSkillChips={true} onEventChange={this.onEventChange} />
          <CompetancyMenu eventDisabled={eventAssigned} isCompentency={false} eventcompentencyList={[]} selectedValue={registerEvent.competancy.value} showCompentencyChips={true} onEventChange={this.onEventChange} />
          <LevelOfAssessment disabled={eventAssigned} selectedValue={registerEvent.assessmentLevel.value} onEventChange={this.onEventChange} selected={selectedLevel} />
          {/* <DateTime disabledField={false} selectedValue={registerEvent.date.value} onEventChange={this.onEventChange} /> */}
          <Duration selectedValue={registerEvent.duration.value} onEventChange={this.onEventChange} />
          <AssessingParameter selectedValue={registerEvent.assessingParameter.value} onEventChange={this.onEventChange} />


          {/* <Row>
            <Col className='fieldName'><span>Event Location:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Event Location'
              />
            </Col>
          </Row> */}

          {/* <Row>
            <Col className='fieldName'><span>Client Name:</span></Col>
            <Col>
              <Select
                value={registerEvent.clientName.value}
                onChange={this.inputFieldChange}
                options={clientDetailsList}
                defaultValue={registerEvent.clientName.value}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Cleint Name'
              />
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>Event Date:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Event Date'
              />
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>Duration:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Duration'
              />
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>Skill List:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Skills'
              />
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>Competency Rating:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Competency Rating'
              />
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>No of Sprints:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Sprints'
              />
            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Assessing Parameters:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Assessing Parameters'
              />
            </Col>
          </Row> */}
        </div>
      </div>
    )
  }
}

export default EventRegistration;