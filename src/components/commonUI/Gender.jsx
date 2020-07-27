import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';

class Gender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      genderValue: props.selectedValue,
      genderList: [{
        value: 'Male',
        label: 'Male'
      },
      {
        value: 'Female',
        label: 'Female'
      }]
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.genderValue) {
      this.setState({ genderValue: nextProps.selectedValue });
    }
  }

  onChangeGender = (e) => {
    this.props.onGenderChange(e);
  }

  render() {
    return (
      <Fragment>
        {/* <IonItem>
          <IonLabel>Gender</IonLabel>
          <IonSelect name='gender' value={this.state.genderValue} placeholder="Select Gender" onIonChange={this.onChangeGender}>
          {this.state.genderList.map((list) =>
            <IonSelectOption key={list} value={list}>{list}</IonSelectOption>
          )}
          </IonSelect>
        </IonItem> */}


        <Row>
          <Col className='fieldName'><span>Gender:</span></Col>
          <Col>
            <Select
              value={this.state.genderValue}
              onChange={this.onChangeGender}
              options={this.state.genderList}
              defaultValue={this.state.genderValue}
              styles={SelectStyles(220)}
              className="mb-3"
              placeholder='Gender'
            />
          </Col>
        </Row>
      </Fragment>

    );
  }
}

export default Gender;
