import React from 'react';
import Select from 'react-select';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/Report.scss';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      selectedEvent: null,
      selectedEventData: {}
    }
  }

  componentDidMount() {
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
    const { eventData } = this.state;
    const getEventDetails = eventData.find(list => list.EventId === selectedEvent.value);
    this.setState({ selectedEvent, selectedEventData: getEventDetails });
  }

  render() {
    const { eventList, selectedEvent, selectedEventData } = this.state;
    console.log('---selectedEventData---', selectedEventData);
    return (
      <div className='eventContainer'>
        <h3 className='pageTitle'>Event Reports</h3>
        <section className='reportHandlerContainer'>
          <label className='eventLabel'>Event Name:</label>
          <Select
            value={selectedEvent}
            onChange={this.handleEventChange}
            options={eventList}
            styles={SelectStyles}
            placeholder='Select the Event'
          />
        </section>
        {selectedEvent && <div className='eventDetailsWrapper'>
          <h4> Event Details:</h4>
          <p>Name: {selectedEventData.Name}</p>
          <p>Date: {new Date(selectedEventData.EventDate).toLocaleDateString()}</p>
        </div>}
      </div>

    )
  }
}

export default Report;