import React, { Fragment } from 'react';
import { AppBar, Tabs, Tab, Paper, withStyles, Typography, Card, CardContent, CardActions, Button, List, ListItem, ListItemText, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, Grid, DialogTitle, Radio, RadioGroup, FormControlLabel, IconButton, Toolbar, Slide, InputBase, Divider, Box } from '@material-ui/core';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import HomeContainer from '../../Home/container/HomeContainer';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from "@material-ui/lab/Pagination";


const styles = theme => ({
  paperRoot: {
    width: '100%',
    padding: '10px 15px'
  },
  dialogRoot: {
    width: '700px',
  },
  radioRoot: {
    padding: '22px 0px',
  },
  appBar: {
    position: 'relative',
  },
  searchRoot: {
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    border: 'solid 1px lightgrey',
    height: 40,
    width: 225
  },
  paginator: {
    justifyContent: "center",
    padding: "10px"
  },

})
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
class Curriculum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      trainingList: [],
      selectedTraining: null,
      skillList: [],
      curriculumList: [],
      trainingCurriculumlist: [],
      activeTab: [],
      openDialog: false,
      snackBarOpen: false,
      snackmsg: '',
      snackvariant: '',
      isUpload: false,
      selectedRadio: null,
      curriculumUpload: false,
      isFormValid: false,
      isMasterTable: false,
      query: '',
      itemsPerPage: 7,
      page: 1,
    }
    this.trainingCurriculumlist = [];
  }

  componentDidMount() {
    this.getTrainingList();
  }

  getTrainingList = () => {
    this.props.getTrainingList().then(response => {
      if (response && response.errCode === 200) {
        const trainingList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.training_name,
            skillsID: list.skills,
            skill_name: list.skill_name.split(','),
            sme_name: list.sme_name,
            smeID: list.sme,
            skillData: list.skills_array,
          }
        });
        this.setState({ trainingList, trainingCurriculumlist: [] });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later', snackvariant: "error" })
      }
    })
  }



  selectTrainingChange = (selectedTraining) => {
    const skillDetails = selectedTraining.target.skillData.map((list, index) => {
      return {
        skillname: list.skill_name,
        skillId: list.id
      }
    });
    this.getTopicList(selectedTraining.target.value);
    this.setState({ selectedTraining: selectedTraining.target, skillList: skillDetails, tabValue: skillDetails[0].skillId, selectedRadio: null });

  }

  getTopicList = (training_id) => {
    const TempCurri = [];
    const { selectedRadio } = this.state;
    const reqObj = { training_id };
    this.props.getTopicList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        response.arrRes.forEach(cdata => {
          cdata.curriculum.forEach(cadata => {
            TempCurri.push({ ...cadata, checked: true });
          });
        });
        this.trainingCurriculumlist = TempCurri;
        this.setState({ curriculumList: response.arrRes, trainingCurriculumlist: TempCurri, isMasterTable: response.isMaster });
        if (training_id && selectedRadio && selectedRadio !== 'upload') {
          if (response.isMaster) {
            this.setState({ isFormValid: true });
            this.props.checkAllFieldsValidCF(true);
          }

        }
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later', snackvariant: "error" })
      }
    })
  }

  handleChange = (event, newValue) => {
    const actuallist = this.trainingCurriculumlist;
    this.setState({ tabValue: newValue, query: '', trainingCurriculumlist: actuallist, page: 1 });
  };

  handleClickOpen = () => {
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };


  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }


  handleSubmit = () => {
    const { trainingCurriculumlist, selectedTraining } = this.state;
    const finalTopic = [];
    trainingCurriculumlist.filter(trueData => trueData.checked === true).map(filteredPerson => (
      finalTopic.push(filteredPerson)
    ))
    const reqObj = {
      training_id: selectedTraining.value,
      curriculumData: finalTopic,
      created_by: 1,
      skill_id: selectedTraining.skillsID
    }
    this.submitCurriculum(reqObj);

  }

  submitCurriculum = (reqObj) => {
    this.props.submitCurriculum(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        console.log(response);
        this.setState({ openDialog: false, selectedRadio: null, trainingCurriculumlist: [], selectedTraining: null, skillList: [], snackBarOpen: true, snackmsg: 'Curriculum has been incorprated successfully ', snackvariant: "success", isFormValid: false });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later', snackvariant: "error" })
      }
    })

  }

  handleToggle = value => () => {
    const { trainingCurriculumlist } = this.state;
    const topicIndex = trainingCurriculumlist && trainingCurriculumlist.findIndex((lst) => value === lst.id);
    trainingCurriculumlist[topicIndex].checked = !trainingCurriculumlist[topicIndex].checked;
    this.setState({ trainingCurriculumlist });
  };

  handleUpload = event => {
    let uploadFlag = (event.target.value === 'upload') ? true : false;
    let disBtn = false;
    if (this.state.selectedTraining && event.target.value && event.target.value !== 'upload') {
      disBtn = (this.state.isMasterTable) ? true : false;
    } else if (this.state.selectedTraining && event.target.value && event.target.value === 'upload') {
      disBtn = false;
    }
    this.setState({ selectedRadio: event.target.value, isUpload: uploadFlag, isFormValid: disBtn });
    this.props.checkAllFieldsValidCF(true);
  }

  showCurriculumUpload = () => {
    this.setState({ showCurriculumUpload: true });
  }

  handleCurriculumUploadClose = () => {
    this.setState({ showCurriculumUpload: false });
  }

  searchCurriculum = (e) => {
    const query = e.target.value;
    const lowerCaseQuery = query.toLowerCase();
    const searchedCurriculumList = (query
      ? this.trainingCurriculumlist.filter((list) =>
        list['name']
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
      : this.trainingCurriculumlist);

    this.setState({ trainingCurriculumlist: searchedCurriculumList, query });
  }
  handlePageChange = (event, value) => {
    this.setState({ page: value });
  };

  render() {
    const { classes } = this.props;
    const { tabValue, skillList, selectedTraining, trainingList, trainingCurriculumlist, snackBarOpen, snackmsg, snackvariant, isUpload, selectedRadio, showCurriculumUpload, query, itemsPerPage, page } = this.state;
    const skillFilter = trainingCurriculumlist.filter(curList => curList.skill_id === tabValue);
    const noOfPages = (skillFilter.length > 0) ? Math.ceil(skillFilter.length / itemsPerPage) : 0;
    const title = 'Curriculum Upload';
    const curriculumUpload = true;
    return (
      <Paper className={classes.paperRoot} elevation={0}>
        <Grid container spacing={3} >
          <Grid item md={4}>
            <SelectOne
              fieldLabel="Training List"
              id="training"
              name="training"
              placeholder="Training"
              value={selectedTraining ? selectedTraining : null}
              options={trainingList}
              onChange={this.selectTrainingChange}
            />
          </Grid>
          <Grid item md={4}>
            <RadioGroup
              className={classes.radioRoot}
              aria-label="position"
              name="position"
              value={selectedRadio}
              onChange={this.handleUpload}
              row
            >
              <FormControlLabel
                value="standard"
                control={<Radio color="primary" />}
                label="Standard"
                labelPlacement="standard"
              />
              <FormControlLabel
                value="upload"
                control={<Radio color="primary" />}
                label="Customized"
                labelPlacement="upload"
              />
            </RadioGroup>
          </Grid>
          {isUpload && <Grid item md={4} xs={12} style={{ margin: 'auto' }}>
            <div style={{ float: 'right' }}><Button variant="contained" onClick={this.showCurriculumUpload} color="primary">{title}</Button></div>

            <Dialog fullScreen open={showCurriculumUpload} onClose={this.handleCurriculumUploadClose} TransitionComponent={Transition}>
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton edge="start" color="inherit" onClick={this.handleCurriculumUploadClose} aria-label="close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" className={classes.title}>{title}</Typography>
                </Toolbar>
              </AppBar>
              <HomeContainer curriculumUpload={curriculumUpload} />
            </Dialog>
          </Grid>}
        </Grid>
        { !isUpload && skillList.length > 0 && selectedRadio &&
          <Fragment>
            <AppBar position="static" elevation={1} color="transparent">
              <Tabs
                value={tabValue}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {skillList.map(skill =>
                  <Tab key={skill.skillId} label={skill.skillname} value={skill.skillId} />
                )}
              </Tabs>
            </AppBar>
            <Card square className={classes.root} variant="outlined">
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {skillFilter.length > 0 && <Paper component="form" className={classes.searchRoot}>
                    <InputBase
                      className={classes.input}
                      placeholder="Search "
                      onChange={this.searchCurriculum}
                      value={query}
                    />
                    <IconButton disabled className={classes.iconButton} aria-label="search">
                      <SearchIcon />
                    </IconButton>
                  </Paper>}
                  {!isUpload && selectedRadio && skillFilter && skillFilter.length > 0 &&
                    <List >
                      {skillFilter.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(value => {
                        return (
                          <ListItem key={value.id} role={undefined} dense button onClick={this.handleToggle(value.id)}>
                            <Checkbox
                              //checked={this.state.checked.indexOf(value.id) !== -1}
                              checked={value.checked}
                              tabIndex={-1}
                              disableRipple
                            />
                            <ListItemText primary={value.name} />
                          </ListItem>
                        );
                      })}
                    </List>}
                  {skillFilter.length === 0 &&
                    <Typography paragraph color='error' gutterBottom align='center'> No Data Found </Typography>
                  }
                  <Divider />
                  {skillFilter.length > 0 && <Box component="span">
                    <Pagination
                      count={noOfPages}
                      page={page}
                      onChange={this.handlePageChange}
                      defaultPage={1}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      classes={{ ul: classes.paginator }}
                    />
                  </Box>}
                </Typography>
              </CardContent>
              {/* <CardActions>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={this.handleClickOpen}
                  aria-label="move selected left"
                >  Submit </Button>
              </CardActions> */}
            </Card>
          </Fragment>}

        {snackBarOpen && <SnackBar snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant}
          onCloseSnackBar={this.onCloseSnackBar} />}

        <div className={classes.dialogRoot} >
          <Dialog
            maxWidth="sm"
            fullWidth={true}
            open={this.state.openDialog}
            onClose={this.handleClose}
            aria-labelledby="curriculum-creation"
          >
            <DialogTitle id="curriculum-creation">{"Please confirm choosen topics"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="curriculum-creation-des">
                <Fragment>
                  <AppBar position="static" elevation={1} color="transparent">
                    <Tabs
                      value={tabValue}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {skillList.map(skill =>
                        <Tab key={skill.skillId} label={skill.skillname} value={skill.skillId} />
                      )}
                    </Tabs>
                  </AppBar>
                  <Card square className={classes.root} variant="outlined">
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {skillFilter && skillFilter.length > 0 &&
                          <List >
                            {skillFilter.map(value => {
                              if (value.checked === true) {
                                return (
                                  <ListItem key={value.id} role={undefined} dense button onClick={this.handleToggle(value.id)}>
                                    <ListItemText primary={value.name} />
                                  </ListItem>
                                );
                              }
                              return null
                            })}
                          </List>}
                        {skillFilter.length === 0 && <Typography color='error'> No Data Found </Typography>}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fragment>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={this.handleSubmit} color="primary" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Curriculum);
