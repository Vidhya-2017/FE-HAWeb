import React, { Component } from 'react';
import { withStyles, Button, TableRow, TableCell, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Cell from '../Table/Cell'
import Search from '../Search/Search'
import CustomisedMenu from '../StyledMenu/StyledMenu'
import Table from '../Table/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

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
export class Layout extends Component {
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
      actualData: [],
      showModal1: false,
      showModal2: false,
      tp1data: [],
      tp2data: [],
      tp1PanelName: '',
      tp2PanelName: '',
      tp1InterviewDate: '',
      tp2InterviewDate: '',
      tp1Panels: []
      // panelName: [
      //   { name: 'panel one', id: 1 },
      //   { name: 'panel two', id: 2 },
      //   { name: 'panel three', id: 3 },
      //   { name: 'panel four', id: 4, },
      // ],
    }
    this.tp1Status = [
      { id: 1, title: 'TP1 Schedule' },
      { id: 2, title: 'TP1 Incomplete' },
      { id: 3, title: 'TP1 Select' },
      { id: 4, title: 'TP1 Reject' },
    ];
    this.tp2Status = [
      { id: 1, title: 'TP2 Scheduled' },
      { id: 2, title: 'TP2 Feedback Pending' },
      { id: 3, title: 'TP2 On hold' },
      { id: 4, title: 'TP2 Pending' },
      { id: 4, title: 'TP2 Rejected' },
    ];

  }

  _handleSort = (name, cellType, sortType) => {
    const { actualData } = this.state
    let tableData = actualData.sort(sort_by(name, sortType == 'asc' ? false : true))
    this.setState({
      sortField: name,
      sortType: sortType,
      actualData: tableData
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.statements !== nextProps.statements) {
      this.setState({
        actualData: nextProps.statements
      })
    }
    const tp1Panels = nextProps.panels;
    this.setState({ tp1Panels })
  }

  getTp1StatusModal = (i) => {
    const { actualData } = this.state
    const filteredDataone = actualData.filter((data) => {
      return data.checked === true || data.checked
    })
    let primarySkillId = filteredDataone.map(a => a.primary_skill_id);
    let CandidatePrimarySkillId = primarySkillId.toString();

    this.props.SendTP1CandidatePrimarySkillId(CandidatePrimarySkillId);

    this.setState({
      showModal1: true,
      tp1data: filteredDataone
    })
  }
  getTp2StatusModal = (i) => {
    const { actualData } = this.state
    const filtertp2Data = actualData.filter((data) => {
      return data.checked === true || data.checked
    })
    // toast.error("Schedule panel from TP1 status")
    let primarySkillId = filtertp2Data.map(a => a.primary_skill_id);
    let CandidatePrimarySkillId = primarySkillId.toString();

    this.props.SendTP1CandidatePrimarySkillId(CandidatePrimarySkillId);

    this.setState({
      showModal2: true,
      tp2data: filtertp2Data
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
    const { tp1data, tp1PanelName, tp1InterviewDate, tp1scheduleUpdate } = this.state;
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
    this.props.tp1scheduleUpdate(tp1ScheduleDetails);
  }

  onTp2ScheduleSubmit = () => {
    const { tp2data, tp2PanelName, tp2InterviewDate, tp2scheduleUpdate } = this.state;
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
    this.props.tp2scheduleUpdate(tp2ScheduleDetails);
  }

  renderTableHeader = () => {
    const { sortField, sortType } = this.state
    return (
      <TableRow style={{ color: 'white !important' }} >
        <TableCell> Select</TableCell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='candidate_name' style={{ width: '100px' }}>Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='contact' style={{ width: '100px' }}>Contact</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='email_id' style={{ width: '100px' }}>Email</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='total_experience' style={{ width: '50px' }}>Total Experience</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='relevant_experience' style={{ width: '50px' }}>Relevent Experience</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='current_company' style={{ width: '100px' }}>Current Company</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='notice_period' style={{ width: '100px' }}>Notice Periods</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='current_location' style={{ width: '50px' }}>Current Location</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='preferred_location' style={{ width: '50px' }}>Preferred Location</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='hr_test_taken' style={{ width: "10px" }}> Hacker Rank</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='hr_score' > HackerRankScore</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='hr_remarks' >Hacker Rank Remarks</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='spoc_name' >SPOC</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='recruiter' >Recruiter</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary_skill' >Primary</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='secondary_skill' >Secondary</Cell>
      </TableRow>
    )
  }

  renderTableBody = (statements) => {
    let { actualData, page, rowsPerPage } = this.state;
    let tableData = actualData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return (
      <React.Fragment>
        {tableData.map((statement, i) => (
          <TableRow key={`${statement.transactionId}-${i}`}>
            <Cell sort={false} ><input type='checkbox' onChange={() => { this.onSelectCandidate((page * rowsPerPage) + i) }} checked={statement.checked} /></Cell>
            <Cell sort={false} style={{ whiteSpace: 'nowrap' }}>{statement.candidate_name}</Cell>
            <Cell sort={false} >{statement.contact}</Cell>
            <Cell sort={false} >{statement.email_id}</Cell>
            <Cell sort={false} >{statement.total_experience}</Cell>
            <Cell sort={false} >{statement.relevant_experience}</Cell>
            <Cell sort={false} >{statement.current_company}</Cell>
            <Cell sort={false}> {`${statement.notice_period} days`}</Cell>
            <Cell sort={false} >{statement.current_location}</Cell>
            <Cell sort={false} >{statement.preferred_location}</Cell>
            <Cell sort={false} ><input type='checkbox' disabled={1} checked={statement.hr_test_taken} /></Cell>
            <Cell sort={false} >{statement.hr_test_taken ? statement.hr_score : 'NA'}</Cell>
            <Cell sort={false} >{statement.hr_test_taken ? statement.hr_remarks : 'NA'}</Cell>
            <Cell sort={false}>{statement.spoc_name}</Cell>
            <Cell sort={false} >{statement.recruiter}</Cell>
            <Cell sort={false} >{statement.primary_skill}</Cell>
            <Cell sort={false} >{statement.secondary_skill}</Cell>
          </TableRow>
        ))
        }
      </React.Fragment>
    )
  }

  onSelectCandidate = (i) => {
    const { actualData } = this.state
    if (actualData[i].checked === undefined || actualData[i].checked === false) {
      actualData[i].checked = true;
    } else {
      actualData[i].checked = false;
    }
    let status = actualData.filter((data) => {
      return data.checked !== undefined && data.checked
    })
    this.setState({
      actualData,
      enableEditIcon: status.length == 1 ? true : false,
      enableDeleteIcon: status.length > 0 ? true : false,
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
    const { actualData } = this.state
    const filteredData = actualData.filter((data) => {
      return data.checked !== undefined && data.checked
    })
    let candidateIds = filteredData.map((data, i) => {
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
    this.props.history.push('/createCandidate');
  }

  renderTP1TableHeader = () => {
    const { sortField, sortType } = this.state
    return (
      <TableRow style={{ color: 'white !important' }} >
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >Panel Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='secondary' >Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >Created By</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='name' style={{ width: '100px' }}>Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='recruiter' >Recruiter</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='spoc' >DNA SPOC</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >Primary Skill</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='secondary' >Secondary Skill</Cell>
      </TableRow>
    )
  }

  renderTP1TableBody = () => {
    let { tp1data, panelName, tp1Panels } = this.state;
    let tableData = tp1data;
    let status2 = tableData.map(a => a.feedback && a.feedback[0]);
    return (
      <React.Fragment>
        {
          tableData.map((statement, i) => (
            (!statement.feedback && !statement.feedback[0] ?
              <TableRow key={statement.transactionId}>
                <Cell sort={false} >
                  <select onChange={this.onTp1PanelSelect}>
                    <option value="none" selected disabled hidden>
                      Select Panel
                              </option>
                    {tp1Panels.map(item => (
                      <>
                        <option key={item.id} value={item.panel_name}>
                          {item.panel_name}
                        </option>
                      </>
                    ))}
                  </select>
                </Cell>
                <Cell sort={false} ><input type="date" placeholder="Select Date" onChange={this.onTp1InterviewDateSelect} /></Cell>
                <Cell sort={false} > {statement.created_by}</Cell>
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

  changeCandidateInterviewStatus = async (status) => {
    const { actualData } = this.state
    const { changeCandidateInterviewStatus } = this.props
    const filteredData = actualData.filter((data) => {
      return data.checked !== undefined || data.checked
    })
    changeCandidateInterviewStatus(filteredData, status)
  }

  getSearchResult = (reqObj) => {
    this.props.getSearchResult(reqObj).then((res) => {
      console.log(res)
      if (res && res.errCode === 200) {
        this.setState({
          actualData: res.arrRes
        })
      } else if (res && res.errCode === 404) {
        this.setState({
          actualData: []
        })
      }
    })
  }

  renderTP2TableHeader = () => {
    const { sortField, sortType } = this.state
    return (
      <TableRow style={{ color: 'white !important' }} >
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >Panel Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='secondary' >Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >TP1 Panel Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >TP1 Interview Date</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >Created By</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='name' style={{ width: '100px' }}>Name</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='recruiter' >Recruiter</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='spoc' >DNA SPOC</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary' >Primary Skill</Cell>
        <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='secondary' >Secondary Skill</Cell>
      </TableRow>
    )
  }

  renderTP2TableBody = () => {
    let { tp2data, tp1Panels } = this.state;
    let tableData = tp2data;
    let status1 = tableData.map(a => a.feedback && a.feedback[0]);
    return (
      <React.Fragment>
        {
          tableData.map((statement, i) => (
            (statement.feedback && statement.feedback[0] && !statement.feedback[1] ?
              <TableRow key={statement.transactionId}>
                <Cell sort={false} >
                  <select onChange={this.onTp2PanelSelect}>
                    <option value="none" selected disabled hidden>
                      Select Panel
                            </option>
                    {tp1Panels.map(item => (
                      <>
                        <option key={item.id} value={item.panel_name}>
                          {item.panel_name}
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
                <Cell sort={false} style={{ whiteSpace: 'nowrap' }}>{statement.created_by}</Cell>
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
    const { classes, getCandidateData } = this.props
    const { page, rowsPerPage, actualData, enableEditIcon, enableDeleteIcon, showModal1, showModal2 } = this.state
    return (
      <React.Fragment>
        <Search getCandidateData={getCandidateData}
          getSearchResult={this.getSearchResult}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={this.navToCandidate}
        >
          Add
                 </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={!enableEditIcon}
          size="small"
          className={classes.button}
          endIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!enableDeleteIcon}
          size="small"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={this._handleDelete}
        >
          Delete
        </Button>
        <CustomisedMenu buttonName='TP1 Status'
          status={this.tp1Status}
          classes={classes}
          onSendPress={this.getTp1StatusModal}
          disabled={!enableDeleteIcon}
        />

        <CustomisedMenu buttonName='TP2 Status'
          status={this.tp2Status}
          onSendPress={this.getTp2StatusModal}
          classes={classes}
          disabled={!enableDeleteIcon}
        />

        <CustomisedMenu buttonName='Fitment Status'
          status={[
            { title: 'Fitment On hold', interview_status: 9 },
            { title: 'Fitment Reject', interview_status: 10 },
            { title: 'Fitment WIP', interview_status: 11 },
          ]}
          classes={classes}
          changeCandidateInterviewStatus={this.changeCandidateInterviewStatus}
          disabled={!enableDeleteIcon}
        />
        <CustomisedMenu buttonName='Offer Status'
          status={[
            { title: 'Offer On hold', interview_status: 14 },
            { title: 'Offer WIP', interview_status: 21 },
            { title: 'Offered', interview_status: 15 },
            { title: 'Joined', interview_status: 20 },
          ]}
          changeCandidateInterviewStatus={this.changeCandidateInterviewStatus}
          classes={classes}
          disabled={!enableDeleteIcon}
        />
        <CustomisedMenu buttonName='Drop Status'
          status={[
            { title: 'Client Reject' },
            { title: 'Demand Dropped' },
            { title: 'Dropped' },
          ]}
          classes={classes}
          disabled={!enableDeleteIcon}
        />

        <Table classes={classes} tableHeader={this.renderTableHeader()} tableBody={this.renderTableBody()} />
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={actualData.length}
          page={page}
          onChangePage={this.handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        <Dialog fullScreen aria-labelledby="responsive-dialog-title" open={showModal1} >
          <DialogTitle id="responsive-dialog-title">{"TP1 Status Schedule"}</DialogTitle>
          <DialogContent>
            <Table classes={classes} tableHeader={this.renderTP1TableHeader()} tableBody={this.renderTP1TableBody()} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => this.setState({ showModal1: false })} color="primary">
              Back
            </Button>
            <Button autoFocus onClick={this.onTp1ScheduleSubmit} color="primary" disabled={!this.state.tp1PanelName}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog fullScreen aria-labelledby="responsive-dialog-title" open={showModal2} >
          <DialogTitle id="responsive-dialog-title">{"TP2 Status Schedule"}</DialogTitle>
          <DialogContent>
            <Table classes={classes} tableHeader={this.renderTP2TableHeader()} tableBody={this.renderTP2TableBody()} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => this.setState({ showModal2: false })} color="primary">
              Back
            </Button>
            <Button autoFocus onClick={this.onTp2ScheduleSubmit} color="primary" disabled={!this.state.tp2PanelName}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Layout);

