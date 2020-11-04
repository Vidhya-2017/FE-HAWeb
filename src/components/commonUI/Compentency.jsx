import React from 'react';
import clients from '../../common/clients';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './css/SkillListMenu.css';

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
        const compentencyVal = this.state.compentencySetList.filter(f => nextProps.selectedValue.includes(f.value));
        this.setState({ selectedCompentency: compentencyVal ? compentencyVal : null });
      }
    }
    if (nextProps.eventcompentencyList !== this.state.eventcompentencyList && nextProps.isCompentency) {
      const eventSkillArr = this.compentencyList.filter((list) => nextProps.eventcompentencyList.includes(list.SkillId));
      this.setState({ compentencySetList: eventSkillArr });
    }
  }

  compentencyOnChange = (e, selectedCompentency) => {
    this.setState({
      selectedCompentency: selectedCompentency
    });
    const value = [];
    if (selectedCompentency) {
      selectedCompentency.forEach(item => {
        value.push(item.value)
      })
    }
    this.props.onEventChange({ target: { value, name: 'competancy' } });
  }

  onIconClick = (value) => {
    const { selectedCompentency } = this.state;
    const filteredItems = selectedCompentency.filter((item) => item !== value);
    this.setState({ selectedCompentency: filteredItems });
  }

  render() {
    const { compentencySetList, selectedCompentency } = this.state;
    const selectedCompentencys = selectedCompentency ? selectedCompentency : [];

    return (
      <div className='paper'>
        <Grid container spacing={2}>
          <Grid item xs={5} >
            <span>Compentency Rating:</span>
          </Grid>

          <Grid item xs={7}>
            <div>
              <Autocomplete
                multiple
                options={compentencySetList}
                getOptionLabel={option => option.label}
                value={selectedCompentencys}
                defaultValue={selectedCompentencys}
                onChange={this.compentencyOnChange}
                disabled={this.props.disabled}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Compentency Rating"
                    placeholder="Select"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
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
      </div>
    );
  }
}

export default competancyList;