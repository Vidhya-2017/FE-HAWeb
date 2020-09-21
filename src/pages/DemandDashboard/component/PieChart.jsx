import React from 'react';
import Highcharts from 'highcharts';
import { withStyles } from "@material-ui/core";
import moment from 'moment';
import DemandDashoardStyles from './DemandDashoardStyles';


class PieChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryLabel: props.categoryLabel,
      individualReport: props.individualReport,
      currentDate: props.currentDate,
      tableTitle: props.tableTitle
    }
  }

  componentDidMount() {
    this.pieChart();
  }

  updatePieChart = (nextProps) => {
    this.totalChart.update({
      title: {
        text: `${moment(nextProps.currentDate).format("DD/MM/YYYY")} - ${nextProps.categoryLabel}`
      },
      plotOptions: {
        pie: {
          colors: ['#64B5F6', '#ea9c9c', '#F9A825', '#D4E157'],
        },
        series: {
          pointPlacement: 'on'
        }
      },
      xAxis: {
        tickmarkPlacement: 'on'
      },
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: [{
          sliced: true,
          selected: true,
          name: `TP1 ${nextProps.categoryLabel}`,
          label: nextProps.individualReport[0].label,
          y: nextProps.individualReport[0].arrLen,
        }, {
          name: `TP2 ${nextProps.categoryLabel}`,
          label: nextProps.individualReport[1].label,
          y: nextProps.individualReport[1].arrLen
        }, {
          name: `Fitment ${nextProps.categoryLabel}`,
          label: nextProps.individualReport[2].label,
          y: nextProps.individualReport[2].arrLen
        }, {
          name: `Offer ${nextProps.categoryLabel}`,
          label: nextProps.individualReport[3].label,
          y: nextProps.individualReport[3].arrLen
        }]
      }]
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryLabel !== this.state.categoryLabel) {
      this.setState({ categoryLabel: nextProps.categoryLabel });
      this.updatePieChart(nextProps);
    }
    if (nextProps.individualReport !== this.state.individualReport) {
      this.setState({ individualReport: nextProps.individualReport});
      this.updatePieChart(nextProps);
    }
    if (nextProps.currentDate !== this.state.currentDate) {
      this.setState({ currentDate: nextProps.currentDate });
      this.updatePieChart(nextProps);
    }

    if (nextProps.tableTitle !== this.state.tableTitle) {
      this.setState({ tableTitle: nextProps.tableTitle });
      this.updatePieChart(nextProps);
    }
  }

  pieChart = () => {
    const self = this;
    this.totalChart = Highcharts.chart('demandBarChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: `${moment(self.state.currentDate).format("DD/MM/YYYY")} - ${self.state.categoryLabel}`
      },
      tooltip: {
        pointFormat: '<b>{series.name}</b>: {point.y}'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      }, 
      credits: {
        enabled: false,
        align: 'right'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true
        },
        series: {
          point: {
            events: {
              click: function () {
                self.props.chartValue(this)
              }
            }
          },
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
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: [{
          sliced: true,
          selected: true,
          name: `TP1 ${self.state.categoryLabel}`,
          y: self.state.individualReport[0].arrLen,
        }, {
          name: `TP2 ${self.state.categoryLabel}`,
          y: self.state.individualReport[1].arrLen
        }, {
          name: `Fitment ${self.state.categoryLabel}`,
          y: self.state.individualReport[2].arrLen
        }, {
          name: `Offer ${self.state.categoryLabel}`,
          y: self.state.individualReport[3].arrLen
        }]
      }]
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.barChart}>
        <div id="demandBarChart" style={{ height: 300 }}></div>
      </div>
    )
  }
}

export default withStyles(DemandDashoardStyles, { withTheme: true })(PieChart);
