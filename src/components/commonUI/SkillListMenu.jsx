import React from 'react';
import './css/SkillListMenu.css'
import { Grid, TextField } from '@material-ui/core';
import clients from '../../common/clients';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
            label: list.Skills.length > 0 ? list.Skills : '---'
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
        const skillVal = this.state.skillSetList.filter(f => nextProps.selectedValue.includes(f.value));
        this.setState({ selectedSkillSet: skillVal ? skillVal : [] });
      }
    }
    if (nextProps.eventSkillList !== this.state.eventSkillList && nextProps.isCandidateSkill) {
      const eventSkillArr = this.skillList.filter((list) => nextProps.eventSkillList.includes(list.SkillId));
      this.setState({ skillSetList: eventSkillArr });
    }
  }


  skillOnChange = (e, selectedSkillSet) => {
    this.setState({
      selectedSkillSet
    });
    const value = [];
    if (selectedSkillSet) {
      selectedSkillSet.forEach(item => {

        value.push(item.value)
      })
    }
    this.props.onEventChange({ target: { value, name: 'skillset' } });
    // this.props.onEventChange({target: {...e, name: 'skillset'}});
  }


  render() {
    const { selectedSkillSet, skillSetList } = this.state;
    const selectedSkillSets = selectedSkillSet ? selectedSkillSet : [];

    return (
      <div className='paper'>
        <Grid container spacing={2}>
          <Grid item xs={5} >
            <span>Skill List:</span>
          </Grid>

          <Grid item xs={7}>
            <div>
              <Autocomplete
                multiple
                options={skillSetList}
                getOptionLabel={option => option.label || option}
                value={selectedSkillSets}
                defaultValue={selectedSkillSets}
                disableCloseOnSelect
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      color="primary"
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.label}
                  </React.Fragment>
                )}
                onChange={this.skillOnChange}
                disabled={this.props.disabled}
                limitTags={2}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Skill List"
                    placeholder="Skills"
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
          <IonLabel>Skill List</IonLabel>
          <IonSelect name='skillset' multiple={true} value={selectedSkillSet} onIonChange={this.skillOnChange} placeholder="Select skills">
            {
              skillSetList.map((item) =>
              item.Skills !==""? <IonSelectOption key={item.SkillId} value={item.SkillId}>{item.Skills}</IonSelectOption>: null
              )
            }
          </IonSelect>
        </IonItem> */}
      </div>
    );
  }
}

export default SkillListMenu;