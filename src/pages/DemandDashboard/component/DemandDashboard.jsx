import React from 'react';
import { withStyles, Paper, Typography, Button, Grid } from "@material-ui/core";
import Select from 'react-select';
import moment from 'moment';
import { KeyboardDatePicker } from "@material-ui/pickers";
import CardView from './CardView';
import CandidateStatusTable from './CandidateStatusTable';
import DemandDashoardStyles from './DemandDashoardStyles';
import PieChart from './PieChart';
import CombinedChart from './CombinedChart';
import SelectStyles from '../../../common/SelectStyles';

const categoryList = [{ value: 0, label: 'Completed' }, { value: 1, label: 'Selected' }, { value: 2, label: 'Rejected' }, { value: 3, label: 'InProgress' }]

class DemandDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: categoryList[0],
      currentDate: new Date(),
      tp1: [],
      tp2: [],
      fitment: [],
      offer: [],
      others: [],
      individualReport: [],
      tableRowData: [],
      tableTitle: 'TP1 Completed'
    }
    this.demandReport = [];
    this.candidateTable = React.createRef();
  }
  chartValue = (value) => {
    if (this.candidateTable.current) {
      this.candidateTable.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
    if (value.label === 'Others') {
      this.setState({ tableRowData: this.state[(value.label).toLowerCase()], tableTitle: value.label });
    } else {
      this.setState({ tableRowData: this.state[(value.label).toLowerCase()], tableTitle: value.name });
    }
  }

  componentDidMount() {
    this.getDemandReport("2020-08-06");
  }

  getDemandReport(currentDate) {
    const reqObj = {
      report_date: currentDate
    }
    this.props.getDemandReport(reqObj).then((response => {
      if (response && response.errCode === 200) {
        this.demandReport = response.reportDetail;
        this.generateCategory(categoryList[0]);
        this.setState({ currentDate });
      } else if (response && response.errCode === 404) {
        this.demandReport = [];
        this.generateCategory(categoryList[0]);
        this.setState({ currentDate });
      }
    }))
  }

  generateCategory = (category) => {
    let categoryReport = [];
    let tp1 = [];
    let tp2 = [];
    let fitment = [];
    let offer = [];
    switch (category.label) {
      case 'Selected':
        if (this.demandReport.SelectCandidates) {
          categoryReport = this.demandReport.SelectCandidates;
          this.demandReport.SelectCandidates.forEach(candidate => {
            if (candidate.status_id === "3") {
              tp1.push(candidate);
            }
            if (candidate.status_id === "7") {
              tp2.push(candidate);
            }
            if (candidate.status_id === "21") {
              fitment.push(candidate);
            }
            if (candidate.status_id === "15") {
              offer.push(candidate);
            }
          })
        }
        break;
      case 'Rejected':
        if (this.demandReport.RejectCandidates) {
          categoryReport = this.demandReport.RejectCandidates;
          this.demandReport.RejectCandidates.forEach(candidate => {
            if (candidate.status_id === "4") {
              tp1.push(candidate);
            }
            if (candidate.status_id === "8") {
              tp2.push(candidate);
            }
            if (candidate.status_id === "10") {
              fitment.push(candidate);
            }
            if (candidate.status_id === "16") {
              offer.push(candidate);
            }
          })
        }
        break;
      case 'InProgress':
        if (this.demandReport.InprocessCandidates) {
          categoryReport = this.demandReport.InprocessCandidates;
          this.demandReport.InprocessCandidates.forEach(candidate => {
            if (candidate.status_id === "1" || candidate.status_id === "2") {
              tp1.push(candidate);
            }
            if (candidate.status_id === "5" || candidate.status_id === "6") {
              tp2.push(candidate);
            }
            if (candidate.status_id === "11") {
              fitment.push(candidate);
            }
            if (candidate.status_id === "21") {
              offer.push(candidate);
            }
          })
        }
        break;
      case 'Completed':
        if (this.demandReport.SelectCandidates || this.demandReport.RejectCandidates) {
          categoryReport = [...this.demandReport.SelectCandidates, ...this.demandReport.RejectCandidates];
          [...this.demandReport.SelectCandidates, ...this.demandReport.RejectCandidates].forEach(candidate => {
            if (candidate.status_id === "3" || candidate.status_id === "4") {
              tp1.push(candidate);
            }
            if (candidate.status_id === "7" || candidate.status_id === "8") {
              tp2.push(candidate);
            }
            if (candidate.status_id === "21" || candidate.status_id === "10") {
              fitment.push(candidate);
            }
            if (candidate.status_id === "15" || candidate.status_id === "16") {
              offer.push(candidate);
            }
          })
        }
        break;
      default:
        break;
    }

    const individualReport = [
      { label: "TP1", arrLen: tp1.length },
      { label: "TP2", arrLen: tp2.length },
      { label: "Fitment", arrLen: fitment.length },
      { label: "Offer", arrLen: offer.length },
      { label: "Others", arrLen: this.demandReport.others.length }
    ];
    this.setState({
      category,
      tp1,
      tp2,
      fitment,
      offer,
      others: [...this.demandReport.others],
      tableTitle: `${individualReport[0].label} ${category.label}`,
      individualReport, tableRowData: tp1
    });
  }

  handleCategoryChange = (category) => {
    this.generateCategory(category);
  }

  handleDateChange = (date) => {
    const currentDate = moment(date).format('YYYY-MM-DD');
    this.getDemandReport(currentDate);
  }

  showAllData = (showAll) => {
    const { tp1, tp2, fitment, offer } = this.state;
    if (showAll) {
      this.setState({
        tableRowData: [...tp1, ...tp2, ...fitment, ...offer]
      })
    } else {
      this.setState({ tableRowData: this.state[this.state.tableTitle.split(' ')[0].toLowerCase()] });
    }
  }

  render() {
    const { classes } = this.props;
    const { category, currentDate, tableRowData, tableTitle, individualReport } = this.state;
    return (
      <Paper className={classes.paperRoot} elevation={0}>
        <Typography variant="h4">Demand Dashboard</Typography>
        <div className={classes.categoryRoot}>
          <KeyboardDatePicker
            inputVariant="outlined"
            format="DD-MM-YYYY"
            value={moment(currentDate)}
            InputAdornmentProps={{ position: "end" }}
            onChange={this.handleDateChange}
            InputProps={{
              classes: {
                root: classes.dateInputRoot,
                input: classes.dateInput,
                notchedOutline: classes.dateInputNotchedOutline
              }
            }}
          />
          <Select
            value={category}
            onChange={this.handleCategoryChange}
            options={categoryList}
            defaultValue={category}
            styles={SelectStyles()}
            placeholder='Event Name'
          />
          <Button variant='contained' color='primary' className={classes.submitButton}>Submit</Button>
        </div>
        <CardView individualReport={individualReport} category={category} chartValue={this.chartValue} />
        <Grid container style={{ margin: 0 }}>
          <Grid item xs={12} sm={6} style={{ padding: 10 }}>
            {individualReport.length > 0 && <PieChart
              categoryLabel={category.label}
              currentDate={currentDate}
              tableTitle={tableTitle}
              chartValue={this.chartValue}
              individualReport={individualReport} />}
          </Grid>
          <Grid item xs={12} sm={6} style={{ padding: 10 }}>
            {this.demandReport.counts && <CombinedChart
              selectedCounts={this.demandReport.counts.selected}
              rejectedCounts={this.demandReport.counts.rejected}
              inProgressCounts={this.demandReport.counts.inProgress}
            />}
          </Grid>
        </Grid>
        {tableRowData.length > 0 &&
          <div ref={this.candidateTable}>
            <CandidateStatusTable showAllData={this.showAllData} rowData={tableRowData} tableTitle={tableTitle} />
          </div>}
      </Paper>
    )
  }
}

export default withStyles(DemandDashoardStyles, { withTheme: true })(DemandDashboard);
