import React from 'react';
import { withStyles } from "@material-ui/core";
import moment from 'moment';
import MaterialTable from "material-table";
import TableOptions from './TableOptions';
import CandidateStatusCoulmn from './CandidateStatusCoulmn';
import DemandDashoardStyles from './DemandDashoardStyles';

class CandidateStatusTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: props.rowData
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rowData !== this.state.rowData) {
      this.setState({ rowData: nextProps.rowData })
    }
  }
  render() {
    return (
      <div>
        <MaterialTable
          columns={CandidateStatusCoulmn}
          data={this.state.rowData}
          style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
          // options={TableOptions} 
          />
      </div>
    )
  }
}

export default withStyles(DemandDashoardStyles, { withTheme: true })(CandidateStatusTable);
