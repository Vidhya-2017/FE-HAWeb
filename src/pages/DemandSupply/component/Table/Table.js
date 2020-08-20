import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';

/**
 * 
 * @param {*} props 
 * Table Component
 */

export default function SimpleTable(props) {
  //const classes = useStyles();
  const { tableHeader, tableBody,classes} = props
 

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="simple table" >
        <TableHead >
          {tableHeader}
        </TableHead>
        <TableBody >
          {tableBody}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
