import React, { Component } from 'react'
import {
  Paper, Typography, List, Grid, ListItem, InputBase, ListItemIcon, Checkbox,
  ListItemText, IconButton, withStyles, Dialog, DialogTitle, TextField, DialogActions, DialogContent
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
// import '../scss/BatchFormation.scss'
import SearchIcon from '@material-ui/icons/Search';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';

import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";


const styles = (theme) => ({
  paperRoot: {
    width: "100%",
    margin: '20px auto',
    padding: '10px 20px'
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
  addBtn: {
    height: 40,
    margin: '0 10px'
  },
  searchRoot: {
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    border: 'solid 1px lightgrey',
    height: 40,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  gridRoot: {
    flexGrow: 1,
  },
  listRoot: {
    width: '100%',
    maxWidth: 360,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  cardHeader: {
    padding: theme.spacing(1, 2),

  },
  list: {
    /*  width: 200, */
    height: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto"
  },
  button: {
    margin: theme.spacing(1, 0),
  },
  bottomBtn: {
    justifyContent: 'flex-end',
    display: 'flex',
    marginTop: 10
  },
  selectOne: {
    display: 'flex',
  },
  trainingTitle: {
    padding: "15px 10px"
  }
});

class BatchFormation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      trainingList: [],
      selectedTraining: null,
      checked: [],
      newChecked: [],
      candidatesList: [],
      batchDetailsList: [],
      snackBarOpen: false,
      snackmsg: '',
      snackvariant: '',
      query: '',
      selectall: false,
      left: [],
      right: [],
      batchSelected: null,
      showAddBatchModal: false,
      newBatchName: '',
      newBatchCount: '',
      formIsValid: false,
    }
    this.candidatesList = [];
    this.left = [];
    this.right = [];
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
            label: list.training_name
          }
        });
        this.setState({ trainingList });
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'Something went Wrong. Please try again later', snackvariant: "error" })
      }
    })
  }

  selectTrainingChange = (selectedTraining) => {

    this.setState({ selectedTraining: selectedTraining.target, candidatesList: [], batchSelected: null });
    this.getBatchList(selectedTraining.target.value);
    this.checkAllFieldsValidbatch();
  }

  getBatchList = (training_id) => {
    const reqObj = { training_id };
    this.props.getBatchList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        const batchList = response.arrRes.map(list => {
          return {
            value: list.batch_id,
            label: list.batch_name
          }
        });
        this.setState({ batchDetailsList: batchList, candidatesList: this.candidatesList, selectall: false, left: [], right: [], query: '', formIsValid: true });
      } else {
        this.setState({ batchDetailsList: [], snackBarOpen: true, snackmsg: 'No Batches Found', snackvariant: "error" })
      }
    })
  }
  onChangeBatch = (batchSelected) => {

    this.setState({ batchSelected: batchSelected.target });
    const reqObj = {
      training_id: this.state.selectedTraining.value,
      batch_id: batchSelected.target.value
    }

    this.props.getCandidateMapList(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.candidatesList = [...response.batchCandidate, ...response.nonBatchCnadidate];
        this.left = response.nonBatchCnadidate;
        this.right = response.batchCandidate;
        this.setState({
          candidatesList: this.candidatesList, selectall: false, left: response.nonBatchCnadidate, right: response.batchCandidate
        });
        this.checkAllFieldsValidbatch();
      } else {
        this.setState({ snackBarOpen: true, snackmsg: 'No Candidates Found', snackvariant: "error" })
      }
    });
  }
  checkAllFieldsValidbatch = () => {
    const { selectedTraining, batchSelected, formIsValid } = this.state;
    if (selectedTraining && batchSelected) {
      this.setState({ formIsValid: true });
    }
    this.props.checkAllFieldsValidBF(formIsValid);
  }

  handleCandidateSelection = (e, list) => {
    const { candidatesList, selectedTraining } = this.state;
    const candidateIndex = candidatesList && candidatesList.findIndex((lst) => list.id === lst.id);
    const updatedcandidateList = [...candidatesList];
    updatedcandidateList[candidateIndex].training_id = e.target.checked ? selectedTraining.value : '';
    this.setState({
      candidatesList: updatedcandidateList
    });
  }


  insertCandidates = () => {
    const { right, batchSelected } = this.state;
    const candidateIDs = [];
    right.forEach((candidate) => {
      if (candidate.id !== '' && candidate.id !== null) {
        candidateIDs.push(candidate.id)
      }
    });
    if (candidateIDs.length !== 0) {
      const reqObj = {
        batch_id: batchSelected.value,
        candidate_ids: candidateIDs,
        created_by: 1,
      }
      return this.props.insertCandidateBatchMap(reqObj).then((response) => {
        if (response && response.errCode === 200) {
          this.setState({ candidatesList: [], selectall: false, batchSelected: null, selectedTraining: null, left: [], right: [], snackBarOpen: true, snackmsg: "Candidates Assigned Successfully", snackvariant: "success" });
        } else {
          this.setState({ candidatesList: [], selectall: false, batchSelected: null, selectedTraining: null, left: [], right: [], snackbaropen: true, snackmsg: 'Something went Wrong. Please try again later.', snackvariant: "error" })
        }
        return response.errCode;
      })
    } else {
      this.setState({ snackBarOpen: true, snackmsg: 'Please Select Atleast One Candidate.', snackvariant: "error" })
    }
  }

  searchCandidate = (e) => {
    const query = e.target.value;
    const lowerCaseQuery = query.toLowerCase();
    const searchedLeftData = (query
      ? this.left.filter((list) =>
        list['first_name']
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
      : this.left);
    const searchedRightData = (query
      ? this.right.filter((list) =>
        list['first_name']
          .toLowerCase()
          .includes(lowerCaseQuery)
      )
      : this.right);
    this.setState({ left: searchedLeftData, right: searchedRightData, query });
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

    this.leftChecked[0].training_id = this.state.selectedTraining.value;
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
      <Card variant="outlined">
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
                <ListItemText id={labelId} primary={value.first_name} secondary={value.email} />
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Card>
    );
  };

  addBatch = () => {
    this.setState({ showAddBatchModal: true });
  }

  handleModalSubmit = () => {
    const { newBatchName, selectedTraining, newBatchCount } = this.state;
    const reqObj = {
      training_id: selectedTraining.value,
      batch_name: newBatchName,
      batch_count: newBatchCount,
      created_by: 1
    }
    this.props.addBatchName(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.getBatchList(selectedTraining.value);
        this.setState({ showAddBatchModal: false, showToast: true, toastMsg: 'Batch Creation is successful.' })
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    });
  }

  handleModalClose = () => {
    this.setState({ showAddBatchModal: false, newBatchName: '', newBatchCount: '' })
  }

  onCloseSnackBar = () => {
    this.setState({ snackBarOpen: false });
  }

  render() {
    const { classes } = this.props;
    const { trainingList, selectedTraining, candidatesList, snackBarOpen, snackmsg,
      snackvariant, query, checked, left, right, batchSelected,
      batchDetailsList, showAddBatchModal, newBatchName, newBatchCount } = this.state;
    this.leftChecked = this.intersection(checked, left);
    this.rightChecked = this.intersection(checked, right);
    this.CandidateIDs = [];
    candidatesList.forEach(list => {
      if (list.training_id !== null && list.training_id !== '') {
        this.CandidateIDs.push(list.id);
      }
    })
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
              errorMessage={this.state.errors.training === "" ? null : this.state.errors.training}
            />
          </Grid>
          {selectedTraining && <Grid item md={4}>
            <SelectOne
              fieldLabel="Batch list"
              value={batchSelected}
              onChange={this.onChangeBatch}
              options={batchDetailsList}
              defaultValue={batchSelected}
              placeholder="Select Batch"
              aria-label="batch"
              aria-describedby="batch"
              id="batch"
              name="batch"
            />
          </Grid>}
          <Grid item md className={classes.searchAddGrid}>
            {selectedTraining && <Button variant="contained" className={classes.addBtn} onClick={this.addBatch} color="primary">
              Add
            </Button>}
          </Grid>
        </Grid>
        <Grid item md className={classes.searchAddGrid}>

          {(this.left.length > 0 || this.right.length > 0) &&
            <Paper component="form" className={classes.searchRoot}>
              <InputBase
                className={classes.input}
                placeholder="Search "
                onChange={this.searchCandidate}
                value={query}
              />
              <IconButton disabled className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          }
        </Grid>
        {selectedTraining && batchSelected &&
          <Grid
            container
            spacing={2}
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={5}>{this.customList("Non-Registered", left)}</Grid>
            <Grid item xs={12} sm={2}>
              <Grid container direction="column" alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={this.handleCheckedRight}
                  disabled={this.leftChecked.length === 0}
                  aria-label="move selected right"
                > &gt; </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={this.handleCheckedLeft}
                  disabled={this.rightChecked.length === 0}
                  aria-label="move selected left"
                >  &lt;  </Button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>{this.customList("Registered", right)}</Grid>
          </Grid>
        }

        {snackBarOpen && <SnackBar snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant}
          onCloseSnackBar={this.onCloseSnackBar} />}
        <Dialog
          disableBackdropClick
          maxWidth="xs"
          fullWidth={true}
          open={showAddBatchModal}
          onClose={this.handleModalClose}
        >
          <DialogTitle id="form-dialog-title">Add Batch</DialogTitle>
          <DialogContent >
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Batch Name:</Typography>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                placeholder="Batch Name"
                type="text"
                value={newBatchName}
                onChange={(e) => this.setState({ newBatchName: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <Typography style={{ padding: '15px 15px 10px 0' }}>Batch Count:</Typography>
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="Batch Count"
                type="number"
                value={newBatchCount}
                onChange={(e) => this.setState({ newBatchCount: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleModalClose} variant="contained" >
              Cancel
            </Button>
            <Button onClick={this.handleModalSubmit} disabled={newBatchName === '' || newBatchCount === ''} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}


export default withStyles(styles)(BatchFormation);