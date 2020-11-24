import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Button, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CandidateUploadActions } from '../modules/CandidateUploadActions';
import Alert from '@material-ui/lab/Alert';
import DialogPopUp from './DialogPopUp';
import CustomiseView from './CustomiseView';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, columns } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow style={{ background: 'rgba(0, 0, 0, 0.12)', border: '1px solid #616161' }}>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            className={classes.tableHeaderCell}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [validRowCount, setValidRowCount] = React.useState(0);
  const [showDialog, setShowDialog] = React.useState(false);
  const validRowDetails = (rows) => {
    const rowCount = rows.filter(row => pattern.test(row.EmailId.trim()))
    setValidRowCount(rowCount)
  }

  useEffect(() => {
    validRowDetails(props.rows);
  }, [props.rows]);

  const closeDialog = () => setShowDialog(false);

  const handleSubmit = (eventData) => {
    const reqObj = {
      data: props.rows,
      EventId: eventData.EventId
    }
    CandidateUploadActions.candidateBulkUpload(reqObj).then(response => {
      setShowDialog(false);
      props.submitCB(reqObj, response);
    });
  }

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
    <Button size="small" variant="contained" style={{ padding: 10, width: 120, marginLeft: 10 }}        onClick={() => setShowDialog(true)} color="primary"
        disabled={!(props.rows.length > 0 && props.rows.length === validRowCount.length)}
      >
        Submit
        </Button>
      <CustomiseView
        buttonName='View Type'
        status={view}
        setViewType={props.setViewType}
      />
      <DialogPopUp showDialog={showDialog} closeDialog={closeDialog} handleSubmit={handleSubmit} />
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

const view = [
  { id: 1, title: 'All' },
  { id: 2, title: 'Valid Candidates' },
  { id: 3, title: 'In-valid Candidates' }
]
let ConstantRow = [];
export default function CandidateTable({ column, row, sheets, handleChange, submitUpload }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState();
  const [page, setPage] = React.useState(0);
  const [columns, setcolumns] = React.useState(column);
  const [rows, setrows] = React.useState(row);
  ConstantRow = row;
  const [sheetOptions, setSheetOptions] = React.useState(sheets);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  useEffect(() => {
    setcolumns(column)
  }, [column]);

  useEffect(() => {
    let uniqueChars = row.filter((c, index) => row.indexOf(c) === index);
    ConstantRow = uniqueChars;
    setrows(uniqueChars)
  }, [row]);

  useEffect(() => {
    setSheetOptions(sheetOptions)
  }, [sheetOptions]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const validRowCounts = () => rows.filter(row => pattern.test(row.EmailId.trim()));
  const submitCB = (reqObj, response) => {
    submitUpload(reqObj, response);
  }

  const setViewType = (data) => {
    let columnView = [];
    switch (data.id) {
      case 1:
        columnView = ConstantRow;
        break;
      case 2:
        columnView = ConstantRow.filter(row => pattern.test(row.EmailId.trim()));;
        break;
      case 3:
        columnView = ConstantRow.filter(row => !pattern.test(row.EmailId.trim()));;
        break;
      default:
        break;
    }
    setrows(columnView);
  }
  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar setViewType={setViewType} sheetOptions={sheetOptions} rows={rows} handleChange={handleChange} submitCB={submitCB} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                columns={columns}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    let validGender = false;
                    if (row.Gender && row.Gender.match("M" || "Male")) {
                      row.Gender = "Male";
                      validGender = true;
                    } else if (row.Gender && row.Gender.match("F" || "Female")) {
                      row.Gender = "Female";
                      validGender = true;
                    } else {
                      row.Gender = "Unknown"
                      validGender = true;
                    }
                    let rowValid = false;
                    if (validGender && pattern.test(row.EmailId.trim()) && !isNaN(parseFloat(row.Expereince)) && !isNaN(parseFloat(row.RelevantExperience))) {
                      rowValid = true;
                    }
                    row.Expereince = parseFloat(row.Expereince);
                    row.RelevantExperience = parseFloat(row.RelevantExperience);
                    row.isExternal = row.SAPID === '';
                    row.SAPID = row.SAPID ? row.SAPID : "0";
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.EmailId}
                        style={!rowValid ? { background: '#e53e3e40' } : {}}
                      >
                        <TableCell className={classes.tablecell}>{row.SAPID === "0" ? "-" : row.SAPID}</TableCell>
                        <TableCell className={classes.tablecell} component="th" id={labelId} scope="row">
                          {row.EmpName}
                        </TableCell>
                        <TableCell style={pattern.test(row.EmailId.trim()) ? {} : { color: 'red' }} className={classes.tablecell}>{row.EmailId}</TableCell>
                        <TableCell className={classes.tablecell}>{row.ContactNo}</TableCell>
                        <TableCell className={classes.tablecell} style={!validGender ? { color: 'red' } : {}}>{row.Gender}</TableCell>

                        <TableCell className={classes.tablecell}>{parseFloat(row.Expereince)}</TableCell>
                        <TableCell className={classes.tablecell}>{parseFloat(row.RelevantExperience)}</TableCell>
                        <TableCell className={classes.tablecell}>{row.Skill}</TableCell>
                        <TableCell className={classes.tablecell}>{row.AdditionalSkill}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {row.length > 0 && validRowCounts().length !== row.length && <Alert severity="error">
        <div>Warning</div>
        {validRowCounts().length !== row.length && <li>{`Out of ${rows.length} candidates only ${validRowCounts().length} candidates data's are correct.`}</li>}
        {row.length !== validRowCounts().length && <li>{`Please check highlighted email address are valid format.`}</li>}
      </Alert>}
    </Paper>
  );
}

