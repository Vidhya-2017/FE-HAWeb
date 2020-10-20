import React from 'react';
import MaterialTable from "material-table";
import {
  Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent,
  Button, ButtonGroup, Grid, Slide, AppBar, Toolbar, IconButton, 
} from '@material-ui/core';
import moment from 'moment';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import '../scss/SkillList.scss'
import CloseIcon from '@material-ui/icons/Close';
import HomeContainer from '../../Home/container/HomeContainer';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = (theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 120,
    margin: '0 8px 8px',
    minWidth: 200,
  },
  selectEmpty: {
  },
  iconRoot: {
    color: '#6b6b6b'
  },
  appBar: {
    position: 'relative',
  },
  paperRoot: {
    // margin: theme.spacing(6, 18),
    // padding: theme.spacing(4),
    width: '70%',
    margin: '20px auto',
    padding: '10px 20px'
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class SkillList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skillListVal: [],
      curriculumListVal: [],
      showAddSkillModal: false,
      showAddCurriculumModal: false,
      hideDeleteButton: false,
      newSkillName: '',
      newCurriculumName: '',
      snackBarOpen: false,
      snackvariant: '',
      updated_by: '',
      snackmsg: '',
      skillId: '',
      curriculumUpload: false,
      selectedData:[]
    }
    this.curriculumListVal = [];
    this.columnFields = [
      {
        title: "Curriculum Name",
        field: "name",
        validate: rowData => rowData.name !== '',
      },
    ]
  }

  componentDidMount() {
    this.props.getSkillList().then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          skillListVal: response.arrRes,
         /*  snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Skill Data loaded successfully" */
        })
      } else {
        this.setState({
          skillListVal: [],
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "Error in loading Skill Data"
        })
      }
    });
    this.getCurriculumList();
  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  getCurriculumList(refresh= false) {
    this.props.getCurriculumList().then((response) => {
      if (response && response.errCode === 200) {
        this.curriculumListVal = response.arrRes;
        if(refresh) {
          const filteredCurriculum = this.curriculumListVal.filter((skill) =>
          skill.skill_id === this.state.skillId
        )
        this.setState({
          curriculumListVal: filteredCurriculum
        })
        }
      } else {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "Error in loading Skill Data"
        })
      }
    });
  }

  handleDelete = (id) => {
    const filteredItems = this.state.skillListVal.filter((item) => item.id !== id);
    const reqObj = {
      id: id,
    }
    this.props.deleteSkillList(reqObj).then(response => {
      if (response.errCode === 200) {
        this.setState({
          skillListVal: filteredItems,
          curriculumListVal: [],
          selectedSkillVal: '',
          showAddSkillModal: false,
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Skill name deleted successfully",
        });
        this.getCurriculumList();
      }
      else {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          showAddSkillModal: false,
          snackmsg: "Error in Skill name deletion"
        });
      }

    });
  }

  editSubmit = (newData, oldData) => {
    const reqObj = {
      id: newData.id,
      skill_name: newData.skill_name,
      updated_by: this.state.updated_by
    }

    this.props.editSkillList(reqObj).then(response => {
      if (response.errCode === 200) {
        this.setState(prevState => ({
          skillListVal: prevState.skillListVal.map(
            el => el.id === newData.id ? { ...el, skill_name: newData.skill_name } : el
          )
        }))
        this.setState({
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Skill name updated successfully",
        });
      }
      else if (response.errCode === 404) {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: " failed in updating Skill name "
        });
      }
      else {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "error in updating the Skill name"
        });
      }
    });
  }

  handleModalClose = () => {
    this.setState({ showAddSkillModal: false, newSkillName: '' })
  }

  handleCurriculumModalClose = () => {
    this.setState({ showAddCurriculumModal: false, newCurriculumName: '' })
  }

  handleModalSubmit = (e) => {
    const { newSkillName } = this.state;
    const date = moment().format("YYYY-MM-DD");

    if (this.state.skillEdit === true) {
      const reqObj = {
        id: this.state.skillId,
        skill_name: this.state.newSkillName,
        updated_by: this.state.updated_by
      }
      this.props.editSkillList(reqObj).then(response => {
        if (response.errCode === 200) {
          this.componentDidMount();
          const updatedItems = [...this.state.skillListVal, reqObj];
          this.setState({
            skillListVal: updatedItems,
            selectedSkillVal: newSkillName,
            snackvariant: 'success',
            snackBarOpen: true,
            showAddSkillModal: false,
            snackmsg: "Skill name updated successfully",
          });
        }
        else if (response.errCode === 404) {
          this.setState({
            snackvariant: 'error',
            snackBarOpen: true,
            showAddSkillModal: false,
            snackmsg: " failed in updating Skill name "
          });
        }
        else {
          this.setState({
            snackvariant: 'error',
            snackBarOpen: true,
            showAddSkillModal: false,
            snackmsg: "error in updating the Skill name"
          });
        }
      });
    } else if (this.state.delSkill === true) {
      this.handleDelete(this.state.skillId)
    } else {
      const reqObj = {
        skill_name: newSkillName,
        created_by: 1,
        updated_by: 1,
        created_date: date
      }
      this.props.addSkillList(reqObj).then(response => {
        if (response && response.errCode === 200) {
          const myObj = {
            id: response.AddedSkillId,
            skill_name: response.AddedSkillName
          }
          const updatedItems = [...this.state.skillListVal, myObj];
          this.setState({
            showAddSkillModal: false,
            skillListVal: updatedItems,
            snackvariant: 'success',
            snackBarOpen: true,
            snackmsg: "Skill name added successfully!"
          })
        }
        else if (response && response.errCode === 404) {
          this.setState({
            showAddSkillModal: false,
            snackvariant: 'error',
            snackBarOpen: true,
            snackmsg: "Already Skill name exists!"
          })
        }
        else {
          this.setState({
            showAddSkillModal: false,
            snackvariant: 'error',
            snackBarOpen: true,
            snackmsg: "error in adding aseessment name!"
          })
        }
      });
    }
  };

  handleCurriculumModalSubmit = () => {
    const { newCurriculumName, skillId } = this.state;
    const date = moment().format("YYYY-MM-DD");
    const reqObj = {
      skill_id: skillId,
      curriculum_name: newCurriculumName,
      created_by: 1,
      updated_by: 1,
      created_date: date
    }
    this.props.addCurriculum(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const myObj = {
          id: response.AddedCurriculumId.toString(),
          skill_id: skillId,
          name: newCurriculumName,
          skill_name: newCurriculumName
        }
        this.curriculumListVal = [...this.state.curriculumListVal, myObj];

        const updatedItems = [...this.state.curriculumListVal, myObj];

        this.setState({
          showAddCurriculumModal: false,
          curriculumListVal: updatedItems,
          newCurriculumName: '',
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Curriculum name added successfully!"
        })
      }
      else if (response && response.errCode === 404) {
        this.setState({
          showAddCurriculumModal: false,
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "Already Skill name exists!"
        })
      }
      else {
        this.setState({
          showAddCurriculumModal: false,
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "error in adding aseessment name!"
        })
      }
    });
  };

  editCurriculum = (newData, oldData) => {
    const reqObj = {
      id: newData.id,
      skill_id: newData.skill_id,
      curriculum_name: newData.name,
      updated_by: newData.updated_by
    }

    this.props.editCurriculum(reqObj).then(response => {
      if (response && response.errCode === 200) {
        const data = [...this.state.curriculumListVal];
        data[data.indexOf(oldData)] = newData;
        this.setState(prevState => ({
          ...prevState, curriculumListVal: data,
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Curriculum name updated successfully",
        }))
        this.getCurriculumList();
      }
      else if (response.errCode === 404) {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: " failed in updating Curriculum name "
        });
      }
      else {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "error in updating the Curriculum name"
        });
      }
    });
  }

  deleteCurriculum = (id) => {
    const filteredItems = this.state.curriculumListVal.filter((item) => item.id !== id);
    const reqObj = {
      id: id,
      updated_by: 1
    }
    this.props.delCurriculum(reqObj).then(response => {
      if (response && response.errCode === 200) {
        this.setState({
          curriculumListVal: filteredItems,
          snackvariant: 'success',
          snackBarOpen: true,
          snackmsg: "Curriculum name deleted successfully",
        });
        this.getCurriculumList();
      }
      else {
        this.setState({
          snackvariant: 'error',
          snackBarOpen: true,
          snackmsg: "Error in Skill name deletion"
        });
      }

    });
  }
//  Multidelete
multideleteCurriculum = id => {
   const filteredItems = this.state.curriculumListVal.filter((item) => item.id !== id);
   this.setState({ filteredItems: filteredItems });
  const reqObj = {
    id: id,
  }
   this.props.multidelCurriculum(reqObj).then(response => {
     if (response && response.errCode === 200) {
      this.setState({
        curriculumListVal: filteredItems,
        snackvariant: 'success',
        snackBarOpen: true,
        snackmsg: "Curriculum name deleted successfully",
      });
      this.getCurriculumList(true);
     }
    else {
      this.setState({
        snackvariant: 'error',
        snackBarOpen: true,
        snackmsg: "Error in Curiculum name deletion"
      });
    }

   });
}
  handleSkillChange = (e) => {
    const filteredCurriculum = this.curriculumListVal.filter((skill) =>
      skill.skill_id === e.target.value
    )

    this.setState({
      curriculumListVal: filteredCurriculum, skillId: e.target.value,
      selectedSkillVal: e.nativeEvent.target.textContent
    })
  }

  showCurriculumUpload = () => {
    this.setState({ showCurriculumUpload: true });
  }

  handleCurriculumUploadClose = () => {
    this.setState({ showCurriculumUpload: false });
  }

  render() {
    const { skillListVal, showAddSkillModal, newSkillName, curriculumListVal, skillId,
      newCurriculumName, snackBarOpen,showAddCurriculumModal, selectedSkillVal, skillEdit, delSkill, showCurriculumUpload, snackvariant, snackmsg } = this.state;
    const { classes } = this.props;
    const uploadtitle = 'Curriculum Upload';
    const skillcurriculumUpload = true;
    let title = 'Curriculum Upload', disabled = false;

    if (delSkill === true) {
      title = 'Delete Skill';
      disabled = false;
    } else {
      disabled = (newSkillName === '' || newSkillName === null) ? true : false
      if (skillEdit === true) {
        title = 'Edit Skill Name'
      } else {
        title = 'Add Skill Name'
      }
    }
      const handleDeleteRows = (event, rowData) => {
        let selectedData = [];
        rowData.forEach(rd => {
         selectedData.push(rd.id);
        });
         this.setState({selectedData:selectedData});
         this.multideleteCurriculum(selectedData);
      };
    return (
      <div className="SkillList_container">
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddSkillModal}
          onClose={this.handleModalClose}
          aria-labelledby="Skill-Name"
        >
          <DialogTitle id="Skill-Name">{title}</DialogTitle>
          {this.state.delSkill !== true ?
            <DialogContent >
              <div style={{ display: 'flex' }}>
                <Typography style={{ padding: '15px 15px 10px 0' }}>Skill Name:</Typography>
                <TextField
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  placeholder="Skill Name"
                  type="text"
                  value={newSkillName}
                  onChange={(e) => this.setState({ newSkillName: e.target.value })}
                />
              </div>
            </DialogContent>
            :
            <DialogContent>
              Are you Sure to delete skill {selectedSkillVal} ?
            </DialogContent>
          }
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" color="primary">
              Cancel
                </Button>
            <Button onClick={this.handleModalSubmit} disabled={disabled} variant="contained" color="primary">
              Submit
                </Button>
          </DialogActions>
        </Dialog>


        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddCurriculumModal}
          onClose={this.handleCurriculumModalClose}
          aria-labelledby="Curriculum-Name"
        >
          <DialogTitle id="Curriculum-Name">Add Curriculum Name</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Curriculum Name:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Curriculum Name"
                type="text"
                value={newCurriculumName}
                onChange={(e) => this.setState({ newCurriculumName: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCurriculumModalClose} variant="contained" color="primary">
              Cancel
                </Button>
            <Button onClick={this.handleCurriculumModalSubmit} disabled={newCurriculumName === '' || newCurriculumName === null} variant="contained" color="primary">
              Submit
                </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            Skill List
            </Typography>
          {/* <div> */}
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Select Skill</InputLabel>
            <Select
              value={skillId}
              onChange={this.handleSkillChange}
              label="Search Skills"
              placeholder="Search Skills"
            >
              {skillListVal.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>{skill.skill_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <ButtonGroup size="small"
            style={{
              'padding': '15px 0px 26px 5px',
              'verticalAlign': 'bottom'
            }} >
            <Button title="Add" onClick={(event) => this.setState({ showAddSkillModal: true, skillEdit: false, delSkill: false, newSkillName: '' })}><AddIcon fontSize="small" /></Button>
            <Button title="Edit" onClick={(event) => this.setState({ showAddSkillModal: true, skillEdit: true, delSkill: false, newSkillName: selectedSkillVal })}
              disabled={selectedSkillVal === '' || selectedSkillVal === undefined}><CreateIcon fontSize="small" /></Button>
            <Button  title="Delete" onClick={(event) => this.setState({ showAddSkillModal: true, skillEdit: false, delSkill: true })}
              disabled={selectedSkillVal === '' || selectedSkillVal === undefined}> <DeleteIcon fontSize="small" /></Button>
         
          </ButtonGroup>
          <FormControl variant="outlined" className={`pull-right ${classes.formControl}`}>
          <Grid item md={6} xs={12} style={{ margin: 'auto' }}>
            <div style={{ float: 'right' }}><Button variant="contained" onClick={this.showCurriculumUpload} color="primary">{uploadtitle}</Button></div>

            <Dialog fullScreen open={showCurriculumUpload} onClose={this.handleCurriculumUploadClose} TransitionComponent={Transition}>
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={this.handleCurriculumUploadClose} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>{uploadtitle}</Typography>
                </Toolbar>
              </AppBar>
              <HomeContainer skillcurriculumUpload={skillcurriculumUpload} />
            </Dialog>
          </Grid>
          </FormControl>
          {/* </div> */}
          <MaterialTable
            title="Curriculum List"
            columns={curriculumListVal.length > 0 ? this.columnFields : []}
            data={curriculumListVal}
            style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
            options={{
              actionsColumnIndex: -1,
              pageSizeOptions: [],
              selection: true,
              headerStyle: {
                backgroundColor: '#E0E0E0',
                whiteSpace: 'nowrap',
                whiteSpace: 'nowrap',
                lineHeight :'15px',
                fontSize: '16px',
                color:'#212529',
                zIndex: 0
              },
              rowStyle: {
                lineHeight :'15px',
                fontSize:'13px',
                whiteSpace: 'nowrap',
                fontSize: '14px'
              }
            }}
             actions={
             skillId ? [
              {
                icon: 'add',
                tooltip: 'Add Curriculum Name',
                isFreeAction: true,
                onClick: (event) => this.setState({ showAddCurriculumModal: true }),
                disabled: (selectedSkillVal === '' || selectedSkillVal === undefined) 
              },
              {
                icon: 'delete',
                tooltip: "Multiple Delete",
                onClick: handleDeleteRows
              }
            ] : []
          }

            editable={curriculumListVal.length > 0 ? {
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  resolve();
                  if (oldData) {
                    this.editCurriculum(newData, oldData);
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  resolve();
                  this.deleteCurriculum(oldData.id);
                })
            } : {}}
          />
          {snackBarOpen &&
            <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
        </Paper>
      </div >
    )
  }
}


export default withStyles(styles, { withTheme: true })(SkillList);