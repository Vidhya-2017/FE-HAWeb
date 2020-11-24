import React, { Component } from 'react';
import XLSX from 'xlsx';
import CandidateTable from './CandidateTable';
import Button from '@material-ui/core/Button';
import '../scss/CandidateUpload.scss';
import CustomizedSnackbars from './CustomizedSnackbars';


const cancelBtnStyle = {
  margin: '0 0 8px 10px',
  color: 'white',
  height: 40,
  background: '#1b91e5',
  border: 'solid 2px #1b91e5',
  borderRadius: '.25rem'
}
class CandidateUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      selectedSheet: null,
      sheetOptions: [],
      showSnackbar: false,
      severity: '',
      toastMessage: '',
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


  handleChange = selectedSheet => {
    const { file } = this.state;
    console.log('-selectedSheet--', selectedSheet);
    this.setState({ selectedSheet: selectedSheet, data: [], cols: [] });
    if (selectedSheet) {
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
            if (hiddenColumns.indexOf(col) === -1 && col.toString().length > 0) {
              columns.push({
                id: col.toString(),
                numeric: false,
                disablePadding: false,
                label: getColText(col)
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
    }
  };


  cancelUpload = () => {
    this.setState({
      data: [], cols: [], file: {}, sheetOptions: [], selectedSheet: null
    });
  }

  submitUpload = (reqObj, response) => {
    let toastMsg = '';
    let severityType = '';
    if (response.errCode === 201 && response.InsertedCount > 0) {
      toastMsg = `Out of ${reqObj.data.length} candidates ${response.InsertedCount} of them inserted successfully and ${response.existingData.length} records already exists.`;
      severityType = "warning";
    } else if (response.errCode === 201 && response.InsertedCount === 0) {
      toastMsg = response.status;
      severityType = "warning";
    } else if (response.errCode === 200 && response.existingData.length === 0) {
      toastMsg = 'Excel sheet uploaded successfully.';
      severityType = "success";
    } else {
      toastMsg = 'Something went wrong. Please try again later.';
      severityType = "error";
    }
    this.setState({
      toastMessage:toastMsg, severity: severityType, showSnackbar: true,
      data: [], cols: [], file: {}, sheetOptions: [], selectedSheet: null
    });
  }

  closeSnackbar = () => {
    this.setState({ showSnackbar: false})
  }
  render() {
    const { file, data, cols, sheetOptions,showSnackbar,  severity, toastMessage } = this.state;

    return (
      <div>
        <section className='handlerContainer'>
          <h3 className='pageTitle'>Candidate Upload</h3>
          <div className='uploadBtn'>
            {file && file.name && <span className='fileName'>{file.name}</span>}
            {file && file.name ?
              <Button   size="small" onClick={this.cancelUpload} variant="contained" color="primary" style={cancelBtnStyle}>Cancel</Button> :
              <label htmlFor="fileUpload" className="file-upload fileUploadBtn btn shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg>
                <span>Choose a file&hellip;</span>
                <input id="fileUpload" type="file" onChange={this.getFileDetails} />
              </label>
            }
          </div>
        </section>
        {sheetOptions.length > 0 && 
        <CandidateTable 
        cancelUpload={this.cancelUpload} 
        submitUpload={this.submitUpload} 
        handleChange={this.handleChange} 
        sheets={sheetOptions} 
        column={cols} 
        row={data} />}
        <CustomizedSnackbars showSnackbar={showSnackbar} closeSnackbar={this.closeSnackbar} severity={severity} toastMessage={toastMessage} />
      </div>
    );
  }
}

export default CandidateUpload;
