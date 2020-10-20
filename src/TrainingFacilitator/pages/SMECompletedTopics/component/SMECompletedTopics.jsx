import React from 'react';
import {
  Paper, withStyles, Typography,IconButton, ListItem, Grid, List, Checkbox, ListItemIcon, ListItemText
} from '@material-ui/core';
import '../scss/SMECompletedTopics.scss';
import Button from '@material-ui/core/Button';
import Buttons from '../../../components/UI_Component/Buttons/Buttons';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';

import green from '@material-ui/core/colors/green';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles = (theme) => ({
  iconRoot: {
    color: '#6b6b6b'
  },
  paperRoot: {
    width: '80%',
    margin: '20px auto',
    padding: '10px 20px'
  },
  input: {
    marginLeft: 8,
    flex: 1,
    // border: 'solid 1px lightgrey'
  },
  cardHeader: {
    padding: theme.spacing(1, 2)
  },
  list: {
    // width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto"
  },
  button: {
    margin: theme.spacing(0.5, 0)
  },
  bottomBtn: {
    justifyContent: 'flex-end',
    display: 'flex',
    marginTop: 10
  },
  gridRoot: {
    flexGrow: 1,
  }, 
  searchRoot: {
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    border: 'solid 1px lightgrey',
    height: 40,
  },
  searchAddGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      marginTop: 5,
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 25,
    },
    [theme.breakpoints.up('md')]: {
      marginTop: 25,
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: 25,
    },
    paddingBottom: 10
  },
});

class SMECompletedTopics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trainingList: [],
      selectedTraining: null,
      skillList: [],
      selectedSkill: null,
      newDay: '',
      checked: [],
      left: [],
      right: [],
      query:''
     
    }
    this.left = [];
    this.right = [];
    
  }

  componentDidMount() {

    this.props.getTrainingList().then((response) => {
      if (response && response.arrRes) {
        const eventList = response.arrRes.map(list => {
          return {
            value: list.id,
            label: list.training_name,

          }
        });
        this.setState({ trainingList: eventList, loading: false });
      } else {
        this.setState({  
          trainingList: [],
          snackbaropen: true , 
          snackmsg:"Error in Loading Training Types",
          snackvariant:"error" })
      }
    });

    
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  dayOnChange = (e) => {
    this.setState({ newDay: e.target.value })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbaropen: false });
  };

  onChangeTraining = (selectedTraining) => {
    this.setState({ selectedTraining: selectedTraining.target,selectedSkill:null });

  const reqObj = { training_id: selectedTraining.target.value };
  this.props.trainingListDetails(reqObj).then((response) => {

      if (response.errCode === 200) {
        const skillLists = response.skills.map(list => {
          return {
            value: list.id,
            label: list.skill_name,
          }
        });
   
        this.setState({
          skillList:skillLists
        });
      }
    
  })
  }

  onChangeSkill = (selectedSkill) => {
    const { selectedTraining } = this.state;
    this.setState({ selectedSkill: selectedSkill.target,left:[],right: []  });

  const reqObj = { training_id:selectedTraining.value,skill_id: selectedSkill.target.value };
  this.props.getCurriculumBySkill(reqObj).then((response) => {

      if (response.errCode === 200) {
        this.left = response.pendingTopic;
        this.right = [];
        this.setState({
          left:response.pendingTopic,right:[]
        });
      }
    
  })
  }

  submitForm = (e) => {
    
        const { right, selectedTraining,selectedSkill, newDay } = this.state;

      const curriculumIDs = [];
      right.forEach((curriculum) => {
        if (curriculum.training_id !== '' && curriculum.training_id !== null) {
          curriculumIDs.push(curriculum.id)
        }
      });
      
      const user_id = 1;

      if(curriculumIDs.length!==0){

        const reqObj = {
          trainingId: selectedTraining.value,
          skillId: selectedSkill.value,
          createdby: user_id,
          date:newDay,
          curriculumIDs
        }
       
        this.props.insertCurriculamData(reqObj).then((response) => {
          if (response && response.errCode === 200) {
            this.setState({ left: [],selectedSkill:null, newDay:'',selectedTraining: null, snackbaropen: true , snackmsg:"Topics Inseted Successfully",snackvariant:"success"});
          } else {
            this.setState({ left: [],selectedSkill:null,newDay:'', selectedTraining: null, snackbaropen: true , snackmsg: 'Something went Wrong. Please try again later.',snackvariant:"error" })
          }
        })
      } else {
        this.setState({ snackbaropen: true , snackmsg: 'Please Select Atleast One Curriculum.',snackvariant:"error"})
      }
  }

  not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1);
  };

  intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1);
  };

  union = (a, b) => {
    return [...a, ...this.not(b, a)];
  };

  numberOfChecked = (items) =>
    this.intersection(this.state.checked, items).length;

  handleToggle = (value) => () => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({
      checked: newChecked
    });
  };

  handleToggleAll = (items) => () => {
    if (this.numberOfChecked(items) === items.length) {
      // setChecked();
      this.setState({
        checked: this.not(this.state.checked, items)
      });
    } else {
      this.setState({
        checked: this.union(this.state.checked, items)
      });
    }
  };

  handleCheckedRight = () => {
  
    this.setState({
      right: this.state.right.concat(this.leftChecked),
      left: this.not(this.state.left, this.leftChecked),
      checked: this.not(this.state.checked, this.leftChecked)
    });

    this.right = this.right.concat(this.leftChecked);
    this.left = this.not(this.left, this.leftChecked);

  };

  handleCheckedLeft = () => {
    this.setState({
      left: this.state.left.concat(this.rightChecked),
      right: this.not(this.state.right, this.rightChecked),
      checked: this.not(this.state.checked, this.rightChecked)
    });

    this.right = this.not(this.right, this.leftChecked); 
    this.left = this.left.concat(this.leftChecked);
  };

  customList = (title, items) => {
    const { classes } = this.props;
    const { checked } = this.state;
   
    return (
      <Card>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={this.handleToggleAll(items)}
              checked={
                this.numberOfChecked(items) === items.length &&
                items.length !== 0
              }
              indeterminate={
                this.numberOfChecked(items) !== items.length &&
                this.numberOfChecked(items) !== 0
              }
              disabled={items.length === 0}
              inputProps={{ "aria-label": "all items selected" }}
            />
          }
          title={title}
          subheader={`Count: ${items.length} `}
        />
        <Divider />
        <List className={classes.list} dense component="div" role="list">
          {items.map((value) => {
            const labelId = `transfer-list-all-item-${value}-label`;

            return (
              <ListItem
                key={value.id}
                role="listitem"
                button
                onClick={this.handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.name} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Card>
    );
  };

  searchCurriculum = (e) => {
    const query = e.target.value;
    const lowerCaseQuery = query.toLowerCase();
    console.log(this.left);
    console.log(this.right);

    const searchedData = (query
      ? this.left.filter((list) =>
        list['name']
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
      : this.left);

      const searchedRightData = (query
        ? this.right.filter((list) =>
          list['name']
            .toLowerCase()
            .includes(lowerCaseQuery)
        )
        : this.right);

    this.setState({ left: searchedData,right:searchedRightData, query });
  }

  render() {
    const {  trainingList, selectedTraining, query, newDay, selectedSkill, skillList, snackbaropen, snackmsg, snackvariant,checked, left, right } = this.state;

    this.leftChecked = this.intersection(checked, left);
    this.rightChecked = this.intersection(checked, right);
    

    const { classes } = this.props;
    return (
      <div className="TrainingType_container">
        
        <Paper className={classes.paperRoot} elevation={3}>
          <Typography variant="h4" className="text-center" gutterBottom>
            SME Covered Topics
        </Typography>
        <Grid container spacing={1} >
          <Grid item md={4} >
            
            <label>Training List</label>
            <SelectOne
                  value={selectedTraining}
                  onChange={this.onChangeTraining}
                  options={trainingList}
                  placeholder="Select Training"
                  aria-label="training"
                  aria-describedby="training"
                  id="training"
                />
                
          </Grid> 
          
          {selectedTraining &&
          <Grid item md={4}>
         
              <label > Skill list   </label>

                <SelectOne
                  value={selectedSkill}
                  onChange={this.onChangeSkill}
                  options={skillList}
                  placeholder="Select Skill"
                  aria-label="skill"
                  aria-describedby="skill"
                  id="skill"
                />
             
            </Grid>
            }
         
          { left.length > 0 && selectedTraining && selectedSkill &&
          <Grid item md={4}>
          
            <label > Day </label>
             <Textbox
               value={newDay}
              id="day"
              type="text"
              placeholder="Day"
              name="day"
              onChange={this.dayOnChange}
            />
           
          </Grid>
  }


        </Grid>

        { (left.length === 0 && right.length === 0) && selectedTraining && selectedSkill  &&
        <Grid item  md={5} >
        <Typography color='error'> No Curriculum Found </Typography> 
        </Grid>}
    
        <Grid item md className={classes.searchAddGrid}>
          
        { selectedTraining && selectedSkill &&
            <Paper component="form" className={classes.searchRoot}>
              <InputBase
                className={classes.input}
                placeholder="Search "
                onChange={this.searchCurriculum}
                value={query}
              />
              <IconButton disabled className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          }
        </Grid>


            { selectedTraining && selectedSkill && 
          
            <Grid
                   container
                   spacing={2}
                   justify="center"
                   alignItems="center"
                   className={classes.gridRoot}
                 >
                   <Grid  item xs={12} sm={5}>{this.customList("Uncovered", left)}</Grid>
                   <Grid item xs={12} sm={2}>
                     <Grid container direction="column" alignItems="center">
                       <Button
                         variant="outlined"
                         size="small"
                         className={classes.button}
                         onClick={this.handleCheckedRight}
                         disabled={this.leftChecked.length === 0}
                         aria-label="move selected right"
                       >
                         &gt;
                       </Button>
                       <Button
                         variant="outlined"
                         size="small"
                         className={classes.button}
                         onClick={this.handleCheckedLeft}
                         disabled={this.rightChecked.length === 0}
                         aria-label="move selected left"
                       >
                         &lt;
                       </Button>
                     </Grid>
                   </Grid>
                   <Grid style={{paddingTop:0}} item xs={12} sm={5}>{this.customList("Covered", right)}</Grid>
                 </Grid>
                
          }
            <div className={classes.bottomBtn}>
           
                <Buttons
                  className="submitBtn float-right"
                  value="Submit"
                  disabled={newDay === ''}
                  onClick={this.submitForm} />
             
            </div>

          <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbaropen}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={snackvariant}
            message={snackmsg}
          />
        </Snackbar>
        </Paper>
      </div>
    )
  }
}


export default withStyles(styles, { withTheme: true })(SMECompletedTopics);