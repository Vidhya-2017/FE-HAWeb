import React, { Fragment } from 'react';
import Select from 'react-select';
import BootstrapTable from 'react-bootstrap-table-next';
import jsPDF from 'jspdf';
import { Button, Table } from 'react-bootstrap';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/SquadReport.scss';

class SquadReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      selectedEvent: null,
      selectedSquad: null,
      selectedEventData: {},
      squadReport: [],
      squadData: [],
      squadList: []
    }
  }

  componentDidMount() {
    this.getEventList();
    this.getSquadList();
  }

  getSquadList = async () => {
    this.props.getSquadList().then(response => {
      this.setState({ squadData: response.arrRes })
    })
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
    const specialElementHandlers = {
      '.eventContainer': function (element, renderer) {
        return true;
      }
    };
    doc.fromHTML(document.getElementsByClassName('eventContainer')[0].innerHTML, 15, 15, {
      'elementHandlers': specialElementHandlers
    });
    doc.save('sample-file.pdf');
  }

  handleEventChange = (selectedEvent) => {
    const { squadData } = this.state;
    const squadListArr = squadData.filter((list) => list.EventID === selectedEvent.value);
    let squadList = [];
    squadList = squadListArr.map(list => {
      return {
        value: list.ID,
        label: list.SquadName
      }
    })
    console.log(squadData, '--squadList--', selectedEvent);
    console.log('--squadListArr--', squadListArr);

    this.setState({ selectedEvent, squadList, squadReport: [], selectedSquad: null});
  }

  handleSquadChange = (selectedSquad) => {
    this.setState({ selectedSquad, squadReport: [] });
  }

  squadReport = () => {
    const { selectedEvent, selectedSquad } = this.state;
    console.log('--selectedEvent--', selectedEvent);
    console.log('--selectedSquad--', selectedSquad);
    const reqObj = {
      squad_id: selectedSquad.value,
      event_id: selectedEvent.value
      };
    this.props.squadEventReport(reqObj).then(response => {
      this.setState({ squadReport: response })
    });
  }

  expandRow = () => {
    return ({
      onlyOneExpanding: true,
      parentClassName: 'parent-expand',
      className: 'expandDetails',
      renderer: (row, open) => {
        return (
          <div>
            <div>
              {row.feedback.length > 0 && row.feedback.map((fb) => {
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
    const { eventList, selectedEvent, squadReport, squadList, selectedSquad } = this.state;
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
      console.log('-----squadReport---', squadReport);

    return (
      <Fragment>
        <div className='eventContainer'>
          <h3 className='pageTitle'>Squad Reports</h3>
          <div className='squadSelection'>
          <section className='reportHandlerContainer'>
            <label className='eventLabel'>Event Name:</label>
            <Select
              value={selectedEvent}
              onChange={this.handleEventChange}
              options={eventList}
              styles={SelectStyles}
              placeholder='Select the Event'
            />
          </section>
          {selectedEvent && <section className='reportHandlerContainer'>
            <label className='eventLabel'>Squad Name:</label>
            <Select
              value={selectedSquad}
              onChange={this.handleSquadChange}
              options={squadList}
              styles={SelectStyles}
              placeholder='Select the Squad'
            />
          </section>}
          {selectedSquad && <Button className='file-upload fileUploadBtn btn shadow' onClick={this.squadReport}>Submit</Button>}
          </div>

          {squadReport && squadReport.Hackathon_Details && <div className='eventDetailsWrapper'>
            <h4>Event Details:</h4>
            <div className='eventDetails'>
              <p><span className='labelTitle'>Name:</span> {squadReport.Hackathon_Details[0].EventName}</p>
              <p><span className='labelTitle'>Client Name:</span> {squadReport.Hackathon_Details[0].ClientName}</p>
              <p><span className='labelTitle'>Location:</span> {squadReport.Hackathon_Details[0].Location}</p>
              <p><span className='labelTitle'>Date:</span> {new Date(squadReport.Hackathon_Details[0].Date).toLocaleDateString()}</p>
              <p><span className='labelTitle'>Duration:</span> {squadReport.Hackathon_Details[0].Duration}</p>
              {squadReport.Hackathon_Details[0].skill_name && <p><span className='labelTitle'>Skills:</span> {squadReport.Hackathon_Details[0].skill_name.split(',').join(', ')}</p>}
            </div>
          </div>}
          {squadReport && squadReport.Organizers_list && <div className='organizerListWrapper'>
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
                  {squadReport.Organizers_list.map((list, index) =>
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
          {squadReport && squadReport.candidate_details && squadReport.candidate_details.length > 0 &&
            <div className='organizerListWrapper'>
              <h4>Candidate Details:</h4>
              <div className='organizerDetails'>
                <BootstrapTable
                  wrapperClasses='listTable'
                  keyField='EmailId'
                  headerClasses="listHeader"
                  data={squadReport.candidate_details}
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

export default SquadReport;