import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import './css/SkillListMenu.css'
import clients from '../../common/clients';


class SkillListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSkillSet: null,
      skillSetList: [],
      eventSkillList: []
    };
    this.skillList = [];
  }

  componentDidMount() {
    this.getSkillSetList().then((response) => {
      if (response && response.arrRes) {
        const skillSetList = response.arrRes.map(list => {
          return {
            value: list.SkillId,
            SkillId: list.SkillId,
            label: list.Skills
          }
        });
        if (this.props.isCandidateSkill) {
          this.setState({ skillSetList });
          this.skillList = response.arrRes;
        } else {
          this.setState({ skillSetList });
        }
      }
    })
  }

  getSkillSetList = async () => {
    try {
      const response = await clients.axiosAPI.get('/skillList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.selectedSkillSet) {
      if (this.state.skillSetList.length !== 0) {
        
        this.setState({ selectedSkillSet: this.state.skillSetList.find(list => list.value === nextProps.selectedValue) });
      }
    }
    if (nextProps.eventSkillList !== this.state.eventSkillList && nextProps.isCandidateSkill) {
      const eventSkillArr = this.skillList.filter((list) => nextProps.eventSkillList.includes(list.SkillId));
      this.setState({ skillSetList: eventSkillArr });
    }
  }

  skillOnChange = (e) => {
    console.log('---e---', e);
    this.setState({
      selectedSkillSet: e
    });
    // this.props.onEventChange({target: {...e, name: 'skillset'}});
  }


  render() {
    const { selectedSkillSet, skillSetList } = this.state;
    return (
      <Fragment>
        <Row>
          <Col className='fieldName'><span>Skill List:</span></Col>
          <Col>
            <Select
              value={selectedSkillSet}
              onChange={this.skillOnChange}
              options={skillSetList}
              defaultValue={selectedSkillSet}
              styles={SelectStyles(220)}
              isMulti
              closeMenuOnSelect={false}
              className="mb-3"
              placeholder='Skill List'
            />
          </Col>
        </Row>
        {/* <IonItem disabled={this.props.eventDisabled}>
          <IonLabel>Skill List</IonLabel>
          <IonSelect name='skillset' multiple={true} value={selectedSkillSet} onIonChange={this.skillOnChange} placeholder="Select skills">
            {
              skillSetList.map((item) =>
              item.Skills !==""? <IonSelectOption key={item.SkillId} value={item.SkillId}>{item.Skills}</IonSelectOption>: null
              )
            }
          </IonSelect>
        </IonItem> */}
      </Fragment>
    );
  }
}

export default SkillListMenu;