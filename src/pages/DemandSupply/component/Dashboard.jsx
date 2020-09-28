import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import TableLayout from './TableLayout/Layout';
import { Toast } from 'react-bootstrap';

const styles = theme => ({
  root: {
    width: '100%',
    padding: 20
  }
});

export class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tableData: {},
      panelList: [],
      showToast: false,
      toastMsg: null,
      candidateId: ''
    }
  }

  SendTP1CandidatePrimarySkillId = (res) => {
    let primariSkillId = {
      "skill_id": res
    }
    this.props.getCandidatePrimarySkillId(primariSkillId).then((res) => {
      if (res && res.errCode === 200) {
        const users = res.arrRes

        this.setState({
          panelList: users
        })

      }
    })
  }

  tp1StatusUpdate = (res) => {
    this.props.updatTp1ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'Status Updated Successfully!'
        });
      } else if (res && res.errCode === 400) {
        this.setState({
          showToast: true, toastMsg: 'Failed to update !'
        });
      }
    })
  }

  tp2StatusUpdate = (res) => {
    this.props.updatTp1ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'Status Updated Successfully!'
        });

      } else if (res && res.errCode === 400) {
        this.setState({
          showToast: true, toastMsg: 'Failed to update !'
        });
      }
    })
  }
  CandidatesbulkUpload = (res) => {
    this.props.CandidatesbulkUpload(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: ' Uploaded Successfully!'
        })
      } else if (res && res.errCode === 400 && res.errCode === 404) {
        this.setState({
          showToast: true, toastMsg: 'Failed to upload !'
        });
      }
    })
  }
  tp1scheduleUpdate = (res) => {
    this.props.updatTp1ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'TP1 Status Scheduled Successfully!'
        });
      } else if (res && res.errCode === 404 && res.errCode === 400) {
        this.setState({
          showToast: true, toastMsg: 'Failed to update!'
        });
      }
    })
  }

  tp2scheduleUpdate = (res) => {
    this.props.updatTp2ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'TP2 Status Scheduled Successfully!'
        });

      }
    })
  }

  getCandidateData = (inputValue) => {
    let reqObj = {
      "search": inputValue ? inputValue : '',
      "start_limit": "",
      "page": ""
    }
    this.props.getCandidateReport(reqObj).then((res) => {
      if (res && res.errCode === 200) {
        let filterData = res.arrRes.map((data) => {
          return {
            ...data,
            secondary_skill_id: data.secondary_skill_id.split(','),
            preferred_location_id: data.preferred_location_id.split(',')
          }
        })
        this.setState({
          tableData: filterData
        })
      }
    })
  }
  componentDidMount() {
    this.getCandidateData()
  }

  changeCandidateInterviewStatus = async (candidate, status) => {

    let candidateIds = candidate.map((data, i) => {
      return data.candidate_id
    })
    let reqObj = {
      "candidate_id": candidateIds.toString(),
      "interview_level": status.interview_status,
      "interview_schedule_dt": "",
      "interview_status": status.interview_status,
      "interview_comment": ""
    }

    this.props.changeCandidateInterviewStatus(reqObj).then((res) => {
      if (res.errCode === 200) {
        this.getCandidateData()
      }
    })
  }
  render() {
    const { showToast, tableData } = this.state
    const { classes, deleteCandidate } = this.props
    return (
      <React.Fragment>
        <div className={classes.root}>
          <TableLayout
            statements={tableData}
            history={this.props.history}
            getCandidateData={this.getCandidateData}
            getSearchResult={this.props.getSearchResult}
            deleteCandidate={deleteCandidate}
            changeCandidateInterviewStatus={this.changeCandidateInterviewStatus}
            tp1scheduleUpdate={this.tp1scheduleUpdate}
            tp2scheduleUpdate={this.tp2scheduleUpdate}
            SendTP1CandidatePrimarySkillId={this.SendTP1CandidatePrimarySkillId}
            panels={this.state.panelList}
            editCandidate={this.props.editCandidate}
            getPrimarySkillsReport={this.props.getPrimarySkillsReport}
            getListLocation={this.props.getListLocation}
            getListRecruiter={this.props.getListRecruiter}
            getListSource={this.props.getListSource}
            getListSpoc={this.props.getListSpoc}
            getCompanyLists={this.props.getCompanyLists}
            SendStatus={this.SendStatus}
            tp1StatusUpdate={this.tp1StatusUpdate}
            tp2StatusUpdate={this.tp2StatusUpdate}
            candidateDetails={this.props.candidateDetails}
            CandidatesbulkUpload={this.CandidatesbulkUpload}
          />
        </div>
        {showToast &&
          <Toast
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#deeddd',
              border: '1px solid #28a745',
              color: '#6c757d',
              fontWeight: 500,
              width: 400
            }}

            onClose={() => this.setState({ showToast: false })}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body>{this.state.toastMsg}</Toast.Body>
          </Toast>
        }
      </React.Fragment>
    );
  }
}


export default withStyles(styles, { withTheme: true })(Dashboard);
