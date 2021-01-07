import React, { Component } from 'react';
import { Toast } from 'react-bootstrap';
import XLSX from 'xlsx';
import Select from 'react-select';
import MaterialTable from "material-table";
import { withStyles, Button, Dialog, DialogContent, AppBar, Toolbar, IconButton, Typography, DialogTitle } from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import SelectStyles from '../../../../common/SelectStyles';
import ArrowDown from '../../../../common/icons/ArrowDown';
import ArrowUp from '../../../../common/icons/ArrowUp';
// import '../../scss/CandidateUpload.scss';
const styles = (theme) => ({
  btnalign: {
    marginLeft: '20px'
  }
});
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
      openCandidateUploadModal: false,
      showAddSpocModal: false,
    }
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

  submitSheet = async () => {
    let Candidates = [...this.state.data];
    const reqobjData = Candidates.map(list => {
      return {
        candidate_name: list.candidate_name || "",
        email_id: list.email_id || "",
        contact: list.contact || "",
        total_experience: list.total_experience || "",
        relevant_experience: list.relevant_experience || "",
        current_company: list.current_company || "",
        notice_period: list.notice_period || "",
        current_location: list.current_location || "",
        preferred_location: list.preferred_location || "",
        hr_test_taken: list.hr_test_taken || "",
        testlink_received_dt: list.testlink_received_dt || "",
        test_completed_dt: list.test_completed_dt || "",
        hr_score: list.hr_score || "",
        hr_remarks: list.hr_remarks || "",
        source: list.source || "",
        spoc: list.spoc || "",
        recruiter: list.recruiter || "",
        primary_skill: list.primary_skill || "",
        secondary_skill: list.secondary_skill || "",
        created_by: this.props.userDetails.user_id,
        feedback: [
          {
            interview_level: list.interview_level || "",
            status_name: list.status_name || "",
            interview_schedule_dt: list.interview_schedule_dt || "",
            created_by: this.props.userDetails.user_id
          }
        ]
      }
    })
    const reqobj = { json_lists: reqobjData };
    await this.props.sendCandidateList(reqobj);
    this.setState({ data: [], columnFields: [], file: {}, sheetOptions: [] })

  }

  handleClose = () => this.setState({ showModal: false, selectedEvent: null, selectedEventData: {}, Candidates: '' });

  handleChange = selectedSheet => {
    const { file } = this.state;
    this.setState({ selectedSheet: selectedSheet, data: [], cols: [] });
    this.columnFields = [];
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
      if (sheetData.length > 0) {
        columns = sheetData[0].map(col => {
          return {
            dataField: col.toString().trim(),
            text: col,
            sort: true,
            filter: false,
            sortCaret: (order, column) => {
              if (!order) return (<span><ArrowUp /><ArrowDown /></span>);
              else if (order === 'asc') return (<span><ArrowUp /></span>);
              else if (order === 'desc') return (<span><ArrowDown /></span>);
              return null;
            }
          }
        });
      }
      const data = XLSX.utils.sheet_to_json(ws, { raw: false });
      /* Object.keys(data[0]).forEach((key, index) => { */
      sheetData[0].forEach((key, index) => {
        if (key) {
          this.columnFields.push(
            {
              title: key,
              field: key,
            },
          )
        }
      });

      this.setState({ data: data, cols: columns });
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  candidateUploadModal = () => {
    // const {  } = this.state;
    this.setState({
      openCandidateUploadModal: true
    })
  }

  editSubmit = (updatedScale, oldData) => {
    const data = [...this.state.data];
    data[data.indexOf(oldData)] = updatedScale;

    data[data.indexOf(oldData)] = updatedScale;
    this.setState(prevState => ({
      ...prevState, data: data,
    }))

  }
  handleDelete = (updatedScale, oldData) => {
    const data = [...this.state.data];
    data[data.splice(oldData, 1)] = updatedScale
    this.setState(prevState => ({
      ...prevState, data: data,
    }))
  }

  render() {
    const { classes } = this.props;
    const { file, data, selectedSheet, sheetOptions, showSuccessMessage,
      toastMessage, openCandidateUploadModal } = this.state;

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

    return (
      <div>
        <div className='uploadBtn'>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.btnalign}
            onClick={this.candidateUploadModal}
          >
            Candidate Upload
            </Button>
        </div>
        <Dialog fullScreen aria-labelledby="responsive-dialog-title" open={openCandidateUploadModal} >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => this.setState({ openCandidateUploadModal: false })} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" style={{ flex: 1 }} >
                Upload Candidates
            </Typography>
            </Toolbar>
          </AppBar>
          <DialogTitle id="responsive-dialog-title">{"Upload Candidates"}</DialogTitle>
          <DialogContent>
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
              {sheetOptions.length > 0 && <div className='uploadBtn'>
                <Button disabled={data.length === 0} className='file-upload fileUploadBtn btn shadow' onClick={this.submitSheet}>Upload</Button>
              </div>
              }
            </section>
            {data.length > 0 &&
              <div className='candidateListTable'>
                <MaterialTable
                  title='Candidate List'
                  columns={this.columnFields}
                  key={data.id}
                  data={data}
                  headerClasses="listHeader"
                  wrapperClasses='listTable'
                  options={{
                    actionsColumnIndex: -1,
                    pageSizeOptions: []
                  }}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        if (oldData) {
                          this.editSubmit(newData, oldData);
                        }
                      }),
                    onRowDelete: (newData, oldData) =>
                      new Promise((resolve) => {
                        resolve();
                        this.handleDelete(newData, oldData);
                      })
                  }}
                />
              </div>
            }
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
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

// export default CandidateUpload;
export default withStyles(styles, { withTheme: true })(CandidateUpload);

