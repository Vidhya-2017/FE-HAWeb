import React from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  withStyles,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Rating from "@material-ui/lab/Rating";
import { Toast } from "react-bootstrap";
import "../scss/EventFeedback.scss";

const styles = (theme) => ({
  textArea: {
    // marginLeft: theme.spacing(1),
    // flex: 1,
    width: "225px",
  },
  input: {
    width: "225px",
  },
});

class EventFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventList: [],
      eventData: [],
      clientName: "",
      clientId: "",
      comment: "",
      rating: 1,
      selectedEvent: null,
      formIsValid: false,
      showSuccessMessage: false,
      toastMessage: "",
    };
  }

  componentDidMount() {
    this.getEventList();
  }

  getEventList = () => {
    this.props.getEventList().then((response) => {
      let eventList = [];
      eventList = response.arrRes.map((list) => {
        return {
          value: list.EventId,
          label: list.Name,
        };
      });
      this.setState({ eventData: response.arrRes, eventList });
    });
  };

  handleEventChange = (e, selectedEvent) => {
    if (selectedEvent !== null) {
      this.setState({ selectedEvent });
      const reqObj = { eventId: selectedEvent.value };

      this.props.geClientDetailsById(reqObj).then((response) => {
        this.setState({
          clientName: response.arrRes[0].ClientName,
          clientId: response.arrRes[0].ClientId,
        });
      });

      let formIsValid = true;
      if (this.state.comment) {
        this.setState({ formIsValid });
      } else {
        this.setState({ formIsValid: false });
      }
    } else {
      this.setState({
        clientName: "",
      });
    }
  };

  onStarClick(e, nextValue) {
    this.setState({ rating: nextValue });
  }

  inputFieldChange = (e) => {
    const targetValue = e.target.value;
    const targetType = e.target.type;
    let formIsValid = true;
    const inputField = {
      value: "",
      validation: {
        required: true,
      },
      valid: false,
    };

    const isvalid = this.checkValidity(
      targetValue,
      inputField.validation,
      targetType
    );

    if (isvalid && this.state.selectedEvent) {
      this.setState({ formIsValid, comment: targetValue });
    } else {
      this.setState({ formIsValid: false, comment: targetValue });
    }
  };

  checkValidity(inputValue, rules, inputType) {
    let value = "";
    if (inputValue) value = inputValue.toString();
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    return isValid;
  }

  submitFeedback = (e) => {
    const reqObj = {
      eventID: this.state.selectedEvent.value,
      clientID: this.state.clientId,
      ratingCnt: this.state.rating,
      txtComment: this.state.comment,
      createdBy: this.props.userDetails.user_id,
    };
    this.props.clientFeedbackOnEvent(reqObj).then((response) => {
      if (response.errCode === 200) {
        this.setState({
          rating: 1,
          selectedEvent: "",
          clientName: "",
          clientId: "",
          comment: "",
          showSuccessMessage: true,
          formIsValid: false,
          toastMessage: "Feedback Submitted Successfully",
        });
        //  this.props.history.push('/homePage');
      } else {
        this.setState({
          showSuccessMessage: true,
          toastMessage: "Error in saving feedback.",
        });
      }
    });
  };

  render() {
    const {
      eventList,
      clientName,
      rating,
      formIsValid,
      showSuccessMessage,
      toastMessage,
    } = this.state;
    const { classes } = this.props;

    return (
      <div className="eventFeedBackWrapper">
        <h3 className="pageTitle">Event Feedback</h3>
        <div className="feedbackForm">
          <Grid container spacing={2}>
            <Grid item xs={4} style={{ padding: "25px 15px 10px 15px" }}>
              <Typography>Event Name:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Autocomplete
                className={classes.input}
                options={eventList}
                getOptionLabel={(option) => option.label}
                onChange={this.handleEventChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Event Name"
                    placeholder="Select the Event"
                    margin="dense"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4} style={{ padding: "25px 15px 10px 15px" }}>
              <Typography>Client Name:</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                id="outlined-basic"
                disabled
                className={classes.input}
                inputProps={{ style: { height: 3 } }}
                variant="outlined"
                value={clientName}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4} style={{ padding: "25px 15px 10px 15px" }}>
              <Typography>Comment:</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                className={classes.textArea}
                aria-label="minimum height"
                rows={3}
                onChange={this.inputFieldChange}
                multiline
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4} style={{ padding: "25px 15px 10px 15px" }}>
              <Typography>Rating:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Rating
                style={{
                  marginTop: "15px",
                }}
                name="rate1"
                value={rating}
                onChange={this.onStarClick.bind(this)}
              />
            </Grid>
          </Grid>
         
          <Grid style={{ textAlign: "center" , marginRight:"50px", marginTop:"20px"}}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              disabled={!formIsValid}
              className="file-upload fileUploadBtn btn shadow"
              onClick={this.submitFeedback}
            >
              Submit
            </Button>
          </Grid>
        </div>

        {showSuccessMessage && (
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
            onClose={() => this.setState({ showSuccessMessage: false })}
            show={showSuccessMessage}
            delay={3000}
            autohide
          >
            <Toast.Header
              style={{
                background: "#deeddd",
                borderBottom: "1px solid #28a745",
              }}
            >
              <strong className="mr-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        )}
      </div>
    );
  }
}
// export default EventFeedback;
export default withStyles(styles, { withTheme: true })(EventFeedback);
