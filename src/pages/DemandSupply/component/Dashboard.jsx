import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import TableLayout from './TableLayout/Layout';
import { Toast } from 'react-bootstrap';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '50px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paper: {
    //marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    // [theme.breakpoints.up('lg')]: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '30px'
    //},

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
    // '& tbody >tr:nth-child(even)': {
    //   backgroundColor: '#dddddd'
    // },
    // '& tbody >tr:nth-child(odd)': {
    //   backgroundColor: 'white'
    // }
  },
  button: {
    margin: theme.spacing(1.5),
  },

});




export class Login extends React.Component {

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
        }, () => { console.log(this.state.panelList, " -- panels List ") })

      }
    })
  }

  tp1StatusUpdate = (res) => {
    this.props.updatTp1ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'Status Updated Successfully!'
        }, () => {
          console.log(this.state.toastMsg, "Status Updated succesfully");
        });
      } else if (res && res.errCode === 400 ) {
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
        }, () => {
          console.log(this.state.toastMsg, " status Updated succesfully");
        });
        
      } else if (res && res.errCode === 400 ) {
        this.setState({
          showToast: true, toastMsg: 'Failed to update !'
        });
      }
    })
  }

  tp1scheduleUpdate = (res) => {
    this.props.updatTp1ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        this.setState({
          showToast: true, toastMsg: 'TP1 Status Scheduled Successfully!'
        }, () => {
          console.log(this.state.toastMsg, "tp1 status added succesfully");
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
    const { showToast } = this.state
    const { classes, deleteCandidate } = this.props
    //const { statements } = this.state.tableData

    return (
      <React.Fragment>

        <Container >
          <div className={classes.root}>
            <TableLayout classes={classes} statements={this.state.tableData}
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
               SendStatus ={ this.SendStatus}
              tp1StatusUpdate={this.tp1StatusUpdate}
              tp2StatusUpdate={this.tp2StatusUpdate}
            />
          </div>
        </Container>
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


export default withStyles(styles, { withTheme: true })(Login);
