import React, { Fragment } from 'react';
import Select from 'react-select';
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
      squadList: [],
      colHeader: [],
      rowData: [],
      showDownload: false
    }
  }

  componentDidMount() {
    this.getEventList();
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
  // getSquadList = async () => {
  //   this.props.getSquadList().then(response => {
  //     this.setState({ squadData: response.arrRes });
  //   })
  // }

  getEventList = () => {
    this.props.getEventList().then(response => {
      // this.getSquadList();
      if (response && response.arrRes) {
        let eventList = [];
        eventList = response.arrRes.map(list => {
          return {
            value: list.EventId,
            label: list.Name
          }
        })
        this.setState({ eventData: response.arrRes, eventList });
      }
    });
  }

  downloadSquadReport = () => {
    const { squadReport, colHeader, rowData, selectedSquad } = this.state;
    const doc = new jsPDF('l', 'pt');
    doc.setFontSize(14);
    // doc.setFontStyle('bold')
    doc.text(`Squad Report`, 40, 40);
    doc.setFontSize(11);
    // doc.setFontStyle('normal')
    doc.text(`Event Name: ${squadReport.Hackathon_Details[0].EventName}`, 40, 70);
    doc.text(`Squad Name: ${selectedSquad.label}`, 275, 70);
    doc.text(`Client Name: ${squadReport.Hackathon_Details[0].ClientName}`, 550, 70);
    doc.text(`Location: ${squadReport.Hackathon_Details[0].Location}`, 40, 90);
    doc.text(`Date: ${new Date(squadReport.Hackathon_Details[0].Date).toLocaleDateString()}`, 275, 90);
    doc.setFontSize(14);
    // doc.setFontStyle('bold')
    doc.text('Candidate Feedback:', 40, 120);
    doc.autoTable({
      startY: 140,
      head: [colHeader],
      bodyStyles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243], fontSize: 8 },
      styles: { lineColor: [44, 62, 80], lineWidth: 0.5 },
      body: rowData,
      theme: 'grid',
    });
    doc.save(`${squadReport.Hackathon_Details[0].EventName}.pdf`);
  }

  handleEventChange = (selectedEvent) => {
    this.getSquadList(selectedEvent.value);
    this.setState({ selectedEvent, squadReport: [], selectedSquad: null, showDownload: false });
  }

  handleSquadChange = (selectedSquad) => {
    this.setState({ selectedSquad, squadReport: [], showDownload: false });
  }

  squadReport = () => {
    const { selectedEvent, selectedSquad } = this.state;
    const reqObj = {
      squad_id: selectedSquad.value,
      event_id: selectedEvent.value
    };
    this.props.squadEventReport(reqObj).then(response => {
      this.setState({ squadReport: response, showDownload: true });
      this.generateTable(response);
    });
  }

  generateTable = (response) => {
    const colHeader = [];
    const squadReport = response;
    let assessScale = response.Hackathon_Details[0].OtherAssessScale;
    assessScale = assessScale.map(scale => scale.ScaleName);
    squadReport.candidate_details.every((elem) => {
      if (elem.feedback.length > 0) {
        const candidateAss = elem.feedback[0];
        colHeader.push(...['Sl.No', 'Candidate Name', 'Email Id', 'Contact No', 'Panel Name', 'Sprint Level'])
        assessScale.forEach(scale => {
          if (candidateAss[0].hasOwnProperty(scale)) {
            colHeader.push(scale);
          }
        });
        colHeader.push('Compentency Rating');
        colHeader.push('Status');
        colHeader.push('Comments');
        return false;
      }
      return true;
    });
    const body = [];
    const feedbackArr = [];
    squadReport.candidate_details.forEach((list, index) => {
      list.feedback.forEach(fbArr => {
        fbArr.forEach(fb => {
          const candidateObj = {};
          candidateObj.ID = index + 1;
          candidateObj.EmpName = list.EmpName;
          candidateObj.EmailId = list.EmailId;
          candidateObj.ContactNo = list.ContactNo;
          candidateObj.first_name = fb.first_name;
          candidateObj.sprintLevel = fb.sprintLevel;
          assessScale.forEach(scale => {
            if (fb.hasOwnProperty(scale)) {
              candidateObj[scale] = fb[scale];
            }
          });
          if (fb.sprintLevel === "Show and Tell assesment") {
            candidateObj['compentencyRating'] = fb.competancy_rating;
            candidateObj['status'] = '--';
          } else if (fb.sprintLevel === "Final Assessment") {
            candidateObj['compentencyRating'] = fb.competancy_rating;
            candidateObj['status'] = fb.sq_final_status;
          } else {
            candidateObj['compentencyRating'] = '--';
            candidateObj['status'] = '--';
          }
          candidateObj.feedbackTxt = fb.feedbackTxt;
          feedbackArr.push(candidateObj);
        })
      })
    });
    let groupCounter = 1;
    let fbListIndex = 0;
    for (let i = 0; i < feedbackArr.length; i++) {
      let row = [];
      const rowSpanHeaders = ['ID', 'EmpName', 'EmailId', 'ContactNo'];
      for (let key in feedbackArr[i]) {
        if (!rowSpanHeaders.includes(key)) {
          row.push(feedbackArr[i][key])
        }
      }
      const groupedCandidate = feedbackArr.filter(list => list.ID === feedbackArr[i].ID);
      if (groupCounter === 1) {
        fbListIndex = fbListIndex + 1;
        row.unshift({
          rowSpan: groupedCandidate.length,
          content: feedbackArr[i].ContactNo,
          styles: { valign: 'middle', halign: 'center' },
        });
        row.unshift({
          rowSpan: groupedCandidate.length,
          content: feedbackArr[i].EmailId,
          styles: { valign: 'middle', halign: 'center' },
        });
        row.unshift({
          rowSpan: groupedCandidate.length,
          content: feedbackArr[i].EmpName,
          styles: { valign: 'middle', halign: 'center' },
        });
        row.unshift({
          rowSpan: groupedCandidate.length,
          content: fbListIndex,
          styles: { valign: 'middle', halign: 'center' },
        })
      }
      if (groupedCandidate.length === groupCounter) {
        groupCounter = 1;
      } else {
        groupCounter = groupCounter + 1;
      }
      body.push(row);
    }
    this.setState({ colHeader, rowData: body });
  }

  render() {
    const { eventList, selectedEvent, squadReport, squadList, selectedSquad, rowData, colHeader, showDownload } = this.state;
    this.columns = [
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
          <h3 className='pageTitle'>Squad Reports</h3>
          <div className='squadSelection'>
            <section className='reportHandlerContainer'>
              <label className='eventLabel'>Event Name:</label>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                options={eventList}
                styles={SelectStyles()}
                placeholder='Select the Event'
              />
            </section>
            {selectedEvent && <section className='reportHandlerContainer'>
              <label className='eventLabel'>Squad Name:</label>
              <Select
                value={selectedSquad}
                onChange={this.handleSquadChange}
                options={squadList}
                styles={SelectStyles()}
                placeholder='Select the Squad'
              />
            </section>}
            {selectedSquad && <Button className='file-upload fileUploadBtn btn shadow' onClick={this.squadReport}>Submit</Button>}
            {showDownload && <Button className='file-upload fileUploadBtn btn shadow' onClick={this.downloadSquadReport}>Download</Button>}
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
                    <tr key={list.first_name}>
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
          {squadReport && squadReport.Panels_list && squadReport.Panels_list.length > 0 && <div className='organizerListWrapper'>
            <h4>Panelist Details:</h4>
            <div className='organizerDetails'>
              <Table id='Organizer' responsive bordered hover size="sm">
                <thead>
                  <tr className='listHeader'>
                    <th>Sl.No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email Id</th>
                  </tr>
                </thead>
                <tbody>
                  {squadReport.Panels_list.map((list, index) =>
                    <tr key={list.first_name}>
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
          {squadReport && squadReport.candidate_details && squadReport.candidate_details.length > 0 && rowData.length > 0 &&
            <div className='organizerListWrapper'>
              <h4>Candidate Details:</h4>
              <div className='organizerDetails candidateTable listTable'>
                <Table bordered size="sm" responsive hover>
                  <thead className='listHeader'>
                    <tr>
                      {colHeader.map(col =>
                        <th key={col}>{col}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rowData.map((row, index) =>
                      <tr key={`row-${index}`}>
                        {row.map((data, index) => <td key={index} rowSpan={data.rowSpan ? data.rowSpan : '1'} className={data.rowSpan ? 'rowSpan' : ''} style={{ textAlign: isNaN(Number(data)) ? 'initial' : 'center' }}>{data.content ? data.content : data}</td>)}
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          }
        </div>
      </Fragment>

    )
  }
}

export default SquadReport;