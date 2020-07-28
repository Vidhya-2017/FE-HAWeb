import React, { Fragment } from 'react';

import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import clients from '../../common/clients';

class Duration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      durationValue: props.selectedValue,
      durationList: []
    }
  }


  componentDidMount() {
    this.getDurationList();
  }

  getDurationList = async () => {
    try {
      const response = await clients.axiosAPI.get('/durationList.php');
      const durationList = response.data.arrRes.map(list => {
        return {
          value: list.DurationID,
          DurationID: list.DurationID,
          label: list.Duration,
        }
      });
      this.setState({ durationList });
    }
    catch (error) {
      return (error.response);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.durationValue) {
      this.setState({ durationValue: nextProps.selectedValue });
    }
  }

  durationOnChange = (e) => {
    this.props.onEventChange({target: {...e, name: 'duration'}});
  }

  render() {
    return (
      <Fragment>
        {/* <IonLabel>Duration</IonLabel>
        <IonSelect name='duration' value={this.state.durationValue} placeholder="Select Duration" onIonChange={this.durationOnChange}>
          {this.state.durationList.map((list) =>
            <IonSelectOption key={list.DurationID} value={list.DurationID}>{list.Duration}</IonSelectOption>
          )}
        </IonSelect> */}
        <Row>
          <Col className='fieldName'><span>Duration:</span></Col>
          <Col>
            <Select
              value={this.state.durationValue}
              onChange={this.durationOnChange}
              options={this.state.durationList}
              defaultValue={this.state.durationValue}
              styles={SelectStyles(215)}
              className="mb-3"
              placeholder='Duration'
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default Duration;
