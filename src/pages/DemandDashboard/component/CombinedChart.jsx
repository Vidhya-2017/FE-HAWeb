import React from 'react';
import Highcharts from 'highcharts';
import { withStyles } from "@material-ui/core";
import DemandDashoardStyles from './DemandDashoardStyles';

class CombinedChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCounts: [],
      rejectedCounts: [],
      inProgressCounts: []
    }
  }

  componentDidMount() {
    this.combinedChartRender();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCounts !== this.state.selectedCounts ||
      nextProps.rejectedCounts !== this.state.rejectedCounts ||
      nextProps.inProgressCounts !== this.state.inProgressCounts) {
      this.setState({
        selectedCounts: nextProps.selectedCounts,
        rejectedCounts: nextProps.rejectedCounts,
        inProgressCounts: nextProps.inProgressCounts
      }, () => {
        this.updateCombinedChart();
      })

    }
  }
  updateCombinedChart = () => {
    const { selectedCounts, rejectedCounts, inProgressCounts } = this.state;
    const selectedVal = selectedCounts.reduce((a, b) => a + b);
    const rejectedVal = rejectedCounts.reduce((a, b) => a + b);
    const inProgressVal = inProgressCounts.reduce((a, b) => a + b);
    this.combinedChart.update({
      yAxis: {
        title: {
          enabled: true,
          text: 'Count',
          style: {
            fontWeight: 'normal'
          }
        },
        max: Math.max(selectedVal, rejectedVal, inProgressVal)
      },
      series: [{
        type: 'column',
        name: 'Selected',
        data: selectedCounts
      }, {
        type: 'column',
        name: 'Rejected',
        data: rejectedCounts
      }, {
        type: 'column',
        name: 'In-Progress',
        data: inProgressCounts
      }, {
        type: 'pie',
        name: 'Count',
        data: [{
          name: 'Selected',
          y: selectedVal,
          color: '#8BC34A'
        }, {
          name: 'Rejected',
          y: rejectedVal,
          color: '#FF7043'
        }, {
          name: 'In-Progress',
          y: inProgressVal,
          color: '#FFA726'
        }],
        center: [50, 10],
        size: 100,
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    });
  }
  combinedChartRender = () => {
    const { selectedCounts, rejectedCounts, inProgressCounts } = this.state;
    this.combinedChart = Highcharts.chart('combinedChart', {
      title: {
        text: 'Combination chart'
      },
      yAxis: {
        title: {
          enabled: true,
          text: 'Count',
          style: {
            fontWeight: 'normal'
          }
        }
      },
      xAxis: {
        categories: ['TP1', 'TP2', 'Fitment', 'Offer']
      },
      colors: ['#8BC34A', '#FF7043', '#FFA726'],
      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false
            },
            inactive: {
              opacity: 1
            }
          }
        }
      },
      credits: {
        enabled: false,
        align: 'right'
      },
      labels: {
        items: [{
          html: 'Total Counts',
          style: {
            left: '150px',
            top: '18px',
            color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'black'
          }
        }]
      },
      series: [{
        type: 'column',
        name: 'Selected',
        data: selectedCounts
      }, {
        type: 'column',
        name: 'Rejected',
        data: rejectedCounts
      }, {
        type: 'column',
        name: 'In-Progress',
        data: inProgressCounts
      }, {
        type: 'pie',
        name: 'Count',
        data: [],
        center: [50, 10],
        size: 100,
        showInLegend: false,
        dataLabels: {
          enabled: false
        }
      }]
    });

  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.barChart}>
        <div id="combinedChart" style={{ height: 300 }}></div>
      </div>
    )
  }
}

export default withStyles(DemandDashoardStyles, { withTheme: true })(CombinedChart);
