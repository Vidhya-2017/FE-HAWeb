import React from 'react';
import { Paper, withStyles, Container, MenuItem, FormControl, IconButton, InputBase, Select, InputLabel } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';



const styles = (theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 300,
    border: 'solid 1px lightgrey',
    height: 56
  },
  containerRoot: {
    display: 'flex',
  },
  formControl: {
    margin: '0 8px 8px',
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: 500
  },
  iconButton: {
    padding: 10,
  },

});

export class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tableData: {},
      searchColumn: '',
      searchInput: ''
    }

  }
  onChangeSearchInput = (e) => {
    this.setState({
      searchColumn: e.target.value,
      searchInput: ''
    })
  }

  handleChange = (e) => {
    const searchText = e.target.value;
    this.setState({

      searchInput: e.target.value,
    })
    const reqObj = {
      search_column: this.state.searchColumn,
      search_text: searchText
    }
    this.props.getSearchResult(reqObj);
  }
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Container className={classes.containerRoot}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Search Column</InputLabel>
            <Select
              value={this.state.searchColumn}
              placeholder="Search Column"
              onChange={this.onChangeSearchInput}
              label="Search Column"
            >
              <MenuItem value="name"> Name</MenuItem>
              <MenuItem value="contact"> Contact No.</MenuItem>
              <MenuItem value="email_id"> Email</MenuItem>
              <MenuItem value="total_experience"> Total Experience</MenuItem>
              <MenuItem value="relevant_experience"> Relevant Experience</MenuItem>
              <MenuItem value="current_company"> Current Company</MenuItem>
              <MenuItem value="notice_period"> Notice Period</MenuItem>
              <MenuItem value="current_location"> Current Location</MenuItem>
              <MenuItem value="preferred_loction"> Preferred Loction</MenuItem>
              <MenuItem value="hr_test_taken"> Hacker Rank Test</MenuItem>
              <MenuItem value="hr_score"> Hacker Rank Score</MenuItem>
              <MenuItem value="hr_remarks"> Hacker Rank Remarks</MenuItem>
              <MenuItem value="spoc"> SPOC</MenuItem>
              <MenuItem value="testlink_received_dt"> Testlink Received Datet</MenuItem>
              <MenuItem value="test_completed_dt"> Test Completed Date</MenuItem>
              <MenuItem value="source"> Source</MenuItem>
              <MenuItem value="tp1_status"> TP1 Status</MenuItem>
              <MenuItem value="tp2_status"> TP2 Status</MenuItem>
              <MenuItem value="fitment"> Fitment</MenuItem>
              <MenuItem value="offer"> Offer</MenuItem>
              <MenuItem value="recruiter"> Recruiter</MenuItem>
              <MenuItem value="primary_skill"> Primary</MenuItem>
              <MenuItem value="secondary_skill"> Secondary</MenuItem>
            </Select>
          </FormControl>
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Enter Search Value"
              onChange={this.handleChange}
              value={this.state.searchInput}
              inputProps={{ 'aria-label': 'Enter Search Value' }}
            />
            <IconButton disabled className={classes.iconButton} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Search);
