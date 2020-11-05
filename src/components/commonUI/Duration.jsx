import React from 'react';
import clients from '../../common/clients';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
      const durationVal = this.state.durationList.find(list => list.value === nextProps.selectedValue);
      this.setState({ durationValue: durationVal ? durationVal : null });
    }
  }

  durationOnChange = (e, value) => {
    this.props.onEventChange({ target: { ...value, name: 'duration' } });
  }

  render() {
    return (
      <div className='paper'>
        {/* <IonLabel>Duration</IonLabel>
        <IonSelect name='duration' value={this.state.durationValue} placeholder="Select Duration" onIonChange={this.durationOnChange}>
          {this.state.durationList.map((list) =>
            <IonSelectOption key={list.DurationID} value={list.DurationID}>{list.Duration}</IonSelectOption>
          )}
        </IonSelect> */}
        <Grid container spacing={2}>
          <Grid item xs={5} >
            <span>Duration:</span>
          </Grid>

          <Grid item xs={7}>
            <Autocomplete
              options={this.state.durationList}
              getOptionLabel={option => option.label || option}
              value={this.state.durationValue}
              defaultValue={this.state.durationValue}
              onChange={this.durationOnChange}
              disabled={this.props.disabled}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Duration"
                  placeholder="Duration"
                  margin="dense"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
        </Grid>
        {/* <Row>
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
              isDisabled={this.props.isDisabled}
            />
          </Col>
        </Row> */}
      </div>
    );
  }
}

export default Duration;
