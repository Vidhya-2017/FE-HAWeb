import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import './css/SkillListMenu.css';
import clients from '../../common/clients';

class competancyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompentency: props.selectedValue,
      showCompentencyChips: !!props.showCompentencyChips,
      compentencySetList: [],
      eventcompentencyList: []
    };
    this.compentencyList = [];
  }

  componentDidMount() {
    this.getCompentencySetList().then((response) => {
      if (response && response.arrRes) {
        const compentencySetList = response.arrRes.map(list => {
          return {
            value: list.ID,
            ID: list.ID,
            label: list.CompetancyName,
          }
        });
        if (this.props.isCompentency) {
          this.setState({ compentencySetList: compentencySetList });
          this.compentencyList = response;
        } else {
          this.setState({ compentencySetList: compentencySetList });
        }
      }
    })
  }

  getCompentencySetList = async () => {
    try {
      const response = await clients.axiosAPI.get('/competancyList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedValue !== this.state.selectedCompentency) {
      if (this.state.compentencySetList.length !== 0) {
        this.setState({ selectedCompentency: nextProps.selectedValue });
      }
    }
    if (nextProps.eventcompentencyList !== this.state.eventcompentencyList && nextProps.isCompentency) {
      const eventSkillArr = this.compentencyList.filter((list) => nextProps.eventcompentencyList.includes(list.SkillId));
      this.setState({ compentencySetList: eventSkillArr });
    }
  }

  compentencyOnChange = (e) => {
    this.setState({
      selectedCompentency: e.detail.value
    });
    this.props.onEventChange(e);
  }

  onIconClick = (value) => {
    const { selectedCompentency } = this.state;
    const filteredItems = selectedCompentency.filter((item) => item !== value);
    this.setState({ selectedCompentency: filteredItems });
  }

  render() {
    const { selectedCompentency, showCompentencyChips, compentencySetList } = this.state;
    return (
      <Fragment>
        <Row>
          <Col className='fieldName'><span>Compentency Rating:</span></Col>
          <Col>
            <Select
              value={selectedCompentency}
              onChange={this.handleEventChange}
              options={compentencySetList}
              defaultValue={selectedCompentency}
              styles={SelectStyles(220)}
              className="mb-3"
              placeholder='Compentency Rating'
            />
          </Col>
        </Row>
        {/* <IonItem disabled={this.props.eventDisabled}>
          <IonLabel>Compentency Rating</IonLabel>
          <IonSelect name='competancy' multiple={true} value={selectedCompentency} onIonChange={this.compentencyOnChange} placeholder="Select Compentency">
            {
              compentencySetList.map((item) =>
                item.CompetancyName !== "" ? <IonSelectOption key={item.ID} value={item.ID}>{item.CompetancyName}</IonSelectOption> : null
              )
            }
          </IonSelect>
        </IonItem> */}
        {/* {showCompentencyChips && selectedCompentency.length > 0 && <div className='skillSetContainer'>

          {selectedCompentency.map((value, index) =>
            (
              value !== 'others' &&
              <IonChip outline color="dark" key={index}>
                <IonLabel>{compentencySetList.find((item) => item.ID === value) && compentencySetList.find((item) => item.ID === value).CompetancyName}</IonLabel>
                {!this.props.eventDisabled && <IonIcon onClick={() => this.onIconClick(value)} name="close-circle"></IonIcon>}
              </IonChip>
            )
          )}
          {
            selectedCompentency.indexOf('others') >= 0 &&
            <IonTextarea placeholder="Enter other skill set details..."></IonTextarea>
          }
        </div>} */}
      </Fragment>
    );
  }
}

export default competancyList;