import React, { Component, Fragment } from 'react';
import { Button, Alert, Modal, Toast } from 'react-bootstrap';
import XLSX from 'xlsx';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Select from 'react-select';
import moment from 'moment';
import clients from '../../../common/clients';
import SelectStyles from '../../../common/SelectStyles';
import ArrowDown from '../../../common/icons/ArrowDown';
import ArrowUp from '../../../common/icons/ArrowUp';
import '../scss/CandidateUpload.scss';

class CandidateUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      selectedSheet: null,
      sheetOptions: [],
      showModal: false,
      eventList: [],
      eventData: [],
      selectedEvent: null,
      selectedEventData: {},
      showSuccessMessage: false,
      toastMessage: '',
      durationList: []
    }
  }

  componentDidMount() {
    this.getDurationList();
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


  getDurationList = async () => {
      const response = await clients.axiosAPI.get('/durationList.php');
      this.setState({ durationList: response.data.arrRes });
  }
  
  getFileDetails = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      this.setState({ file: files[0] });
      this.handleFile(files[0]);
      e.target.value = null;
    }
  }

  handleFile(file, sheet = 0) {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      const sheetOptions = wb.SheetNames.map((sheet, index) => {
        return {
          value: index,
          label: sheet
        }
      });
      this.setState({ sheetOptions });
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  submitSheet = () => {
    this.setState({ showModal: true });
  }

  handleClose = () => this.setState({ showModal: false, selectedEvent: null, selectedEventData: {} });

  handleEventChange = (selectedEvent) => {
    const req = { EventID: selectedEvent.value };
    this.props.getEventByUser(req).then((response) => {
      if (response && response.arrRes) {
        this.setState({ selectedEvent, selectedEventData: response.arrRes[0] });
      }
    })
  }

  handleOnSubmit = () => {
    const { file, selectedEventData } = this.state;
    this.setState({ showModal: false });
    var reader = new FileReader();
    reader.onload = (e) => {
      var binaryData = e.target.result;
      var base64String = window.btoa(binaryData);
      const reqObj = {
        EventDate: selectedEventData.EventDate,
        EventId: selectedEventData.EventId,
        Name: selectedEventData.Name,
        isExternal: false,
        mime: file.type,
        data: base64String
      }
      this.props.importExcel(reqObj).then(response => {
        if (response && response.errCode === 200) {
          this.setState({
            showModal: false, selectedEvent: null, selectedEventData: {},
            data: [], cols: [], file: {}, sheetOptions: [],
            showSuccessMessage: true, selectedSheet: null, toastMessage: 'Excel sheet uploaded successfully.'
          });
        } else {
          this.setState({
            showModal: false, selectedEvent: null, selectedEventData: {},
            data: [], cols: [], file: {}, sheetOptions: [],
            showSuccessMessage: true, selectedSheet: null, toastMessage: response && response.status
          });
        }
      })
    };
    reader.readAsBinaryString(file);

  }

  handleChange = selectedSheet => {
    const { file } = this.state;
    this.setState({ selectedSheet: selectedSheet, data: [], cols: [] });
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      const wsname = wb.SheetNames[selectedSheet.value];
      const ws = wb.Sheets[wsname];
      let columns = [];
      let sheetData = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: '',
        blankrows: false
      });
      const customHeaderColumns = ['EmailId', 'ContactNo', 'EmpName'];
      const customColText = [
        {
          value: 'EmpName',
          text: 'Emp. Name'
        },
        {
          value: 'EmailId',
          text: 'Email Id'
        },
        {
          value: 'ContactNo',
          text: 'Contact No'
        },
        {
          value: 'RelevantExperience',
          text: 'Rel Exp.'
        },
        {
          value: 'AdditionalSkill',
          text: 'Additional Skill'
        }
      ];

      const getColText = (value) => {
        const customisedCol = customColText.find(col => col.value === value);
        if (!customisedCol) {
          return value;
        } else {
          return customisedCol.text;
        }
      }

      const hiddenColumns = ['candidate_status', 'notice_period', 'current_location', 'preferred_location']
      if (sheetData.length > 0) {
        sheetData[0].forEach(col => {
          if (hiddenColumns.indexOf(col) === -1) {
            columns.push({
              dataField: col.toString(),
              text: getColText(col),
              sort: true,
              filter: false,
              headerClasses: customHeaderColumns.indexOf(col) >= 0 ? 'customColHeader' : 'colHeader',
              sortCaret: (order, column) => {
                if (!order) return (<span className='arrowDesign'><ArrowUp /><ArrowDown /></span>);
                else if (order === 'asc') return (<span className='arrowDesign'><ArrowUp /></span>);
                else if (order === 'desc') return (<span className='arrowDesign'><ArrowDown /></span>);
                return null;
              }
            });
          }
        });
      }
      const data = XLSX.utils.sheet_to_json(ws, { raw: false });
      this.setState({ data: data, cols: columns });
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  showFilter = (e) => {
    const { cols } = this.state;
    let filterOptions = [...cols];
    if (e.target.checked) {
      filterOptions = filterOptions.map(item => {
        item.filter = textFilter({
          delay: 1000,
          className: 'filterTextField',
          placeholder: item.dataField,
        });
        return item;
      });
    } else {
      filterOptions = filterOptions.map(item => {
        item.filter = '';
        return item;
      });
    }
    this.setState({ cols: filterOptions });
  }

  render() {
    const { file, data, cols, selectedSheet, sheetOptions, showSuccessMessage,
      showModal, eventList, selectedEvent, selectedEventData, toastMessage, durationList } = this.state;
    const recordPerPageVal = Math.ceil(data.length / 10) * 10;
    const recordPerPageOptions = [
      { text: "10", page: 10 },
      { text: "20", page: 20 },
      { text: "30", page: 30 },
      { text: "50", page: 50 }
    ];
    const options = [];
    recordPerPageOptions.forEach(item => {
      if (recordPerPageVal >= item.page) {
        options.push(item);
      }
    });
    const sizePerPageRenderer = ({
      // options,
      currSizePerPage,
      onSizePerPageChange
    }) => (
        <div className="btn-group recordPerPage" role="group">
          {
            options.map((option) => {
              const isSelect = currSizePerPage === `${option.page}`;
              return (
                <button
                  key={option.text}
                  type="button"
                  onClick={() => onSizePerPageChange(option.page)}
                  className={`btn ${isSelect ? 'pageSelectedBtn' : 'pageBtn'}`}
                >
                  {option.text}
                </button>
              );
            })
          }
        </div>
      );
    const pageButtonRenderer = ({
      page,
      active,
      disable,
      title,
      onPageChange
    }) => {
      const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
      };
      const activeStyle = {
        border: 'none',
        padding: '6px 12px',
        color: 'white'
      };
      if (active) {
        activeStyle.backgroundColor = '#1b91e5a8';
      } else {
        activeStyle.backgroundColor = '#1b91e5';
      }
      if (typeof page === 'string') {
        activeStyle.backgroundColor = '#1b91e5';
      }
      return (
        <li key={page} className="page-item">
          <button key={page} onClick={handleClick} style={activeStyle}>{page}</button>
        </li>
      );
    };
    const paginationOptions = {
      sizePerPageRenderer,
      pageButtonRenderer
    };

console.log('--selectedEventData---', selectedEventData);
    return (
      <div>
        <h3 className='pageTitle'>Candidate Upload</h3>
        <section className='handlerContainer'>
          <div className='uploadBtn'>
            <label htmlFor="fileUpload" className="file-upload fileUploadBtn btn shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg>
              <span>Choose a file&hellip;</span>
              <input id="fileUpload" type="file" onChange={this.getFileDetails} />
            </label>
            {file && file.name && <span className='fileName'>{file.name}</span>}
          </div>
          {sheetOptions.length > 0 && <Select
            value={selectedSheet}
            onChange={this.handleChange}
            options={sheetOptions}
            styles={SelectStyles()}
            placeholder='Select the Sheet'
          />}
          {data.length > 0 &&
            <div className="custom-control custom-switch filterSwitch">
              <input type="checkbox" className="custom-control-input" onChange={this.showFilter} id="customSwitch1" />
              <label className="custom-control-label" htmlFor="customSwitch1">Show Filter Options</label>
            </div>
          }
          {sheetOptions.length > 0 && <div className='uploadBtn'>
            <Button disabled={data.length === 0} className='file-upload fileUploadBtn btn shadow' onClick={this.submitSheet}>Upload</Button>
          </div>
          }

        </section>

        {data.length > 0 &&
          <div className='candidateListTable'>
            <BootstrapTable
              keyField='id'
              data={data}
              columns={cols}
              wrapperClasses='listTable'
              // striped
              // hover
              rowClasses='rowlist'
              headerClasses="listHeader"
              pagination={paginationFactory(paginationOptions)}
              filter={filterFactory()}
            />
          </div>
        }
        <Modal className='eventModal' show={showModal} centered onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Select Event Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='eventData'>
              <span className='eventTitle'>Event Name:</span>
              <Select
                value={selectedEvent}
                onChange={this.handleEventChange}
                options={eventList}
                styles={SelectStyles()}
                placeholder='Select the Event'
              />
            </div>
            {selectedEvent &&
              <Fragment>
                <div className='eventData'>
                  <span className='eventTitle'>Event Date:</span>
                  <span className='scoreTextLabel'>{moment(selectedEventData.EventDate).format("DD-MM-YYYY")}</span>
                </div>
                <div className='eventData'>
                  <span className='eventTitle'>Duration:</span>
                  <span className='scoreTextLabel'>{durationList.find(list => list.DurationID === selectedEventData.Duration).Duration}</span>
                </div>
                <div className='eventData'>
                  <span className='eventTitle'>Event Skills:</span>
                  <span className='scoreTextLabel'>{selectedEventData.skillname.join(', ')}</span>
                </div>
              </Fragment>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button className='file-upload fileUploadBtn btn shadow' onClick={this.handleClose}>Close</Button>
            <Button className='file-upload fileUploadBtn btn shadow' onClick={this.handleOnSubmit}>Submit</Button>
          </Modal.Footer>
        </Modal>
        {data.length > 0 && <Alert className='noteContainer' variant='secondary'>
          ** Please check the candidate data and then click <b>Submit</b> to save the excel sheet.
        </Alert>}
        {showSuccessMessage &&
          <Toast
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#deeddd',
              border: '1px solid #28a745',
              color: '#6c757d',
              fontWeight: 500,
              width: 400
            }}
            onClose={() => this.setState({ showSuccessMessage: false })}
            show={showSuccessMessage}
            delay={3000}
            autohide
          >
            <Toast.Header style={{ background: '#deeddd', borderBottom: '1px solid #28a745' }}>
              <strong className="mr-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        }
      </div>
    );
  }
}

export default CandidateUpload;
