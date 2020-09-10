import React from 'react';
import Select from "react-select";
import '../scss/SignUp.scss';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from "@material-ui/core";
import Switch from '@material-ui/core/Switch';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FlagIcon from '@material-ui/icons/Flag';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Toast } from 'react-bootstrap';
import moment from 'moment';

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};
const signUpForm = {
  firstName: inputField,
  lastName: inputField,
  emailId: inputField,
  contactNo: inputField,
  password: inputField,
}


class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inValidUser: false,
      formIsValid: false,
      signUpDetails: { ...signUpForm },
      showPasswordEye: false,
      showCPasswordEye: false,
      checked: false,
      passcode: "",
      sapID: '',
      c_password: '',
      IsPwdValid: false,
      toastMsg: '',
      showQuestionModal: false,
      ansVals: [null, null, null],
      isQuesValid: false,
      isAnsValid: false,
      secretQuestions: [],
      questionVals: [null, null, null],

    }
  }
 
  checkValidity(inputValue, rules, inputType) {
    let value = '';
    if (inputValue) value = inputValue.toString();
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.isNumeric) {
      const pattern = /^[0-9]{10}$/;
      isValid = pattern.test(value) && isValid
    }
    if (inputType === "number") {
      const pattern = /^[0-9]{10}$/;
      isValid = pattern.test(value) && isValid

    }
    if (inputType === "email") {
      var pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      isValid = pattern.test(value) && isValid
    }
    if (inputType === "contactNo") {
      const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  }
  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type;

    const updatedSignUpForm = {
      ...this.state.signUpDetails
    };
    if ((targetName === 'firstName' || targetName === 'lastName') && targetValue.length > 0) {
      this.targetValue = targetValue[0].toUpperCase() + targetValue.slice(1);
    }
    const updatedFormElement = {
      ...updatedSignUpForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, targetType);
    updatedSignUpForm[targetName] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedSignUpForm) {
      formIsValid = updatedSignUpForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ signUpDetails: updatedSignUpForm, formIsValid });
  }

  sucessLogin = (FPDetails) => {
    const formData = {};
    const { signUpDetails } = this.state;
    const resetRegSignUp = {
      ...signUpDetails
    };
    for (let inputIdentifier in resetRegSignUp) {
      formData[inputIdentifier] = resetRegSignUp[inputIdentifier].value;
    }
    var dateTime = new Date()
    var date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    const reqObj = {
      isAdmin: true,
      UserSAPID: this.state.sapID === "" ? "0" : this.state.sapID,
      UserFirstName: formData.firstName,
      UserLastName: formData.lastName,
      UserEmail: formData.emailId,
      UserMobile: formData.contactNo,
      UserPassword: formData.password,
      CreatedDate: date,
      CreatedBy: '1',
      UpdatedBy: '1',
      UpdatedDate: date,
      FPDetails
    };
    this.props.signUpDetails(reqObj).then((response) => {
      if(response === undefined){
        this.setState({showToast:true,toastMsg:'server is disconnected'})
      }
      else if (response.errCode === 200) {
        for (let inputIdentifier in resetRegSignUp) {
          resetRegSignUp[inputIdentifier].value = '';
          resetRegSignUp[inputIdentifier].valid = false;
        }
        this.setState({
          signUpDetails: { ...resetRegSignUp },
          showToast: true,
          sapID: "",
          passcode: "",
          c_password: "",
          showCPasswordEye: false,
          showPasswordEye: false,
          showQuestionModal: false,
          toastMsg:'User Registered Successfully!'
        })
        this.props.history.push('/');
        
      }
      else if(response.errCode === 404 && response.message === "EmailId Already Exist") {
        this.setState({ showToast: true,  showQuestionModal: false, toastMsg: "User is already Registered with this Email Id" });
      }
    })
    this.setState({ showToast: false });
  }

  checkSignUpCredentials = (e) => {
    if (this.state.c_password !== this.state.signUpDetails.password.value) {
      this.setState({ showToast: true, toastMsg: "Password Not Matching" });
    }
    else {
      this.props.secretQuestions().then((response) => {
        if (response && response.arrRes) {
          const Questions = response.arrRes.map(list => {
            return {
              ID: list.ID,
              label: list.Question,
              value: list.Question
            }
          })
          this.setState({ secretQuestions: Questions, showQuestionModal: true});
        } else {
          this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
        }
      })
    }
  }

  


  securityQuesAns = (e, dropDownID) => {
    const newAnsVals = [...this.state.ansVals];
    newAnsVals[dropDownID] = e.target.value;
    const isAnsValid = newAnsVals.filter((val) => (val !== null && val !== '')).length >= 3;
    this.setState(state => {
      return {
        ansVals: newAnsVals,
        isAnsValid
      };
    });
  }

  loginPage = () => {
    this.setState({ showToast: false, signUpDetails: { ...signUpForm }, showCPasswordEye: false, showPasswordEye: false, c_password: '', passcode: '', sapID: '', checked: false });
    this.props.history.push('/');
  }

  checkPassword = (e) => {
    this.setState({ c_password: e.target.value, IsPwdValid: e.target.value !== '' });
  }

  submitSignUp = () => {
    const { questionVals, ansVals } = this.state;
    const question = questionVals.map(value => value.ID)
    const FPDetails = [];
    question.forEach((val, index) => {
      FPDetails.push({
        qn_id: val, answer: ansVals[index]
      })
    });
    this.sucessLogin(FPDetails);
  }


  handleMouseDownPassword = (event) => {
    event.preventDefault();
  }
  
  handleClose = () => {
    this.setState({ showQuestionModal: false, questionVals: [null, null, null],
      ansVals: [null, null, null] })
  }
  



  handleQuestionValChange = (option, index) => {
    const newQuestionVals = this.state.questionVals;
    newQuestionVals[index] = option;
    const isQuesValid = newQuestionVals.filter((val) => (val !== null && val !== '')).length >= 3;
    this.setState(state => {
      return {
        questionVals: newQuestionVals,
        isQuesValid
      };
    });
  };

  getAvailableOptions = () => {
    const availableOptionsLeft = this.state.secretQuestions;
    return availableOptionsLeft.filter(questionOption => {
      return this.state.questionVals.indexOf(questionOption) === -1;
    });
  };


  render() {
    const { classes } = this.props;
    const { checked,isAnsValid,isQuesValid,showQuestionModal, ansVals, formIsValid, signUpDetails, showPasswordEye, showCPasswordEye, IsPwdValid, showToast, toastMsg } = this.state;

    return (

      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    component="span"
                    variant="body1"
                    color="textPrimary"
                  >
                    Internal
                  </Typography>
                  <Switch
                    checked={checked}
                    onChange={(e) => { this.setState({ checked: e.target.checked }) }}
                    color="primary"
                    name="checked"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </Grid>
                {checked &&
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      type="number"
                      fullWidth
                      id="sapid"
                      label="SAP ID"
                      name="sapid"
                      autoComplete="sapid"
                      value={this.state.sapID}
                      onChange={(e) => { this.setState({ sapID: e.target.value }) }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <FlagIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                }
                <Grid item xs={12}>
                  <TextField
                  type="text"
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    // autoFocus
                    value={signUpDetails.firstName.value}
                    onChange={this.inputFieldChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />

                </Grid>
                <Grid item xs={12}>
                  <TextField
                  type="text"
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    value={signUpDetails.lastName.value}
                    onChange={this.inputFieldChange}
                    // size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    type="number"
                    onInput={(e) => {
                      e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                    }}
                    required
                    fullWidth
                    id="mobile"
                    label="Contact No"
                    name='contactNo'
                    autoComplete="mobile"
                    helperText="Contact No should be 10 digit"
                    value={signUpDetails.contactNo.value}
                    onChange={this.inputFieldChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    type="email"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name='emailId'
                    value={signUpDetails.emailId.value}
                    onChange={this.inputFieldChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth className={clsx(classes.margin, classes.textField)} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      name='password'

                      label="Password"
                      id="outlined-adornment-password"
                      type={!showPasswordEye ? 'password' : 'text'}
                      value={signUpDetails.password.value}
                      onChange={this.inputFieldChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => this.setState({ showPasswordEye: !this.state.showPasswordEye })}
                            onMouseDown={this.handleMouseDownPassword}
                            edge="end"
                          >
                            {showPasswordEye ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                </Grid>


                <Grid item xs={12}>
                  <FormControl fullWidth className={clsx(classes.margin, classes.textField)} variant="outlined">
                    <InputLabel required htmlFor="outlined-adornment-password"> Confirm Password</InputLabel>
                    <OutlinedInput

                      label="Confirm Password"
                      id="outlined-adornment-password"
                      type={!showCPasswordEye ? 'password' : 'text'}
                      name='c_password'
                      value={this.state.c_password}
                      onChange={this.checkPassword}
                      required

                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => this.setState({ showCPasswordEye: !this.state.showCPasswordEye })}
                            onMouseDown={this.handleMouseDownPassword}
                            edge="end"
                          >
                            {showCPasswordEye ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                    />
                  </FormControl>
                </Grid>


              </Grid>
              <Button
              disabled={!formIsValid || !IsPwdValid}

                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.checkSignUpCredentials}
              >
                Sign Up
          </Button>


              <Grid container justify="flex-end">
                <Grid item>
                  <Link
                    style={{ color: 'blue', cursor: 'pointer' }}
                    onClick={this.loginPage} variant="body2">
                    Already have an account? Sign in
                 </Link>
                </Grid>
              </Grid>
            </form>
          </div>

        </Container>

        {showToast &&
          <Toast
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#deeddd',
              border: '1px solid #28a745',
              color: '#6c757d',
              fontWeight: 500,
              width: 400
            }}
            onClose={() => this.setState({ showToast: false })}
            show={showToast}
            delay={3000}
            autohide
          >
            <Toast.Body>{toastMsg}</Toast.Body>
          </Toast>
        }

        <div>

          <Dialog
            fullWidth
            maxWidth='sm'

            open={showQuestionModal}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Security Questions"}</DialogTitle>
            <DialogContent>
              <div >

                <Select
                

                  name="filters"
                  placeholder="Question #1"
                  value={this.state.questionVals[0]}
                  options={this.getAvailableOptions()}
                  onChange={e => {
                    this.handleQuestionValChange(e, 0);
                  }}
                />
                
                <Grid item xs={12}>
                  <TextField
                  style={{marginTop:10,marginBottom:10}}
                    id="outlined-size-small"
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="ans1"
                    value={ansVals[0]}
                    placeholder="Answer"
                    onChange={(e) => this.securityQuesAns(e, 0)}

                  />
                </Grid>
                

                <Select
                  name="filters"
                  placeholder="Question #2"
                  value={this.state.questionVals[1]}
                  options={this.getAvailableOptions()}
                  onChange={e => {
                    this.handleQuestionValChange(e, 1);
                  }}
                />
                

                <Grid item xs={12}>
                  <TextField
                  style={{marginTop:10,marginBottom:10}}
                    id="outlined-size-small"
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="ans2"
                    value={ansVals[1]}
                    placeholder="Answer"
                    onChange={(e) => this.securityQuesAns(e, 1)}

                  />
                </Grid>
                

                <Select
                  name="filters"
                  placeholder="Question #3"
                  value={this.state.questionVals[2]}
                  options={this.getAvailableOptions()}
                  onChange={e => {
                    this.handleQuestionValChange(e, 2);
                  }}
                />
                

                <Grid item xs={12}>
                  <TextField
                  style={{marginTop:10,marginBottom:10}}
                    id="outlined-size-small"
                    size="small"
                    variant="outlined"
                    fullWidth
                    name="ans3"
                    value={ansVals[2]}
                    placeholder="Answer"
                    onChange={(e) => this.securityQuesAns(e, 2)}

                  />
                </Grid>
                
              </div>
            </DialogContent>
            <DialogActions>

              <Button  variant="contained" onClick={this.handleClose} color="primary" autoFocus>
                cancel
          </Button>
              <Button disabled={!isAnsValid || !isQuesValid} variant="contained" onClick={this.submitSignUp} color="primary" autoFocus>
                submit
          </Button>
            </DialogActions>
          </Dialog>

        </div>



      </>

    )
  }
}


export default withStyles(useStyles)(SignUp);
