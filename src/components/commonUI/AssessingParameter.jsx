import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import clients from '../../common/clients';

class AssessingParameter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessingParameter: props.selectedValue,
      assessingParameterList: []
    }
  }

  componentDidMount() {
    this.getAssessList().then((response) => {
      if (response && response.arrRes) {
        const assessingParameterList = response.arrRes.map(list => {
          return {
            value: list.AssId,
            AssId: list.AssId,
            label: list.AssName,
            AssVal: list.AssVal
          }
        });
        this.setState({ assessingParameterList, assessingParameter: this.props.selectedValue });
      }
    });
  }

  getAssessList = async () => {
    try {
      const data = { event_id: 0 };
      const response = await clients.axiosAPI.post('/OtherAssessList.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.state.assessingParameterList.length > 0 && nextProps.selectedValue !== this.state.assessingParameter) {
      const paramsVal  = this.state.assessingParameterList.filter(f => nextProps.selectedValue.includes(f.value));
      this.setState({ assessingParameter: paramsVal ? paramsVal : null });
    }
  }

  assessingPrmtrOnChange = (assessingParameter) => {
    this.setState({
      assessingParameter: assessingParameter
    });
    const value = [];
    if(assessingParameter) {
      assessingParameter.forEach(item => {
        value.push(item.value)
      })
    }
    this.props.onEventChange({target: {value, name: 'assessingParameter'}});
  }

  render() {
    const { assessingParameter, assessingParameterList } = this.state;
    return (
      <Fragment>
        {/* <IonLabel></IonLabel>
        <IonSelect name='assessingParameter' value={assessingParameter} multiple={true} placeholder="Select Parameter" onIonChange={this.assessingPrmtrOnChange}>
          {assessingParameterList.map((list) =>
            <IonSelectOption key={list.AssId} value={list.AssId}>{list.AssName}</IonSelectOption>
          )}
        </IonSelect> */}
        <Row>
          <Col className='fieldName'><span>Assessing Parameter:</span></Col>
          <Col>
            <Select
              onChange={this.assessingPrmtrOnChange}
              options={assessingParameterList}
              defaultValue={assessingParameter}
              value={assessingParameter}
              styles={SelectStyles(215)}
              isMulti
              closeMenuOnSelect={false}
              className="mb-3"
              isDisabled={this.props.isDisabled}
              placeholder='Assessing Parameter'
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default AssessingParameter;
