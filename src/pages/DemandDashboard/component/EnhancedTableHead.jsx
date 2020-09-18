import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, TableSortLabel, TableHead } from '@material-ui/core';

const EnhancedTableHead = (props) => {
  const { classes, order, orderBy, onRequestSort, columnData } = props;
  const [columnHeader, setColumnHeader] = useState(columnData);
  useEffect(() => {
    setColumnHeader(columnData);
  }, [columnData]);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columnHeader.map((headCell) => (
          <Fragment key={headCell.id}>
            {!headCell.hide && <TableCell
              key={headCell.id}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>}
          </Fragment>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;