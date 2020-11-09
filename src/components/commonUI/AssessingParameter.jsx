import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';
import clients from '../../common/clients';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
      const paramsVal = this.state.assessingParameterList.filter(f => nextProps.selectedValue.includes(f.value));
      this.setState({ assessingParameter: paramsVal ? paramsVal : null });
    }
  }

  assessingPrmtrOnChange = (e, assessingParameter) => {
    this.setState({
      assessingParameter: assessingParameter
    });
    const value = [];
    if (assessingParameter) {
      assessingParameter.forEach(item => {
        value.push(item.value)
      })
    }
    this.props.onEventChange({ target: { value, name: 'assessingParameter' } });
  }

  render() {
    const { assessingParameter, assessingParameterList } = this.state;
    const che = assessingParameter ? assessingParameter : []
    return (
      <Fragment>
        <Grid container spacing={2}>
          <Grid item xs={5} >
            <span>Assessing Parameter:</span>
          </Grid>

          <Grid item xs={7}>
            <div>
              <Autocomplete
                multiple
                options={assessingParameterList}
                getOptionLabel={option => option ? option.label : ''}
                value={che}
                defaultValue={che}
                onChange={this.assessingPrmtrOnChange}
                disabled={this.props.disabled}
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
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Assessing Parameter"
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
      </Fragment>
    );
  }
}

export default AssessingParameter;
