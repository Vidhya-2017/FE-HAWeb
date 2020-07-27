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
      this.setState({ assessingParameter: nextProps.selectedValue });
    }
  }

  assessingPrmtrOnChange = (e) => {
    this.setState({
      assessingParameter: e.detail.value
    });
    this.props.onEventChange(e);
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
              value={assessingParameter}
              onChange={this.handleEventChange}
              options={assessingParameterList}
              defaultValue={assessingParameter}
              styles={SelectStyles(220)}
              className="mb-3"
              placeholder='Assessing Parameter'
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default AssessingParameter;
