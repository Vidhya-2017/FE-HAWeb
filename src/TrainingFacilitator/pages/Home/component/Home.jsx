import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import XLSX from 'xlsx';
import Select from 'react-select';
import ArrowDown from '../../../../common/icons/ArrowDown';
import ArrowUp from '../../../../common/icons/ArrowUp';
import '../scss/Home.scss';
import SelectStyles from '../../../components/UI_Component/Select/SelectStyles';
import { TextField } from '@material-ui/core';
import MaterialTable from "material-table";
import SnackBar from "../../../components/UI_Component/SnackBar/SnackBar";

const months = [{ value: 'January', label: 'January' }, { value: 'February', label: 'February' }, { value: 'March', label: 'March' }, { value: 'April', label: 'April' }, { value: 'May', label: 'May' }, { value: 'June', label: 'June' }, { value: 'July', label: 'July' }, { value: 'August', label: 'August' }, { value: 'September', label: 'September' }, { value: 'October', label: 'October' }, { value: 'November', label: 'November' }, { value: 'December', label: 'December' }]


class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      selectedSheet: null,
      selectedTraining: null,
      trainingList: [],
      sheetOptions: [],
      snackBarOpen: false,
      snackmsg: '',
      snackvariant: '',
      curriculumUpload: null,
      skillcurriculumUpload: null,
      skillList: [],
      trainingDetails: [],
      selectedSkill: null
    }
    this.columnFields = [

    ]
  }

  componentDidMount() {
    this.getTrainingList();
    this.getSkillList();

  }

  static getDerivedStateFromProps(props) {
    if (props.curriculumUpload !== undefined) {
      return {
        curriculumUpload: props.curriculumUpload
      }
    }
    if (props.skillcurriculumUpload !== undefined) {
      return {
        skillcurriculumUpload: props.skillcurriculumUpload
      }
    }

  }

  getTrainingList = () => {
    this.props.getTrainingList().then(response => {
      if (response && response.arrRes) {
        const trainingDetails = response.arrRes;
        const trainingList = response.arrRes.map(list => {
          return {
            value: list.id,
            label: list.training_name
          }
        });
        this.setState({ trainingList, trainingDetails });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later', snackvariant: "error" })
      }
    })
  }

  getSkillList = () => {
    this.props.getSkillList().then(response => {
      if (response && response.arrRes) {
        const skillList = response.arrRes.map(list => {
          return {
            value: list.id,
            label: list.skill_name
          }
        });
        this.setState({ skillList });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later', snackvariant: "error" })
      }
    })
  }

  getFileDetails = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      this.setState({ file: files[0] });
      this.handleFile(files[0]);
    }
  }

  handleFile(file, sheet = 4) {
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
    const { file, data, selectedTraining, selectedSkill } = this.state;
    if (this.state.skillcurriculumUpload === true) {
      if (selectedSkill === null) {
        this.setState({ snackBarOpen: true, snackmsg: 'Please Select the Skill', snackvariant: "error" });
      } else {
        const reqObj = {
          details: data,
          created_by: this.props.userDetails.user_id,
          updated_by: this.props.userDetails.user_id,
          skill_id: selectedSkill.value,
          skill_curriculum_upload: 1
        }
        this.props.insertCurriculum(reqObj).then((response) => {
          if (response && response.errCode === 200) {

            this.setState({ sheetOptions: [], file: {}, data: [], selectedSkill: null, snackBarOpen: true, snackmsg: 'Curriculum Uploaded Successfully', snackvariant: "success" });
          } else if (response.errCode === 404) {

            const snackmsg = 'Error in Inserting Curriculum';
            this.setState({ sheetOptions: [], file: {}, data: [], selectedSkill: null, snackBarOpen: true, snackmsg, snackvariant: "success" })

          }
        });
      }
    }

    if (this.state.curriculumUpload === true) {
      if (selectedTraining === null || selectedSkill === null) {
        this.setState({ snackBarOpen: true, snackmsg: 'Please Select the Training and Skill', snackvariant: "error" });
      } else {
        const reqObj = {
          details: data,
          created_by: this.props.userDetails.user_id,
          training_id: selectedTraining.value,
          updated_by: this.props.userDetails.user_id,
          skill_id: selectedSkill.value,
          skill_curriculum_upload: 0
        }
        this.props.insertCurriculum(reqObj).then((response) => {

          if (response && response.errCode === 200) {

            this.setState({ sheetOptions: [], file: {}, data: [], selectedTraining: null, selectedSkill: null, snackBarOpen: true, snackmsg: 'Curriculum Uploaded Successfully', snackvariant: "success" });
          } else if (response.errCode === 404) {

            const snackmsg = 'Error in Inserting Curriculum';
            this.setState({ sheetOptions: [], file: {}, data: [], selectedTraining: null, selectedSkill: null, snackBarOpen: true, snackmsg, snackvariant: "success" })

          }
        });
      }
    }

    if (this.state.skillcurriculumUpload !== true && this.state.curriculumUpload !== true) {

      if (selectedTraining === null) {
        this.setState({ snackBarOpen: true, snackmsg: 'Please Select the Training', snackvariant: "error" });
      } else {
        var reader = new FileReader();
        reader.onload = (e) => {
          const reqObj = {
            // mime: file.type,
            details: data,
            created_by: this.props.userDetails.user_id,
            training_id: selectedTraining.value,
            // sheetname : this.state.selectedSheet.label,
            updated_by: this.props.userDetails.user_id
          }

          this.props.insertCandidates(reqObj).then((response) => {
            if (response && response.errCode === 200) {
              this.setState({ sheetOptions: [], file: {}, data: [], selectedTraining: null, snackBarOpen: true, snackmsg: 'Candidates Uploaded Successfully', snackvariant: "success" });
            } else if (response.errCode === 404) {
              const snackmsg = `We have ${response.Email_exist.length} Existing Data and ${response.Format_error_list.length} Format Error Data and Remaining Data has been Uploaded Successfully`;
              this.setState({ sheetOptions: [], file: {}, data: [], selectedTraining: null, snackBarOpen: true, snackmsg, snackvariant: "success" })
            }
          });
        };
        reader.readAsBinaryString(file);
      }
    }

  }

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
        if (key === 'Expected Joining Date') {
          this.columnFields.push(
            {
              title: key,
              field: key,
              editComponent: props => (
                <TextField
                  id="Expected Joining Date"
                  name="Expected Joining Date"
                  type="date"
                  value={props.value}
                  onChange={e => props.onChange(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ),
            },
          )
        } else if (key === 'Joining Month') {
          this.columnFields.push(
            {
              title: key,
              field: key,
              editComponent: props => {
                const defaultLabel = (typeof props.rowData["Joining Month"] === 'string') ? props.rowData["Joining Month"] : props.rowData["Joining Month"].label;
                return (
                  <Select
                    placeholder="Joining Month"
                    onChange={e => props.onChange(e)}
                    options={months}
                    styles={SelectStyles()}
                    defaultValue={{ value: props.value, label: defaultLabel }}
                  />
                )
              },
            },
          )
        } else {
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



  editSubmit = (newData, oldData) => {
    const data = [...this.state.data];
    data[data.indexOf(oldData)] = newData;
    if (this.state.curriculumUpload !== true && this.state.skillcurriculumUpload !== true) {
      this.setState(prevState => ({
        data: prevState.data.map(
          (el, index) => index === oldData.tableData.id ? {
            ...el,
            "Joining Month": newData['Joining Month'].value ? newData['Joining Month'].value : newData['Joining Month'],
            "SAP ID": newData["SAP ID"],
            "First Name": newData["First Name"],
            "Last Name": newData["Last Name"],
            "Email": newData["Email"],
            "Account": newData["Account"],
            "Lob": newData["Lob"],
            "Location": newData["Location"],
            "Mode 1": newData["Mode 1"],
            "Mode 2": newData["Mode 2"],
            "SME": newData["SME"],
            "Phone": newData["Phone"],
            "Batch": newData["Batch"],
            "Expected Joining Date": newData["Expected Joining Date"],

          } : el
        )
      }))
    } else {
      if (oldData) {
        this.setState((prevState) => {
          const data = [...prevState.data];
          data[data.indexOf(oldData)] = newData;
          return { ...prevState, data };
        });
      }

    }
  }

  handleDelete = (oldData) => {
    const data = [...this.state.data];
    data.splice(data.indexOf(oldData), 1);
    this.setState({
      data: data,
    });

  }

  selectChange = (selectoption) => {
    if (this.state.curriculumUpload === true) {
      this.skillList = [];
      this.state.trainingDetails.filter((val) => {
        if (val.id === selectoption.value) {
          this.skillList = val.skills_array.map((value) => {
            const obj = {
              value: value.id,
              label: value.skill_name
            }
            return obj;
          })
        }
      })
    }
    this.setState({ selectedTraining: selectoption, skillList: this.skillList, selectedSkill: null });
  };

  handleSkillChange = (selectedOption) => {
    this.setState({ selectedSkill: selectedOption });
  }

  handleClick = () => {
    this.setState({ snackBarOpen: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  render() {
    const { file, data, snackBarOpen, snackvariant, snackmsg, selectedTraining,
      trainingList, selectedSheet, sheetOptions, skillList, selectedSkill } = this.state;

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

    const selectStyles = {
      control: styles => ({
        ...styles,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        minWidth: 200,
        minHeight: 40,
        borderColor: '#000',
        borderRadius: '5px',
        marginBottom: '3px',
        outline: 'transparent',
        boxShadow: 'none',
        ':hover': {
          borderColor: '#000000',
          boxShadow: '0 0 0 1px #000000',
        },
        ':active': {
          borderColor: '#000000',
          boxShadow: '0 0 0 1px #000000',
        },
        ':focus': {
          borderColor: '#000000',
          boxShadow: '0 0 0 1px #000000'
        }
      }),
      menu: styles => ({ ...styles, backgroundColor: '#fff', border: '1px solid #999' }),
      indicatorSeparator: styles => ({ ...styles, backgroundColor: 'none' }),
      option: (styles, { isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: '#fff',
          ':active': {
            backgroundColor: '#eee',
          },
          ':hover': {
            backgroundColor: '#dadada',
          },
          ':focus': {
            backgroundColor: '#eee',
          },
          color: isSelected ? '#000' : '#333'
        }
      }
    }
    return (
      <div>
        <section className='handlerContainer'>
          <div className='uploadBtn'>
            <label htmlFor="fileUpload" className="file-upload fileUploadBtn btn shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg>
              <span>Choose a file&hellip;</span>
              <input id="fileUpload" type="file" onChange={this.getFileDetails} />
            </label>
            {file && file.name && <div className='fileName'>{file.name}</div>}
          </div>
          {sheetOptions.length > 0 && this.state.skillcurriculumUpload === null && <Select
            value={selectedTraining}
            onChange={this.selectChange}
            options={trainingList}
            styles={selectStyles}
            placeholder='Select the Training'
          />}
          {sheetOptions.length > 0 && (this.props.curriculumUpload === true || this.state.skillcurriculumUpload === true) && <Select
            value={selectedSkill}
            onChange={this.handleSkillChange}
            options={skillList}
            styles={selectStyles}
            placeholder='Select the Skill'
          />}
          {sheetOptions.length > 0 && <Select
            value={selectedSheet}
            onChange={this.handleChange}
            options={sheetOptions}
            styles={selectStyles}
            placeholder='Select the Sheet'
          />}

          {sheetOptions.length > 0 && <div className='uploadBtn'>
            <Button disabled={data.length === 0} className='file-upload fileUploadBtn btn shadow' onClick={this.submitSheet}>Submit</Button>
          </div>
          }

        </section>

        {data.length > 0 &&
          <div className='candidateListTable'>
            <MaterialTable
              title=""
              columns={this.columnFields}
              data={data}
              style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
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
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    resolve();
                    this.handleDelete(oldData);
                  })
              }}
            />
          </div>
        }
        {data.length > 0 && <Alert className='noteContainer' variant='secondary'>
          ** Please check the candidate data and then click <b>Submit</b> to save the excel sheet.
        </Alert>}
        {snackBarOpen &&
          <SnackBar snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} onCloseSnackBar={this.onCloseSnackBar} />}
      </div>
    );
  }
}

export default Home;
