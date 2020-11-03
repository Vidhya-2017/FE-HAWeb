import React, { Component } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import XLSX from 'xlsx';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Select from 'react-select';
import { MakeColumns } from './MakeColumns';
import ArrowDown from '../../common/icons/ArrowDown';
import ArrowUp from '../../common/icons/ArrowUp';
import './scss/Home.scss';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      selectedSheet: null,
      sheetOptions: []
    }
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
    const { file } = this.state;
    var reader = new FileReader();
    reader.onload = (e) => {
      var binaryData = e.target.result;
      var base64String = window.btoa(binaryData);
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
      if (sheetData.length > 0) {
        columns = sheetData[0].map(col => {
          return {
            dataField: col.toString().trim(),
            text: col,
            sort: true,
            filter: false,
            sortCaret: (order, column) => {
              if (!order) return (<span><ArrowUp/><ArrowDown/></span>);
              else if (order === 'asc') return (<span><ArrowUp/></span>);
              else if (order === 'desc') return (<span><ArrowDown/></span>);
              return null;
            }
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
    console.log('----e---', cols);
    let filterOptions = [...cols];
    if(e.target.checked) {
      filterOptions = filterOptions.map(item => {
        item.filter = textFilter({
            delay: 1000,
            className: 'filterTextField',
            placeholder: item.dataField,
            onClick: e => console.log(e)
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
    const { file, data, cols, selectedSheet, sheetOptions } = this.state;
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
        <h3 className='pageTitle'>Candidate List</h3>
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
            styles={selectStyles}
            placeholder='Select the Sheet'
          />} 
          {data.length > 0 &&
            <div className="custom-control custom-switch filterSwitch">
            <input type="checkbox" className="custom-control-input" onChange={this.showFilter} id="customSwitch1" />
            <label className="custom-control-label" for="customSwitch1">Show Filter Options</label>
          </div>
          }
          {sheetOptions.length > 0 && <div className='uploadBtn'>
            <Button disabled={data.length === 0} className='file-upload fileUploadBtn btn shadow' onClick={this.submitSheet}>Submit</Button>
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
              filter={ filterFactory() }
            />
          </div>
        }
        {data.length > 0 && <Alert className='noteContainer' variant='secondary'>
          ** Please check the candidate data and then click <b>Submit</b> to save the excel sheet.
        </Alert>}
      </div>
    );
  }
}

export default Home;
