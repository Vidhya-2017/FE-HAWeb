import React, { Fragment } from 'react';
import Select from 'react-select';
import { Card, ListGroup } from 'react-bootstrap';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      selectedEvent: null,
      feedbackSummary: {}
    }
  }

  componentDidMount() {
    if(this.props.userDetails.user_id) {
      this.getEventList();
    } else {
      this.props.history.push('/');
    }
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
    const reqObj = {
      event_id: selectedEvent.value
    };
    this.setState({ selectedEvent });
    this.props.feedbackSummary(reqObj).then(response => {
      this.setState({ feedbackSummary: response.resultArr });      
    });
  }

  render() {
    const { eventList, selectedEvent, feedbackSummary } = this.state;
    return (
      <Fragment>
        <div className='eventStatusContainer'>
          <h3 className='pageTitle'>Event Status</h3>
          <section className='statusHandlerContainer'>
            <label className='eventLabel'>Event Name:</label>
            <Select
              value={selectedEvent}
              onChange={this.handleEventChange}
              options={eventList}
              styles={SelectStyles}
              placeholder='Select the Event'
            />
          </section>
          {feedbackSummary.SelectedEmp && <section className='statusList'>
            <Card className='card'>
              <Card.Header>
                <div className='statusContainer'><span>Total:</span><span>{feedbackSummary.TotalEmp}</span></div>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item variant="primary">
                  <div className='statusContainer'><span>In-Progress:</span><span>{feedbackSummary.InprocessEmp}</span></div>
                </ListGroup.Item>
                <ListGroup.Item variant="warning">
                  <div className='statusContainer'><span>On-Hold:</span><span>{feedbackSummary.HoldEmp}</span></div>
                </ListGroup.Item>
                <ListGroup.Item variant="success">
                  <div className='statusContainer'><span>Selected:</span><span>{feedbackSummary.SelectedEmp}</span></div>
                </ListGroup.Item>
                <ListGroup.Item variant="danger">
                  <div className='statusContainer'><span>Rejected:</span><span>{feedbackSummary.RejectedEmp}</span></div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </section>}
        </div>
      </Fragment>
    )
  }
}

export default Dashboard;