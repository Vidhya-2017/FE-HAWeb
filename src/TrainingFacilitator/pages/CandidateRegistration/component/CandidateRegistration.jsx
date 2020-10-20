import React, { Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import Buttons from '../../../components/UI_Component/Buttons/Buttons';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import ToastBox from '../../../components/UI_Component/Toast/ToastBox';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';

import '../scss/CandidateRegistration.scss'


const months = [{ value: 'January', label: 'January' }, { value: 'February', label: 'February' }, { value: 'March', label: 'March' }, { value: 'April', label: 'April' }, { value: 'May', label: 'May' }, { value: 'June', label: 'June' }, { value: 'July', label: 'July' }, { value: 'August', label: 'August' }, { value: 'September', label: 'September' }, { value: 'October', label: 'October' }, { value: 'November', label: 'November' }, { value: 'December', label: 'December' }]

const inputField = {
  value: '',
  validation: {
    required: true
  },
  valid: false
};

const candidateRegForm = {
  trainingid: { ...inputField },
  sapid: { ...inputField },
  firstname: { ...inputField },
  lastname: { ...inputField },
  email: { ...inputField },
  phoneno: { ...inputField },
  location: { ...inputField },
  lob: { ...inputField },
  account: { ...inputField },
  expectedjoiningdate: { ...inputField },
  joiningmonth: { ...inputField },
}

class CandidateRegistration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formValues: { ...candidateRegForm },
      showToast: false,
      toastMsg: '',
      errors: {},
      trainingList: [],
      locationList: [],
      lobList: [],
      accountList: [],
      selectedTraining: null,
      selectedLocation: null,
      selectedLob: null,
      selectedAccount: null,
      selectedMonth: null,
      formIsValid: false,
      formDisable: false,
    }
  }

  componentDidMount() {
    this.getLocation();
    this.getLob();
    this.getAccount();
    this.getTrainingList();
  }

  getTrainingList = () => {
    this.props.getTrainingList().then(response => {
      if (response && response.arrRes) {
        const trainingList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.training_name,
            trainingType: list.training_type
          }
        });
        this.setState({ trainingList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }

  getAccount = () => {
    this.props.getAccountList().then(response => {
      if (response && response.arrRes) {
        const accountList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.account_name
          }
        });
        this.setState({ accountList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }

  getLocation = () => {
    this.props.getLocationList().then(response => {
      if (response && response.arrRes) {
        const locationList = response.arrRes.map(list => {
          return {
            value: list.id,
            id: list.id,
            label: list.location_name
          }
        });
        this.setState({ locationList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
      }
    })
  }
  getLob = () => {
    this.props.getLobList().then((response) => {
      if (response && response.arrRes.length > 0) {
        const lobList = response.arrRes.map(list => {
          return {
            value: list.id,
            LobId: list.id,
            label: list.lob_name
          }
        });
        this.setState({ lobList });
      } else {
        this.setState({ showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })

      }
    });
  }



  inputFieldChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === 'trainingid' && targetValue !== '') {
      this.setState({ formDisable: true });
    }

    const updatedRegForm = {
      ...this.state.formValues
    };
    const updatedFormElement = {
      ...updatedRegForm[targetName]
    };
    updatedFormElement.value = targetValue;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedRegForm[targetName] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedRegForm) {

      formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ formValues: updatedRegForm, formIsValid });
  }

  checkValidity(inputValue, rules) {
    const value = inputValue.toString();
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
    return isValid;
  }


  selectFieldChange = (e) => {
    if (e.target.name === 'location') {
      this.setState({ selectedLocation: e.target });
    }
    if (e.target.name === 'account') {
      this.setState({ selectedAccount: e.target });
    }
    if (e.target.name === 'lob') {
      this.setState({ selectedLob: e.target });
    }
    if (e.target.name === 'joiningmonth') {
      this.setState({ selectedMonth: e.target });
    }
    if (e.target.name === 'trainingid') {
      const { formValues } = this.state;
      const updatedRegForm = { ...formValues };
      if (e.target.trainingType !== '1') {
        updatedRegForm.expectedjoiningdate.valid = true;
        updatedRegForm.joiningmonth.valid = true;
      }
      else {
        updatedRegForm.expectedjoiningdate.valid = false;
        updatedRegForm.joiningmonth.valid = false;
      }
      this.setState({ formValues: updatedRegForm, selectedTraining: e.target });
    }
    this.inputFieldChange(e);
  }



  submitForm = (e) => {
    this.setState({ showToast: false })
    console.log("submit");
    const formData = {};
    const { formValues } = this.state;
    const resetRegisterCandidate = {
      ...formValues
    };
    for (let inputIdentifier in resetRegisterCandidate) {
      formData[inputIdentifier] = resetRegisterCandidate[inputIdentifier].value;
    }

    let reqObj = {
      training_id: formData.trainingid,
      sap_id: formData.sapid,
      first_name: formData.firstname,
      last_name: formData.lastname,
      email: formData.email,
      phone_number: formData.phoneno,
      location_id: formData.location,
      lob_id: formData.lob,
      account_id: formData.account,
      created_by: 1,
    }

    if(this.state.selectedTraining.trainingType === '1') {
      reqObj = {...reqObj, 
        joining_month: formData.joiningmonth,
        expected_joining_date: moment(formData.expectedjoiningdate).format("YYYY-MM-DD")
      }
    } else {
        reqObj = {...reqObj, 
          joining_month: '',
          expected_joining_date: ''
        }
    }
    console.log('----formData--', reqObj);

    this.props.insertCandidate(reqObj).then(response => {
      console.log(response);
      if (response && response.errCode === 200) {

        this.setState({
          showToast: true,
          toastMsg: 'Inserted Successfully.',
          formValues: { ...candidateRegForm },
          selectedLocation: null,
          selectedLob: null,
          selectedAccount: null,
          selectedMonth: null,
          selectedTraining: null,
          formDisable: false
        })
      } else if (response.errCode === 404 && response.status === 'Email Id already exists') {
        this.setState({
          showToast: true,
          toastMsg: 'Email Id already exists.',
          formValues: { ...candidateRegForm },
          selectedLocation: null,
          selectedLob: null,
          selectedAccount: null,
          selectedMonth: null,
          selectedTraining: null,
          formDisable: false
        })
      } else {
        this.setState({
          showToast: true,
          toastMsg: 'Something went Wrong. Please try again later.',
          formValues: { ...candidateRegForm },
          selectedLocation: null,
          selectedLob: null,
          selectedAccount: null,
          selectedMonth: null,
          selectedTraining: null,
          formDisable: false
        })
      }
    })
  }

  render() {
    const { trainingList, selectedTraining, locationList, selectedLocation, selectedLob, lobList, selectedAccount, accountList, selectedMonth, showToast, toastMsg, formIsValid, formValues, formDisable } = this.state;
    return (
      <div className="batchMaster_container">
        <section className="blue_theme">
          <Container>
            <Row>
              <Col xs={12} md={12} lg="12" >
                <h2 className="text-center">Candidate Registration</h2>
              </Col>
            </Row>
            <Col xs={12} md={12} lg="12" >
              <form className="">
                <Row>
                  <Col xs={12} md={12} lg="6" >

                    <SelectOne
                      fieldLabel="Training Name"
                      value={selectedTraining ? selectedTraining : null}
                      id="trainingid"
                      name="trainingid"
                      placeholder='Training Name'
                      options={trainingList}
                      onChange={this.selectFieldChange}
                      errorMessage={this.state.errors.trainingid === "" ? null : this.state.errors.trainingid}
                    />

                    <Textbox
                      value={formValues.sapid.value}
                      fieldLabel="SAP ID"
                      id="sapid"
                      type="number"
                      placeholder="SAP ID"
                      errorMessage={this.state.errors.sapid === "" ? null : this.state.errors.sapid}
                      name="sapid"
                      isDisabled={!formDisable}
                      onChange={this.inputFieldChange}

                    />

                    <Textbox
                      value={formValues.firstname.value}
                      fieldLabel="First Name"
                      id="firstname"
                      type="text"
                      placeholder="First Name"
                      errorMessage={this.state.errors.firstname === "" ? null : this.state.errors.firstname}
                      name="firstname"
                      isDisabled={!formDisable}
                      onChange={this.inputFieldChange}
                    />

                    <Textbox
                      value={formValues.lastname.value}
                      fieldLabel="Last Name"
                      id="lastname"
                      type="text"
                      placeholder="Last Name"
                      errorMessage={this.state.errors.lastname === "" ? null : this.state.errors.lastname}
                      name="lastname"
                      onChange={this.inputFieldChange}
                      isDisabled={!formDisable}
                    />

                    <Textbox
                      value={formValues.email.value}
                      fieldLabel="Email ID"
                      id="email"
                      type="email"
                      placeholder="Email ID"
                      errorMessage={this.state.errors.email === "" ? null : this.state.errors.email}
                      name="email"
                      onChange={this.inputFieldChange}
                      isDisabled={!formDisable}
                    />

                    <Textbox
                      value={formValues.phoneno.value}
                      fieldLabel="Mobile No"
                      id="phoneno"
                      type="number"
                      placeholder="Mobile No"
                      errorMessage={this.state.errors.phoneno === "" ? null : this.state.errors.phoneno}
                      name="phoneno"
                      onChange={this.inputFieldChange}
                      isDisabled={!formDisable}
                    />


                  </Col>
                  <Col xs={12} md={12} lg="6" >

                    <SelectOne
                      fieldLabel="Location"
                      id="location"
                      name="location"
                      placeholder="Location"
                      value={selectedLocation}
                      options={locationList}
                      onChange={this.selectFieldChange}
                      errorMessage={this.state.errors.location === "" ? null : this.state.errors.location}
                      isDisabled={!formDisable}
                    />

                    <SelectOne
                      fieldLabel="LOB"
                      value={selectedLob ? selectedLob : null}
                      id="lob"
                      name="lob"
                      placeholder='LOB'
                      options={lobList}
                      onChange={this.selectFieldChange}
                      errorMessage={this.state.errors.lob === "" ? null : this.state.errors.lob}
                      isDisabled={!formDisable}
                    />

                    <SelectOne
                      fieldLabel="Account"
                      value={selectedAccount ? selectedAccount : null}
                      id="account"
                      name="account"
                      placeholder='Account'
                      options={accountList}
                      onChange={this.selectFieldChange}
                      errorMessage={this.state.errors.account === "" ? null : this.state.errors.account}
                      isDisabled={!formDisable}
                    />

                    {selectedTraining && selectedTraining.trainingType === "1" && <Fragment>
                      <DateTimePicker
                        value={formValues.expectedjoiningdate.value}
                        fieldLabel="Expected Joining Date"
                        maxDays={90}
                        minDate={new Date()}
                        name="expectedjoiningdate"
                        onChange={this.inputFieldChange}
                        disabled={!formDisable}
                      />
                      <SelectOne
                        fieldLabel="Joining Month"
                        value={selectedMonth ? selectedMonth : null}
                        id="joiningmonth"
                        name="joiningmonth"
                        placeholder='Joining Month'
                        options={months}
                        onChange={this.selectFieldChange}
                        errorMessage={this.state.errors.joiningmonth === "" ? null : this.state.errors.joiningmonth}
                        isDisabled={!formDisable}
                      />
                    </Fragment>}


                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Col>
                      <Buttons
                        className="float-right"
                        value="Submit"
                        disabled={!formIsValid}
                        onClick={this.submitForm} />
                    </Col>
                  </Col>
                </Row>
              </form>
            </Col>


          </Container>
        </section>
        {showToast &&
          <ToastBox showToast={showToast} toastMsg={toastMsg} />}
      </div>
    )
  }
}


export default CandidateRegistration;