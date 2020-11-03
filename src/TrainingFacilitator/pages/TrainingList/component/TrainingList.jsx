import React from 'react';
import MaterialTable from "material-table";
import { Paper, withStyles, Typography, TextField } from '@material-ui/core';
import Select from 'react-select';
import SelectStyles from '../../../components/UI_Component/Select/SelectStyles';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import '../scss/TrainingList.scss';

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      width: '90%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '90%',
    },
    margin: '20px auto',
    padding: '10px 10px'
  },
});
class TrainingList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trainingListVal: [],
      skillList: [],
      locationList: [],
      accountList: [],
      trainingTypeList: [],
      smeList: [],
      snackBarOpen: false,
      snackmsg: '',
      snackvariant: '',
    }
    this.columnFields = [
      {
        title: "Name",
        field: "training_name",
        validate: rowData => rowData.training_name !== '',
      },
      {
        title: "Training Type",
        field: "type",
        editComponent: props => {
          return (
            <Select
              placeholder="Training Type"
              onChange={e => props.onChange(e)}
              options={this.state.trainingTypeList}
              styles={SelectStyles()}
              defaultValue={{ value: props.value, label: props.rowData.type }}
            />
          )
        },
        validate: rowData => rowData.training_type !== '',

      },
      {
        title: "Location",
        field: "location_name",
        editComponent:props=>{
          return(
            <Select
              placeholder="Location"
              onChange={e => props.onChange(e)}
              options={this.state.locationList}
              styles={SelectStyles()}
              defaultValue={{ value: props.value, label: props.rowData.location_name }}
            />
          )
         },
        validate: rowData => rowData.location !== '',
      },
      {
        title: "Duration",
        field: "duration",
        validate: rowData => rowData.duration !== '',
      },
      {
        title: "Count",
        field: "count",
        type: "numeric",
        validate: rowData => rowData.count !== '',
      },
      {
        title: "Account",
        field: "account_name",
        editComponent: props => {
          return (
            <Select
            placeholder="Account"
            onChange={e => props.onChange(e)}
            options={this.state.accountList}
            styles={SelectStyles()}
            defaultValue={{ value: props.value, label: props.rowData.account_name }}
          />
          )
        },
        validate: rowData => rowData.account !== '',
      },
      {
        title: "Skills",
        field: "skill_name",
        editComponent: props => {
          const defaultValue = this.state.skillList.filter(skill => props.rowData.skills.includes(skill.id))
          props.rowData.sme_name = [];
          return (
            <Select
            placeholder="Skills"
            onChange={e => props.onChange(e)}
            options={this.state.skillList}
            styles={SelectStyles()}
            isMulti
            defaultValue={defaultValue}
          />
          )
        },
        validate: rowData => rowData.skills !== '',
      },
      {
        title: "SME",
        field: "sme_name",
        editComponent: props => {
          let TemSme = this.state.smeList;
          let smeValue = [];
          let isSkillUpdate = false;
          if(props.rowData.skill_name && typeof props.rowData.skill_name === "object") {
            TemSme = [];
            smeValue = [];
            isSkillUpdate = true;
            this.state.smeList.forEach((list, index) => {
              const indexSkill = props.rowData.skill_name.filter(skill => list.skillsId.includes(skill.value));
              if(indexSkill.length > 0) {
                  TemSme.push({
                    value: list.id,
                    id: list.id,
                    skill: list.skill,
                    skillsId: list.skillsId,
                    label: list.label
                  });
                }
            }); 
            if(typeof props.value === "object" && isSkillUpdate) {
              smeValue = props.value;
              props.rowData.sme_name = props.value;
            } else {
              smeValue = null;
            }
          } else if( typeof props.rowData.skill_name === "string"){
            TemSme = [];
            this.state.smeList.forEach((list, index) => {
              const indexSkill = list.skillsId.filter(id => props.rowData.skills.includes(id));
              if(indexSkill.length > 0) {
                  TemSme.push({
                    value: list.id,
                    id: list.id,
                    skill: list.skill,
                    skillsId: list.skillsId,
                    label: list.label 
                  });
                }
            }); 
            smeValue = props.value;
            props.rowData.sme_name = props.value;
          } else {
            smeValue = null;
            isSkillUpdate = true;
          }
          if(typeof props.value === 'string' && !isSkillUpdate) {
            smeValue = this.state.smeList.filter(sme => props.rowData.sme.includes(sme.id))
          }
          return (
            <Select
            placeholder="SME"
            value={smeValue}
            options={TemSme}
            styles={SelectStyles()}
            isMulti
            onChange={e => props.onChange(e)}
          />
          )
        }
        ,validate: rowData => rowData.sme !== '',
      },
      {
        title: "Actual Start Date",
        field: "actual_start_date",
        editComponent: props => {
          return (
            <TextField
              id="ActualStartDate"
              name="ActualStartDate"
              type="date"
              value={props.value}
              onChange={e => props.onChange(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )
        },
        validate: rowData => rowData.actual_start_date !== '',
      },
      {
        title: "Actual End Date",
        field: "actual_end_date",
        editComponent: props => (
          <TextField
            id="ActualSEndDate"
            name="ActualSEndDate"
            type="date"
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ),
        validate: rowData => rowData.actual_end_date !== '',
      },
      {
        title: "Planned Start Date",
        field: "planned_start_date",
        editComponent: props => (
          <TextField
            id="PlannedStartDate"
            name="PlannedStartDate"
            type="date"
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ),
        validate: rowData => rowData.planned_start_date !== '',
      },
      {
        title: "Planned End Date",
        field: "planned_end_date",
        editComponent: props => (
          <TextField
            id="PlannedEndDate"
            name="PlannedEndDate"
            type="date"
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ),
        validate: rowData => rowData.planned_end_date !== '',
      },
      {
        title: "Requested By",
        field: "request_by",
        validate: rowData => rowData.request_by !== '',
      },
      {
        title: "Requested By Sapid",
        field: "requestedby_sapid",
        validate: rowData => rowData.request_by !== '',
      },
      {
        title: "Program Manager",
        field: "program_manager",
        validate: rowData => rowData.request_by !== '',
      },
      {
        title: "Program Manager Sapid",
        field: "program_mngr_sapid",
      },
    ]
  }

  componentDidMount() {
    this.getTrainingData();
    this.getSkillList();
    this.getLocation();
    this.getAccount();
    this.getTrainingType();
    this.getSmeList();
  }

  getTrainingData = () => {
    this.props.getTrainingList().then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          trainingListVal: response.arrRes,
          snackBarOpen: true,
          snackmsg: "Data loaded successfully",
          snackvariant: "success"
        })
      } else {
        this.setState({
          trainingListVal: [],
          snackBarOpen: true,
          snackmsg: "Error in loading Data",
          snackvariant: "error"
        })
      }
    });
  }
  getAccount = () => {
    this.props.getAccount().then(response => {
      if (response && response.errCode === 200) {
        const accountList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.account_name
          }
        });
        this.setState({ accountList });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant: "error" })
      }
    })
  }
  getLocation = () => {
    this.props.getLocation().then(response => {
      if (response && response.errCode === 200) {
        const locationList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.location_name
          }
        });
        this.setState({ locationList });
      } else {
        this.setState({  snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant: "error" })
      }
    })
  }
  getSkillList = () => {
    this.props.getSkillList().then(response => {
      if (response && response.errCode === 200) {
        const skillList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.skill_name
          }
        });
        this.setState({ skillList });
      } else {
        this.setState({  snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant: "error" })
      }
    })
  }
  getTrainingType = () => {
    this.props.getTrainingType().then(response => {
      if (response && response.errCode === 200) {
        const trainingTypeList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.type
          }
        });
        this.setState({ trainingTypeList });
      } else {
        this.setState({  snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant: "error" })
      }
    })
  }

  getSmeList = () => {
    this.props.getSMEList().then(response => {
      if (response && response.errCode === 200) {
        const smeList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.name,
            skill:list.SkillName,
            skillsId: list.skill_ids
          }
        });
        this.setState({ smeList });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant: "error" })
      }
    })
  }

  handleDelete = (oldData) => {
    const reqObj = {
      id: oldData.id
    }
    this.props.DeleteTrainingList(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const data = [...this.state.trainingListVal];
        data.splice(data.indexOf(oldData), 1);
        this.setState({
          trainingListVal: data,
          snackBarOpen: true,
          snackmsg: "Deleted successfully",
          snackvariant: "success"
        });
      }
      else {
        this.setState({
          snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later.',snackvariant: "error" 
        });
      }
    });

  }

  editSubmit = (updatedData, oldData) => {
    let skillIds = '';
    let smeIds = '';
    if(typeof(updatedData.skill_name) === "string") {
      skillIds = updatedData.skills;
    } else{
      skillIds = updatedData.skill_name.map(skill => skill.id );
    }
    if(typeof(updatedData.sme_name) === "string") {
      smeIds = updatedData.sme;
    } else {
      smeIds = updatedData.sme_name.map(sme => sme.id );
    }
    const reqObj = {
      id: updatedData.id,
      trainingName: updatedData.training_name,
      trainingType: updatedData.training_type,
      location: updatedData.location,
      count: updatedData.count,
      account: updatedData.account,
      smes: smeIds,
      skills: skillIds,
      actualStDate: updatedData.actual_start_date,
      actualEndDate: updatedData.actual_end_date,
      plannedStDate: updatedData.planned_start_date,
      plannedEndDate: updatedData.planned_end_date,
      duration: updatedData.duration,
      requestBy: updatedData.request_by,
      requestBySapid:updatedData.requestedby_sapid,
      programManager:updatedData.program_manager,
      programManagerSapid:updatedData.program_mngr_sapid,
      UpdatedBy: 1
    }
    this.props.EditTrainingList(reqObj).then(response => {
      if (response && response.errCode === 200) {
            this.getTrainingData();
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMessage: " Failed in updating data"
        });
      }
      else {
        this.setState({
          showToast: true,
          toastMessage: "error in updating the Assessment name"
        });
      }
    });
  }

  deleteRow = () => {
    this.props.history.push('/trainingCreation')
  }

  onCloseSnackBar = () =>{
    this.setState({snackBarOpen:false});
  }

  editRowRedirect = (updatedRow) => {
    console.log(updatedRow.id);   
    this.props.history.push(`/trainingCreation?tId=${updatedRow.id}`)
  }
 

  render() {
    const { trainingListVal, snackmsg, snackvariant, snackBarOpen } = this.state;
    const { classes} = this.props;
    return (
      <div className="TrainingList_container">
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Training List
        </Typography>
          <MaterialTable
            title=""
            columns={this.columnFields}
            data={trainingListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: 0,
              pageSizeOptions: [],
              headerStyle: {
                zIndex: 0
              }
            }}
            actions={[
              {
                icon: 'add',
                tooltip: 'Add Training',
                isFreeAction: true,
                onClick: (event) => this.deleteRow()
              },
              {
                icon: 'edit',
                tooltip: 'Edit Training',
                onClick: (event, rowData) => this.editRowRedirect(rowData)
              },
              rowData => ({
                icon: 'delete',
                tooltip: 'Delete User',
                onClick: (event, rowData) => this.handleDelete(rowData),
              })
              ]}
           /* actions={[
              {
                icon: 'add',
                tooltip: 'Add Training',
                isFreeAction: true,
                onClick: (event) => this.deleteRow()
              },
            ]}
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
            }} */
          />

{snackBarOpen && <SnackBar snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} 
                     onCloseSnackBar={this.onCloseSnackBar} />}
        </Paper>
      </div>
    )
  }
}


export default withStyles(styles, { withTheme: true })(TrainingList);