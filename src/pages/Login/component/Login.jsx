import React from 'react';
import { Toast } from 'react-bootstrap';
import Android from '../../../common/images/android.png';
import Ios from '../../../common/images/ios.png';
import '../scss/Login.scss';

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
      if (response.errCode === 200) {
        if (response.UserSet[0].isAdmin === "1") {
          this.props.history.push('/home');
        } else {
          this.setState({ showToastMessage: true, toastMsg: 'You do not have permission to access this site.' });
        }
      } else {
        this.setState({ showToastMessage: true, toastMsg: response.status });
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
            <a href="https://download.wetransfer.com//eu2/118ef5e84146024190fd28ddca79a16c20200627120304/26615da7fafe06c37dcdc33fde8d171a423a8f46/app-release.apk?cf=y&token=eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTM0MTM5NjEsInVuaXF1ZSI6IjExOGVmNWU4NDE0NjAyNDE5MGZkMjhkZGNhNzlhMTZjMjAyMDA2MjcxMjAzMDQiLCJmaWxlbmFtZSI6ImFwcC1yZWxlYXNlLmFwayIsImhvdCI6ZmFsc2UsIndheWJpbGxfdXJsIjoiaHR0cDovL3Byb2R1Y3Rpb24uYmFja2VuZC5zZXJ2aWNlLmV1LXdlc3QtMS53dDo5MjkyL3dheWJpbGwvdjEvc2Fya2FyL2M2NzgzYTE0MGUzMzZhM2ZiNTBkMWMzNmQ0ZTIzNDE3NGNhYTg2MWE1NjVhNjc3ZTJmN2Y2YjUzMmNkODMzODk2ZGUyNmY4MTdmODRmODU5N2Y1NjNiIiwiZmluZ2VycHJpbnQiOiIyNjYxNWRhN2ZhZmUwNmMzN2RjZGMzM2ZkZThkMTcxYTQyM2E4ZjQ2IiwiY2FsbGJhY2siOiJ7XCJmb3JtZGF0YVwiOntcImFjdGlvblwiOlwiaHR0cDovL3Byb2R1Y3Rpb24uZnJvbnRlbmQuc2VydmljZS5ldS13ZXN0LTEud3Q6MzAwMC93ZWJob29rcy9iYWNrZW5kXCJ9LFwiZm9ybVwiOntcInRyYW5zZmVyX2lkXCI6XCIxMThlZjVlODQxNDYwMjQxOTBmZDI4ZGRjYTc5YTE2YzIwMjAwNjI3MTIwMzA0XCIsXCJkb3dubG9hZF9pZFwiOjk2MzI2OTg2NDJ9fSJ9.r9wxZC7OkKVG8a0x2v5ydpnV-3_BF4RzEJ0f6em0-Yg" download>
              <img src={Android} alt="Android apk download path" title="Android apk download path" className='apkImage'></img>
            </a>
            <a href="https://download.wetransfer.com//eu2/118ef5e84146024190fd28ddca79a16c20200627120304/26615da7fafe06c37dcdc33fde8d171a423a8f46/app-release.apk?cf=y&token=eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTM0MTM5NjEsInVuaXF1ZSI6IjExOGVmNWU4NDE0NjAyNDE5MGZkMjhkZGNhNzlhMTZjMjAyMDA2MjcxMjAzMDQiLCJmaWxlbmFtZSI6ImFwcC1yZWxlYXNlLmFwayIsImhvdCI6ZmFsc2UsIndheWJpbGxfdXJsIjoiaHR0cDovL3Byb2R1Y3Rpb24uYmFja2VuZC5zZXJ2aWNlLmV1LXdlc3QtMS53dDo5MjkyL3dheWJpbGwvdjEvc2Fya2FyL2M2NzgzYTE0MGUzMzZhM2ZiNTBkMWMzNmQ0ZTIzNDE3NGNhYTg2MWE1NjVhNjc3ZTJmN2Y2YjUzMmNkODMzODk2ZGUyNmY4MTdmODRmODU5N2Y1NjNiIiwiZmluZ2VycHJpbnQiOiIyNjYxNWRhN2ZhZmUwNmMzN2RjZGMzM2ZkZThkMTcxYTQyM2E4ZjQ2IiwiY2FsbGJhY2siOiJ7XCJmb3JtZGF0YVwiOntcImFjdGlvblwiOlwiaHR0cDovL3Byb2R1Y3Rpb24uZnJvbnRlbmQuc2VydmljZS5ldS13ZXN0LTEud3Q6MzAwMC93ZWJob29rcy9iYWNrZW5kXCJ9LFwiZm9ybVwiOntcInRyYW5zZmVyX2lkXCI6XCIxMThlZjVlODQxNDYwMjQxOTBmZDI4ZGRjYTc5YTE2YzIwMjAwNjI3MTIwMzA0XCIsXCJkb3dubG9hZF9pZFwiOjk2MzI2OTg2NDJ9fSJ9.r9wxZC7OkKVG8a0x2v5ydpnV-3_BF4RzEJ0f6em0-Yg" download>
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