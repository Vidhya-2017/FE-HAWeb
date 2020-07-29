import React from 'react';
import { Row, Col, InputGroup, FormControl, Button, Toast } from 'react-bootstrap';
import Select from 'react-select';
import '../scss/EventFeedback.scss';
import StarRatingComponent from 'react-star-rating-component';
import SelectStyles from '../../../common/SelectStyles';

class EventFeedback extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      clientName: '',
      clientId: '',
      comment: '',
      rating: 1,
      selectedEvent: null,
      formIsValid: false,
      showSuccessMessage: false,
      toastMessage: '',
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
    this.setState({ selectedEvent });
    const reqObj = { eventId: selectedEvent.value }

    this.props.geClientDetailsById(reqObj).then(response => {

      this.setState({ clientName: response.arrRes[0].ClientName, clientId: response.arrRes[0].ClientId });

    });

    let formIsValid = true;
    if (this.state.comment) {
      this.setState({ formIsValid });
    } else {
      this.setState({ formIsValid: false });
    }
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  inputFieldChange = (e) => {
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

    if (isvalid && this.state.selectedEvent) {
      this.setState({ formIsValid, comment: targetValue });
    } else {
      this.setState({ formIsValid: false, comment: targetValue });
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

  submitFeedback = (e) => {
    const reqObj = {
      eventID: this.state.selectedEvent.value,
      clientID: this.state.clientId,
      ratingCnt: this.state.rating,
      txtComment: this.state.comment,
      createdBy: this.props.userDetails.user_id,
    }
    this.props.clientFeedbackOnEvent(reqObj).then((response) => {
      if (response.errCode === 200) {
        this.setState({
          rating: 1,
          selectedEvent: '',
          clientName: '',
          clientId: '',
          comment: '',
          showSuccessMessage: true,
          formIsValid: false,
          toastMessage: 'Feedback Submitted Successfully'
        });
        //  this.props.history.push('/homePage');
      }
      else {
        this.setState({
          showSuccessMessage: true,
          toastMessage: 'Error in saving feedback.'
        });
      }
    })

  }

  render() {
    const { selectedEvent, eventList, clientName, rating, formIsValid, comment, showSuccessMessage, toastMessage } = this.state;

    return (
      <div className="eventFeedBackWrapper">
        <h3 className='pageTitle'>Event Feedback</h3>
        <div className='feedbackForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              <Select
                className="mb-3"
                value={selectedEvent}
                onChange={this.handleEventChange}
                options={eventList}
                styles={SelectStyles()}
                placeholder='Select the Event'
              />

            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Client Name:</span></Col>

            <Col className='fieldName'><span>{clientName}</span></Col>

          </Row>

          <Row>
            <Col className='fieldName'><span>Comment:</span></Col>
            <Col>
              <InputGroup className="mb-3">

                <FormControl as="textarea" value={comment} onChange={this.inputFieldChange} />
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>Rating:</span></Col>
            <Col>
              <div className="star">
                <StarRatingComponent
                  name="rate1"
                  starCount={5}
                  value={rating}
                  onStarClick={this.onStarClick.bind(this)}
                  starColor='#fcc62a'
                  emptyStarColor='#fcc62a4a'
                />
              </div>

            </Col>
          </Row>
          <Row>
            <Col style={{textAlign: 'center'}}>
              <Button disabled={!formIsValid} className='file-upload fileUploadBtn btn shadow' onClick={this.submitFeedback}>Submit</Button>
            </Col>
          </Row>
        </div>

        {showSuccessMessage &&
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
            onClose={() => this.setState({ showSuccessMessage: false })}
            show={showSuccessMessage}
            delay={3000}
            autohide
          >
            <Toast.Header style={{ background: '#deeddd', borderBottom: '1px solid #28a745' }}>
              <strong className="mr-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        }

      </div>



    )
  }
}

export default EventFeedback;