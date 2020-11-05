import React from 'react';
import clients from '../../common/clients';
import { Grid, TextField, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

  onLevelChange = (e, assesmentValue) => {
    const selectedLevelCheck = [];
    if (assesmentValue != null && assesmentValue) {
      if (Number(assesmentValue.value) > 0) {
        for (let i = 0; i < Number(assesmentValue.value) + 2; i++) {
          selectedLevelCheck.push({
            id: i,
            value: i === (Number(assesmentValue.value) + 1) ? 'Final Assessment' : `Sprint ${i}`,
            checked: true
          });
        }
      }
      this.setState({ selectedLevel: selectedLevelCheck, assessmentLevel: assesmentValue.value });
      this.props.onEventChange({ target: { ...assesmentValue, name: 'assessmentLevel' } });
    }

  }

  onSprintLevelChange = (e) => {
    const updateSelectedLevel = [...this.state.selectedLevel];
    updateSelectedLevel.find((list) => list.id === Number(e.target.value)).checked = e.target.checked;
    this.setState({ selectedLevel: updateSelectedLevel });
  }

  render() {
    const { selectedLevel, assessmentLevel, assessmentLevelList } = this.state;
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <span>No of Sprint:</span>
          </Grid>
          <Grid item xs={7}>
            {assessmentLevelList.length > 0 && <Autocomplete
              closeIcon=""
              options={assessmentLevelList}
              getOptionLabel={option => option.label || option}
              value={assessmentLevel}
              defaultValue={assessmentLevel}
              onChange={this.onLevelChange}
              disabled={this.props.disabled}
              renderInput={params => (
                <TextField
                  {...params}
                  label="No of Sprint"
                  placeholder="No of Sprint"
                  margin="dense"
                  variant="outlined"
                />
              )}
            />}
          </Grid>
        </Grid>

        {selectedLevel.length > 0 && assessmentLevel &&
          <TableContainer component={Paper}>
            <Table  size="small" >
              <TableBody>
                {selectedLevel.map((list) => (
                 <TableRow key={list.id}>
                    <TableCell component="th" scope="row">
                    {list.value}
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox
                        defaultChecked={list.checked}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                        value={list.id}
                        disabled={this.props.disabled}
                        onChange={this.onSprintLevelChange}
                      />
                    </TableCell>  
                  </TableRow>
                ))}
              </TableBody>
            </Table>  
          </TableContainer>
         }
      </div>
    );
  }
};

export default LevelOfAssessment;
