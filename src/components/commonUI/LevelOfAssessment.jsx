import React, { Fragment } from 'react';
import { Row, Col, ListGroup, Form } from 'react-bootstrap';
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
      const levelAssmtVal = this.state.assessmentLevelList.find(list => list.value === nextProps.selectedValue);
      this.setState({ assessmentLevel: levelAssmtVal ? levelAssmtVal : null });

    }
    if (nextProps.selected !== this.props.selected) {
      this.setState({ selectedLevel: nextProps.selected });
    }
  }

  onLevelChange = (e) => {
    const selectedLevelCheck = [];
    if (Number(e.value) > 0) {
      for (let i = 0; i < Number(e.value) + 2; i++) {
        selectedLevelCheck.push({
          id: i,
          value: i === (Number(e.value) + 1) ? 'Final Assessment' : `Sprint ${i}`,
          checked: true
        });
      }
    }
    this.setState({ selectedLevel: selectedLevelCheck, assessmentLevel: e.value });
    this.props.onEventChange({ target: { ...e, name: 'assessmentLevel' } });
  }

  onSprintLevelChange = (e) => {
    const updateSelectedLevel = [...this.state.selectedLevel];
    updateSelectedLevel.find((list) => list.id === Number(e.target.value)).checked = e.target.checked;
    this.setState({ selectedLevel: updateSelectedLevel });
  }

  render() {
    const { selectedLevel, assessmentLevel, assessmentLevelList } = this.state;
    return (
      <Fragment>
        <Row>
          <Col className='fieldName'><span>No of Sprint:</span></Col>
          <Col>
            <Select
              value={assessmentLevel}
              onChange={this.onLevelChange}
              options={assessmentLevelList}
              defaultValue={assessmentLevel}
              styles={SelectStyles(215)}
              className="mb-3"
              placeholder='No of Sprint'
              isDisabled={this.props.isDisabled}
            />
          </Col>
        </Row>
        {selectedLevel.length > 0 && assessmentLevel &&
          <div>
            <ListGroup style={{ margin: '0px 10px 10px' }}>
              {selectedLevel.map((list) => (
                <ListGroup.Item key={list.id} style={{ height: 40, padding: '7px 20px', display: 'flex', justifyContent: 'space-between' }} disabled={this.props.disabled}>
                  <p>{list.value}</p>
                  <Form.Check
                    type="checkbox"
                    id={list.id}
                    checked={list.checked}
                    disabled={this.props.isDisabled}
                    label=""
                    value={list.id}
                    className='toggleUser'
                    onChange={this.onSprintLevelChange}
                  />
                  {/* <IonCheckbox slot="end" checked={list.checked} value={list.id} onIonChange={this.onSprintLevelChange} /> */}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>}
      </Fragment>
    );
  }
};

export default LevelOfAssessment;
