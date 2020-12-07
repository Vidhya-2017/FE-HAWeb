import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table, TableContainer, Toolbar, Typography, Paper, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
      </Typography>
      <Autocomplete
        id="combo-box-demo"
        options={props.sheetOptions}
        getOptionLabel={(option) => option.label}
        style={{ width: 300 }}
        size="small"
        onChange={(event, newValue) => props.handleChange(newValue)}
        renderInput={(params) => <TextField {...params} label="Select the Sheets" variant="outlined" />}
      />
      <Button size="small" variant="contained" style={{ padding: 10, width: 120, marginLeft: 10 }} color="primary"
      >
        Submit
        </Button>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  tablecell: { padding: 10 },
  tableHeaderCell: { padding: 10, borderBottom: '1px solid #616161' },
  paperRoot: { margin: '0 20px' },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));
export default function CandidateFeedbackNew() {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar  />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </Paper>
  );
}

