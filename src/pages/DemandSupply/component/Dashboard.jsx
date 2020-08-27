import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import TableLayout from './TableLayout/Layout'

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
      backgroundColor: '#007bff',
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
      tableData: {}
    }
  }
  tp1scheduleUpdate = (res) => {
    this.props.updatTp1ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        alert("TP1 Status Scheduled Successfully")
      }
    })
  }
  tp2scheduleUpdate = (res) => {
    this.props.updatTp2ScheduleDetails(res).then((res) => {
      if (res && res.errCode === 201) {
        alert("TP2 Status Scheduled Successfully")

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
        this.setState({
          tableData: res.arrRes
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
            />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}


export default withStyles(styles, { withTheme: true })(Login);
