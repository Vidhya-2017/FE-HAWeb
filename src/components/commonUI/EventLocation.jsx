import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import clients from '../../common/clients';

class EventLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventLocationValue: props.selectedValue,
      eventLocation: []
    }
  }

  componentDidMount() {
    this.getEventList().then((response) => {
      if (response && response.arrRes) {
        const eventLocation = response.arrRes.map(list => {
          return {
            value: list.loc_id,
            loc_id: list.loc_id,
            label: list.loc_name
          }
        });
        this.setState({ eventLocation, eventLocationValue: this.props.selectedValue });
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== '' && (nextProps.eventLocationValue !== this.state.eventLocationValue)) {
      const location = this.state.eventLocation.find((loc) => loc.loc_id === nextProps.selectedValue);
      if (location && location.loc_id) {
        this.setState({ eventLocationValue: location.loc_id });
      }
    }
  }

  getEventList = async () => {
    try {
      const response = await clients.axiosAPI.get('/locationList.php');
      return (response.data);

    }
    catch (error) {
      return (error.response);
    }
  }



  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.eventLocationValue) {
      this.setState({ eventLocationValue: nextProps.selectedValue });
    }
  }

  durationOnChange = (e) => {
    this.props.onEventChange(e);
  }

  render() {
    return (
      <Fragment>
        {/* <IonLabel>Event Location</IonLabel>
        <IonSelect  name='eventLocation' value={this.state.eventLocationValue} placeholder="Select Location" onIonChange={this.durationOnChange}>
          {this.state.eventLocation.map((list) =>
            <IonSelectOption key={list.loc_id} value={list.loc_id}>{list.loc_name}</IonSelectOption>
          )}
          {this.state.eventLocation.length === 0 &&
            <IonSelectOption key='no Data' disabled > Please add Location.</IonSelectOption>
          }
        </IonSelect> */}

        <Row>
          <Col className='fieldName'><span>Event Location:</span></Col>
          <Col>
            <Select
              value={this.state.eventLocationValue}
              onChange={this.durationOnChange}
              options={this.state.eventLocation}
              defaultValue={this.state.eventLocationValue}
              styles={SelectStyles(220)}
              className="mb-3"
              placeholder='Event Location'
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default EventLocation;
