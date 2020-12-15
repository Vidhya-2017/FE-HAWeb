import React from 'react';
import { Toast } from 'react-bootstrap';
import Android from '../../../common/images/android.png';
import Ios from '../../../common/images/ios.png';
import '../scss/Login.scss';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginDetails: {
        userName: {
          value: '',
          validation: {
            required: true
          },
          valid: false
        },
        password: {
          value: '',
          validation: {
            required: true
          },
          valid: false
        }
      },
      showToastMessage: false,
      formIsValid: false,
      toastMsg: ''
    }
  }
  componentDidMount() {
    if (this.props.userDetails.user_id) {
      this.props.history.push('/home');
    }
  }

  login = () => {
    const { loginDetails } = this.state;
    const reqObj = {
      userName: loginDetails.userName.value,
      password: loginDetails.password.value
    }
    this.props.loginAuth(reqObj).then(response => {
      if (response && response.errCode === 200) {
        if (response.UserSet[0].isAdmin === "1") {
          this.props.history.push('/home');
        } else {
          this.setState({ showToastMessage: true, toastMsg: 'You do not have permission to access this site.' });
        }
      } else if(response && response.errCode !== 200 ) {
        this.setState({ showToastMessage: true, toastMsg: response.status });
      } else {
        this.setState({ showToastMessage: true, toastMsg: "Something went Wrong. Please try again later." });
      }
    })
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
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }
    if (inputType === "email") {
      const pattern = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
      isValid = pattern.test(value) && isValid
    }
    return isValid;
  }


  inputOnChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;
    const targetType = e.target.type;
    const updatedLoginDetails = {
      ...this.state.loginDetails
    };
    const updatedFormElement = {
      ...updatedLoginDetails[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, targetType);
    updatedLoginDetails[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedLoginDetails) {
      formIsValid = updatedLoginDetails[inputIdentifier].valid && formIsValid;
    }
    this.setState({ loginDetails: updatedLoginDetails, formIsValid })
  }

  render() {
    const { formIsValid, loginDetails, showToastMessage, toastMsg } = this.state;
    return (
      <div className="layoutAuthentication_content">
        <main>
          <div className='apkContainer'>
            <a target="blank" href="https://install.appcenter.ms/users/vigneshwaran.somas/apps/dieva-1/distribution_groups/dieva-betatest" download>
              <img src={Android} alt="Android apk download path" title="Android apk download path" className='apkImage'></img>
            </a>
            <a target="blank" href="https://install.appcenter.ms/users/vigneshwaran.somas/apps/dieva/distribution_groups/beta%20test" download>
              <img src={Ios} alt="Ios apk download path" title="Ios apk download path" className='ipaImage'></img>
            </a>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5">
                <div className="card shadow-lg border-0 rounded-lg mt-3">
                  <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                  <div className="card-body">
                    <div className="form-group">
                      <label className="small mb-1" htmlFor="inputEmailAddress">Email</label>
                      <input className="form-control py-4" id="inputEmailAddress" name="userName" onChange={this.inputOnChange} value={loginDetails.userName.value} type="email" placeholder="Enter email address" />
                    </div>
                    <div className="form-group">
                      <label className="small mb-1" htmlFor="inputPassword">Password</label>
                      <input className="form-control py-4" id="inputPassword" name="password" onChange={this.inputOnChange} value={loginDetails.password.value} type="password" placeholder="Enter password" />
                    </div>
                    <div className="form-group">
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-center">
                      <button disabled={!formIsValid} className="btn btn-primary loginBtn" onClick={this.login}>Sign In</button></div>
                    <Grid container justify="flex-end">
                      <Grid item>
                        <Link
                          style={{ color: 'blue', cursor: 'pointer' }}
                          onClick={()=>this.props.history.push('/signUp')} variant="body2">
                          Don't have an account? Sign Up
                        </Link>
                      </Grid>
                    </Grid>
                    <Grid container justify="flex-end">
                      <Grid item>
                        <Link
                          style={{ color: 'blue', cursor: 'pointer' }}
                          onClick={()=>this.props.history.push('/forgotPassword')} variant="body2">
                          Forgot Password ? Click here
                        </Link>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {showToastMessage &&
          <Toast
            style={{
              position: 'absolute',
              top: '50px',
              right: '10px',
              background: '#f8d7da',
              border: '1px solid #721c24',
              color: '#721c24',
              fontWeight: 500,
              width: 400
            }}
            onClose={() => this.setState({ showToastMessage: false })} show={showToastMessage} delay={3000} autohide>
            <Toast.Header style={{ background: '#f8d7da', color: '#721c24', borderBottom: '1px solid #721c24' }}>
              <strong className="mr-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body>{toastMsg}</Toast.Body>
          </Toast>
        }
      </div>
    )
  }
}

export default Login;