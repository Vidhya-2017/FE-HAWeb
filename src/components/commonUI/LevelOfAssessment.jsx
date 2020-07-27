import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import clients from '../../common/clients';

class LevelOfAssessment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      assessmentLevel: props.selectedValue,
      selectedLevel: props.selected,
      assessmentLevelList: []
    }
  }

  componentDidMount() {
    this.getAssessingParamsList().then((response) => {
      if (response && response.arrRes) {
        const assessmentLevelList = response.arrRes.map(list => {
          return {
            value: list.AssessmentId,
            AssessmentId: list.AssessmentId,
            label: list.AssementScaleName
          }
        });
        this.setState({ assessmentLevelList, selectedLevel: this.props.selected, assessmentLevel: this.props.selectedValue });
      }
    })
  }

  getAssessingParamsList = async () => {
    try {
      const response = await clients.axiosAPI.get('/assesscaleList.php');
      return (response.data);

    }
    catch (error) {
      return (error.response);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.assessmentLevel) {
      this.setState({ assessmentLevel: nextProps.selectedValue });
    }
    if (nextProps.selected !== this.props.selected) {
      this.setState({ selectedLevel: nextProps.selected });
    }
  }

  onLevelChange = (e) => {
    const selectedLevelCheck = [];
    if (Number(e.target.value) > 0) {
      for (let i = 0; i < Number(e.target.value) + 2; i++) {
        selectedLevelCheck.push({
          id: i,
          value: i === (Number(e.target.value) + 1) ? 'Final Assessment' : `Sprint ${i}`,
          checked: true
        });
      }
    }
    this.setState({ selectedLevel: selectedLevelCheck, assessmentLevel: e.target.value });
    this.props.onEventChange(e);
  }

  onSprintLevelChange = (e) => {
    const updateSelectedLevel = [...this.state.selectedLevel];
    updateSelectedLevel.find((list) => list.id === Number(e.detail.value)).checked = e.detail.checked;
    this.setState({ selectedLevel: updateSelectedLevel });
  }

  render() {
    const { selectedLevel, assessmentLevel, assessmentLevelList } = this.state;
    return (
      <Fragment >

        <Row>
          <Col className='fieldName'><span>No of Sprint:</span></Col>
          <Col>
            <Select
              value={this.state.assessmentLevel}
              onChange={this.onLevelChange}
              options={this.state.assessmentLevelList}
              defaultValue={this.state.assessmentLevel}
              styles={SelectStyles(220)}
              className="mb-3"
              placeholder='No of Sprint'
            />
          </Col>
        </Row>
        {/* <IonItem disabled={this.props.disabled}>
          <IonLabel>No of Sprint</IonLabel>
          <IonSelect name='assessmentLevel' value={assessmentLevel} placeholder="Select level" onIonChange={this.onLevelChange}>
            {
              assessmentLevelList.map((list) =>
                <IonSelectOption key={list.AssessmentId} value={list.AssessmentId}>{list.AssementScaleName}</IonSelectOption>
              )
            }
          </IonSelect>
        </IonItem>
        {selectedLevel.length > 0 &&
          <div>
            <IonList >
              {selectedLevel.map((list) => (
                <IonItem key={list.id} disabled={this.props.disabled}>
                  <IonLabel>{list.value}</IonLabel>
                  <IonCheckbox slot="end" checked={list.checked} value={list.id} onIonChange={this.onSprintLevelChange} />
                </IonItem>
              ))}
            </IonList>
          </div>} */}
      </Fragment>
    );
  }
};

export default LevelOfAssessment;
