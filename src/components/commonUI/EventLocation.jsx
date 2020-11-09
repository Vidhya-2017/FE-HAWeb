import React from 'react';
import clients from '../../common/clients';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
        this.setState({ eventLocation });
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== '' && (nextProps.eventLocationValue !== this.state.eventLocationValue)) {
      const location = this.state.eventLocation.find((loc) => loc.loc_id === nextProps.selectedValue);
      if (location && location.loc_id) {
        this.setState({ eventLocationValue: location });
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

  durationOnChange = (e, value) => {
    this.props.onEventChange({ target: { ...value, name: 'eventLocation' } });
  }

  render() {
    return (
      <div className='paper'>
        {/* <IonLabel>Event Location</IonLabel>
        <IonSelect  name='eventLocation' value={this.state.eventLocationValue} placeholder="Select Location" onIonChange={this.durationOnChange}>
          {this.state.eventLocation.map((list) =>
            <IonSelectOption key={list.loc_id} value={list.loc_id}>{list.loc_name}</IonSelectOption>
          )}
          {this.state.eventLocation.length === 0 &&
            <IonSelectOption key='no Data' disabled > Please add Location.</IonSelectOption>
          }
        </IonSelect> */}

        <Grid container spacing={2}>
          <Grid item xs={5} >
            <span>Event Location:</span>
          </Grid>

          <Grid item xs={7}>
            <Autocomplete
              options={this.state.eventLocation}
              getOptionLabel={option => option.label || option}
              value={this.state.eventLocationValue}
              defaultValue={this.state.eventLocationValue}
              onChange={this.durationOnChange}
              disabled={this.props.disabled}
              renderInput={params => (
                <TextField
                  {...params}
                  label={"Event Location"}
                  placeholder="Event Location"
                  margin="dense"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
        </Grid>

        {/* <Row>
          <Col className='fieldName'><span>Event Location:</span></Col>
          <Col>
            <Select
              value={this.state.eventLocationValue}
              onChange={(e, value) => this.durationOnChange(e)}
              options={this.state.eventLocation}
              defaultValue={this.state.eventLocationValue}
              styles={SelectStyles(215)}
              className="mb-3"
              placeholder='Event Location'
              isDisabled={this.props.isDisabled}
            />
          </Col>
        </Row> */}
      </div>
    );
  }
}

export default EventLocation;
