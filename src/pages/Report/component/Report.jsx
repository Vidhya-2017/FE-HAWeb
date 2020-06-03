import React, { Fragment } from 'react';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Table } from 'react-bootstrap';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/Report.scss';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      selectedEvent: null,
      selectedEventData: {},
      eventReport: []
    }
  }

  componentDidMount() {
    this.getEventList();
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

  downloadReport = () => {
    const doc = new jsPDF('p', 'pt', 'letter');
    // const specialElementHandlers = {
    //   '.eventContainer': function (element, renderer) {
    //     return true;
    //   }
    // };
    // doc.fromHTML(document.getElementsByClassName('eventContainer')[0].innerHTML, 15, 15, {
    //   'elementHandlers': specialElementHandlers
    // });
    doc.autoTable({ html: '#candidate' })
    doc.save('sample-file.pdf');
  }

  handleEventChange = (selectedEvent) => {
    const { eventData } = this.state;
    const getEventDetails = eventData.find(list => list.EventId === selectedEvent.value);
    const reqObj = {
      event_id: selectedEvent.value
    };
    this.setState({ selectedEvent, selectedEventData: getEventDetails });
    this.props.eventReportWeb(reqObj).then(response => {
      this.setState({ eventReport: response });
    });
  }
  
  compare = (a, b) => {
    const bandA = a.sprintLevel.toUpperCase();
    const bandB = b.sprintLevel.toUpperCase();
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  expandRow = () => {
    return ({
      onlyOneExpanding: true,
      parentClassName: 'parent-expand',
      className: 'expandDetails',
      renderer: (row, open) => {
        // row.feedback.sort((a, b) => (a.sprintLevel > b.sprintLevel) ? 1 : -1);
        return (
          <div>
            <div>
              {row.feedback.map((fb) => {
                const columnsHeader = [
                  {
                    dataField: 'first_name',
                    text: 'Panel Name'
                  },
                ];
                if(fb[0].ProblemSolvingSkill) {
                  columnsHeader.push({
                    dataField: 'ProblemSolvingSkill',
                    text: 'Problem Solving'
                  });
                }
                if(fb[0].Analytics) {
                  columnsHeader.push({
                    dataField: 'Analytics',
                    text: 'Analytics'
                  });
                }
                if(fb[0].Communication) {
                  columnsHeader.push({
                    dataField: 'Communication',
                    text: 'Communication'
                  });
                }
                if(fb[0].LogicalSkill) {
                  columnsHeader.push({
                    dataField: 'LogicalSkill',
                    text: 'Logical'
                  });
                }
                if (fb[0].sq_final_status.length > 0) {
                  const compRat = fb[0].sprintLevel === "Show and Tell assesment" ? 'Compentency Rating' : 'Status';
                  columnsHeader.push({
                    dataField: 'sq_final_status',
                    text: compRat
                  });
                }
                columnsHeader.push({
                  dataField: 'feedbackTxt',
                  text: 'Comments'
                })
                return (
                  <Fragment>
                    <h5>{fb[0].sprintLevel}</h5>
                    <div style={{overflow: 'auto'}}>
                    <div style={{ width: (150 * columnsHeader.length) }}>
                      <BootstrapTable
                        wrapperClasses='listTable'
                        keyField='id'
                        headerClasses="listHeader"
                        data={fb}
                        columns={columnsHeader}
                      />
                    </div>
                    </div>
                  </Fragment>
                )
              }

              )}
              {row.feedback.length === 0  &&
              <div>
                <h6>Feedback has not provided for this candidate.</h6>
              </div>
            }
            </div>
          </div>
        )
      }
    })
  }

  render() {
    const { eventList, selectedEvent, eventReport } = this.state;
    const columns = [
      {
        dataField: 'id',
        text: 'Sl.No',
        headerClasses: 'slNoStyle',
        formatter: (cell, row, rowIndex) => {
          return (
            rowIndex + 1
          )
        },
      }, {
        dataField: 'EmpName',
        text: 'Candidate Name'
      }, {
        dataField: 'EmailId',
        text: 'Email Id'
      }, {
        dataField: 'ContactNo',
        text: 'Contact No'
      }];
    return (
      <Fragment>
        <div className='eventContainer'>
          <h3 className='pageTitle'>Event Reports</h3>
          <section className='reportHandlerContainer'>
            <label className='eventLabel'>Event Name:</label>
            <Select
              value={selectedEvent}
              onChange={this.handleEventChange}
              options={eventList}
              styles={SelectStyles}
              placeholder='Select the Event'
            />
            {selectedEvent && <Button className='file-upload fileUploadBtn btn shadow' onClick={this.downloadReport}>Download</Button>}
          </section>
          {eventReport && eventReport.Hackathon_Details && <div className='eventDetailsWrapper'>
            <h4>Event Details:</h4>
            <div className='eventDetails'>
              <p><span className='labelTitle'>Name:</span> {eventReport.Hackathon_Details[0].EventName}</p>
              <p><span className='labelTitle'>Client Name:</span> {eventReport.Hackathon_Details[0].ClientName}</p>
              <p><span className='labelTitle'>Location:</span> {eventReport.Hackathon_Details[0].Location}</p>
              <p><span className='labelTitle'>Date:</span> {new Date(eventReport.Hackathon_Details[0].Date).toLocaleDateString()}</p>
              <p><span className='labelTitle'>Duration:</span> {eventReport.Hackathon_Details[0].Duration}</p>
              {eventReport.Hackathon_Details[0].skill_name && <p><span className='labelTitle'>Skills:</span> {eventReport.Hackathon_Details[0].skill_name.split(',').join(', ')}</p>}
            </div>
          </div>}
          {eventReport && eventReport.Organizers_list && <div className='organizerListWrapper'>
            <h4>Organizer Details:</h4>
            <div className='organizerDetails'>
              <Table responsive bordered hover size="sm">
                <thead>
                  <tr className='listHeader'>
                    <th>Sl.No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email Id</th>
                  </tr>
                </thead>
                <tbody>
                  {eventReport.Organizers_list.map((list, index) =>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{list.first_name}</td>
                      <td>{list.last_name}</td>
                      <td>{list.email}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>}
          {eventReport && eventReport.candidate_list && eventReport.candidate_list.length > 0 &&
            <div className='organizerListWrapper'>
              <h4>Candidate Details:</h4>
              <div className='organizerDetails'>
                <BootstrapTable
                  wrapperClasses='listTable'
                  keyField='EmailId'
                  id='candidate'
                  headerClasses="listHeader"
                  data={eventReport.candidate_list}
                  columns={columns}
                  expandRow={this.expandRow()}
                />
              </div>
            </div>
          }
        </div>
      </Fragment>

    )
  }
}

export default Report;