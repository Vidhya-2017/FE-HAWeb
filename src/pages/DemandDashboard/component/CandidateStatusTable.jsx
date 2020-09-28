import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Paper, Table, TableBody, FormControlLabel, Toolbar, IconButton, Typography, TableRow, TableCell, Switch, TableContainer, TablePagination } from '@material-ui/core';
import ViewColumns from './ViewColumns';
import EnhancedTableHead from './EnhancedTableHead';
import CandidateStatusCoulmn from './CandidateStatusCoulmn';
import SearchCandidate from './SearchCandidate';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator) => {
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
  title: {
    flex: '1 1 100%',
  },
  showAll: {
    padding: '0 10px',
    margin: 0,
    width: 250
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
  }
}));

const CandidateStatusTable = (props) => {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [rowData, setRowData] = useState(props.rowData);
  const [columnData, setColumnData] = useState(CandidateStatusCoulmn);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showAll, setShowAll] = useState(false);

  const globalRowData = props.rowData;

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const searchedData = (query
      ? props.rowData.filter((list) =>
        CandidateStatusCoulmn.find(item => list[item.id].toLowerCase().includes(lowerCaseQuery))
      )
      : props.rowData);
    setRowData(searchedData)
  }, [props.rowData, query]);

  useEffect(() => {
    if(showAll) {
      setShowAll(showAll => !showAll);
    }
  }, [props.tableTitle]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onInputChange = (e) => {
    const inputQuery = e.target.value;
    const lowerCaseQuery = inputQuery.toLowerCase();
    const searchedData = (inputQuery
      ? globalRowData.filter((list) =>
        CandidateStatusCoulmn.find(item => list[item.id].toLowerCase().includes(lowerCaseQuery))
      )
      : globalRowData);
    setQuery(inputQuery);
    setRowData(searchedData);
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowData.length - page * rowsPerPage);

  const showHideColumn = (value, currentIndex) => {
    const updateColData = [...columnData];
    const updateCol = updateColData.findIndex(list => list.id === value);
    updateColData[updateCol].hide = currentIndex >= 0;
    setColumnData(updateColData);
  }

  const toggleChecked = () => {
    setShowAll(showAll => !showAll);
    props.showAllData(!showAll);
  }

  const downloadPdf = () => {
    const doc = new jsPDF('l', 'pt');
    doc.autoTable({
      html: '#candidateTable',
      bodyStyles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243], fontSize: 8 },
      styles: { lineColor: [44, 62, 80], lineWidth: 0.5 },
      theme: 'grid',
    })
    doc.save('table.pdf')
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {props.tableTitle}
          </Typography>

          <FormControlLabel
            className={classes.showAll}
            control={<Switch checked={showAll} onChange={toggleChecked} />}
            label="Show All"
          />
          <SearchCandidate value={query} onInputChange={onInputChange} />
          <ViewColumns columnData={columnData} showHideColumn={showHideColumn} />
          <IconButton
            onClick={downloadPdf}
            className={classes.filterIcon}
          >
            <SaveAltIcon />
          </IconButton>
        </Toolbar>
        <TableContainer>
          <Table
            className={classes.table}
            size={'medium'}
            id="candidateTable"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              columnData={columnData}
              onRequestSort={handleRequestSort}
              rowCount={rowData.length}
            />
            <TableBody>
              {stableSort(rowData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow key={row.email_id}>
                      {CandidateStatusCoulmn.map((col, index) =>
                        <Fragment key={`${row[col.id]}${index}`}>
                          {!col.hide && <TableCell>{col.id === 'preferred_location' ? row[col.id].split(',').join(', ') : row[col.id]}</TableCell>}
                        </Fragment>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default React.memo(CandidateStatusTable);