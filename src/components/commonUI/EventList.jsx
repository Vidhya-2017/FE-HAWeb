import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import clients from '../../common/clients';
import './css/SkillListMenu.css'

class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventNameList: props.selectedValue,
      eventList: []
    };
  }

  componentDidMount() {
    this.getEventList();
  }

  getEventList = async () => {
    try {
      const response = await clients.axiosAPI.get('/RegEventList.php');
      const eventList = response.data.arrRes.map(list => {
        return {
          value: list.EventId,
          EventId: list.EventId,
          label: list.Name
        }
      });
      this.setState({ eventList });
    }
    catch (error) {
      return (error.response);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.eventNameList) {
      this.setState({ eventNameList: nextProps.selectedValue });
    }
  }

  onEventNameChange = (e) => {
    const eventListArr = this.state.eventList.find((list) => list.EventId === e.detail.value);
    this.setState({
      eventNameList: e.detail.value
    });
    this.props.onEventListChange(e, eventListArr);
  }

  render() {
    const { eventNameList, eventList } = this.state;
    return (
      <Fragment>
        {/* <IonItem>
          <IonLabel>Event Name</IonLabel>
          <IonSelect name='eventName' value={eventNameList} onIonChange={this.onEventNameChange} placeholder="Select event name">
            {eventList.map((item) =>
              <IonSelectOption key={`${item.Name}-${item.EventId}`} value={item.EventId}>{item.Name}</IonSelectOption>
            )}
          </IonSelect>
        </IonItem> */}

        <Row>
          <Col className='fieldName'><span>Event Name:</span></Col>
          <Col>
            <Select
              value={this.state.eventNameList}
              onChange={this.onEventNameChange}
              options={this.state.eventList}
              defaultValue={this.state.eventNameList}
              styles={SelectStyles(220)}
              className="mb-3"
              placeholder='Event Name'
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default EventList;