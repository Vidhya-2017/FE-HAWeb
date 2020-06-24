import React, { Fragment } from 'react';
import Highcharts from 'highcharts';


class SprintWiseChart extends React.Component {

  componentDidMount() {
    this.stackedBarChart(this.props.candidate, this.props.colHeader);
    document.addEventListener("sideBarToggled", (event) => {
      if (event.detail.sideBarToggled && this.chartNew && document.getElementById('stackedBarChart')) {
        setTimeout(() => {
          this.chartNew.setSize(document.getElementById('stackedBarChart').clientWidth - 30);
        }, 200)
      }
    });
    window.addEventListener('resize', () => {
      if (this.chartNew && document.getElementById('stackedBarChart')) {
        setTimeout(() => {
          this.chartNew.setSize(document.getElementById('stackedBarChart').clientWidth - 30);
        }, 200)
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.chartNew.update({
      series: nextProps.candidate,
      xAxis: {
        categories: nextProps.colHeader,
        labels: {
          x: -10
        }
      },
      title: {
        text: `${nextProps.panelTitle} - ${nextProps.sprintTitle}`
      },
    });
  }

  stackedBarChart = (candidate, colHeader) => {
    this.chartNew = Highcharts.chart('stackedBarChart', {
      chart: {
        type: 'column'
      },
      title: {
        text: `${this.props.panelTitle} - ${this.props.sprintTitle}`
      },
      tooltip:{
        enabled: false
      },
      credits: {
        enabled: false
      },
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
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
      },
      xAxis: {
        categories: this.props.colHeader,
        labels: {
          x: -10
        }
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: 'Score'
        }
      },
      series: this.props.candidate,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal'
            },
            yAxis: {
              labels: {
                align: 'left',
                x: 0,
                y: -5
              },
              title: {
                text: null
              }
            },
            subtitle: {
              text: null
            },
            credits: {
              enabled: false
            }
          }
        }]
      }
    });

  }
  render() {
    return (
      <Fragment>
        <div id="stackedBarChart" style={{ border: '1px solid lightgray', margin: '0 20px 20px' }}></div>
      </Fragment>
    )
  }
}

export default SprintWiseChart;