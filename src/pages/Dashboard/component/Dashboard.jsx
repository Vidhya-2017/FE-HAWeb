import React, { Fragment } from 'react';
import Select from 'react-select';
import Highcharts from 'highcharts';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
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
      filteredCandiate: [],
      selectedCategories: null,
      squadData: [],
      squadList: [],
      selectedSquad: null,
      candidateName: [],
      panelReport: []
    }
  }

  componentDidMount() {
    if (this.props.userDetails.user_id) {
      this.getEventList();
    } else {
      this.props.history.push('/');
    }
    const containerChartDom = document.getElementsByClassName('containerChart');
    const feedBackChartDom = document.getElementsByClassName('feedBackChart');
    document.addEventListener("sideBarToggled", (event) => {
      if (event.detail.sideBarToggled && this.clientFbChart && this.totalChart &&
        containerChartDom && containerChartDom.length > 0 && feedBackChartDom && feedBackChartDom.length > 0) {
        setTimeout(() => {
          this.clientFbChart.setSize(feedBackChartDom[0].clientWidth - 30);
          this.totalChart.setSize(containerChartDom[0].clientWidth - 30);
        }, 200)
      }
    });
    window.addEventListener('resize', () => {
      if (this.clientFbChart && this.totalChart && containerChartDom && containerChartDom.length > 0 && feedBackChartDom && feedBackChartDom.length > 0) {
        setTimeout(() => {
          this.clientFbChart.setSize(feedBackChartDom[0].clientWidth - 30);
          this.totalChart.setSize(containerChartDom[0].clientWidth - 30);
        }, 200)
      }
    });
  }

  getEventList = () => {
    this.props.getEventList().then(response => {
      if (response && response.arrRes) {
        let eventList = [];
        const dates = [];
        eventList = response.arrRes.map(list => {
          dates.push(moment(list.EventDate));
          return {
            value: list.EventId,
            label: list.Name
          }
        });
        const maxDate = moment.max(dates)
        const latestEvent = response.arrRes.filter(list => list.EventDate === maxDate._i);
        const selectedEvent = {
          value: latestEvent[0].EventId,
          label: latestEvent[0].Name
        }
        this.handleEventChange(selectedEvent);
        this.setState({ eventData: response.arrRes, eventList });
      }
    });
  }

  getSquadList = async (eventID) => {
    const reqObj = { eventID: eventID };
    this.props.getSquadList(reqObj).then(response => {
      if (response && response.arrRes) {
        let squadList = [];
        squadList = response.arrRes.map(list => {
          return { value: list.ID, label: list.SquadName }
        })
        this.setState({ squadList });
      }
    })
  }

  handleEventChange = (selectedEvent) => {
    const reqObj = {
      event_id: selectedEvent.value
    };
    this.getSquadList(selectedEvent.value);
    this.setState({ selectedEvent, panelList: [], panelDetails: [], selectedCategories: null, selectedSprint: null, selectedPanel: null });
    this.props.feedbackSummary(reqObj).then(response => {
      if (response && response.resultArr) {
        this.setState({ feedbackSummary: response.resultArr });
        this.setChart(response.resultArr, selectedEvent);
      }
    });
    const eventReportReqObj = {
      event_id: selectedEvent.value
    };
    const panelReportReqObj = {
      eventID: selectedEvent.value
    };

    this.props.panelFeedbackReport(panelReportReqObj).then(panelresponse => {
      if (panelresponse && panelresponse.feedBack) {
        this.setState({ panelReport: panelresponse.feedBack });
        if (panelresponse.feedBack.length > 0) {
          this.feedbackChart(panelresponse.feedBack, panelresponse.eventDetail[0]);
        }
      }
    });
    this.props.eventReportWeb(eventReportReqObj).then(response => {
      if (response) {
        let assessScale = response.Hackathon_Details[0].AssessScale.split(',');
        assessScale.splice(assessScale.length - 1, 0, "Show and Tell assesment");
        assessScale = assessScale.map(scale => {
          return {
            value: scale,
            label: scale
          }
        })
        this.setState({ assessScale });
        this.generateTable(response);
      }
    });
  }

  handleSquadChange = (selectedSquad) => {
    this.setState({ selectedSquad, selectedSprint: null, selectedPanel: null });
  }

  handlePanelChange = (selectedPanel) => {
    this.setState({ selectedPanel, selectedSprint: null });
  }

  handleSprintChange = (selectedSprint) => {
    const { feedbackArr, selectedPanel, colHeader, selectedSquad, selectedCategories } = this.state;
    const colors = ['#b8daff', '#ffeeba', '#c3e6cb', '#f5c6cb', '#17a2b8', '#cddc39', '#99d69b', '#e7abf1', '#69c0e7'];
    if (selectedPanel && selectedCategories.value === 'Panel-wise') {
      const candidateName = [];
      let filteredCandiate = feedbackArr.filter(list => list.sprintLevel === selectedSprint.value && list.panelName.trim() === selectedPanel.value);
      const assessLevelData = colHeader.map((item, index) => {
        return {
          name: item,
          color: colors[index],
          data: []
        }
      });
      filteredCandiate.forEach((list, index) => {
        candidateName.push(list.EmpName);
        assessLevelData.forEach((col) => {
          if (list.hasOwnProperty(col.name)) {
            col.data.push(Number(list[col.name]));
          }
        });
      });
      this.setState({ selectedSprint, filteredCandiate: assessLevelData, candidateName: candidateName })
    } else if (selectedCategories.value === 'Squad-wise') {
      const candidateName = [];
      let filteredCandiate = feedbackArr.filter(list => list.sprintLevel === selectedSprint.value && list.SquadID.trim() === selectedSquad.value && list.panelName.trim() === selectedPanel.value);
      const assessLevelData = colHeader.map((item, index) => {
        return {
          name: item,
          color: colors[index],
          data: []
        }
      });
      filteredCandiate.forEach((list, index) => {
        candidateName.push(list.EmpName);
        assessLevelData.forEach((col) => {
          if (list.hasOwnProperty(col.name)) {
            col.data.push(Number(list[col.name]));
          }
        });
      });
      this.setState({ selectedSprint, filteredCandiate: assessLevelData, candidateName: candidateName })
    }
  }

  generateTable = (response) => {
    const colHeader = [];
    const eventReport = response;
    let assessScale = response.Hackathon_Details[0].OtherAssessScale;
    assessScale = assessScale.map(scale => scale.ScaleName);
    eventReport.candidate_list.every((elem) => {
      if (elem.feedback.length > 0) {
        const candidateAss = elem.feedback[0];
        assessScale.forEach(scale => {
          if (candidateAss[0].hasOwnProperty(scale)) {
            colHeader.push(scale);
          }
        });
        return false;
      }
      return true;
    });
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
          candidateObj.SquadID = list.SquadID;
          candidateObj.SquadName = list.SquadName;
          candidateObj.panelEmail = fb.email;
          candidateObj.panelName = fb.first_name;
          candidateObj.sprintLevel = fb.sprintLevel;
          if (panelName.indexOf(fb.first_name.trim()) < 0) {
            panelName.push(fb.first_name.trim());
            panelDetails.push({ name: fb.first_name.trim(), email: fb.email });
            panelList.push({ label: fb.first_name.trim(), value: fb.first_name.trim() });
          }
          assessScale.forEach(scale => {
            if (fb.hasOwnProperty(scale)) {
              candidateObj[scale] = fb[scale];
            }
          });
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

  feedbackChart = (feedback, event) => {
    const yAxisData = feedback.map(fb => Number(fb.cf_rating));
    const xAxisData = feedback.map(fb => fb.first_name);
    this.clientFbChart = Highcharts.chart('feedBackChart', {
      title: {
        text: `Client: ${event.ClientName}`
      },
      subtitle: {
        text: 'Feedback'
      },
      credits: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: '100%'
          },
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.x + '</b><br/>' +
            '<b>Comments: </b>' + feedback[this.point.index].cf_comment;
        }
      },
      xAxis: {
        categories: xAxisData,
      },
      yAxis: {
        title: {
          enabled: true,
          text: 'Rating',
          style: {
            fontWeight: 'normal'
          }
        }
      },
      series: [{
        type: 'column',
        colors: ['#b8daff', '#ffeeba', '#c3e6cb', '#f5c6cb'],
        colorByPoint: true,
        data: yAxisData,
        showInLegend: false
      }]
    });
  }

  setChart = (eventData, event) => {
    this.totalChart = Highcharts.chart('containerChart', {
      title: {
        text: `Event Name: ${event.label}`
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },
      tooltip: {
        enabled: false
      },
      subtitle: {
        text: `Total: ${eventData.TotalEmp}`
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: '100%'
          },
        }]
      },
      xAxis: {
        categories: ['In-Progress', 'On-Hold', 'Selected', 'Rejected'],
      },
      yAxis: {
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

  handleCategoriesChange = (selectedCategories) => {
    this.setState({ selectedCategories: selectedCategories, selectedSquad: null, selectedSprint: null, selectedPanel: null })
  }


  render() {
    const { eventList, selectedEvent, feedbackSummary, assessScale, selectedPanel, selectedSquad, panelReport,
      squadList, selectedCategories, selectedSprint, panelList, filteredCandiate, candidateName } = this.state;
    return (
      <Fragment>
        <div className='eventStatusContainer'>
          <h3 className='pageTitle'>Event Status</h3>
          <section className='statusHandlerContainer'>
            <Fragment>
              <div className="sprintlabel">
                <label className='eventLabel'>Event Name:</label>
                <Select
                  value={selectedEvent}
                  onChange={this.handleEventChange}
                  options={eventList}
                  defaultValue={selectedEvent}
                  styles={SelectStyles()}
                  placeholder='Select the Event'
                />
              </div>
              {selectedEvent &&
                <div className="sprintlabel">
                  <label className='eventLabel'>Categories:</label>
                  <Select
                    value={selectedCategories}
                    onChange={this.handleCategoriesChange}
                    options={[{ value: 'Panel-wise', label: 'Panel-wise' }, { value: 'Squad-wise', label: 'Squad-wise' }]}
                    styles={SelectStyles()}
                    placeholder='Select Categories'
                  />
                </div>}
              {selectedCategories && selectedCategories.value === 'Panel-wise' && panelList.length > 0 &&
                <div className="sprintlabel">
                  <label className='eventLabel'>Panel Name:</label>
                  <Select
                    value={selectedPanel}
                    onChange={this.handlePanelChange}
                    options={panelList}
                    styles={SelectStyles()}
                    placeholder='Select the Panel'
                  />
                </div>
              }
              {selectedCategories && selectedCategories.value === 'Squad-wise' && squadList.length > 0 &&
                <div className="sprintlabel">
                  <label className='eventLabel'>Squad Name:</label>
                  <Select
                    value={selectedSquad}
                    onChange={this.handleSquadChange}
                    options={squadList}
                    styles={SelectStyles()}
                    placeholder='Select the Squad'
                  />
                </div>
              }
              {selectedSquad && selectedCategories && selectedCategories.value === 'Squad-wise' && panelList.length > 0 &&
                <div className="sprintlabel">
                  <label className='eventLabel'>Panel Name:</label>
                  <Select
                    value={selectedPanel}
                    onChange={this.handlePanelChange}
                    options={panelList}
                    styles={SelectStyles()}
                    placeholder='Select the Panel'
                  />
                </div>
              }
              {((selectedPanel && selectedCategories && selectedCategories.value === 'Panel-wise')
                || (selectedSquad && selectedPanel && selectedCategories && selectedCategories.value === 'Squad-wise')) &&
                <div className="sprintlabel"> <label className='eventLabel'>Sprint:</label>
                  <Select
                    value={selectedSprint}
                    onChange={this.handleSprintChange}
                    options={assessScale}
                    styles={SelectStyles()}
                    placeholder='Select the Sprint'
                  />
                </div>}
            </Fragment>
          </section>
          <section className='eventStatus'>
            {feedbackSummary.SelectedEmp &&
              <Row className='statusRow'>
                <Col sm className='colStatus successBorder'>
                  <div>
                    <p>Selected</p>
                    <p className="success">{feedbackSummary.SelectedEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus primaryBorder'>
                  <div>
                    <p>In-Progress</p>
                    <p className="primary">{feedbackSummary.InprocessEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus dangerBorder'>
                  <div>
                    <p>Rejected</p>
                    <p className="danger">{feedbackSummary.RejectedEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus warningBorder'>
                  <div>
                    <p>On-Hold</p>
                    <p className="warning">{feedbackSummary.HoldEmp}</p>
                  </div>
                </Col>
                <Col sm className='colStatus secondaryBorder'>
                  <div>
                    <p>Total</p>
                    <p className="secondary">{feedbackSummary.TotalEmp}</p>
                  </div>

                </Col>
              </Row>}
          </section>
          <section className='statusList'>
            <Row>
              <Col sm className='containerChart'>
                {feedbackSummary.SelectedEmp && <div id="containerChart" style={{ height: 250, border: 'solid 1px lightgray' }}></div>}
              </Col>

              <Col sm className='feedBackChart'>
                {panelReport.length > 0 && <div id="feedBackChart" style={{ height: 250, border: 'solid 1px lightgray' }}></div>}
              </Col>
            </Row>
          </section>
          {candidateName.length > 0 && selectedSprint && (selectedPanel || selectedSquad) &&
            <SprintWiseChart candidate={filteredCandiate} colHeader={candidateName} sprintTitle={selectedSprint.value}
              panelTitle={selectedPanel ? selectedPanel.value : selectedSquad.label} />
          }
          {
            candidateName.length === 0 && selectedSprint && (selectedPanel || selectedSquad) &&
            <div className="errorLabel">No Data found for this Sprint.</div>
          }
        </div>
      </Fragment>
    )
  }
}

export default Dashboard;