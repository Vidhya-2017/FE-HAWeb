import React, { Component } from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import MaterialTable from "material-table";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ColumnArr from './ColumnFields';
import Search from '../Search/Search'
import CustomisedMenu from '../StyledMenu/StyledMenu';
import CustomiseView from '../CustomiseView/CustomiseView';
import CustomiseColumn from '../CustomiseColumn/CustomiseColumn';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

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
      viewType: 1,
      customColumns: [],
      columnFields: ColumnArr.FullViewFields,
      candidateResult: '',
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

    this.columnFields = [
      {
        title: "Name",
        name: 'name',
        field: "candidate_name",
      },
      {
        title: "Email",
        name: 'email',
        field: "email_id",
      },
      {
        title: "Contact",
        name: 'contact',
        field: "contact",
      },
      {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
      },
      {
        title: "Relavent Experience",
        name: 'relevantExperience',
        field: "relevant_experience",
      },
      {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        render: (rowData) => {
          let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
            rowData.feedback[rowData.feedback.length - 1].status_name : '-'
          return <div>{display}</div>
        },
      },
      {
        title: "Last Interview Panel",
        name: 'interviewPanel',
        field: "feedback",
        render: (rowData) => {
          let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
            rowData.feedback[rowData.feedback.length - 1].interview_level : '-'
          return <div>{display}</div>
        },
      },
      {
        title: "Last Interview  Date",
        name: 'interviewDate',
        field: "feedback",
        render: (rowData) => {
          let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
            rowData.feedback[rowData.feedback.length - 1].interview_schedule_dt : '-'
          return <div>{display.split(' ')[0]}</div>
        },
      },
      {
        title: "Current Company",
        field: "current_company",
        name: 'currentCompany',
      },
      {
        title: "Notice Period",
        field: "notice_period",
        name: 'noticePeriod',
      },
      {
        title: "Current Location",
        field: "current_location",
        name: 'currentLocation',
      },
      {
        title: "Prefered Location",
        field: "preferred_location",
        name: 'preferredLocation',
      },
      {
        title: "HackerRank Score",
        field: "hr_score",
        name: 'hrScore',
      },
      {
        title: "HackerRank Remarks",
        name: 'hrRemarks',
        field: "hr_remarks",
      },
      {
        title: "SPOC",
        field: "spoc_name",
        name: 'spoc',
      },
      {
        title: "Recruiter",
        field: "recruiter",
        name: 'recuiter',
      },
      {
        title: "Primary Skill",
        field: "primary_skill",
        name: 'primarySkill',
      },
      {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
      },
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
        }, () => { console.log(this.state.candidateResult, "candidate details") })

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


  setViewType = (data) => {
    console.log(data)
    let columnView = [];
    switch (data.id) {
      case 1:
        columnView = ColumnArr.HistoryViewFields;
        break;
      case 2:
        columnView = ColumnArr.BasicViewFields;
        break;
      case 3:
        columnView = ColumnArr.RecruiterViewFields;
        break;
      case 4:
        columnView = ColumnArr.SPOCViewFields;
        break;
      default:
        break;
    }
    this.setState({
      viewType: data.id,
      columnFields: columnView
    })
  }

  applyCustomColumn = (data) => {
    let customColumns = [];
    data.forEach(item => {
      if (item.checked !== undefined && item.checked === true) {
        customColumns.push(item.name);
      }
    })
    if (customColumns.length > 0) {
      this.setState({
        viewType: 0,
        customColumns: customColumns,
        columnFields: ColumnArr.FullViewFields.filter(data => customColumns.includes(data.name))
      })
    }
  }

  render() {
    const { classes, getCandidateData } = this.props
    const { actualData, columnFields, enableEditIcon, enableDeleteIcon } = this.state
    return (
      <React.Fragment>
        <Typography variant='h4'>Candidate List</Typography>
        <Search getCandidateData={getCandidateData}
          getSearchResult={this.getSearchResult}
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
          className={classes.button}
          endIcon={<EditIcon />}
          candidateResult={this.state.candidateResult}
          onClick={this.navToCandidate}
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

        <div></div>
        <CustomiseView buttonName='View Type'
          status={this.view}
          classes={classes}
          setViewType={this.setViewType}
        />
        <CustomiseColumn buttonName='Customise Columns'
          columns={ColumnArr.FullViewFields}
          status={this.view}
          classes={classes}
          setViewType={this.applyCustomColumn}
        />

        <MaterialTable
          // title="Candidate List"
          columns={columnFields}
          data={actualData}
          style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
          options={{
            search: false,
            toolbar: false,
            selection: true,
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
              minWidth: 100,
            },
            cellStyle: {
              padding: '5px 10px 5px 5px',
            },
            rowStyle: {
              fontSize: 14,
              height: 20
            }
          }}
          onSelectionChange={(rows) => {
            this.setState({
              enableEditIcon: rows.length === 1,
              enableDeleteIcon: rows.length > 0,
              selectedRows: rows,
            })
          }}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Layout);

