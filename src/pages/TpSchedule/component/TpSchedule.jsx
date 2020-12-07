import React, { Component } from 'react';
import { withStyles, Typography, Button, TableContainer, TableRow, Paper } from '@material-ui/core';
import Cell from '../Table/Cell'
import Table from '../Table/Table';

const styles = theme => ({
  root: {
    width: '100%',
  },
  paperRoot: {
    width: '100%',
    height: '500px',
    padding: '15px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  }

});

const sort_by = (field, reverse, primer) => {
  const key = primer ?
    function (x) {
      return primer(x[field])
    } :
    function (x) {
      return x[field]
    };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}
export class TpSchedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortField: 'name',
      sortType: 'asc',
      page: 0,
      rowsPerPage: 10,
      enableEditIcon: false,
      test: props.statements,
      enableDeleteIcon: false,
      selectedRows: [],
      actualData: [],
      showModal1: props.location.state.showModal1,
      showModal2: props.location.state.showModal2,
      tp1data: props.location.state.tp1data,
      tp2data: props.location.state.tp2data,
      tp1PanelName: '',
      tp2PanelName: '',
      tp1InterviewDate: '',
      tp2InterviewDate: '',
      tp1Panels: [],
      panelListData: [],
      viewType: 1,
      customColumns: [],
      tp1skillID: props.location.state.tp1skillID,
      candidateResult: '',
      tpStatusId: props.location.state.statusId1,

    }

  }

  componentDidMount() {
    const { tp1skillID, tpStatusId } = this.state;
    if (tpStatusId === 1 || tpStatusId === 5) {
      let primariSkillId = {
        "skill_id": tp1skillID
      }
      this.props.getCandidatePrimarySkillId(primariSkillId).then((res) => {
        if (res && res.errCode === 200) {
          const users = res.arrRes
          this.setState({ tp1Panels: users })

        }
      })

    } else {
      this.props.history.push('/demand')
    }
    this.redirectComponent();

  }

  redirectComponent = () => {
    const tp1data = this.props.location.state.tp1data;
    const tp2data = this.props.location.state.tp2data;
    if (tp1data.length === 0 && tp2data.length === 0) {
      this.props.history.push('/demand')
    }
  }

  _handleSort = (name, cellType, sortType) => {
    const { actualData } = this.state
    let tableData = actualData.sort(sort_by(name, sortType === 'asc' ? false : true))
    this.setState({
      sortField: name,
      sortType: sortType,
      actualData: tableData
    })
  }


  onTp1PanelSelect = e => {
    this.setState({ tp1PanelName: e.target.value })
  }

  onTp2PanelSelect = e => {
    this.setState({ tp2PanelName: e.target.value })
  }

  onTp1InterviewDateSelect = e => {
    this.setState({ tp1InterviewDate: e.target.value })
  }

  onTp2InterviewDateSelect = e => {
    this.setState({ tp2InterviewDate: e.target.value })
  }

  onTp1ScheduleSubmit = () => {
    const { tp1data, tp1PanelName, tp1InterviewDate } = this.state;
    let CandidateId = tp1data.map(a => a.candidate_id);
    let CandidateIdUniqueId = CandidateId.toString();

    this.setState({ showModal1: false });
    const tp1ScheduleDetails = {
      candidate_id: CandidateIdUniqueId,
      interview_level: tp1PanelName,
      interview_schedule_dt: tp1InterviewDate,
      interview_status: 1,
      interview_comment: "TP1 Scheduled",
      created_by: 1
    }
    // this.props.tp1scheduleUpdate(tp1ScheduleDetails);
    this.props.updatTp1ScheduleDetails(tp1ScheduleDetails).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'TP1 Status Scheduled Successfully!'
        });
        this.props.history.push('/demand')

      } else if (res && res.errCode === 404 && res.errCode === 400) {
        this.setState({
          showToast: true, toastMsg: 'Failed to update!'
        });
      }
    })
  }

  onTp2ScheduleSubmit = () => {
    const { tp2data, tp2PanelName, tp2InterviewDate } = this.state;
    let CandidateId = tp2data.map(a => a.candidate_id);
    let CandidateIdUniqueId = CandidateId.toString();
    this.setState({ showModal2: false });
    const tp2ScheduleDetails = {
      candidate_id: CandidateIdUniqueId,
      interview_level: tp2PanelName,
      interview_schedule_dt: tp2InterviewDate,
      interview_status: 5,
      interview_comment: "TP2 Scheduled",
      created_by: 1
    }
    //this.props.tp2scheduleUpdate(tp2ScheduleDetails);
    this.props.updatTp2ScheduleDetails(tp2ScheduleDetails).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'TP2 Status Scheduled Successfully!'
        });
        this.props.history.push('/demand')
      } else {
        this.setState({
          showToast: true, toastMsg: 'Failed to update!'
        });
      }
    })
  }



  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      page: 0,
      rowsPerPage: event.target.value
    })
  };

  _handleDelete = () => {
    const { selectedRows } = this.state

    let candidateIds = selectedRows.map((data, i) => {
      return data.candidate_id
    })
    let reqObj = {
      candidate_id: candidateIds.toString()
    }
    this.props.deleteCandidate(reqObj).then((res) => {
      if (res.errCode === 201) {
        this.props.getCandidateData()
        this.setState({
          page: 0,
          enableEditIcon: false,
          enableDeleteIcon: false,
        })
      }
    })
  }

  navToCandidate = () => {
    const { selectedRows } = this.state
    let candidateIds = selectedRows.map((data, i) => {
      return data.candidate_id
    })
    let reqObj = {
      candidate_id: candidateIds.toString()
    }

    this.props.candidateDetails(reqObj).then((res) => {
      if (res.errCode === 200) {
        const candidateDetails = res.arrRes;
        this.setState({
          candidateResult: candidateDetails
        })
        this.props.history.push({ pathname: '/createCandidate', data: candidateDetails })
      }
    })
  }

  renderTP1TableHeader = () => {
    const { sortField, sortType } = this.state
    return (
      <TableRow style={{ backgroundColor: '#E0E0E0', color: '#000000', padding: '15px 15px' }} >
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='panelName' >Panel Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='Date' >Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='CreatedDate' >Created Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='name' style={{ width: '100px' }}>Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='recruiter' >Recruiter</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='spoc' >DNA SPOC</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='PrimarySkill' >Primary Skill</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='SecondarySkill' >Secondary Skill</Cell>
      </TableRow>
    )
  }

  renderTP1TableBody = () => {
    let { tp1data, tp1Panels } = this.state;
    let tableData = tp1data;
    let panelListData = [];
    Object.keys(tp1Panels).forEach((panels, index) => {
      tp1Panels[panels].forEach((obj, idx) => {
        panelListData.push(obj.panel_name)
      })
    })
    return (
      <React.Fragment>
        {
          tableData.map((statement, i) => (
            (statement.last_updated_status_id === "26" ?
              <TableRow key={statement.transactionId}>
                <Cell sort={false} >
                  <select onChange={this.onTp1PanelSelect}>
                    <option value="none" selected disabled hidden>
                      Select Panel
                              </option>
                    {panelListData.map(item => (
                      <>
                        <option key={item.id} value={item}>
                          {item}
                        </option>
                      </>
                    ))}
                  </select>
                </Cell>
                <Cell sort={false} ><input type="date" placeholder="Select Date" onChange={this.onTp1InterviewDateSelect} /></Cell>
                <Cell sort={false} > {statement.created_date}</Cell>
                <Cell sort={false} style={{ whiteSpace: 'nowrap' }}>{statement.candidate_name}</Cell>
                <Cell sort={false} >{statement.recruiter}</Cell>
                <Cell sort={false}>{statement.spoc_name}</Cell>
                <Cell sort={false} >{statement.primary_skill}</Cell>
                <Cell sort={false} >{statement.secondary_skill}</Cell>
              </TableRow> : null)
          ))
        }
      </React.Fragment>
    )
  }

  renderTP2TableHeader = () => {
    const { sortField, sortType } = this.state
    return (
      <TableRow style={{ backgroundColor: '#E0E0E0', color: '#000000', padding: '15px 15px' }}  >
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='>PanelName' >Panel Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='Date' >Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='TP1PanelName' >TP1 Panel Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='TP1InterviewDate' >TP1 Interview Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='CreatedDate' >Created Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='name' style={{ width: '100px' }}>Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='recruiter' >Recruiter</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='spoc' >DNA SPOC</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='PrimarySkill' >Primary Skill</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='SecondarySkill' >Secondary Skill</Cell>
      </TableRow>
    )
  }

  renderTP2TableBody = () => {
    let { tp2data, tp1Panels } = this.state;
    let tableData = tp2data;
    let panelListData = [];
    Object.keys(tp1Panels).forEach((panels, index) => {
      tp1Panels[panels].forEach((obj, idx) => {
        panelListData.push(obj.panel_name)
      })
    })
    return (
      <React.Fragment>
        {
          tableData.map((statement, i) => (
            (statement.feedback && statement.feedback[0] ?
              <TableRow key={statement.transactionId}>
                <Cell sort={false} >
                  <select onChange={this.onTp2PanelSelect}>
                    <option value="none" selected disabled hidden>
                      Select Panel
                            </option>
                    {panelListData.map(item => (
                      <>
                        <option key={item.id} value={item}>
                          {item}
                        </option>
                      </>
                    ))}
                  </select>
                </Cell>
                <Cell sort={false} ><input type="date" placeholder="Select Date" onChange={this.onTp2InterviewDateSelect} /></Cell>

                <Cell sort={false} >
                  {statement.feedback && statement.feedback[0] ? statement.feedback[0].interview_level : ''}
                </Cell>
                <Cell sort={false} >
                  {statement.feedback && statement.feedback[0] ? statement.feedback[0].interview_schedule_dt : ''}
                </Cell>
                <Cell sort={false} style={{ whiteSpace: 'nowrap' }}>{statement.created_date}</Cell>
                <Cell sort={false} style={{ whiteSpace: 'nowrap' }}>{statement.candidate_name}</Cell>
                <Cell sort={false} >{statement.recruiter}</Cell>
                <Cell sort={false}>{statement.spoc_name}</Cell>
                <Cell sort={false} >{statement.primary_skill}</Cell>
                <Cell sort={false} >{statement.secondary_skill}</Cell>
              </TableRow> : null)
          ))
        }
      </React.Fragment>
    )
  }

  render() {
    const { classes } = this.props;
    const { showModal1, showModal2, tp1Panels } = this.state;
    return (
      <React.Fragment>
        {showModal1 && <div >
          <Paper className={classes.paperRoot} elevation={0}>
            <Typography variant="h4" className="text-left" gutterBottom>
              {"TP1 Status Schedule"}
            </Typography>
            <TableContainer style={{ padding: '15px 20px' }} >
              {tp1Panels && <Table classes={classes} tableHeader={this.renderTP1TableHeader()} tableBody={this.renderTP1TableBody()} />}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button onClick={() => this.props.history.push('/demand')} color="primary" variant="contained" style={{ marginRight: '10px' }}>
                  Back
            </Button>
                <Button onClick={this.onTp1ScheduleSubmit} color="primary" disabled={!this.state.tp1PanelName} variant="contained">
                  Submit
            </Button>
              </div>
            </TableContainer>
          </Paper>
        </div>}

        {showModal2 && <div >
          <Paper className={classes.paperRoot} elevation={3}>
            <Typography variant="h4" className="text-center" gutterBottom>
              {"TP2 Status Schedule"}
            </Typography>
            <TableContainer style={{ padding: '15px 20px' }} >
              <Table classes={classes} tableHeader={this.renderTP2TableHeader()} tableBody={this.renderTP2TableBody()} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button autoFocus onClick={() => this.props.history.push('/demand')} color="primary" variant="contained" style={{ marginRight: '10px' }}>
                  Back
            </Button>
                <Button autoFocus onClick={this.onTp2ScheduleSubmit} color="primary" variant="contained" disabled={!this.state.tp2PanelName}>
                  Submit
            </Button>
              </div>
            </TableContainer>
          </Paper>
        </div>}

      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TpSchedule);

