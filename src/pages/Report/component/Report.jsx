import React, { Fragment } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
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
      eventReport: [],
      colHeader: [],
      rowData: [],
      offset: 0,
      perPage: 5,
      currentPage: 0,
      pageCount: 0,
      data: [],
      candidateArrIndex: []
    }
  }

  componentDidMount() {
    this.getEventList();
  }

  getEventList = () => {
    this.props.getEventList().then(response => {
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

  downloadReport = () => {
    const { eventReport, colHeader, data } = this.state;
    const doc = new jsPDF('l', 'pt');
    doc.setFontSize(14);
    doc.setFontStyle('bold')
    doc.text(`Event Report`, 40, 40);
    doc.setFontSize(11);
    doc.setFontStyle('normal')
    doc.text(`Event Name: ${eventReport.Hackathon_Details[0].EventName}`, 40, 70);
    doc.text(`Client Name: ${eventReport.Hackathon_Details[0].ClientName}`, 400, 70);
    doc.text(`Location: ${eventReport.Hackathon_Details[0].Location}`, 40, 90);
    doc.text(`Date: ${new Date(eventReport.Hackathon_Details[0].Date).toLocaleDateString()}`, 400, 90);
    doc.setFontSize(14);
    doc.setFontStyle('bold')
    doc.text('Candidate Feedback:', 40, 120);
    doc.autoTable({
      startY: 140,
      head: [colHeader],
      bodyStyles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243], fontSize: 8 },
      styles: { lineColor: [44, 62, 80], lineWidth: 0.5 },
      body: data,
      theme: 'grid',
    });
    doc.save(`${eventReport.Hackathon_Details[0].EventName}.pdf`);
  }

  handleEventChange = (selectedEvent) => {
    const { eventData } = this.state;
    const getEventDetails = eventData.find(list => list.EventId === selectedEvent.value);
    const reqObj = {
      event_id: selectedEvent.value
    };
    this.setState({
      selectedEvent,
      selectedEventData: getEventDetails,
      rowData: [],
      offset: 0,
      currentPage: 0,
      data: [],
      candidateArrIndex: []
    });
    this.props.eventReportWeb(reqObj).then(response => {
      this.setState({ eventReport: response });
      this.generateTable(response);
    });
  }

  generateTable = (response) => {
    const colHeader = [];
    const eventReport = response;
    let assessScale = response.Hackathon_Details[0].OtherAssessScale;
    assessScale = assessScale.map(scale => scale.ScaleName);
    eventReport.candidate_list.every((elem) => {
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
    const candidateArrIndex = [];
    eventReport.candidate_list.forEach((list, index) => {
      list.feedback.forEach((fbArr, fbArrIndex) => {
        fbArr.forEach((fb, fbIndex) => {
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
            candidateObj['compentencyRating'] = fb.sq_final_status;
            candidateObj['status'] = '--';
          } else if (fb.sprintLevel === "Final Assessment") {
            candidateObj['compentencyRating'] = '--';
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
        candidateArrIndex.push(i);
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
    candidateArrIndex.push(body.length);
    const pageCount = Math.ceil(fbListIndex / this.state.perPage);
    const itemPerPage = this.state.offset + this.state.perPage;
    if (candidateArrIndex.length >= itemPerPage) {
      const newDataIndex = candidateArrIndex[itemPerPage];
      const slice = body.slice(this.state.offset, newDataIndex);
      this.setState({ colHeader, rowData: slice, pageCount, data: body, candidateArrIndex });
    } else {
      this.setState({ colHeader, rowData: body, pageCount, data: body, candidateArrIndex });
    }
  }

  handlePageClick = (e) => {
    const { data, candidateArrIndex, perPage } = this.state;
    const selectedPage = e.selected;
    const offsetUpdated = selectedPage * perPage;
    const itemPerPage = offsetUpdated + perPage;
    const slice = data.slice(candidateArrIndex[offsetUpdated], candidateArrIndex[itemPerPage]);
    this.setState({
      currentPage: selectedPage,
      offset: offsetUpdated,
      rowData: slice
    });
  };

  render() {
    const { eventList, selectedEvent, eventReport, colHeader, rowData } = this.state;
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
          <h3 className='pageTitle'>Event Reports</h3>
          <section className='reportHandlerContainer'>
            <label className='eventLabel'>Event Name:</label>
            <Select
              value={selectedEvent}
              onChange={this.handleEventChange}
              options={eventList}
              styles={SelectStyles()}
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
          {eventReport && eventReport.Organizers_list && eventReport.Organizers_list.length > 0 && <div className='organizerListWrapper'>
            <h4>Organizer Details:</h4>
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
                  {eventReport.Organizers_list.map((list, index) =>
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
          {eventReport && eventReport.Panels_list && eventReport.Panels_list.length > 0 && <div className='organizerListWrapper'>
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
                  {eventReport.Panels_list.map((list, index) =>
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
          {eventReport && eventReport.candidate_list && eventReport.candidate_list.length > 0 && rowData.length > 0 &&
            <Fragment>
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
                      <tr key={`row${index}`}>
                        {row.map((data, index) => <td rowSpan={data.rowSpan ? data.rowSpan : '1'} className={data.rowSpan ? 'rowSpan' : ''} style={{ textAlign: isNaN(Number(data)) ? 'initial' : 'center' }} key={index} >{data.content ? data.content : data}</td>)}
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={"eventPagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
            </Fragment>
          }
        </div>
      </Fragment >

    )
  }
}

export default Report;