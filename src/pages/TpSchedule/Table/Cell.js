import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

/**
 * 
 * @param {*} props 
 * Cell Component
 */

export default function SimpleTable(props) {

    const { name, cellType, style, children, handleSort, sortField, sort, sortType } = props
    return (
        <React.Fragment>
            <TableCell style={style}>
                <div style={{ display: 'flex', alignItems: 'center' }} >
                    <div>{children} </div>
                    {
                        sort && <div style={{ alignItems: 'center' }} onClick={() => { handleSort(name, cellType, sortType === 'asc' ? 'desc' : 'asc') }}>
                            <TableSortLabel active={true} direction={sortField === name ? sortType : 'desc'}></TableSortLabel>
                        </div>
                    }
                </div>
            </TableCell>
        </React.Fragment>
    );
}
