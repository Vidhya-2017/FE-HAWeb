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
      selectedSkillSet: props.selectedValue,
      showSkillChips: !!props.showSkillChips,
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
        this.setState({ selectedSkillSet: nextProps.selectedValue });
      }
    }
    if (nextProps.eventSkillList !== this.state.eventSkillList && nextProps.isCandidateSkill) {
      const eventSkillArr = this.skillList.filter((list) => nextProps.eventSkillList.includes(list.SkillId));
      this.setState({ skillSetList: eventSkillArr });
    }
  }

  skillOnChange = (e) => {
    this.setState({
      selectedSkillSet: e.detail.value
    });
    this.props.onEventChange(e);
  }

  onIconClick = (value) => {
    const { selectedSkillSet } = this.state;
    const filteredItems = selectedSkillSet.filter((item) => item !== value);
    this.setState({ selectedSkillSet: filteredItems });
  }

  render() {
    const { selectedSkillSet, showSkillChips, skillSetList } = this.state;
    return (
      <Fragment>
        <Row>
          <Col className='fieldName'><span>Skill List:</span></Col>
          <Col>
            <Select
              value={this.state.selectedSkillSet}
              onChange={this.skillOnChange}
              options={this.state.skillSetList}
              defaultValue={this.state.selectedSkillSet}
              styles={SelectStyles(220)}
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
        {/* {showSkillChips && selectedSkillSet.length > 0 && <div className='skillSetContainer'>

          {selectedSkillSet.map((value, index) =>
            (
              value !== 'others' &&
              <IonChip outline color="dark" key={index}>
                <IonLabel>{skillSetList && skillSetList.find((item) => item.SkillId === value) && skillSetList.find((item) => item.SkillId === value).Skills}</IonLabel>
                {!this.props.eventDisabled && <IonIcon onClick={() => this.onIconClick(value)} name="close-circle"></IonIcon>}
              </IonChip>
            )
          )}
          {
            selectedSkillSet.indexOf('others') >= 0 &&
            <IonTextarea placeholder="Enter other skill set details..."></IonTextarea>
          }
        </div>} */}
      </Fragment>
    );
  }
}

export default SkillListMenu;