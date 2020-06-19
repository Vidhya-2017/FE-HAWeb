import React from 'react';
import Highcharts from 'highcharts';


class SprintWiseChart extends React.Component {

    componentDidMount() {
        this.stackedBarChart(this.props.candidate, this.props.colHeader)
    }

    componentWillReceiveProps(nextProps) {
        this.chart.update({
            series: nextProps.candidate,
            title: {
                text: `${nextProps.panelTitle} - ${nextProps.sprintTitle}`
            },
        });
    }

    stackedBarChart = (candidate, colHeader) => {
        this.chart = Highcharts.chart('stackedBarChart', {
            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            },
            title: {
                text: `${this.props.panelTitle} - ${this.props.sprintTitle}`
            },
            xAxis: {
                categories: colHeader,
                title: {
                    enabled: false,
                }
            },
            yAxis: {
                labels: { enabled: false },
                title: {
                    enabled: false,
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                },
                bar: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            // fontSize: 20,
                            // color: "#aaa"
                        }
                    },
                }
            },
            series: candidate
        });
    }
    render() {
        return (
            <div id="stackedBarChart" style={{width: 600, margin: 'auto'}}></div>
        )
    }
}

export default SprintWiseChart;