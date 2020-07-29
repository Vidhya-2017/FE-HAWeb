import React, { Fragment } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import Select from 'react-select';
import moment from 'moment';
import '../scss/EventStatus.scss';
import SelectStyles from '../../../common/SelectStyles';

class EventStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          selectedEvent: null,
          eventList: [],
          feedbackSummary: {},
          loading: false
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
          this.setState({ eventList });
        });
      }

      onEventListChange = (selectedEvent) => {
        this.setState({selectedEvent});
        const reqObj={event_id:selectedEvent.value};
        this.setState({ loading: true });
        this.props.getSummary(reqObj).then(response => {
            this.setState({ loading: false, feedbackSummary: response.resultArr });
           });
        
      }
    render() {
        const { selectedEvent, eventList, feedbackSummary } = this.state;
        return (
            <div className='eventStatusWrapper'>
            <h3 className='pageTitle'>Event Status</h3>
            <div className='StatusForm'>
            <Row>
            <Col className='fieldName'><span>Event Name:</span></Col>
            <Col>
            <Select
              className="mb-3"
              value={selectedEvent}
              onChange={this.onEventListChange}
              options={eventList}
              styles={SelectStyles(215)}
              placeholder='Select the Event'
            />
            </Col>
            </Row>
            <section className='eventStatus'>
              {feedbackSummary.SelectedEmp &&
              <Row className='statusRow'>
                <Col sm className='colStatus successBorder'>
                  <div>
                    <p>Selected</p>
                    <p className="success">{feedbackSummary.SelectedEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus primaryBorder'>
                  <div>
                    <p>In-Progress</p>
                    <p className="primary">{feedbackSummary.InprocessEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus dangerBorder'>
                  <div>
                    <p>Rejected</p>
                    <p className="danger">{feedbackSummary.RejectedEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus warningBorder'>
                  <div>
                    <p>On-Hold</p>
                    <p className="warning">{feedbackSummary.HoldEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus secondaryBorder'>
                  <div>
                    <p>Total</p>
                    <p className="secondary">{feedbackSummary.TotalEmp}</p>
                  </div>

                </Col>
              </Row>}
          </section>
          {feedbackSummary.OrganizerData && feedbackSummary.OrganizerData.length > 0 && <Row>
            <Col>
            <p className='memberLabel'>Organiser Details:</p>
            <p className="clientName">
            <span> Location: {feedbackSummary.OrganizerData[0].Location}</span> &nbsp; &nbsp; &nbsp;
            <span> Date: {moment((feedbackSummary.OrganizerData[0].EventDate)).format("DD-MM-YYYY")}</span>
            </p>
            <ListGroup className="userListGroup">
                {feedbackSummary.OrganizerData.map((list) =>
                <Fragment key={list.user_id}>
                <ListGroup.Item className="userList">
                <div className='userDetails'>
                  <h6>{list.first_name} {list.last_name}</h6>
                  <p>{list.email}</p>
                </div>
               </ListGroup.Item>
                </Fragment>
              )}
            </ListGroup>
            </Col>
            </Row>}       
            </div>
            </div>
        )
    }
}

export default EventStatus;