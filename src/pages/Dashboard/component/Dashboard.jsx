import React, { Fragment } from 'react';
import Select from 'react-select';
import Highcharts from 'highcharts';
import { Card, ListGroup } from 'react-bootstrap';
import SprintWiseChart from './SprintWiseChart';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/Dashboard.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      selectedEvent: null,
      feedbackSummary: {},
      assessScale: [],
      selectedPanel: null,
      panelDetails: [],
      panelList: [],
      selectedSprint: null,
      colHeader: [],
      feedbackArr: [],
      filteredCandiate: []
    }
  }

  componentDidMount() {
    if (this.props.userDetails.user_id) {
      this.getEventList();
    } else {
      this.props.history.push('/');
    }
  }

  getEventList = () => {
    this.props.getEventList().then(response => {
      let eventList = [];
      eventList = response.arrRes.map(list => {
        return {
          value: list.EventId,
          label: list.Name
        }
      })
      this.setState({ eventData: response.arrRes, eventList });
    });
  }

  handleEventChange = (selectedEvent) => {
    const reqObj = {
      event_id: selectedEvent.value
    };
    this.setState({ selectedEvent, panelList: [], panelDetails: [], selectedSprint: null, selectedPanel: null });
    this.props.feedbackSummary(reqObj).then(response => {
      this.setState({ feedbackSummary: response.resultArr });
      this.setChart(response.resultArr, selectedEvent);
    });
    const eventReportReqObj = {
      event_id: selectedEvent.value
    };
    this.props.eventReportWeb(eventReportReqObj).then(response => {
      // this.stackedBarChart();
      let assessScale = response.Hackathon_Details[0].AssessScale.split(',');
      assessScale.splice(assessScale.length - 1, 0, "Show and Tell assesment");
      assessScale = assessScale.map(scale => {
        return {
          value: scale,
          label: scale
        }
      })

      this.setState({ assessScale })
      this.generateTable(response);
    });
  }

  handlePanelChange = (selectedPanel) => {
    this.setState({ selectedPanel, selectedSprint: null });
  }

  handleSprintChange = (selectedSprint) => {
    const { feedbackArr, selectedPanel, colHeader } = this.state;
    const colors = ['#b8daff', '#ffeeba', '#c3e6cb', '#f5c6cb', '#17a2b8', '#cddc39', '#99d69b', '#e7abf1', '#69c0e7'];
    let filteredCandiate = feedbackArr.filter(list => list.sprintLevel === selectedSprint.value && list.panelName.trim() === selectedPanel.value);
    filteredCandiate = filteredCandiate.map((list, index) => {
      const values = [];
      colHeader.forEach((col) => {
        if (col === 'Problem Solving') {
          values.push(Number(list.ProblemSolvingSkill))
        }
        if (col === 'Analytics') {
          values.push(Number(list.Analytics))
        }
        if (col === 'Communication') {
          values.push(Number(list.Communication))
        }
        if (col === 'Logical') {
          values.push(Number(list.LogicalSkill))
        }
      })
      return {
        name: list.EmpName,
        color: colors[index],
        data: values
      }
    });
    this.setState({ selectedSprint, filteredCandiate })
  }

  generateTable = (response) => {
    const colHeader = [];
    const eventReport = response;
    eventReport.candidate_list.every((elem) => {
      if (elem.feedback.length > 0) {
        const candidateAss = elem.feedback[0];
        if (candidateAss[0].ProblemSolvingSkill) {
          colHeader.push('Problem Solving');
        }
        if (candidateAss[0].Analytics) {
          colHeader.push('Analytics');
        }
        if (candidateAss[0].Communication) {
          colHeader.push('Communication');
        }
        if (candidateAss[0].LogicalSkill) {
          colHeader.push('Logical');
        }
        // colHeader.push('Compentency Rating');
        // colHeader.push('Status');
        // colHeader.push('Comments');
        return false;
      }
      return true;
    });
    const body = [];
    const feedbackArr = [];
    const panelName = [];
    const panelDetails = [];
    const panelList = [];
    eventReport.candidate_list.forEach((list, index) => {
      list.feedback.forEach((fbArr, fbArrIndex) => {
        fbArr.forEach((fb, fbIndex) => {
          const candidateObj = {};
          candidateObj.EmpName = list.EmpName;
          candidateObj.EmailId = list.EmailId;
          candidateObj.panelEmail = fb.email;
          candidateObj.panelName = fb.first_name;
          candidateObj.sprintLevel = fb.sprintLevel;
          if (panelName.indexOf(fb.first_name.trim()) < 0) {
            panelName.push(fb.first_name.trim());
            panelDetails.push({ name: fb.first_name.trim(), email: fb.email });
            panelList.push({ label: fb.first_name.trim(), value: fb.first_name.trim() });
          }
          if (fb.ProblemSolvingSkill) {
            candidateObj.ProblemSolvingSkill = fb.ProblemSolvingSkill;
          }
          if (fb.Analytics) {
            candidateObj.Analytics = fb.Analytics;
          }
          if (fb.Communication) {
            candidateObj.Communication = fb.Communication;
          }
          if (fb.LogicalSkill) {
            candidateObj.LogicalSkill = fb.LogicalSkill;
          }
          if (fb.sprintLevel === "Show and Tell assesment") {
            candidateObj['compentencyRating'] = fb.sq_final_status;
          } else if (fb.sprintLevel === "Final Assessment") {
            candidateObj['compentencyRating'] = '--';
          } else {
            candidateObj['compentencyRating'] = '--';
          }
          feedbackArr.push(candidateObj);
        })
      })
    });
    this.setState({ panelList, panelDetails, colHeader, feedbackArr });
  }

  setChart = (eventData, event) => {
    Highcharts.chart('containerChart', {
      title: {
        text: `Event Name: ${event.label}`
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: `Total: ${eventData.TotalEmp}`
      },
      xAxis: {
        categories: ['In-Progress', 'On-Hold', 'Selected', 'Rejected'],
      },
      yAxis:{
        title: {
          enabled: true,
          text: 'Counts',
          style: {
              fontWeight: 'normal'
          }
      }
      },
      series: [{
        type: 'column',
        colors: ['#b8daff', '#ffeeba', '#c3e6cb', '#f5c6cb'],
        colorByPoint: true,
        data: [Number(eventData.InprocessEmp), Number(eventData.HoldEmp), Number(eventData.SelectedEmp), Number(eventData.RejectedEmp)],
        showInLegend: false
      }]
    });
  }



  render() {
    const { eventList, selectedEvent, feedbackSummary, assessScale, selectedPanel, selectedSprint, panelList, filteredCandiate, colHeader } = this.state;
    return (
      <Fragment>
        <div className='eventStatusContainer'>
          <h3 className='pageTitle'>Event Status</h3>
          <section className='statusHandlerContainer'>
            <label className='eventLabel'>Event Name:</label>
            <Select
              value={selectedEvent}
              onChange={this.handleEventChange}
              options={eventList}
              styles={SelectStyles}
              placeholder='Select the Event'
            />
          </section>
          {feedbackSummary.SelectedEmp && <section className='statusList'>
            <Card className='card'>
              <Card.Header>
                <div className='statusContainer'><span>Total:</span><span>{feedbackSummary.TotalEmp}</span></div>
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item variant="primary">
                  <div className='statusContainer'><span>In-Progress:</span><span>{feedbackSummary.InprocessEmp}</span></div>
                </ListGroup.Item>
                <ListGroup.Item variant="warning">
                  <div className='statusContainer'><span>On-Hold:</span><span>{feedbackSummary.HoldEmp}</span></div>
                </ListGroup.Item>
                <ListGroup.Item variant="success">
                  <div className='statusContainer'><span>Selected:</span><span>{feedbackSummary.SelectedEmp}</span></div>
                </ListGroup.Item>
                <ListGroup.Item variant="danger">
                  <div className='statusContainer'><span>Rejected:</span><span>{feedbackSummary.RejectedEmp}</span></div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
            <div id="containerChart" style={{ width: 500, height: 250, border: 'solid 1px lightgray' }}></div>
          </section>}


          {panelList.length > 0 && <section className='statusHandlerContainer'>
            <label className='eventLabel'>Panel Name:</label>
            <Select
              value={selectedPanel}
              onChange={this.handlePanelChange}
              options={panelList}
              styles={SelectStyles}
              placeholder='Select the Panel'
            />
            {selectedPanel &&
              <div className="sprintlabel"> <label className='eventLabel'>Sprint:</label>
                <Select
                  value={selectedSprint}
                  onChange={this.handleSprintChange}
                  options={assessScale}
                  styles={SelectStyles}
                  placeholder='Select the Sprint'
                />
              </div>}
          </section>}
          {filteredCandiate.length > 0 && selectedSprint && selectedPanel &&
            <SprintWiseChart candidate={filteredCandiate} colHeader={colHeader} sprintTitle={selectedSprint.value}
              panelTitle={selectedPanel.value} />
          }
          {
            filteredCandiate.length === 0 && selectedSprint && selectedPanel &&
            <div className="errorLabel">No Data found for this Sprint.</div>
          }
        </div>
      </Fragment>
    )
  }
}

export default Dashboard;