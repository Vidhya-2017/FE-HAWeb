import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox } from '@material-ui/core';

const EnhancedTableHead = (props) => {
  const { classes, columns, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

  const [columnHeader, setColumnHeader] = React.useState(columns);
  useEffect(() => {
    setColumnHeader(columns);
  }, [columns]);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow style={{ background: '#eee' }}>
        <TableCell padding="checkbox" className={classes.stickyColumnHeader}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            color="primary"

          />
        </TableCell>
        {columnHeader.map((headCell) => (
          <Fragment key={headCell.name}>
            {!headCell.hide && <TableCell
              className={headCell.field === 'candidate_name' ? classes.stickyColumnHeaderName : ''}
              key={headCell.name}
              align="left"
              style={{ minWidth: (headCell.field === 'secondary_skill' || headCell.field === 'preferred_location' || headCell.name === 'interviewStatus') ? '170px' : '100px', padding: 8 }}
              sortDirection={orderBy === headCell.field ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.field}
                direction={orderBy === headCell.field ? order : 'asc'}
                onClick={createSortHandler(headCell.field)}
              >
                {headCell.title}
                {orderBy === headCell.field ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>}
          </Fragment>
        )
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


export default EnhancedTableHead;