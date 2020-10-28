import React from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  withStyles,
  InputAdornment,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  ListItem,
  List,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  Table,
  TableRow,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import { Toast } from "react-bootstrap";
import moment from "moment";
import "../scss/SquadFormation.scss";

const styles = (theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    borderRadius: 30,
    width: 250,
    height: 40,
  },
  customizedButton: {
    position: "absolute",
    left: "89%",
    top: "5%",
    color: "gray",
  },
  gridAlign: {
    padding: "10px 10px -10px -10px !important",
  },
  // textField: {
  //   width: "80%",
  //   paddingTop: "20px",
  //   paddingBottom: "20px",
  //   fontWeight: 100,
  // },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  listCustom: {
    width: "100%",
    maxWidth: 760,
  },
  tableBorder: {
    // borderWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
 
});

class SquadFormation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: "",
      EventDetailsList: [],
      eventSelected: null,
      showUserModal: false,
      squadList: [],
      selectedSquad: null,
      newSquadName: "",
      candidateList: [],
      searchQuery: "",
    };
    this.candidateList = [];
  }

  componentDidMount() {
    this.props.getEventList().then((response) => {
      if (response && response.arrRes) {
        const eventList = response.arrRes.map((list) => {
          return {
            value: list.EventId,
            EventId: list.EventId,
            label: list.Name,
          };
        });
        this.setState({ EventDetailsList: eventList, loading: false });
      } else {
        this.setState({
          showToast: true,
          toastMsg: "Something went Wrong. Please try again later.",
        });
      }
    });
  }

  handleEventChange = (e, eventSelected) => {
    if (eventSelected !== null) {
      this.setState({ eventSelected, selectedSquad: null, candidateList: [] });
      let id = eventSelected.value;
      const user_id = this.props.userDetails.user_id;
      const isPanelReq = { eventID: id, userID: user_id };
      this.props.checkIsOrganiser(isPanelReq).then((panelRes) => {
        if (panelRes && panelRes.ispanel !== "" && !panelRes.ispanel) {
          this.getSquadList(id);
        } else {
          this.setState({
            toastMsg: "You don't have permission. Please contact Organiser.",
            showToast: true,
          });
        }
      });
    }
  };

  getSquadList = (id, newSquadName = "") => {
    const reqObj = { eventID: id };
    this.props.getSquadList(reqObj).then((response) => {
      if (response && response.arrRes) {
        const squadList = response.arrRes.map((list) => {
          return {
            value: list.ID,
            ID: list.ID,
            label: list.SquadName,
            squad_team_img: list.squad_team_img,
          };
        });
        let selectedSquad = null;
        if (newSquadName) {
          selectedSquad = squadList.find((list) => list.label === newSquadName);
          this.setState({
            squadList,
            selectedSquad,
            showToast: true,
            toastMsg: "Squad Created successfully",
            showUserModal: false,
          });
        } else {
          this.setState({ squadList });
        }
      }
    });
  };
  createSquadName = () => {
    this.setState({ showUserModal: true });
  };

  handleClose = () => this.setState({ showUserModal: false });

  squadNameOnChange = (e) => {
    this.setState({ newSquadName: e.target.value });
  };

  handleNewSquadSubmit = () => {
    const { newSquadName, eventSelected } = this.state;
    const reqObj = {
      SquadID: "",
      SquadName: newSquadName,
      EventID: eventSelected.value,
      CreatedDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      CreatedBy: this.props.userDetails.user_id,
      UpdatedBy: this.props.userDetails.user_id,
      UpdatedDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };
    this.props.addSquad(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.getSquadList(eventSelected.value, newSquadName);
      } else {
        this.setState({
          showToast: true,
          toastMsg: response.status,
        });
      }
    });
  };

  handleSquadChange = (e, selectedSquad) => {
    if (selectedSquad !== null) {
      const { eventSelected } = this.state;
      this.setState({ selectedSquad });
      const req = { event_id: eventSelected.value };
      const request = { squad_id: selectedSquad.value };
      this.props.getSquadCandidateList(request).then((squadRes) => {
        if (
          squadRes &&
          (squadRes.errCode === 200 || squadRes.errCode === 404)
        ) {
          const squadCandidates = squadRes.arrRes;
          this.props.getCandidateList(req).then((res) => {
            if (res && (res.errCode === 200 || res.errCode === 404)) {
              let eventCandidates = res.arrRes.filter(
                (list) => list.SquadName === null || list.SquadName === ""
              );
              eventCandidates = eventCandidates.sort((a, b) =>
                a.EmpName > b.EmpName ? 1 : -1
              );
              const candidateList = [...squadCandidates, ...eventCandidates];
              this.candidateList = candidateList;
              this.setState({ candidateList });
            } else if (res && res.errCode === 404) {
              this.setState({
                showToast: true,
                toastMsg: "No Records found in Candidate List",
              });
            } else {
              this.setState({
                showToast: true,
                toastMsg: "Something went Wrong. Please try again later.",
              });
            }
          });
        } else {
          this.setState({
            showToast: true,
            toastMsg: "Something went Wrong. Please try again later.",
          });
        }
      });
    }
  };

  searchCandidate = (e) => {
    const query = e.target.value;
    const lowerCaseQuery = query.toLowerCase();
    const searchedData = query
      ? this.candidateList.filter((list) =>
          list["EmpName"].toLowerCase().includes(lowerCaseQuery)
        )
      : this.candidateList;
    this.setState({ candidateList: searchedData, searchQuery: query });
  };

  handleCandidateSelection = (e, list) => {
    const { candidateList, selectedSquad } = this.state;
    const candidateIndex =
      candidateList && candidateList.findIndex((lst) => list.ID === lst.ID);
    const updatedcandidateList = [...candidateList];
    updatedcandidateList[candidateIndex].SquadName = e.target.checked
      ? selectedSquad.value
      : "";
    this.setState({
      candidateList: updatedcandidateList,
    });
  };

  insertCandidate = () => {
    const { eventSelected, selectedSquad } = this.state;
    const reqObj = {
      SquadID: selectedSquad.value,
      CandidateID: this.CandidateIDs,
      EventID: eventSelected.value,
      isActive: true,
      CreatedBy: this.props.userDetails.user_id,
      UpdatedBy: this.props.userDetails.user_id,
    };
    this.props.squadCandidatesInsert(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          toastMsg: "Squad Registered successfully",
          showToast: true,
          candidateList: [],
          eventSelected: null,
          selectedSquad: null,
        });
      } else if (response && response.errCode === 404) {
        this.setState({
          showToast: true,
          toastMsg: response.status,
        });
      } else {
        this.setState({
          showToast: true,
          toastMsg: "Something went Wrong. Please try again later.",
        });
      }
    });
  };

  render() {
    const { classes } = this.props;
    const {
      eventSelected,
      candidateList,
      searchQuery,
      squadList,
      newSquadName,
      selectedSquad,
      EventDetailsList,
      showToast,
      toastMsg,
      showUserModal,
    } = this.state;
    this.CandidateIDs = [];

    candidateList.forEach((list) => {
      if (list.SquadName !== null && list.SquadName !== "") {
        this.CandidateIDs.push(list.ID);
      }
    });
    return (
      <div className="squadWrapper">
        <div className="pageHeader">
          <h3 className="pageTitle">Squad Formation</h3>
          {eventSelected && (
            <i
              onClick={this.createSquadName}
              className="addUser fa fa-plus"
              aria-hidden="true"
            ></i>
          )}
        </div>
        <div className="eventCoordForm">
          <Grid container spacing={2}>
            <Grid item xs={4} style={{ padding: "25px 15px 10px 15px" }}>
              <Typography>Event Name:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Autocomplete
                options={EventDetailsList}
                getOptionLabel={(option) => option.label}
                onChange={this.handleEventChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Event Name"
                    placeholder="Event Name"
                    margin="dense"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
          </Grid>

          {squadList.length > 0 && (
            <Grid container spacing={2}>
              <Grid item xs={4} style={{ padding: "25px 15px 10px 15px" }}>
                <Typography>Squad Name:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Autocomplete
                  value={selectedSquad}
                  options={squadList}
                  getOptionLabel={(option) => option.label}
                  defaultValue={selectedSquad}
                  onChange={this.handleSquadChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Squad Name"
                      placeholder="Squad Name"
                      margin="dense"
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {candidateList && selectedSquad && (
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  name="searchcandidate"
                  variant="outlined"
                  id="input-with-icon-textfield"
                  label="Search Candidate"
                  placeholder="Search Candidate"
                  margin="normal"
                  onChange={this.searchCandidate}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    style: { height: 45 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <p style={{ marginTop: "25px" }}>
                  Candidate List: Count - {this.CandidateIDs.length}
                </p>
              </Grid>
            </Grid>
          )}

          {candidateList && candidateList.length > 0 && (
            <List dense className={classes.listCustom}>
              {candidateList.map((list) => {
                const labelId = `checkbox-list-secondary-label-${list.EmpName}`;
                return (
                  <Table className={classes.tableBorder}>
                    
                      <ListItem key={list.EmpName} button>
                        <ListItemText
                          primary={list.EmpName}
                          secondary={list.SkillName}
                        />
                        <ListItemSecondaryAction>
                          <Checkbox
                            edge="end"
                            onChange={(e) =>
                              this.handleCandidateSelection(e, list)
                            }
                            checked={
                              list.SquadName !== null && list.SquadName !== ""
                            }
                            inputProps={{ "aria-labelledby": list.user_id }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
           
                  </Table>
                );
              })}
            </List>
          )}
          {candidateList && candidateList.length > 0 && (
            <div className="panelRegCntrlPanel">
              <Button
                disabled={this.CandidateIDs.length === 0}
                className="file-upload fileUploadBtn btn shadow"
                onClick={this.insertCandidate}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
        <Dialog
          fullWidth={true}
          maxWidth="xs"
          onClose={this.handleClose}
          aria-labelledby="customized-dialog-title"
          open={showUserModal}
        >
          <div style={{ marginLeft: "5px", marginRight: "5px" }}>
            <IconButton className={classes.customizedButton}>
              <CloseIcon onClick={this.handleClose} />
            </IconButton>
            <DialogTitle id="simple-dialog-title">Squad Name</DialogTitle>
            <Divider />
            <Grid container spacing={-10}>
              <Grid item xs={8}>
                <TextField
                  //  className={classes.textField}
                  type="CandidateName"
                  name="candidatename"
                  required
                  variant="outlined"
                  label="Squad Name"
                  placeholder="Squad Name"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ style: { height: 5 } }}
                  onChange={this.squadNameOnChange}
                />
              </Grid>
            </Grid>
            <br />

            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={newSquadName.length === 0}
              onClick={this.handleNewSquadSubmit}
              style={{ float: "right" }}
            >
              Submit
            </Button>
            <br />
            <br />
          </div>
        </Dialog>

        {showToast && (
          <Toast
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#deeddd",
              border: "1px solid #28a745",
              color: "#6c757d",
              fontWeight: 500,
              width: 400,
            }}
            onClose={() => this.setState({ showToast: false })}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body>{toastMsg}</Toast.Body>
          </Toast>
        )}
      </div>
    );
  }
}
// export default SquadFormation;
export default withStyles(styles, { withTheme: true })(SquadFormation);
