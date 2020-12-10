
import React from "react";
import {  Toolbar, Typography, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';

const useToolbarStyles = (theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1,
  }
});


const EnhancedTableToolbar = (props) => {
  const { classes, eventList, handleEventChange, handleSquadChange, handleSprintChange,
    squadList, sprintList, handleProceed, selectedSquad, selectedSprint, selectedEvent } = props;
  return (
    <>
      <Toolbar>
        <Typography className={classes.title} variant="h5" noWrap>
          Candidate Feedback
        </Typography>
      </Toolbar>
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '0 10px 10px' }}>
        <Autocomplete
          options={eventList}
          getOptionLabel={(option) => option.label}
          size="small"
          value={selectedEvent}
          style={{ maxWidth: 250, width: "100%", marginRight: 10, marginTop: 10 }}
          onChange={(event, newValue) => handleEventChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Select the Events" variant="outlined" />}
        />
        <Autocomplete
          options={squadList}
          getOptionLabel={(option) => option.label}
          size="small"
          value={selectedSquad}
          style={{ maxWidth: 250, width: "100%", marginRight: 10, marginTop: 10 }}
          onChange={(event, newValue) => handleSquadChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Select the Squad" variant="outlined" />}
        />
        <Autocomplete
          options={sprintList}
          getOptionLabel={(option) => option.label}
          size="small"
          value={selectedSprint}
          style={{ maxWidth: 250, width: "100%", marginRight: 10, marginTop: 10 }}
          onChange={(event, newValue) => handleSprintChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Select the Sprint" variant="outlined" />}
        />
        <Button size="small" variant="contained"
          style={{ padding: 10, minWidth: 120, marginTop: 10 }}
          onClick={handleProceed}
          disabled={selectedSprint === null}
          color="primary">
          Proceed
          </Button>
      </div>
    </>
  );
};

export default withStyles(useToolbarStyles, { withTheme: true })(EnhancedTableToolbar);
