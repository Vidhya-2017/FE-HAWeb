import React from 'react';
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import SkillListMenu from '../../../components/commonUI/SkillListMenu';
import LevelOfAssessment from '../../../components/commonUI/LevelOfAssessment';
import AssessingParameter from '../../../components/commonUI/AssessingParameter';
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
      showToast: false,
      toastMsg: '',
      clientDetailsList: [],
      organizerList: [],
      selectedLevel: [],
      eventSkillList: [],
      editEvent: false,
      eventList: [],
      showEditBtn: true
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
        this.setState({ eventList });
      } else {
        this.geClientDetailsList('');
      }
    });
  }
  geClientDetailsList = (eventID) => {
    this.props.geClientDetailsList().then((response) => {
      if (response && response.arrRes) {
        const clientDetailsList = response.arrRes.map(list => {
          return {
            value: list.ClientId,
            ClientId: list.ClientId,
            label: list.ClientName
          }
        });
        this.setState({ clientDetailsList });
      } else {
        this.setState({
          showToast: true,
          toastMsg: 'Something went wrong. Please try again later.'
        })
      }
      // if (eventID) this.geUserEventList(eventID);
    })
  }

  geUserEventList = async (eventID) => {
    const req = { EventID: eventID };
    this.props.getEventByUser(req).then((response) => {
      var assessmentScale = [];
      if (response.arrRes && response.arrRes.length > 0) {
        const myObject = response.arrRes[0];
        console.log('myObject---', myObject);
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
            eventName: { value: myObject.Name, validation: { required: true }, valid: true },
            eventLocation: { value: myObject.Location, validation: { required: true }, valid: true },
            clientName: { value: myObject.Client, validation: { required: true }, valid: true },
            date: { value: new Date(myObject.EventDate), validation: { required: true }, valid: true },
            duration: { value: myObject.Duration, validation: { required: true }, valid: true },
            skillset: { value: myObject.Skills.map((list) => list.trim()), validation: { required: true }, valid: true },
            competancy: { value: competancyList.map((list) => list.trim()), validation: { required: true }, valid: true },
            assessmentLevel: { value: assessmentLevel.toString(), validation: { required: true }, valid: true },
            assessingParameter: { value: assessingParameter, validation: { required: true }, valid: true }
          }
          myObject.AssessmentScale.map((list, index) => assessmentScale.push({ id: index, value: list, checked: true }));
          this.setState({
            registerEvent: updatedFormElement,
            organizerList: myObject.Organisers,
            showEditBtn,
            formIsValid: true,
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
    this.inputFieldChange(e);
  }

  eventFieldChange = (selectedEvent) => {
    this.setState({ selectedEvent });
    this.geUserEventList(selectedEvent.value);
    // this.inputFieldChange({target: {...selectedEvent, name: 'eveName'}});
  }

  clientChange = (e) => {
    this.inputFieldChange({ target: { ...e, name: 'clientName' } });
  }

  dateChange = (e) => {
    this.inputFieldChange({ target: { value: e !== null ? e : '', name: 'date' } });
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
    console.log('-updatedRegForm--', updatedRegForm);
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


  submitEventReg = () => {
    const user_id = this.props.userDetails.user_id;
    const formData = {};
    const { registerEvent } = this.state;
    const resetRegisterEvent = {
      ...registerEvent
    };
    for (let inputIdentifier in resetRegisterEvent) {
      formData[inputIdentifier] = resetRegisterEvent[inputIdentifier].value;
    }
    const organizerList = this.state.organizerList.map((list) => {
      return list.user_id;
    })
    const assessmentLevel = [];
    for (let i = 0; i < Number(formData.assessmentLevel) + 2; i++) {
      assessmentLevel.push(
        i === (Number(formData.assessmentLevel) + 1) ? 'Final Assessment' : `Sprint ${i}`,
      );
    }
    const date = moment(formData.date).format("YYYY-MM-DD  HH:mm:ss");
    let reqObj = {
      EventName: formData.eventName,
      Location: formData.eventLocation,
      Client: formData.clientName,
      eventdate: date,
      Duration: formData.duration,
      Skills: formData.skillset,
      CompetancyLevelData: formData.competancy,
      AssessmentScale: assessmentLevel,
      OtherAssessmentData: formData.assessingParameter,
      OrganizerData: organizerList,
      CreatedBy: user_id,
      UpdatedBy: user_id
    }
    console.log('--this.state.editEvent-', this.state.editEvent);
    if (!this.state.editEvent) {
      const isUserExist = reqObj.OrganizerData.find((id) => id === user_id);
      if (!isUserExist) {
        reqObj.OrganizerData.push(user_id);
      }
      this.props.registerEvent(reqObj).then((response) => {
        this.eventCreateOrEdit(response, 'Event Registered successfully.');
      })
    }
    else {
      var pair = { EventId: this.state.selectedEvent.value }
      reqObj = { ...reqObj, ...pair }
      this.props.editEvent(reqObj).then((response) => {
        this.eventCreateOrEdit(response, 'Event updated successfully.');
      })
    }
  }

  eventCreateOrEdit = (response, message) => {
    if (response && response.errCode === 200) {
      this.setState({
        registerEvent: { ...regEventForm },
        organizerList: [],
        showToast: true,
        toastMsg: message,
        showEditBtn: false,
        selectedEvent: null
      })
    } else {
      this.setState({
        registerEvent: { ...regEventForm },
        organizerList: [],
        showToast: true,
        showEditBtn: false,
        selectedEvent: null,
        toastMsg: 'Something went wrong. Please try again later'
      })
    }
  }

  cancelEvent = () => {
    this.setState({
      registerEvent: { ...regEventForm },
      organizerList: [],
      editEvent: false,
      selectedEvent: null,
      formIsValid: false
    })
  }

  editEvent = () => {
    this.setState({ editEvent: true });
  }
  render() {
    const { registerEvent, showEditBtn, formIsValid, eventList, selectedEvent, selectedLevel, clientDetailsList, editEvent } = this.state;
    const clientSelected = clientDetailsList.find(list => list.value === registerEvent.clientName.value);
    return (
      <div className='eventRegisterWrapper'>
        <div className="pageHeader">
          <h3 className='pageTitle'>Event Register</h3>
          {!editEvent && <i onClick={this.editEvent} className="editEvent fa fa-pencil fa-lg" aria-hidden="true"></i>}
        </div>
        <div className='registerForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              {!editEvent ? <InputGroup size="sm" className="mb-3">
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
                  value={selectedEvent ? selectedEvent : null}
                  onChange={this.eventFieldChange}
                  options={eventList}
                  defaultValue={selectedEvent}
                  styles={SelectStyles(215)}
                  className="mb-3"
                  placeholder='Event Name'
                />}
            </Col>
          </Row>
          <EventLocation isDisabled={!showEditBtn} selectedValue={registerEvent.eventLocation.value} onEventChange={this.onEventChange} />
          <Row>
            <Col className='fieldName'><span>Client Name:</span></Col>
            <Col>
              <Select
                value={clientSelected ? clientSelected : null}
                onChange={this.clientChange}
                options={clientDetailsList}
                defaultValue={clientSelected}
                styles={SelectStyles(215)}
                className="mb-3"
                placeholder='Client Name'
                isDisabled={!showEditBtn}
              />
            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Date:</span></Col>
            <Col>
              <DatePicker
                className="datePicker"
                format="yyyy-MM-dd"
                onChange={this.dateChange}
                value={registerEvent.date.value}
                monthPlaceholder="mm"
                yearPlaceholder="yyyy"
                dayPlaceholder="dd"
                disabled={!showEditBtn}
              />
            </Col>
          </Row>
          <Duration isDisabled={!showEditBtn} selectedValue={registerEvent.duration.value} onEventChange={this.onEventChange} />
          <SkillListMenu isDisabled={!showEditBtn} isCandidateSkill={false} eventSkillList={[]} selectedValue={registerEvent.skillset && registerEvent.skillset.value} onEventChange={this.onEventChange} />
          <CompetancyMenu isDisabled={!showEditBtn} isCompentency={false} eventcompentencyList={[]} selectedValue={registerEvent.competancy.value} showCompentencyChips={true} onEventChange={this.onEventChange} />
          <LevelOfAssessment isDisabled={!showEditBtn} selected={selectedLevel} selectedValue={registerEvent.assessmentLevel.value} onEventChange={this.onEventChange} />
          <AssessingParameter isDisabled={!showEditBtn} selectedValue={registerEvent.assessingParameter.value} onEventChange={this.onEventChange} />
          <div className="eveRegCntrlPanel">
            <Button className='file-upload fileUploadBtn btn shadow' onClick={this.cancelEvent}>Cancel</Button>
            {showEditBtn && <Button disabled={!formIsValid} className='file-upload fileUploadBtn btn shadow' onClick={this.submitEventReg}>
              {editEvent ? "Update" : "Submit"}
            </Button>}
          </div>
        </div>
      </div>
    )
  }
}

export default EventRegistration;