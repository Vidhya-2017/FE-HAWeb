import React, { Component } from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ColumnArr from './ColumnFields';
import Search from '../Search/Search'
import CustomisedMenu from '../StyledMenu/StyledMenu';
import CandidateList from './CandidateList';

const styles = theme => ({

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '30px'
  },
  table: {
    minWidth: 300,
    '& thead': {
      backgroundColor: '#2196f3',
      '& tr ': {
        '& th ': {
          color: 'white !important'
        }
      }
    },
  },
  button: {
    margin: theme.spacing(1.5),
  }
});

export class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortField: 'name',
      sortType: 'asc',
      page: 0,
      rowsPerPage: 10,
      enableEditIcon: false,
      enableDeleteIcon: false,
      selectedRows: [],
      actualData: [],
      tp1Panels: [],
      panelListData: [],
      customColumns: [],
      columnFields: ColumnArr.FullViewFields,
      candidateResult: ''
    }
    this.tp1Status = [
      { id: 1, title: 'TP1 Schedule' },
      { id: 2, title: 'TP1 Incomplete' },
      { id: 3, title: 'TP1 Select' },
      { id: 4, title: 'TP1 Reject' },
    ];
    this.tp2Status = [
      { id: 5, title: 'TP2 Schedule' },
      { id: 7, title: 'TP2 Select' },
      { id: 22, title: 'TP2 On Hold' },
      { id: 6, title: 'TP2 Pending' },
      { id: 8, title: 'TP2 Reject' },
    ];
    this.fitmentStatus = [
      { id: 9, title: 'Fitment on hold' },
      { id: 10, title: 'Fitment Reject' },
      { id: 11, title: 'Fitment WIP' }
    ];
    this.offerStatus = [
      { id: 14, title: 'Offer On hold' },
      { id: 21, title: 'Offer WIP' },
      { id: 15, title: 'Offered' },
      { id: 20, title: 'Joined' }
    ];
    this.dropStatus = [
      { id: 23, title: 'Client Reject' },
      { id: 24, title: 'Demand Dropped' },
      { id: 25, title: 'Dropped' }
    ];

    this.view = [
      { id: 1, title: 'History View', columns: ['name', 'email', 'contact', 'totalExperience', 'relevantExperience', 'currentCompany', 'noticePeriod', 'currentLocation', 'preferredLocation', 'primarySkill', 'secondarySkill'] },
      { id: 2, title: 'Basic View', columns: ['name', 'email', 'contact', 'primarySkill', 'secondarySkill', 'interviewStatus'] },
      { id: 3, title: 'Recruiter View', columns: ['name', 'recruiter', 'interviewStatus', 'interviewPanel', 'interviewDate', 'totalExperience', 'hrScore', 'hrRemarks'] },
      { id: 4, title: 'SPOC View', columns: ['name', 'spoc', 'interviewStatus', 'interviewPanel', 'interviewDate'] },
    ]

  }

  editCandidate = async (newData, oldData) => {
    let request = {
      "id": newData.candidate_id,
      "candidate_name": newData.candidate_name,
      "email_id": newData.email_id,
      "contact": newData.contact,
      "total_experience": newData.total_experience,
      "relevant_experience": newData.relevant_experience,
      "current_company": newData.current_company,
      "notice_period": newData.notice_period,
      "current_location": newData.current_location_id,
      "preferred_location": newData.preferred_location_id.toString(),
      "hr_test_taken": newData.hr_test_taken,
      "testlink_received_dt": newData.testlink_received_dt,
      "test_completed_dt": newData.test_completed_dt,
      "hr_score": newData.hr_score,
      "hr_remarks": newData.hr_remarks,
      "source": newData.source_id,
      "spoc": newData.spoc_id,
      "recruiter": newData.recruiter_id,
      "primary_skill": newData.primary_skill_id,
      "secondary_skill": newData.secondary_skill_id.toString(),
      "updated_by": '0',
      "updated_date": new Date()
    }
    await this.props.editCandidate(request)
    await this.props.getCandidateData()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.statements !== nextProps.statements) {
      this.setState({
        actualData: nextProps.statements,
        selectedRows: []
      })
    }
    const tp1Panels = nextProps.panels;
    this.setState({ tp1Panels })
  }

  getCandiddateStatus = (status) => {
    const { selectedRows, tp1Panels } = this.state
    let filteredDataone = selectedRows.map((data, i) => {
      return data
    });
    let filteredDataoneList = filteredDataone.filter(function (data) {
      return data.feedback === '' && !data.feedback;
    })
    if (status.id === 1) {
      let primarySkillId = filteredDataoneList.map(a => a.primary_skill_id);
      let CandidatePrimarySkillId = primarySkillId.toString();
      this.props.SendTP1CandidatePrimarySkillId(CandidatePrimarySkillId);
      this.props.history.push({
        pathname: '/TpSchedule',
        state: { tp1data: filteredDataone, tp2data: [], showModal1: true, showModal2: false, statusId1: status.id, tp1Panels1: tp1Panels, tp1skillID: CandidatePrimarySkillId }
      })
    } else if (status.id && status.id !== '') {
      let CandidateId = filteredDataone.map(a => a.candidate_id);
      let CandidateIdUniqueId = CandidateId.toString();
      const tp1Status = {
        candidate_id: CandidateIdUniqueId,
        interview_level: "",
        interview_schedule_dt: "",
        interview_comment: "",
        interview_status: status.id,
        created_by: 1
      }
      this.props.tp1StatusUpdate(tp1Status);
    }
  }
  getTp2StatusModal = (status) => {
    const { selectedRows } = this.state
    let filtertp2Data = selectedRows.map((data, i) => {
      return data
    })
    let filtertp2DataList = filtertp2Data.filter((data) => data.feedback !== '' && data.feedback)
    let primarySkillId = filtertp2DataList.map(a => a.primary_skill_id);
    let CandidatePrimarySkillId = primarySkillId.toString();
    if (status.id === 5) {
      this.props.SendTP1CandidatePrimarySkillId(CandidatePrimarySkillId);
      this.props.history.push({
        pathname: '/TpSchedule',
        state: { tp1data: [], tp2data: filtertp2Data, showModal1: false, showModal2: true, statusId1: status.id, tp1skillID: CandidatePrimarySkillId }
      })
    } else if (status.id === 7 || 22 || 6 || 8) {
      let CandidateId = filtertp2DataList.map(a => a.candidate_id);
      let CandidateIdUniqueId = CandidateId.toString();

      const tp2Status = {
        candidate_id: CandidateIdUniqueId,
        interview_level: "",
        interview_schedule_dt: "",
        interview_comment: "",
        interview_status: status.id,
        created_by: 1
      }
      this.props.tp2StatusUpdate(tp2Status);
    }
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
      enableEditIcon: status.length === 1 ? true : false,
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

  addCandidate = () => {
    this.props.history.push('/createCandidate')
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

  selectCandidate = (rows) => {
    this.setState({
      enableEditIcon: rows.length === 1,
      enableDeleteIcon: rows.length > 0,
      selectedRows: rows,
    })
  }

  getCandidateDetails = (reqObj) => {
    this.props.CandidatesbulkUpload(reqObj)
  }


  render() {
    const { classes, getCandidateData } = this.props;
    const { actualData, columnFields, enableEditIcon, enableDeleteIcon } = this.state;
    return (
      <React.Fragment>
        <Typography variant='h4'>Candidate List</Typography>
        <Search getCandidateData={getCandidateData}
          getSearchResult={this.getSearchResult}
          getCandidateDetails={this.getCandidateDetails}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={this.addCandidate}
          className={classes.button}
        >
          Add
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!enableEditIcon}
          size="small"
          endIcon={<EditIcon />}
          className={classes.button}
          onClick={this.navToCandidate}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!enableDeleteIcon}
          size="small"
          startIcon={<DeleteIcon />}
          className={classes.button}
          onClick={this._handleDelete}
        >
          Delete
        </Button>
        <CustomisedMenu buttonName='TP1 Status'
          status={this.tp1Status}
          classes={classes}
          onSendPress={this.getCandiddateStatus}
          SendStatus={this.props.SendStatus}
          disabled={!enableDeleteIcon}
        />

        <CustomisedMenu buttonName='TP2 Status'
          status={this.tp2Status}
          onSendPress={this.getTp2StatusModal}
          classes={classes}
          disabled={!enableDeleteIcon}
        />

        <CustomisedMenu buttonName='Fitment Status'
          status={this.fitmentStatus}
          classes={classes}
          onSendPress={this.getCandiddateStatus}
          disabled={!enableDeleteIcon}
        />
        <CustomisedMenu buttonName='Offer Status'
          status={this.offerStatus}
          onSendPress={this.getCandiddateStatus}
          classes={classes}
          disabled={!enableDeleteIcon}
        />
        <CustomisedMenu buttonName='Drop Status'
          status={this.dropStatus}
          classes={classes}
          onSendPress={this.getCandiddateStatus}
          disabled={!enableDeleteIcon}
        />
        <CandidateList selectCandidate={this.selectCandidate} columns={columnFields} rowData={actualData}/>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Layout);

