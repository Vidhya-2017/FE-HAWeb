import React from 'react';
import '../scss/ForgotPassword.scss';
import { Toast } from 'react-bootstrap';
import { Link, Grid, FormHelperText, TextField, Button, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Container, CssBaseline, FormControl, InputLabel, OutlinedInput, IconButton, Avatar, Typography } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';



class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: '',
      formIsValid: false,
      showQuesModal: false,
      emailId: '',
      securityQues: [],
      isAnsValid: false,
      confrm_pwd: '',
      password: '',
      questionVals: [null, null],
      isQuesValid: false,
      ansVals: [null, null],
      showPassUpdateModal: false,
      showPasswordEye: false,
      showCPasswordEye: false,
      ansCheck: false

    }
  }
  backToLogin = () => {
    this.props.history.push('/');
  }

  getSecurityQuestion = () => {
    const reqObj = {
      UserEmail: this.state.emailId
    }
    this.props.getSecurityQues(reqObj).then((response) => {
      if (response === undefined) {
        this.setState({ showToast: true, toastMsg: 'Server is disconnected' })
      }
      else if (response && response.arrRes) {
        const Questions = response.arrRes.map(list => {
          return {
            ID: list.QuestionID,
            label: list.Question,
            value: list.Question
          }
        })
        this.setState({ showQuesModal: true, securityQues: Questions });
      }
      else if (response.errCode === 404 && response.status === "No User found") {
        this.setState({ showToast: true, toastMsg: 'No User found with this Email Id, Please Enter Correct Email Id.' })
      }
      else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }

  handleClose = () => {
    this.setState({ showQuesModal: false, questionVals: [null, null], ansVals: [null, null], isAnsValid: false, ansCheck: false })
  }


  securityQuesAns = (e, dropDownID) => {
    const newAnsVals = [...this.state.ansVals];
    newAnsVals[dropDownID] = e.target.value;
    const isAnsValid = newAnsVals.filter((val) => (val !== null && val !== '')).length >= 2;
    this.setState({ ansVals: newAnsVals, isAnsValid })
  }

  validateSecurityQues = () => {
    const { ansVals, securityQues, emailId } = this.state;
    const reqObj = [];
    ansVals.forEach((ans, index) => {
      reqObj.push({
        EmailID: emailId,
        QnID: securityQues[index].ID,
        Answer: ans
      })
    })

    this.props.validateSecurityQues(reqObj).then((response) => {
      if (response && response.errCode === 200) {
        this.setState({ showQuesModal: false, ansVals: [null, null], showPassUpdateModal: true });
      } else if (response && response.errCode === 404) {
        this.setState({
          ansCheck: true,
          // showQuesModal: false,
          isAnsValid: false
        });
      } else {
        this.setState({ showToast: true, ansVals: [null, null], toastMsg: 'Something went wrong. Please try again later' });
      }
    })
  }

  passwordFieldChange = (e) => {
    const targetValue = e.target.value;
    const targetName = e.target.name;
    if (targetName === 'password') {
      this.setState({ password: targetValue });
    } else if (targetName === 'confrm_pwd') {
      this.setState({ confrm_pwd: targetValue });

    }
  }

  validatePassword = () => {
    const { password, confrm_pwd, emailId } = this.state;
    if (password !== confrm_pwd) {
      console.log("don't delete this log")
    } else {
      const reqObj = {
        EmailID: emailId,
        Password: password
      };
      this.props.changePassword(reqObj).then((response) => {
        if (response && response.errCode === 200) {
          this.setState({ showToast: true, showPasswordEye: false, showCPasswordEye: false, showPassUpdateModal: false, toastMsg: 'Password changed successfully.' });
          this.props.history.push('/');
        } else {
          this.setState({ showToast: true, toastMsg: 'Something went wrong. Please try again later.' });
        }

      })
    }
  }

  render() {
    const { classes } = this.props;
    const { showToast, toastMsg, ansCheck, emailId, showQuesModal, questionVals, ansVals, isAnsValid, isQuesValid, showPassUpdateModal, password, confrm_pwd, showPasswordEye, showCPasswordEye, securityQues } = this.state;
    const disablePwdBtn = password === confrm_pwd && password !== null && password !== undefined && password !== '' && password.length >= 6;
    const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    return (
      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className="logo">
            <Avatar >
              <VpnKeyIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
          </div>
          {/* -----email id -------- */}
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name='emailId'
            style={{ marginTop: 10, marginBottom: 10 }}
            value={emailId}
            onChange={(e) => this.setState({ emailId: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          {/* -----submit button------- */}
          <Button
            disabled={!pattern.test(emailId)}
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 10, marginBottom: 10 }}
            onClick={this.getSecurityQuestion}
          >
            Submit
          </Button>
          {/* -----------Back to home ------ */}
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={this.backToLogin} variant="body1">
                Back to login
            </Link>
            </Grid>
          </Grid>
        </Container>
        {/* -----React Toast ------- */}
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
        {/* -------modal dialog for security questions-------- */}
        <Dialog
          fullWidth
          maxWidth='sm'
          open={showQuesModal}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Security Questions"}</DialogTitle>
          <DialogContent>
            <div >
              {securityQues.map((ques, index) => {
                return (
                  <div>
                    <Typography component="main" variant="body2">
                      <h6><span style={{ paddingRight: 10 }}>Q:{index + 1}</span> {ques.value}</h6>
                    </Typography>

                    <Grid item xs={12}>
                      <TextField
                        style={{ marginTop: 10, marginBottom: 10 }}
                        id="outlined-size-small"
                        size="small"
                        variant="outlined"
                        fullWidth
                        name="ans"
                        value={ansVals[index]}
                        placeholder="Answer"
                        onChange={(e) => this.securityQuesAns(e, index)}
                      />
                    </Grid>
                  </div>
                )
              })}
            </div>
            {ansCheck &&
              <FormHelperText id="standard-helper-text" style={{ color: 'red' }}>You have Entered Wrong Security Answer</FormHelperText>
            }
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.handleClose} color="primary" autoFocus>
              cancel
          </Button>
            <Button disabled={!isAnsValid} variant="contained" onClick={this.validateSecurityQues} color="primary" autoFocus>
              Next
          </Button>
          </DialogActions>
        </Dialog>
        {/* ---------modal dialog for change password------ */}
        <Dialog
          fullWidth
          maxWidth='sm'
          open={showPassUpdateModal}
          onClose={() => this.setState({ showPassUpdateModal: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Change Password"}</DialogTitle>
          <DialogContent>
            <div >
              <Grid item xs={12}>
                <FormControl fullWidth style={{ marginTop: 10, marginBottom: 10 }} variant="outlined">
                  <InputLabel required htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    label="Password"
                    name='password'
                    value={password}
                    onChange={this.passwordFieldChange}
                    required
                    helperText="Password should be min 6 character long"
                    id="outlined-adornment-password"
                    type={showPasswordEye ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => this.setState({ showPasswordEye: !this.state.showPasswordEye })}
                          edge="end"
                        >
                          {showPasswordEye ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                  <FormHelperText id="standard-Password-helper-text"> Password should be min 6 character long</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth style={{ marginTop: 10, marginBottom: 10 }}
                  variant="outlined">
                  <InputLabel
                    required htmlFor="outlined-adornment-password"> Confirm Password</InputLabel>
                  <OutlinedInput
                    label="Confirm Password"
                    name='confrm_pwd'
                    value={confrm_pwd}
                    onChange={this.passwordFieldChange}
                    required
                    id="outlined-adornment-password"
                    type={showCPasswordEye ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => this.setState({ showCPasswordEye: !this.state.showCPasswordEye })}
                          edge="end"
                        >
                          {showCPasswordEye ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                  {
                    (this.state.password !== this.state.confrm_pwd) &&
                    <FormHelperText id="standard-confirmPassword-helper-text" style={{ color: 'red' }}>Password and Confirm Password should match</FormHelperText>
                  }

                  {
                    ((this.state.password != '' && this.state.confrm_pwd != '') && (this.state.password === this.state.confrm_pwd)) &&
                    <FormHelperText id="standard-confirmPassword-helper-text" style={{ color: 'green' }}>Password is match successfully</FormHelperText>
                  }

                </FormControl>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => this.setState({ showPassUpdateModal: false })} color="primary" autoFocus>
              cancel
          </Button>
            <Button disabled={!disablePwdBtn} variant="contained" color="primary" autoFocus onClick={this.validatePassword}>
              Submit
          </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}
export default ForgotPassword;
