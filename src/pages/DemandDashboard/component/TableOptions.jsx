 const TableOptions = {
    search: false,
    toolbar: false,
    actionsColumnIndex: -1,
    pageSize: 10,
    // maxBodyHeight : '2', 
    pageSizeOptions: [10, 20],
    draggable: false,
    // maxBodyHeight:500,
    selectionProps: {
      color: 'primary',
    },
    sorting: true,
    headerStyle: {
      backgroundColor: '#E0E0E0',
      color: '#000',
      padding: '5px 10px 5px 5px',
      minWidth: 75,
    },
    cellStyle: {
      padding: '5px 10px 5px 5px',
    },
    rowStyle: {
      fontSize: 14,
      height: 20
    }
  }

  export default TableOptions;