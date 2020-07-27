import React from 'react';
import { Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/EventRegistration.scss';

class EventRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: null
    }
  }
  
  inputFieldOnChange = (e)=> {
    console.log('-----e---', e.target);
  }

  render() {
    const { selectedEvent } = this.state;
    return (
      <div className='eventRegisterWrapper'>
        <h3 className='pageTitle'>Event Register</h3>
        <div className='registerForm'>
          <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
              <InputGroup size="sm" className="mb-3">
                <FormControl
                  placeholder="Event Name"
                  type="text"
                  className='inputField'
                  name="eventName"
                  onChange={this.inputFieldOnChange}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col className='fieldName'><span>Event Location:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
                styles={SelectStyles(220)}
                className="mb-3"
                placeholder='Event Location'
              />
            </Col>
          </Row>

          <Row>
            <Col className='fieldName'><span>Client Name:</span></Col>
            <Col>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                // options={eventList}
                defaultValue={selectedEvent}
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
          </Row>
        </div>
      </div>
    )
  }
}

export default EventRegistration;