import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TableCell, Toolbar, Typography, TableContainer, TablePagination, TableRow, Paper, Checkbox, InputBase } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ViewColumns from './ViewColumns';
import EnhancedTableHead from './EnhancedTableHead';
import ColumnArr from './ColumnFields';
import CustomiseView from '../CustomiseView/CustomiseView';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import SinglePagePDFViewer from "../PdfView/PdfView";
import FileViewer from "react-file-viewer";

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
  return order === 'desc'
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


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    border: '1px solid #BDBDBD',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  inputPaperRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 200,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  tableTitle: {
    flex: '1 1 100%',
  },
  resetIcon: {
    marginLeft: 10
  },
  searchBtn: {
    border: 'none',
    borderRadius: '50%',
    outline: 'none',
    margin: '0 10px',
    "&:focus": {
      outline: 'none',
    },
    "&$searchBtnSelected": {
      color: 'rgb(255 255 255)',
      backgroundColor: 'rgb(0 161 255)',
      outline: 'none',
      "&:hover": {
        color: 'rgb(255 255 255)',
        backgroundColor: 'rgb(0 161 255)',
      }
    }
  },
  searchBtnSelected: {},
  stickyColumnHeader: { position: 'sticky', left: 0, zIndex: 1, background: '#eee' },
  stickyColumnHeaderName: { position: 'sticky', left: 46, zIndex: 1, background: '#eee' },
  stickyColumnCell: { position: 'sticky', left: 0, zIndex: 1, background: '#fff' },
  stickyColumnCellName: { position: 'sticky', left: 46, zIndex: 1, background: '#fff' }
}));

const view = [
  { id: 1, title: 'Standard View' },
  { id: 2, title: 'Historical View' },
  { id: 3, title: 'Creator View' }
]

const CandidateList = (props) => {
  const classes = useStyles();
  const { selectCandidate, candidateCvDetails } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('candidate_name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [columnData, setColumnData] = React.useState(ColumnArr.FullViewFields);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [rowData, setRowData] = React.useState(props.rowData);

  let globalRowData = [...props.rowData];

  const handleClose = () => setShow(false);
  const samplePDF = candidateCvDetails.candidate_document;
  const docType = candidateCvDetails.document_extension ;

  useEffect(() => {
    // globalRowData = props.rowData;
    setRowData(props.rowData)
  }, [props.rowData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    setColumnData(props.columns)
  }, [props.columns]);

  const setViewType = (data) => {
    let columnView = [];
    switch (data.id) {
      case 1:
        columnView = ColumnArr.FullViewFields;
        break;
      case 2:
        columnView = ColumnArr.HistoryViewFields;
        break;
      case 3:
        columnView = ColumnArr.RecruiterViewFields;
        break;
      case 4:
        columnView = ColumnArr.SPOCViewFields;
        break;
      default:
        break;
    }
    setColumnData(columnView);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rowData.map((n) => n.candidate_id);
      setSelected(newSelecteds);
      selectCandidate(rowData);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    const rows = rowData.filter(list => newSelected.includes(list.candidate_id));
    selectCandidate(rows);
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const showHideColumn = (value, currentIndex) => {
    const updateColData = [...columnData];
    const updateCol = updateColData.findIndex(list => list.name === value);
    updateColData[updateCol].hide = currentIndex >= 0;
    setColumnData(updateColData);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowData.length - page * rowsPerPage);

  const resetColHeader = () => { setColumnData(ColumnArr.FullViewFields) }

  const onInputChange = (e) => {
    const inputQuery = e.target.value;
    const lowerCaseQuery = inputQuery.toLowerCase();

    const searchedData = (inputQuery
      ? globalRowData.filter((list) =>
        columnData.find(item => {
          if (item.field !== 'feedback') {
            return list[item.field].toLowerCase().includes(lowerCaseQuery)
          } else if (item.field === 'feedback' && list.feedback.length > 0) {
            if (item.name === 'interviewStatus') {
              let display = list.feedback[list.feedback.length - 1].status_name;
              return display.toLowerCase().includes(lowerCaseQuery)
            }
            if (item.name === 'interviewPanel') {
              let display = list.feedback[list.feedback.length - 1].interview_level;
              return display.toLowerCase().includes(lowerCaseQuery)
            }
            if (item.name === 'interviewDate') {
              let display = list.feedback[list.feedback.length - 1].interview_schedule_dt;
              return display.toLowerCase().includes(lowerCaseQuery)
            }
          }
          return false;
        })
      ) : globalRowData);
    setQuery(inputQuery);
    setRowData(searchedData);
  }

  const getCVdetails = (event, name) => {
    const { getcandidateDoc } = props;
    const reqObj = { candidate_id: name.toString() }
    getcandidateDoc(reqObj);
    setShow(true)
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography variant="h6" id="table1Title" component="div" className={classes.tableTitle}>Candidate Listings</Typography>

          {search && <div>
            <Paper component="form" className={classes.inputPaperRoot}>
              <InputBase
                className={classes.searchInput}
                placeholder="By Column Names"
                onChange={onInputChange}
                value={query}
                autoFocus
              />
            </Paper>
          </div>}
          <ToggleButton
            value="check"
            selected={search}
            classes={{ root: classes.searchBtn, selected: classes.searchBtnSelected }}
            onChange={() => {
              setSearch(!search);
            }}
          >
            <SearchIcon />
          </ToggleButton>
          <CustomiseView
            buttonName='View Type'
            status={view}
            setViewType={setViewType}
          />
          {/* <IconButton
            onClick={resetColHeader}
            aria-haspopup="true"
            className={classes.resetIcon}
          >
            <RefreshIcon />
          </IconButton> */}
          <ViewColumns showHideColumn={showHideColumn} columnData={columnData} />
        </Toolbar>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              columns={columnData}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rowData.length}
            />
            <TableBody>
              {stableSort(rowData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.candidate_id);
                  return (
                    <TableRow
                      onClick={(event) => handleClick(event, row.candidate_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      hover
                      key={`${index}${row.candidate_id}`}
                    >
                      <TableCell className={classes.stickyColumnCell} padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          color="primary"
                        />
                      </TableCell>
                      {columnData.map((col, colIndex) => {
                        if (col.field === 'feedback' && col.name === 'interviewStatus') {
                          let display = row.feedback !== null && row.feedback.length > 0 ?
                            row.feedback[row.feedback.length - 1].status_name : '-'
                          return (
                            <Fragment key={colIndex}>
                              {!col.hide &&
                                <TableCell key={colIndex} style={{ padding: 5 }}>{display}</TableCell>}
                            </Fragment>
                          )
                        }
                        if (col.field === 'feedback' && col.name === 'interviewPanel') {
                          let display = row.feedback !== null && row.feedback.length > 0 ?
                            row.feedback[row.feedback.length - 1].interview_level : '-'
                          return (
                            <Fragment key={colIndex}>
                              {!col.hide &&
                                <TableCell key={colIndex} style={{ padding: 5 }} >{display}</TableCell>}
                            </Fragment>
                          )
                        }
                        if (col.field === 'feedback' && col.name === 'interviewDate') {
                          let display = row.feedback !== null && row.feedback.length > 0 ?
                            row.feedback[row.feedback.length - 1].interview_schedule_dt : '-'
                          return (
                            <Fragment key={colIndex}>
                              {!col.hide && <TableCell key={colIndex} style={{ padding: 5 }}>{display.split(' ')[0]}</TableCell>}
                            </Fragment>
                          )
                        }
                        if (col.field === 'candidate_document' && col.name === 'Resume') {
                          if (row.candidate_document != '') {
                            const display = row.candidate_document;
                            return (
                              <TableCell key={colIndex} style={{ padding: 5 }}>
                                <span onClick={(event) => getCVdetails(event, row.candidate_id)} >View {" "}</span>
                                <a href={row.candidate_document} download>Download </a>
                              </TableCell>
                            )
                          }
                        }

                        return (
                          <Fragment key={colIndex}>
                            {!col.hide && <TableCell key={colIndex} className={col.field === 'candidate_name' ? classes.stickyColumnCellName : ''} style={{ padding: 5 }}>{(col.field === 'preferred_location' || col.field === 'secondary_skill') ? row[col.field].split(',').join(', ') : row[col.field]}</TableCell>}
                          </Fragment>
                        )
                      }
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={show}>
        <DialogTitle ></DialogTitle>
        <DialogContent>
        { docType == 'pdf' ? 
          <SinglePagePDFViewer pdf={samplePDF} />
          : 
          <FileViewer fileType={docType} filePath={samplePDF}  />
        }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CandidateList;